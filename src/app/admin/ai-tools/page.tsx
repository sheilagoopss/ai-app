"use client"

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Clock, LinkIcon, Info } from 'lucide-react';

interface Tool {
  toolName: string;
  toolIcon: string;
  toolInfoLink: string;
  description: string;
  toolTask: string;
}

export default function Scraper() {
  const [results, setResults] = useState<Tool[]>([]);
  const [filteredResults, setFilteredResults] = useState<Tool[]>([]);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Fetch tools from Firebase Realtime Database
  const fetchTools = async () => {
    setError('');
    setIsLoading(true);
    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL}/ai_tools.json`);
      const toolsArray = Object.values(response.data) as Tool[]; 
      setResults(toolsArray);
      setFilteredResults(toolsArray); // Initialize filtered results
    } catch (err) {
      setError('Error fetching tools from Firebase. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch tools when the component mounts
  useEffect(() => {
    fetchTools();
  }, []);

  // Handle search input change
  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setSearchTerm(value);

    // Filter results based on search term
    const filtered = results.filter((tool) =>
      tool.toolName.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredResults(filtered);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="space-y-4">
          <h1 className="text-4xl font-bold text-gray-900">AI Tools</h1>
          {error && (
            <p className="text-sm text-red-600">{error}</p>
          )}
        </div>

        {/* Search Bar */}
        <div className="mb-4">
          <input
            type="text"
            value={searchTerm}
            onChange={handleSearch}
            placeholder="Search for a tool..."
            className="w-full rounded-lg border border-gray-300 px-4 py-3 text-base focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
          />
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {isLoading ? (
            <p>Loading...</p>
          ) : (
            filteredResults.map((item, index) => {
              const isBlue = index % 2 === 0;
              
              return (
                <div
                  key={index}
                  className={`relative overflow-hidden rounded-xl p-6 ${
                    isBlue ? 'bg-blue-600 text-white' : 'bg-orange-500 text-white'
                  }`}
                >
                  <div className="space-y-4">
                    {item.toolIcon && (
                      <div className="flex justify-center mb-4">
                        <img
                          src={item.toolIcon}
                          alt=""
                          className="h-16 w-16 rounded-full border-2 border-white/50"
                        />
                      </div>
                    )}
                    <div className="space-y-2">
                      <h2 className="text-2xl font-semibold">{item.toolName}</h2>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 opacity-80" />
                        <span className="text-sm opacity-80">Last updated: {new Date().toLocaleDateString()}</span>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-center gap-2">
                        <LinkIcon className="h-4 w-4 opacity-80" />
                        <span className="text-sm opacity-80">Source URL</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Info className="h-4 w-4 opacity-80" />
                        <p className="text-sm opacity-80 line-clamp-2">{item.toolInfoLink}</p>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-center gap-2">
                        <LinkIcon className="h-4 w-4 opacity-80" />
                        <span className="text-sm opacity-80">Tool description</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Info className="h-4 w-4 opacity-80" />
                        <p className="text-sm opacity-80 line-clamp-2">{item.description}</p>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div className="flex items-center gap-2">
                        <LinkIcon className="h-4 w-4 opacity-80" />
                        <span className="text-sm opacity-80">Category</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Info className="h-4 w-4 opacity-80" />
                        <p className="text-sm opacity-80 line-clamp-2">{item.toolTask}</p>
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
            })
          )}
        </div>
      </div>
    </div>
  );
}