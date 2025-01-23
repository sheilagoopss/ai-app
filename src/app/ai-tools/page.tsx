"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Clock, LinkIcon, Info } from "lucide-react";
import { Image, Input, Pagination, Segmented, Skeleton, Spin } from "antd";
import { Tool } from "@/types/tools";
import useFetchTools from "@/hooks/useFetchTools";
import { caseInsensitiveSearch } from "@/utils/caseInsensitveMatch";
import AIToolSearch from "@/components/common/AIToolSearch";

export default function Scraper() {
  const [filteredResults, setFilteredResults] = useState<Tool[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const {
    paginatedTools,
    isFetching,
    error,
    fetchTools,
    lastItem,
    total,
    tools,
    isFetchingTotal,
  } = useFetchTools();
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [keywords, setKeywords] = useState<string[]>([]);
  const [searchType, setSearchType] = useState("Manual");
  const ITEMS_PER_PAGE = 10;

  const handleFindTools = async () => {
    const filtered = tools
      .filter(
        (tool) =>
          caseInsensitiveSearch(tool.toolName, searchTerm) ||
          caseInsensitiveSearch(tool.description, searchTerm),
      )
      .slice(0, ITEMS_PER_PAGE);
    setFilteredResults(filtered);
  };

  const handleAIToolSearch = useCallback(async () => {
    if (keywords.length === 0) {
      return;
    }
    const filtered = tools
      .filter((tool) =>
        keywords.some(
          (keyword) =>
            caseInsensitiveSearch(tool.toolName, keyword) ||
            caseInsensitiveSearch(tool.description, keyword),
        ),
      )
      .slice(0, ITEMS_PER_PAGE);
    setFilteredResults(filtered);
    setKeywords([]);
  }, [keywords, tools]);

  const handleSearch = async () => {
    setIsLoading(true);
    if (searchTerm.length > 0) {
      await handleFindTools();
    } else {
      setCurrentPage(1);
      setFilteredResults(paginatedTools);
    }
    setIsLoading(false);
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
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onSearch={handleSearch}
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
          {isFetching || isLoading ? (
            <div className="flex justify-center items-center h-screen w-full">
              <Spin />
            </div>
          ) : (
            <div className="space-y-4 w-full flex flex-col items-center">
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {filteredResults.map((item, index) => {
                  const isBlue = index % 2 === 0;

                  return (
                    <div
                      key={index}
                      className={`relative overflow-hidden rounded-xl p-6 ${
                        isBlue
                          ? "bg-blue-600 text-white"
                          : "bg-orange-500 text-white"
                      }`}
                    >
                      <div className="space-y-4">
                        {item.toolIcon && (
                          <div className="flex justify-center mb-4">
                            <Image
                              src={item.toolIcon}
                              alt=""
                              className="h-16 w-16 rounded-full border-2 border-white/50"
                              width={64}
                              height={64}
                              preview={false}
                            />
                          </div>
                        )}
                        <div className="space-y-2">
                          <h2 className="text-2xl font-semibold">
                            {item.toolName}
                          </h2>
                          <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4 opacity-80" />
                            <span className="text-sm opacity-80">
                              Last updated: {new Date().toLocaleDateString()}
                            </span>
                          </div>
                        </div>

                        <div className="space-y-4">
                          <div className="flex items-center gap-2">
                            <LinkIcon className="h-4 w-4 opacity-80" />
                            <span className="text-sm opacity-80">
                              Source URL
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Info className="h-4 w-4 opacity-80" />
                            <p className="text-sm opacity-80 line-clamp-2">
                              {item.toolInfoLink}
                            </p>
                          </div>
                        </div>

                        <div className="space-y-4">
                          <div className="flex items-center gap-2">
                            <LinkIcon className="h-4 w-4 opacity-80" />
                            <span className="text-sm opacity-80">
                              Tool description
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Info className="h-4 w-4 opacity-80" />
                            <p className="text-sm opacity-80 line-clamp-2">
                              {item.description}
                            </p>
                          </div>
                        </div>
                        <div className="space-y-4">
                          <div className="flex items-center gap-2">
                            <LinkIcon className="h-4 w-4 opacity-80" />
                            <span className="text-sm opacity-80">Category</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Info className="h-4 w-4 opacity-80" />
                            <p className="text-sm opacity-80 line-clamp-2">
                              {item.toolTask}
                            </p>
                          </div>
                        </div>

                        <a
                          href={item.toolInfoLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="block rounded-lg bg-white/ 20 px-4 py-2 text-center font-medium hover:bg-white/30"
                        >
                          View Details
                        </a>
                      </div>
                    </div>
                  );
                })}
              </div>
              {isFetchingTotal ? (
                <Skeleton.Button active style={{ width: "30ch" }} />
              ) : (
                <Pagination
                  current={currentPage}
                  total={total}
                  pageSize={ITEMS_PER_PAGE}
                  onChange={(page) => setCurrentPage(page)}
                />
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
