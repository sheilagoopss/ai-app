"use client";

import React, { useState, useEffect } from "react";
import { useYoutubeSearch } from "@/hooks/useYoutubeSearch";
import AISearchInput from "@/components/common/AISearchInput";
import AIToolCard from "@/components/aiTools/aiToolCard";
import ThinkingAnimation from "@/components/common/ThinkingAnimation";
import { YOUTUBE_RESULTS_INTRO } from "@/constants/prompts";
import { SparklesIcon, Send } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import GeminiHelper from "@/helpers/GeminiHelper";

type UIState = "idle" | "thinking" | "results";

export default function Scraper() {
  const { isLoadingYoutubeTools, searchYoutubeAiTools } = useYoutubeSearch();
  const thinkingRef = React.useRef<HTMLDivElement>(null);
  const geminiHelper = React.useRef(new GeminiHelper());

  const [searchTerm, setSearchTerm] = useState("");
  const [youtubeResults, setYoutubeResults] = useState<any[]>([]);
  const [uiState, setUIState] = useState<UIState>("idle");
  const [lastSearchTerm, setLastSearchTerm] = useState("");
  const [input, setInput] = useState("");
  const [chatHistory, setChatHistory] = useState<Array<{ query: string; results: any[] }>>([]);
  const [translatedTexts, setTranslatedTexts] = useState({
    subtitle: "מצא את כלי הבינה המלאכותית הטובים ביותר לצרכים שלך",
    placeholder: "תאר איזה כלי בינה מלאכותית אתה מחפש...",
    searchButton: "חיפוש"
  });

  // Scroll to thinking animation
  const scrollToThinking = () => {
    if (thinkingRef.current) {
      thinkingRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  // Handle chat input submission
  const handleChatSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!input.trim()) return;
    const currentInput = input;
    setInput("");
    setSearchTerm(currentInput);
    setLastSearchTerm(currentInput);
    setUIState("thinking");
    // Scroll to thinking animation after state update
    setTimeout(scrollToThinking, 100);
    const youtubeTools = await searchYoutubeAiTools(currentInput);
    if (youtubeTools && Array.isArray(youtubeTools)) {
      const uniqueTools = youtubeTools.filter(
        (tool, index, self) =>
          index === self.findIndex((t) => t.toolLink === tool.toolLink),
      );
      setYoutubeResults(uniqueTools);
      setChatHistory(prev => [...prev, { query: currentInput, results: uniqueTools }]);
    }
    setUIState("results");
  };

  // Handle YouTube search (initial search)
  const handleSearch = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!searchTerm.trim()) return;
    setUIState("thinking");
    setLastSearchTerm(searchTerm);
    const youtubeTools = await searchYoutubeAiTools(searchTerm);
    if (youtubeTools && Array.isArray(youtubeTools)) {
      const uniqueTools = youtubeTools.filter(
        (tool, index, self) =>
          index === self.findIndex((t) => t.toolLink === tool.toolLink),
      );
      setYoutubeResults(uniqueTools);
      // Add to chat history
      setChatHistory(prev => [...prev, { query: searchTerm, results: uniqueTools }]);
    }
    setUIState("results");
  };

  // Clear YouTube results
  const handleClearYoutube = () => {
    setYoutubeResults([]);
    setChatHistory([]);
    setUIState("idle");
    setSearchTerm("");
  };

  return (
    <div className="min-h-screen bg-[#FFA87F] flex flex-col items-center w-full pt-16 pb-32">
      <h1 className="text-3xl font-bold mb-2">betzefer.ai</h1>
      <p className="text-lg font-semibold text-black mb-8">{translatedTexts.subtitle}</p>
      {uiState === "idle" && (
        <AISearchInput
          value={searchTerm}
          onChange={setSearchTerm}
          onSubmit={handleSearch}
          isLoading={isLoadingYoutubeTools}
          buttonText={translatedTexts.searchButton}
          placeholder={translatedTexts.placeholder}
          className=""
        />
      )}
      {uiState !== "idle" && (
        <>
          <div className="flex flex-col items-center w-full mb-24">
            {/* Chat history */}
            {chatHistory.map((chat, index) => (
              <React.Fragment key={index}>
                {/* User's message */}
                <div className="flex justify-end w-full pr-0 md:pr-32 mb-6">
                  <div className="flex flex-col gap-2 w-full md:w-[468px]">
                    <div className="flex flex-col items-end">
                      <div className="flex flex-col max-w-[600px]">
                        <div className="px-6 py-4 w-full font-medium leading-5 rounded-3xl bg-[#E5E7FB] text-black">
                          {chat.query}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                {/* System response */}
                <div className="flex justify-start w-full pl-0 md:pl-32 mb-6">
                  <div className="flex flex-row gap-4 w-full items-start">
                    <div className="flex items-center justify-center w-14 h-14 rounded-full bg-[#E5E7FB]">
                      <SparklesIcon className="w-6 h-6 text-black" fill="black" />
                    </div>
                    <div className="flex flex-col gap-2 w-full">
                      <div className="flex flex-col items-start w-full">
                        <div className="flex flex-col w-full">
                          <div className="flex overflow-hidden flex-col justify-center self-start p-6 max-w-3xl w-full rounded-[40px] bg-white">
                            <div className="flex flex-col w-full max-md:max-w-full">
                              <div className="w-full">
                                <p className="mb-4 text-base text-gray-700" dir="rtl">
                                  {YOUTUBE_RESULTS_INTRO}
                                </p>
                                <div className="flex overflow-x-auto gap-6 pb-4 w-full">
                                  {chat.results.map((item, idx) => (
                                    <div key={idx} className="flex-none w-[300px]">
                                      <AIToolCard tool={item} />
                                    </div>
                                  ))}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </React.Fragment>
            ))}
            {/* Current thinking state */}
            {uiState === "thinking" && (
              <>
                {/* User's message for current thinking */}
                <div className="flex justify-end w-full pr-0 md:pr-32 mb-6">
                  <div className="flex flex-col gap-2 w-full md:w-[468px]">
                    <div className="flex flex-col items-end">
                      <div className="flex flex-col max-w-[600px]">
                        <div className="px-6 py-4 w-full font-medium leading-5 rounded-3xl bg-[#E5E7FB] text-black">
                          {lastSearchTerm}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                {/* Thinking animation */}
                <div ref={thinkingRef} className="flex justify-start w-full pl-0 md:pl-32">
                  <div className="flex flex-row gap-4 w-full items-start">
                    <div className="flex flex-col gap-2 w-full">
                      <div className="flex flex-col items-start w-full">
                        <div className="flex flex-col w-full">
                          <div className="flex overflow-hidden flex-col justify-center self-start p-6 max-w-3xl w-full rounded-[40px]">
                            <div className="flex flex-col w-full max-md:max-w-full">
                              <ThinkingAnimation sparkleBackgroundColor="#E5E7FB" isThinking={true} />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
          {/* Chat input at bottom */}
          <div className="fixed bottom-0 left-0 right-0 bg-[#FFA87F] p-4">
            <div className="max-w-2xl mx-auto">
              <div className="bg-[#FFCBB2] rounded-2xl shadow-md p-4">
                <form onSubmit={handleChatSubmit} className="flex gap-2">
                  <Input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder=""
                    className="flex-1 bg-white border-[#E5E7FB] focus-visible:ring-[#E5E7FB] h-16 rounded-2xl text-lg px-6"
                    disabled={uiState === "thinking"}
                  />
                  <Button 
                    type="submit" 
                    disabled={uiState === "thinking" || !input.trim()} 
                    className="bg-[#FFA87F] hover:bg-[#FF9B6A] h-16 w-16 rounded-2xl"
                  >
                    <Send className="h-5 w-5 text-black" />
                  </Button>
                </form>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
