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
  id?: {
    videoId?: string;
  };
  snippet?: {
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
    console.log('🔍 [YouTube] Searching with query:', query);
    const baseUrl = "https://www.googleapis.com/youtube/v3/search";
    const params = new URLSearchParams({
      part: "snippet",
      q: query,
      maxResults: maxResults.toString(),
      type: "video",
      key: this.YOUTUBE_API_V3_KEY,
      order: "relevance",
      videoDuration: "medium",
      relevanceLanguage: "en",
      regionCode: "US",
    });

    console.log('🔍 [YouTube] Search params:', {
      query,
      maxResults,
      order: "relevance",
      videoDuration: "medium",
      relevanceLanguage: "en",
      regionCode: "US"
    });

    const response = await HttpHelper.get(`${baseUrl}?${params.toString()}`);
    if (!response) {
      console.log('❌ [YouTube] No response from API');
      return [];
    }

    const searchResults = response.data;
    if (!searchResults.items || !Array.isArray(searchResults.items) || searchResults.items.length === 0) {
      console.log('❌ [YouTube] No results found');
      return [];
    }

    console.log(`✅ [YouTube] Found ${searchResults.items.length} initial results`);
    const resultsWithDetails: YoutubeResult[] = [];

    // Process videos in batches to get details
    const videoIds = searchResults.items
      .filter((item: YoutubeSearchItem) => item.id?.videoId)
      .map((item: YoutubeSearchItem) => item.id!.videoId!);

    if (videoIds.length === 0) {
      console.log('❌ [YouTube] No valid video IDs found');
      return [];
    }

    console.log(`🔍 [YouTube] Processing ${videoIds.length} videos in batches`);

    // Get video details in batches of 50 (YouTube API limit)
    const batchSize = 50;
    for (let i = 0; i < videoIds.length; i += batchSize) {
      const batch = videoIds.slice(i, i + batchSize);
      console.log(`🔍 [YouTube] Processing batch ${i/batchSize + 1} of ${Math.ceil(videoIds.length/batchSize)}`);
      
      const details = await this.getVideoDetails(batch);
      
      if (!details?.items) {
        console.log(`❌ [YouTube] No details for batch ${i/batchSize + 1}`);
        continue;
      }

      console.log(`✅ [YouTube] Got details for ${details.items.length} videos in batch ${i/batchSize + 1}`);

      for (const videoInfo of details.items) {
        const snippet = videoInfo.snippet;
        const stats = videoInfo.statistics || {};

        // Skip videos that are comparisons or "top tools" lists
        const title = snippet.title.toLowerCase();
        const skipPatterns = [
          /top \d+ (?:best )?tools/i,  // "top 5 tools" or "top 5 best tools"
          /best \d+ tools/i,           // "best 5 tools"
          /vs\.? /i,                   // "vs" or "vs."
          /versus /i,                  // "versus"
          /comparison of/i,            // "comparison of"
          /compared to/i,              // "compared to"
          /roundup/i,                  // "roundup"
          /tools compared/i,           // "tools compared"
          /tools review/i,             // "tools review" (plural)
        ];
        
        // Check if title matches any skip pattern
        if (skipPatterns.some(pattern => pattern.test(title))) {
          console.log('⏭️ [YouTube] Skipping comparison video:', title);
          continue;
        }

        // Format view count like Python version
        const viewCount = parseInt(stats.viewCount || "0", 10);
        let viewCountStr = `${viewCount} views`;
        if (viewCount >= 1_000_000) {
          viewCountStr = `${(viewCount / 1_000_000).toFixed(1)}M views`;
        } else if (viewCount >= 1_000) {
          viewCountStr = `${(viewCount / 1_000).toFixed(1)}K views`;
        }

        // Clean description like Python version
        let description = "";
        try {
          description = (snippet.description || "").slice(0, 150);
        } catch (e) {
          description = "[Contains special characters that cannot be displayed]";
        }

        resultsWithDetails.push({
          title: snippet.title,
          description: description,
          url: `https://www.youtube.com/watch?v=${videoInfo.id}`,
          source: "youtube",
          source_name: "YouTube",
          relevance_score: 1.0,
          metadata: {
            channel: snippet.channelTitle,
            views: viewCountStr,
            video_id: videoInfo.id,
          },
        });
      }

      // Add delay between batches
      if (i + batchSize < videoIds.length) {
        console.log('⏳ [YouTube] Waiting 1s before next batch...');
        await this.sleep(1000);
      }
    }

    console.log(`✅ [YouTube] Processed ${resultsWithDetails.length} videos total`);
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
    console.log('🚀 [Search] Starting search for:', query);
    
    // Translate Hebrew query to English using Gemini
    const translationPrompt = `Translate this Hebrew query to English, keeping it concise and search-friendly. Only return the English translation, nothing else.
    
Hebrew query: ${query}`;

    const translatedQuery = await this.geminiHelper.generateContent(translationPrompt);
    console.log('🌐 [Search] Translated query:', { from: query, to: translatedQuery });
    
    // Search for individual tool reviews, excluding "top tools" and "best tools" videos
    const searchQuery = `${translatedQuery} ai tool -"top tools" -"best tools" -"comparison" -"vs" review demo tutorial`;
    console.log('🔍 [Search] Using query:', searchQuery);
    
    const results = await this.searchYoutube(searchQuery, 50);
    console.log(`✅ [Search] Found ${results.length} results`);

    if (results.length > 0) {
      // Use Gemini to pick most relevant tools, with emphasis on specific tool reviews
      const selectedResults = await this.geminiHelper.pickMostRelevantAiTools(results);
      console.log(`✅ [Search] Selected ${selectedResults.length} relevant tools`);
      return selectedResults;
    }

    console.log('❌ [Search] No results found');
    return [];
  }

  private extractToolDomain(title: string, description: string): string | null {
    // Common AI tool domains
    const commonDomains = [
      'chatgpt.com',
      'midjourney.com',
      'dalle.com',
      'claude.ai',
      'gemini.google.com',
      'perplexity.ai',
      'notion.ai',
      'copilot.microsoft.com',
      'github.com/copilot',
      'stability.ai',
      'runwayml.com',
      'elevenlabs.io',
      'synthesia.io',
      'descript.com',
      'murf.ai',
      'play.ht',
      'wellsaidlabs.com',
      'speechify.com',
      'otter.ai',
      'fireflies.ai',
      'notta.ai',
      'grammarly.com',
      'jasper.ai',
      'copy.ai',
      'writesonic.com',
      'rytr.me',
      'simplified.co',
      'peppertype.ai',
      'wordtune.com',
      'quillbot.com',
      'rephraser.ai',
      'textcortex.com',
      'anyword.com',
      'contentbot.ai',
      'hypotenuse.ai',
      'neuroflash.com',
      'texta.ai',
      'textmetrics.com',
      'wordai.com',
      'wordhero.co',
      'writesonic.com',
      'zapier.com',
      'make.com',
      'n8n.io',
      'automate.io',
      'integromat.com',
      'pipedream.com',
      'tray.io',
      'workato.com',
      'zoho.com',
      'monday.com',
      'clickup.com',
      'asana.com',
      'trello.com',
      'notion.so',
      'miro.com',
      'figma.com',
      'canva.com',
      'adobe.com',
      'picsart.com',
      'remove.bg',
      'cleanup.pictures',
      'inpaint.com',
      'stability.ai',
      'runwayml.com',
      'synthesia.io',
      'descript.com',
      'murf.ai',
      'play.ht',
      'wellsaidlabs.com',
      'speechify.com',
      'otter.ai',
      'fireflies.ai',
      'notta.ai',
      'grammarly.com',
      'jasper.ai',
      'copy.ai',
      'writesonic.com',
      'rytr.me',
      'simplified.co',
      'peppertype.ai',
      'wordtune.com',
      'quillbot.com',
      'rephraser.ai',
      'textcortex.com',
      'anyword.com',
      'contentbot.ai',
      'hypotenuse.ai',
      'neuroflash.com',
      'texta.ai',
      'textmetrics.com',
      'wordai.com',
      'wordhero.co',
      'writesonic.com',
      'zapier.com',
      'make.com',
      'n8n.io',
      'automate.io',
      'integromat.com',
      'pipedream.com',
      'tray.io',
      'workato.com',
      'zoho.com',
      'monday.com',
      'clickup.com',
      'asana.com',
      'trello.com',
      'notion.so',
      'miro.com',
      'figma.com',
      'canva.com',
      'adobe.com',
      'picsart.com',
      'remove.bg',
      'cleanup.pictures',
      'inpaint.com'
    ];

    // Combine title and description for searching
    const text = `${title} ${description}`.toLowerCase();

    // Look for domain mentions in the text
    for (const domain of commonDomains) {
      if (text.includes(domain)) {
        return domain;
      }
    }

    // If no domain found, try to extract from title
    const titleWords = title.toLowerCase().split(/\s+/);
    for (const word of titleWords) {
      // Look for common TLDs
      if (word.endsWith('.com') || word.endsWith('.ai') || word.endsWith('.io')) {
        return word;
      }
    }

    return null;
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
