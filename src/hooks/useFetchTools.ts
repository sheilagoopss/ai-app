"use client";

import { useCallback, useState } from "react";
import { useLocalStorage } from "./useLocalStorage";
import { Tool } from "@/types/tools";
import { collection, getDocs, query, orderBy, limit, startAfter, where } from "firebase/firestore";
import { db } from "@/firebase/config";
import { COLLECTIONS } from "@/firebase/collections";

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
      startAfter: startAfterId,
      searchTerm = "",
    }: {
      limitToFirst: number;
      startAfter?: string;
      searchTerm?: string;
    }) => {
      setIsFetching(true);
      setError("");
      try {
        const toolsRef = collection(db, COLLECTIONS.aiTools);
        let q = query(toolsRef);

        if (searchTerm) {
          const searchQuery = searchTerm.toLowerCase().trim();
          q = query(
            toolsRef,
            where("searchQuery", ">=", searchQuery),
            where("searchQuery", "<", searchQuery + "\uf8ff"),
            orderBy("searchQuery")
          );
        } else {
          q = query(toolsRef, orderBy("searchQuery"));
        }

        q = query(q, limit(limitToFirst));
        
        if (startAfterId) {
          q = query(q, startAfter(startAfterId));
        }

        const snapshot = await getDocs(q);
        const toolsArray = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Tool[];

        setPaginatedTools(toolsArray);
        setTotal(toolsArray.length);
        setLastItem(toolsArray[toolsArray.length - 1]?.toolName);

        // Get total number of tools
        setIsFetchingTotal(true);
        const totalSnapshot = await getDocs(toolsRef);
        const allTools = totalSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Tool[];
        
        setTools(allTools);
        setTotal(allTools.length);
        setIsFetchingTotal(false);
      } catch (error: any) {
        console.error("Error fetching tools:", error);
        setError(
          error?.message || "Error fetching tools from Firestore. Please try again later."
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
