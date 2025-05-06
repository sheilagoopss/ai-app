"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Button, Input, Segmented, Spin } from "antd";
import { Tool } from "@/types/tools";
import useFetchTools from "@/hooks/useFetchTools";
import { caseInsensitiveSearch } from "@/utils/caseInsensitveMatch";
import AIToolSearch from "@/components/common/AIToolSearch";
import AiCard from "@/components/aiTools/aiCard";
import { useYoutubeSearch } from "@/hooks/useYoutubeSearch";
import { CloseOutlined } from "@ant-design/icons";
import { AIToolResponse } from "@/helpers/GeminiHelper";
import AIToolCard from "@/components/aiTools/aiToolCard";

const ITEMS_PER_PAGE = 20;

export default function Scraper() {
  const { paginatedTools, error, fetchTools, tools } = useFetchTools();
  const { isLoadingYoutubeTools, searchYoutubeAiTools } = useYoutubeSearch();

  const [filteredResults, setFilteredResults] = useState<Tool[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [keywords, setKeywords] = useState<string[]>([]);
  const [searchType, setSearchType] = useState("Manual");
  const [youtubeTools, setYoutubeTools] = useState<AIToolResponse[]>([]);

  const handleAIToolSearch = useCallback(async () => {
    if (keywords.length === 0) {
      return;
    }
    const filtered = tools.filter((tool) =>
      keywords.some(
        (keyword) =>
          caseInsensitiveSearch(tool.toolName, keyword) ||
          caseInsensitiveSearch(tool.description, keyword),
      ),
    );

    setFilteredResults(filtered);
    setKeywords([]);
  }, [keywords, tools]);

  const handleYoutubeSearch = async () => {
    const youtubeTools = await searchYoutubeAiTools(searchTerm);
    if (youtubeTools && Array.isArray(youtubeTools)) {
      const uniqueTools = youtubeTools.filter(
        (tool, index, self) =>
          index === self.findIndex((t) => t.toolLink === tool.toolLink),
      );
      setYoutubeTools(uniqueTools);
    }
  };

  useEffect(() => {
    if (paginatedTools.length > 0) {
      setFilteredResults(paginatedTools);
    }
  }, [paginatedTools]);

  const handleClear = () => {
    setSearchTerm("");
    setKeywords([]);
    setFilteredResults(paginatedTools);
    setYoutubeTools([]);
  };

  useEffect(() => {
    fetchTools({
      limitToFirst: ITEMS_PER_PAGE,
    });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (keywords.length > 0) {
      handleAIToolSearch();
    }
  }, [handleAIToolSearch, keywords]);

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="space-y-4">
          <h1 className="text-4xl font-bold text-gray-900">AI Tools</h1>
          {error && <p className="text-sm text-red-600">{error}</p>}
        </div>

        <Segmented
          options={["Manual", "AI"]}
          onChange={(value) => setSearchType(value)}
        />
        {/* Search Bar */}
        <div className="mb-4 flex flex-row gap-2">
          {searchType === "Manual" && (
            <Input.Search
              size="large"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onSearch={handleYoutubeSearch}
              placeholder="Search for a tool..."
              allowClear
              onClear={handleClear}
            />
          )}
          {searchType === "AI" && (
            <AIToolSearch setKeywords={setKeywords} onClear={handleClear} />
          )}
          <Button icon={<CloseOutlined />} onClick={handleClear} size="large" />
        </div>

        <div>
          {isLoadingYoutubeTools ? (
            <div className="flex justify-center items-center h-screen w-full">
              <Spin />
            </div>
          ) : (
            <div className="space-y-4 w-full flex flex-col items-center">
              {searchType === "Manual" && (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {youtubeTools.map((item, index) => (
                    <AIToolCard key={index} tool={item} />
                  ))}
                </div>
              )}
              {searchType === "AI" && (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {filteredResults.map((item, index) => (
                    <AiCard key={index} tool={item} index={index} />
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
