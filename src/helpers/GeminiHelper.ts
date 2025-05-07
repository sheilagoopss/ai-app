import {
  FunctionCallingConfigMode,
  FunctionDeclaration,
  GoogleGenAI,
  Type,
} from "@google/genai";
import { YoutubeResult } from "./YoutubeSearchHelper";
const GEMINI_API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY || "";

export interface AIToolResponse {
  toolLink: string;
  summary: string;
  videoLink: string;
  title: string;
}

class GeminiHelper {
  private gemini: GoogleGenAI;

  constructor() {
    this.gemini = new GoogleGenAI({ apiKey: GEMINI_API_KEY });
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
Important rules:
1. ONLY include videos about AI tools that are specifically relevant to the search query's category/purpose
2. Each tool should only appear once - pick the most informative video for each tool
3. Skip any video that isn't about a tool in the requested category
4. Skip any video that doesn't clearly demonstrate or explain the tool
5. Try to include 3-5 different AI tools if available
6. Make sure each tool is actually designed for the requested purpose
7. CRITICAL: Only include videos that have a tool link - if a video doesn't have a tool link, do not include it in the results`,
            },
            {
              text: `
             For example:
- If user searches for "content writing tools", only show AI writing tools like Jasper, Copy.ai, etc.
- If user searches for "image generation", only show image AI tools like Midjourney, DALL-E, etc.
- If user searches for "coding tools", only show coding AI tools like GitHub Copilot, Codeium, etc.
            `,
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
    return (
      (
        response.functionCalls?.[0]?.args as unknown as {
          tools: AIToolResponse[];
        }
      ).tools || []
    );
  }
}

export default GeminiHelper;
