"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Button, Input, Segmented, Spin } from "antd";
import { Tool } from "@/types/tools";
import useFetchTools from "@/hooks/useFetchTools";
import { caseInsensitiveSearch } from "@/utils/caseInsensitveMatch";
import AIToolSearch from "@/components/common/AIToolSearch";
import { useFetchAiTools } from "@/hooks/useFetchAiTools";
import AiCard from "@/components/aiTools/aiCard";

const ITEMS_PER_PAGE = 20;

export default function Scraper() {
  const [filteredResults, setFilteredResults] = useState<Tool[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const { paginatedTools, error, fetchTools, lastItem, tools } =
    useFetchTools();
  const [currentPage, setCurrentPage] = useState(1);
  const [keywords, setKeywords] = useState<string[]>([]);
  const [searchType, setSearchType] = useState("Manual");
  const { data, loading, nextPage, reset } = useFetchAiTools(
    currentPage * ITEMS_PER_PAGE,
    searchTerm,
  );

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

  useEffect(() => {
    if (paginatedTools.length > 0) {
      setFilteredResults(paginatedTools);
    }
  }, [paginatedTools]);

  const handleClear = () => {
    setSearchTerm("");
    setKeywords([]);
    setFilteredResults(paginatedTools);
  };

  useEffect(() => {
    fetchTools({
      limitToFirst: ITEMS_PER_PAGE,
      startAfter: lastItem,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage]);

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
        <div className="mb-4 flex flex-col gap-2">
          {searchType === "Manual" && (
            <Input.Search
              size="large"
              // value={searchTerm}
              // onChange={(e) => setSearchTerm(e.target.value)}
              onSearch={(value) => {
                setSearchTerm(value);
                reset();
              }}
              placeholder="Search for a tool..."
              allowClear
              onClear={handleClear}
            />
          )}
          {searchType === "AI" && (
            <AIToolSearch setKeywords={setKeywords} onClear={handleClear} />
          )}
        </div>

        <div>
          {loading ? (
            <div className="flex justify-center items-center h-screen w-full">
              <Spin />
            </div>
          ) : (
            <div className="space-y-4 w-full flex flex-col items-center">
              {searchType === "Manual" && (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {data.map((item, index) => (
                    <AiCard key={index} tool={item} index={index} />
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
              {searchType === "Manual" && (
                <Button
                  type="primary"
                  size="large"
                  onClick={() => {
                    setCurrentPage(currentPage + 1);
                    nextPage();
                  }}
                  disabled={loading}
                >
                  Load More
                </Button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
