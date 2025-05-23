import {
  FunctionCallingConfigMode,
  FunctionDeclaration,
  GoogleGenAI,
  Type,
} from "@google/genai";
import { YoutubeResult } from "./YoutubeSearchHelper";
import { CHAT_PROMPT } from "@/constants/prompts";
const GEMINI_API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY || "";

export interface AIToolResponse {
  toolLink: string;
  summary: string;
  videoLink: string;
  title: string;
  description?: string; // Optional field for video description
  url?: string; // Optional field for video URL
}

class GeminiHelper {
  private gemini: GoogleGenAI;

  constructor() {
    this.gemini = new GoogleGenAI({ apiKey: GEMINI_API_KEY });
  }

  private async translateToHebrew(text: string): Promise<string> {
    const response = await this.gemini.models.generateContent({
      model: "gemini-2.0-flash-001",
      contents: [
        {
          role: "user",
          parts: [
            {
              text: `Translate this text to Hebrew. Return ONLY the translation, no explanations or additional text. Keep URLs and technical terms unchanged:\n${text}`,
            },
          ],
        },
      ],
    });

    if (!response?.candidates?.[0]?.content?.parts?.[0]?.text) {
      return text; // Return original text if translation fails
    }

    return response.candidates[0].content.parts[0].text;
  }

  async generateContent(prompt: string) {
    const response = await this.gemini.models.generateContent({
      model: "gemini-2.0-flash-001",
      contents: prompt,
    });
    return response.text;
  }

  async pickMostRelevantAiTools(
    results: YoutubeResult[],
  ): Promise<AIToolResponse[]> {
    const getAIToolVideos: FunctionDeclaration = {
      name: "getAIToolVideos",
      description:
        "Extracts and returns a list of AI tools mentioned in YouTube videos.",
      parameters: {
        type: Type.OBJECT,
        properties: {
          tools: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                title: {
                  type: Type.STRING,
                  description: "Title of the YouTube video",
                },
                videoLink: {
                  type: Type.STRING,
                  description: "Direct link to the YouTube video",
                },
                summary: {
                  type: Type.STRING,
                  description:
                    "Summary of what the AI tool does and its key features",
                },
                toolLink: {
                  type: Type.STRING,
                  description:
                    "Official link to the AI tool shown in the video",
                },
              },
              required: ["title", "videoLink", "summary", "toolLink"],
            },
          },
        },
        required: ["tools"],
      },
    };

    const response = await this.gemini.models.generateContent({
      model: "gemini-2.0-flash-001",
      contents: [
        {
          role: "user",
          parts: [
            {
              text: `I will give you a list of youtube videos. 
Based on this information, curate a list of resources that are ONLY about specific AI tools that match the original search query.
Each result must be about a concrete, named AI tool that is relevant to the requested category.

CRITICAL RULES:
1. ONLY include videos that are about a SINGLE, SPECIFIC AI tool (not multiple tools or comparisons)
2. The tool MUST be an AI-powered tool (not just any software)
3. Each tool should only appear once - pick the most informative video for each tool
4. Skip any video that isn't about a tool in the requested category
5. Skip any video that doesn't clearly demonstrate or explain the tool
6. IMPORTANT: Return EXACTLY 5 tools (or fewer if less are available) - pick the most relevant and informative ones
7. Make sure each tool is actually designed for the requested purpose
8. CRITICAL: Only include videos that have a tool link - if a video doesn't have a tool link, do not include it in the results
9. Skip any video that is a comparison, list, or review of multiple tools
10. Skip any video that doesn't focus on a single tool's features and usage

Examples of valid AI tools by category:
- Image editing: Midjourney, DALL-E, Stable Diffusion
- Writing: ChatGPT, Jasper, Copy.ai
- Coding: GitHub Copilot, Codeium
- Video: Runway, Descript
- Audio: ElevenLabs, Murf
- Design: Canva AI, Adobe Firefly

DO NOT include:
- Regular software that isn't AI-powered
- Videos comparing multiple tools
- Videos listing "top" or "best" tools
- Videos about non-AI tools
- Videos that don't focus on a single tool's features and usage`,
            },
            {
              text: `List of videos: ${JSON.stringify(results)}`,
            },
          ],
        },
      ],
      config: {
        toolConfig: {
          functionCallingConfig: {
            mode: FunctionCallingConfigMode.ANY,
            allowedFunctionNames: ["getAIToolVideos"],
          },
        },
        tools: [{ functionDeclarations: [getAIToolVideos] }],
      },
    });

    const tools =
      (
        response.functionCalls?.[0]?.args as unknown as {
          tools: AIToolResponse[];
        }
      ).tools || [];

    // Map the tools to include the correct video link from the original results
    const toolsWithVideoLinks = tools.map((tool) => {
      // Extract video ID from the Gemini-provided video link
      const videoId = tool.videoLink.match(
        /(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?|shorts)\/|.*[?&]v=)|youtu\.be\/)([\w-]{11})/,
      )?.[1];
      // Find the original result by video ID
      const originalResult = results.find(
        (r) => r.metadata.video_id === videoId,
      );
      return {
        ...tool,
        videoLink: originalResult?.url || tool.videoLink,
      };
    });

    // Translate the results to Hebrew
    const translatedTools = await Promise.all(
      toolsWithVideoLinks.map(async (tool) => ({
        ...tool,
        title: await this.translateToHebrew(tool.title),
        summary: await this.translateToHebrew(tool.summary),
      })),
    );

    // Limit to 5 tools
    return translatedTools.slice(0, 5);
  }

  async chat({
    aiTools,
    messages,
  }: {
    aiTools: AIToolResponse[];
    messages: {
      role: "user" | "bot";
      content: string;
    }[];
  }) {
    const result = await this.gemini.models.generateContent({
      model: "gemini-2.0-flash",
      config: {
        systemInstruction: `${CHAT_PROMPT}\n\nAvailable AI Tools:\n${aiTools
          .map(
            (tool) =>
              `- ${tool.title}\n  Link: ${tool.toolLink}\n  Summary: ${
                tool.summary
              }\n  Video: ${tool.videoLink}\n  Description: ${
                tool.description || ""
              }\n  URL: ${tool.url || ""}`,
          )
          .join("\n")}`,
      },
      contents: messages.map((m) => `${m.role}: ${m.content}`).join("\n"),
    });
    return result.text || "";
  }
}

export default GeminiHelper;
