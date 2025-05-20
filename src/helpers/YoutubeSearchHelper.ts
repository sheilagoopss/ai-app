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

interface YoutubeSearchItem {
  id: {
    videoId: string;
  };
  snippet: {
    title: string;
    description: string;
  };
}

interface YoutubeVideoDetails {
  id: string;
  snippet: {
    title: string;
    description: string;
    channelTitle: string;
  };
  statistics: {
    viewCount: string;
  };
}

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
  private async getVideoDetails(videoIds: string[]): Promise<any | null> {
    const baseUrl = "https://www.googleapis.com/youtube/v3/videos";
    const params = new URLSearchParams({
      part: "snippet,statistics",
      id: videoIds.join(','),
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
    // Check if we should use mock data (when API quota is exceeded)
    if (process.env.NEXT_PUBLIC_USE_MOCK_DATA === 'true') {
      return this.getMockYoutubeResults(query);
    }

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

    // Filter videos first
    const filteredItems = searchResults.items.filter((item: YoutubeSearchItem) => {
      const title = (item.snippet?.title || "").toLowerCase();
      const description = (item.snippet?.description || "").toLowerCase();

      if (genericPatterns.some((pattern) => title.includes(pattern))) return false;
      if (
        !aiToolKeywords.some(
          (keyword) => title.includes(keyword) || description.includes(keyword),
        )
      ) return false;
      if (!item.id || !item.id.videoId) return false;
      return true;
    });

    // Get all video IDs
    const videoIds = filteredItems.map((item: YoutubeSearchItem) => item.id.videoId);
    if (videoIds.length === 0) return [];

    // Get details for all videos in one batch request
    const details = await this.getVideoDetails(videoIds);
    if (!details || !details.items || details.items.length === 0) return [];

    // Create a map of video details for easy lookup
    const videoDetailsMap = new Map(
      details.items.map((item: YoutubeVideoDetails) => [item.id, item])
    );

    const resultsWithDetails: YoutubeResult[] = [];
    for (const item of filteredItems) {
      const videoId = item.id.videoId;
      const videoInfo = videoDetailsMap.get(videoId) as YoutubeVideoDetails | undefined;
      if (!videoInfo) continue;

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
    
    // Process keywords in parallel with a limit
    const batchSize = 3; // Process 3 keywords at a time
    for (let i = 0; i < keywords.length; i += batchSize) {
      const batch = keywords.slice(i, i + batchSize);
      const batchResults = await Promise.all(
        batch.map(keyword => this.searchYoutube(keyword, 10))
      );
      allResults = allResults.concat(...batchResults);
      
      // Add a small delay between batches to avoid rate limits
      if (i + batchSize < keywords.length) {
        await this.sleep(1000);
      }
    }

    if (allResults.length > 0) {
      const selectedResults = await this.geminiHelper.pickMostRelevantAiTools(
        allResults,
      );

      return selectedResults;
    }
    return [];
  }
  private getMockYoutubeResults(query: string): YoutubeResult[] {
    return [
      {
        title: "Top 5 AI Tools for Developers in 2024",
        description: "Discover the most powerful AI tools that are revolutionizing software development. From code completion to automated testing, these tools will boost your productivity.",
        url: "https://www.youtube.com/watch?v=mock1",
        source: "youtube",
        source_name: "YouTube",
        relevance_score: 1.0,
        metadata: {
          channel: "Tech Channel",
          views: "100K views",
          video_id: "mock1"
        }
      },
      {
        title: "How to Use AI Tools for Web Development",
        description: "Learn how to leverage AI tools to streamline your web development workflow. This tutorial covers practical examples and real-world applications.",
        url: "https://www.youtube.com/watch?v=mock2",
        source: "youtube",
        source_name: "YouTube",
        relevance_score: 0.9,
        metadata: {
          channel: "Web Dev Channel",
          views: "50K views",
          video_id: "mock2"
        }
      },
      {
        title: "AI Tools for Content Creation",
        description: "Explore the best AI tools for content creators. From writing assistants to image generators, these tools will help you create better content faster.",
        url: "https://www.youtube.com/watch?v=mock3",
        source: "youtube",
        source_name: "YouTube",
        relevance_score: 0.8,
        metadata: {
          channel: "Content Creator",
          views: "75K views",
          video_id: "mock3"
        }
      }
    ];
  }
}

export default YoutubeSearchHelper;
