"use client";

import React, { useState, useEffect } from "react";
import { Tool } from "@/types/tools";
import useFetchTools from "@/hooks/useFetchTools";
import AISearchInput from "@/components/common/AISearchInput";
import AiCard from "@/components/aiTools/aiCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";

export default function ToolsPage() {
  const { tools, fetchTools, isFetching, error } = useFetchTools();
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredTools, setFilteredTools] = useState<Tool[]>([]);

  // Fetch tools when component mounts
  useEffect(() => {
    fetchTools({ limitToFirst: 100 });
  }, [fetchTools]);

  // Filter tools based on search term
  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredTools(tools);
      return;
    }

    const searchLower = searchTerm.toLowerCase();
    const filtered = tools.filter(tool => 
      tool.toolName.toLowerCase().includes(searchLower) ||
      tool.description.toLowerCase().includes(searchLower) ||
      tool.toolTask.toLowerCase().includes(searchLower)
    );
    setFilteredTools(filtered);
  }, [searchTerm, tools]);

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold mb-2">AI Tools Directory</h1>
          <p className="text-lg text-muted-foreground mb-8">
            Discover and explore the best AI tools for your needs
          </p>

          {/* Search Section */}
          <div className="mb-8">
            <div className="relative">
              <Input
                type="text"
                placeholder="Search AI tools..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full h-12 pl-12 pr-4 rounded-lg border-2"
              />
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="text-red-500 mb-4">
              {error}
            </div>
          )}

          {/* Results Section */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {isFetching ? (
              <div className="col-span-full text-center py-8">
                <div className="animate-pulse">
                  Loading tools...
                </div>
              </div>
            ) : filteredTools.length > 0 ? (
              filteredTools.map((tool, idx) => (
                <AiCard key={tool.id || idx} tool={tool} index={idx} />
              ))
            ) : (
              <div className="col-span-full text-center py-8">
                {searchTerm ? (
                  <p>No tools found matching "{searchTerm}"</p>
                ) : (
                  <p>No tools available at the moment.</p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 