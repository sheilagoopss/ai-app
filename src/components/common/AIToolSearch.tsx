import { Input } from "antd";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { useState } from "react";

interface AIToolSearchProps {
  setKeywords: (keywords: string[]) => void;
  onClear: () => void;
  className?: string;
}

const AIToolSearch: React.FC<AIToolSearchProps> = ({ setKeywords, onClear, className }) => {
  const [isSearching, setIsSearching] = useState(false);
  
  const onSearch = async (value: string) => {
    if (value === "") {
      onClear();
      return;
    }
    setIsSearching(true);
    try {
      if (!process.env.NEXT_PUBLIC_GEMINI_API_KEY) {
        throw new Error("GEMINI_API_KEY is not set");
      }
      const genAI = new GoogleGenerativeAI(
        process.env.NEXT_PUBLIC_GEMINI_API_KEY,
      );
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
      // Context: These are the available tool categories: {TOOL_CATEGORIES}
      const prompt = `You are an AI assistant for generating keywords to improve search accuracy. 

Here's the user query: 
"${value}"

Your task:
1. Analyze the user query.
2. Understand the context based on the categories.
3. Generate a concise array of keywords (no duplicates, only relevant terms) that match the intent of the user query.

Output format:
keyword1, keyword2, keyword3, ...

Example:
If the query is "I need something to edit photos," and the categories are "Photo Editing, Graphic Design, Video Editing," your response should be:
photo editor, photo editing, image editing, graphics

Always return your output as comma separated keywords.`;

      const result = await model.generateContent(prompt);
      const keywords = result.response.text()?.split(",");
      const cleanedKeywords = keywords?.map((keyword) => keyword.trim());
      setKeywords(cleanedKeywords);
    } catch (error) {
      console.log(error);
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <Input.Search
      size="large"
      placeholder="Search for a tool using natural language..."
      onSearch={onSearch}
      loading={isSearching}
      allowClear
      onClear={onClear}
      className={className}
      style={{
        backgroundColor: 'white',
        borderRadius: '0.75rem',
      }}
    />
  );
};

export default AIToolSearch;
