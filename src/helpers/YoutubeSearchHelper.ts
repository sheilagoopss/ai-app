import { GENERATE_SEARCH_KEYWORDS_PROMPT } from "@/constants/prompts";
import GeminiHelper, { AIToolResponse } from "./GeminiHelper";
import HttpHelper from "./HttpHelper";

export type YoutubeResult = {
  title: string;
  description: string;
  url: string;
  source: string;
  source_name: string;
  relevance_score: number;
  metadata: {
    channel: string;
    views: string;
    video_id: string;
  };
};

class YoutubeSearchHelper {
  private YOUTUBE_API_V3_KEY: string;
  private geminiHelper: GeminiHelper;

  constructor() {
    this.YOUTUBE_API_V3_KEY = process.env.NEXT_PUBLIC_YOUTUBE_API_V3_KEY || "";
    this.geminiHelper = new GeminiHelper();
  }

  private sleep(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
  private async getVideoDetails(videoId: string): Promise<any | null> {
    const baseUrl = "https://www.googleapis.com/youtube/v3/videos";
    const params = new URLSearchParams({
      part: "snippet,statistics",
      id: videoId,
      key: this.YOUTUBE_API_V3_KEY,
    });
    const response = await HttpHelper.get(`${baseUrl}?${params.toString()}`);
    return response?.data;
  }
  private findSentenceBoundary(text: string, maxLength = 200): string {
    if (text.length <= maxLength) return text;
    const sentenceEndings = [". ", "! ", "? "];
    let bestEnd = maxLength;
    for (const ending of sentenceEndings) {
      const lastEnd = text.substring(0, maxLength).lastIndexOf(ending);
      if (lastEnd > 0) {
        bestEnd = Math.min(bestEnd, lastEnd + ending.length);
      }
    }
    if (bestEnd === maxLength) {
      const lastSpace = text.substring(0, maxLength).lastIndexOf(" ");
      if (lastSpace > 0) bestEnd = lastSpace;
    }
    return text.substring(0, bestEnd).trim();
  }
  private async searchYoutube(
    query: string,
    maxResults = 50,
  ): Promise<YoutubeResult[]> {
    const baseUrl = "https://www.googleapis.com/youtube/v3/search";
    const params = new URLSearchParams({
      part: "snippet",
      q: `${query} ai tool`,
      maxResults: maxResults.toString(),
      type: "video",
      key: this.YOUTUBE_API_V3_KEY,
    });
    const response = await HttpHelper.get(`${baseUrl}?${params.toString()}`);
    if (!response) {
      return [];
    }
    const searchResults = response.data;
    if (
      !searchResults.items ||
      !Array.isArray(searchResults.items) ||
      searchResults.items.length === 0
    ) {
      console.log("No YouTube results found or API quota exceeded");
      return [];
    }

    const genericPatterns = [
      "top 10",
      "top 5",
      "must have",
      "tools for",
      "tools of",
      "tools in",
      "tools to",
      "every developer",
      "every programmer",
      "every coder",
      "list of",
      "collection of",
    ];
    const aiToolKeywords = [
      "ai",
      "artificial intelligence",
      "machine learning",
      "ml",
      "gpt",
      "llm",
      "chatbot",
      "neural",
      "deep learning",
      "copilot",
      "assistant",
      "automation",
    ];

    const resultsWithDetails: YoutubeResult[] = [];
    for (const item of searchResults.items) {
      const title = (item.snippet?.title || "").toLowerCase();
      const description = (item.snippet?.description || "").toLowerCase();

      if (genericPatterns.some((pattern) => title.includes(pattern))) continue;
      if (
        !aiToolKeywords.some(
          (keyword) => title.includes(keyword) || description.includes(keyword),
        )
      )
        continue;
      if (!item.id || !item.id.videoId) continue;

      const videoId = item.id.videoId;
      const details = await this.getVideoDetails(videoId);
      if (!details || !details.items || details.items.length === 0) continue;

      const videoInfo = details.items[0];
      const snippet = videoInfo.snippet;
      const stats = videoInfo.statistics || {};

      // Format view count
      const viewCount = parseInt(stats.viewCount || "0", 10);
      let viewCountStr = `${viewCount} views`;
      if (viewCount >= 1_000_000) {
        viewCountStr = `${(viewCount / 1_000_000).toFixed(1)}M views`;
      } else if (viewCount >= 1_000) {
        viewCountStr = `${(viewCount / 1_000).toFixed(1)}K views`;
      }

      // Clean up and limit description
      let cleanedDescription = "";
      try {
        const fullDescription = snippet.description || "";
        const promoPhrases = [
          "subscribe",
          "like this video",
          "follow me",
          "check out my",
          "download now",
          "click here",
          "sign up",
          "join my",
          "discount",
          "off",
          "sale",
          "promo",
          "coupon",
        ];
        const descLines = fullDescription.split("\n");
        let cleanedDesc = "";
        for (const line of descLines) {
          const trimmed = line.trim();
          if (
            trimmed &&
            !promoPhrases.some((promo) => trimmed.toLowerCase().includes(promo))
          ) {
            cleanedDesc = trimmed;
            break;
          }
        }
        if (!cleanedDesc && descLines.length > 0) {
          cleanedDesc = descLines[0].trim();
        }
        cleanedDesc = this.findSentenceBoundary(cleanedDesc);
        cleanedDescription = cleanedDesc;

        // If description is too short, try to get another non-promo paragraph
        if (cleanedDescription.length < 50 && descLines.length > 1) {
          for (const line of descLines.slice(1)) {
            const trimmed = line.trim();
            if (
              trimmed &&
              !promoPhrases.some((promo) =>
                trimmed.toLowerCase().includes(promo),
              )
            ) {
              cleanedDesc = this.findSentenceBoundary(trimmed);
              cleanedDescription = cleanedDesc;
              break;
            }
          }
        }
      } catch (e) {
        console.log(e);
        cleanedDescription =
          "[Contains special characters that cannot be displayed]";
      }

      resultsWithDetails.push({
        title: snippet.title,
        description: cleanedDescription,
        url: `https://www.youtube.com/watch?v=${videoId}`,
        source: "youtube",
        source_name: "YouTube",
        relevance_score: 1.0,
        metadata: {
          channel: snippet.channelTitle,
          views: viewCountStr,
          video_id: videoId,
        },
      });
    }
    return resultsWithDetails;
  }
  private async generateSearchKeywords(question: string): Promise<string[]> {
    const prompt = GENERATE_SEARCH_KEYWORDS_PROMPT;
    const keywords = await this.geminiHelper.generateContent(
      prompt + "\n\nQuestion:\n" + question,
    );
    return keywords?.split("\n") || [];
  }
  public async search(query: string): Promise<AIToolResponse[]> {
    // Get combined results from multiple tool-specific searches
    const keywords = await this.generateSearchKeywords(query);
    let allResults: YoutubeResult[] = [];
    for (const keyword of keywords) {
      const results = await this.searchYoutube(keyword, 20);
      allResults = allResults.concat(results);
      // Optionally sleep to avoid API rate limits
      await this.sleep(100);
    }
    if (allResults.length > 0) {
      const selectedResults = await this.geminiHelper.pickMostRelevantAiTools(
        allResults,
      );

      return selectedResults;
    }
    return [];
  }
}

export default YoutubeSearchHelper;
