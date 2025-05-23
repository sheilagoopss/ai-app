"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Button, Input, Spin } from "antd";
import { Tool } from "@/types/tools";
import useFetchTools from "@/hooks/useFetchTools";
import { caseInsensitiveSearch } from "@/utils/caseInsensitveMatch";
import AiCard from "@/components/aiTools/aiCard";

const ITEMS_PER_PAGE = 20;

export default function Scraper() {
  const [filteredResults, setFilteredResults] = useState<Tool[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const { paginatedTools, error, fetchTools, lastItem, tools, isFetching } =
    useFetchTools();
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);

  // Initial fetch when component mounts
  useEffect(() => {
    fetchTools({
      limitToFirst: ITEMS_PER_PAGE,
    });
  }, []);

  useEffect(() => {
    if (paginatedTools.length > 0) {
      setFilteredResults(paginatedTools);
    }
  }, [paginatedTools]);

  const handleClear = () => {
    setSearchTerm("");
    setFilteredResults(paginatedTools);
  };

  useEffect(() => {
    fetchTools({
      limitToFirst: ITEMS_PER_PAGE,
      startAfter: lastItem,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage]);

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="space-y-4">
          <h1 className="text-4xl font-bold text-gray-900">AI Tools</h1>
          {error && <p className="text-sm text-red-600">{error}</p>}
        </div>

        {/* Search Bar */}
        <div className="mb-4 flex flex-col gap-2">
          <Input.Search
            size="large"
            onSearch={(value) => {
              setSearchTerm(value);
              const filtered = tools.filter((tool) =>
                caseInsensitiveSearch(tool.toolName, value) ||
                caseInsensitiveSearch(tool.description, value)
              );
              setFilteredResults(filtered);
            }}
            placeholder="Search for a tool..."
            allowClear
            onClear={handleClear}
          />
        </div>

        <div>
          {isFetching && filteredResults.length === 0 ? (
            <div className="flex justify-center items-center h-screen w-full">
              <Spin />
            </div>
          ) : (
            <div className="space-y-4 w-full flex flex-col items-center">
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {filteredResults.map((item, index) => (
                  <AiCard key={index} tool={item} index={index} />
                ))}
              </div>
              {filteredResults.length > 0 && (
                <Button
                  type="primary"
                  size="large"
                  onClick={() => {
                    setCurrentPage(currentPage + 1);
                  }}
                  disabled={isFetching}
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