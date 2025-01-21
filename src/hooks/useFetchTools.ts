"use client";

import { useCallback, useState } from "react";
import { useLocalStorage } from "./useLocalStorage";
import axios from "axios";
import { Tool } from "@/types/tools";

const useFetchTools = () => {
  const [isFetching, setIsFetching] = useState(false);
  const [error, setError] = useState("");
  const [tools, setTools] = useLocalStorage("tools", []);

  const fetchTools = useCallback(async () => {
    setIsFetching(true);
    setError("");
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL}/ai_tools.json`,
      );
      const toolsArray = Object.values(response.data) as Tool[];
      setTools(toolsArray);
    } catch (error: any) {
      setError(
        "Error fetching tools from Firebase. Please try again later. " + error,
      );
    } finally {
      setIsFetching(false);
    }
  }, [setTools]);

  return { tools, isFetching, error, fetchTools };
};

export default useFetchTools;
