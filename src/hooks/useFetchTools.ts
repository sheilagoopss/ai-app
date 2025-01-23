"use client";

import { useCallback, useState } from "react";
import { useLocalStorage } from "./useLocalStorage";
import axios from "axios";
import { Tool } from "@/types/tools";

const useFetchTools = () => {
  const [isFetching, setIsFetching] = useState(false);
  const [isFetchingTotal, setIsFetchingTotal] = useState(false);
  const [error, setError] = useState("");
  const [tools, setTools] = useLocalStorage<Tool[]>("tools", []);
  const [lastItem, setLastItem] = useState<string | undefined>(undefined);
  const [total, setTotal] = useState(0);
  const [paginatedTools, setPaginatedTools] = useState<Tool[]>([]);

  const fetchTools = useCallback(
    async ({
      limitToFirst = 10,
      startAfter,
    }: {
      limitToFirst: number;
      startAfter?: string;
    }) => {
      setIsFetching(true);
      setError("");
      try {
        const params = new URLSearchParams();
        params.append("orderBy", `"id"`);
        params.append("limitToFirst", `${limitToFirst}`);
        if (startAfter !== undefined) {
          params.append("startAfter", `"${startAfter}"`);
        }
        const response = await axios.get(
          `${
            process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL
          }/ai_tools.json?${params.toString()}`,
        );
        const toolsArray = (Object.values(response.data) as Tool[]).sort(
          (a, b) => a.toolName.localeCompare(b.toolName),
        ) as Tool[];
        setPaginatedTools(toolsArray);
        setTotal(toolsArray.length);
        setIsFetching(false);
        setLastItem(toolsArray[toolsArray.length - 1].toolName);

        // Get total number of tools
        setIsFetchingTotal(true);
        const totalTools = await axios.get(
          `${process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL}/ai_tools.json`,
        );
        setTools(Object.values(totalTools.data) as Tool[]);
        setTotal(Object.keys(totalTools.data).length);
        setIsFetchingTotal(false);
      } catch (error: any) {
        setError(
          "Error fetching tools from Firebase. Please try again later. " +
            error,
        );
      } finally {
        setIsFetching(false);
      }
    },
    [setTools],
  );

  return {
    paginatedTools,
    isFetching,
    error,
    fetchTools,
    lastItem,
    total,
    tools,
    isFetchingTotal,
  };
};

export default useFetchTools;
