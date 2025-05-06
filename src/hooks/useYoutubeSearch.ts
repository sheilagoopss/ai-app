import YoutubeSearchHelper, {
  YoutubeResult,
} from "@/helpers/YoutubeSearchHelper";
import { useCallback, useState } from "react";

export const useYoutubeSearch = () => {
  const [isLoadingYoutubeTools, setIsLoadingYoutubeTools] = useState(false);

  const searchYoutubeAiTools = useCallback(
    async (query?: string): Promise<YoutubeResult[]> => {
      try {
        setIsLoadingYoutubeTools(true);
        if (!query) {
          return [];
        }

        const youtubeHelper = new YoutubeSearchHelper();
        const searchResult = await youtubeHelper.search(query);
        return searchResult?.combined_results || [];
      } catch (error) {
        console.error("Error searching YouTube AI tools:", error);
        return [];
      } finally {
        setIsLoadingYoutubeTools(false);
      }
    },
    [],
  );

  return { isLoadingYoutubeTools, searchYoutubeAiTools };
};
