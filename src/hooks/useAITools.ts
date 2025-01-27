"use client";

import { COLLECTIONS } from "@/firebase/collections";
import { db } from "@/firebase/config";
import {
  getCountFromServer,
  getDocs,
  limit,
  orderBy,
  query,
  startAfter,
  endBefore,
  where,
} from "firebase/firestore";
import { collection } from "firebase/firestore";
import { useCallback, useState } from "react";

interface IQueryOptions {
  searchTerm?: string;
  pageSize?: number;
  lastDoc?: string;
  direction?: "forward" | "backward";
}

interface IPageResult<T> {
  data: T[];
  lastDoc?: T;
  total: number;
}

export const useAITools = () => {
  const [isFetching, setIsFetching] = useState(false);

  const fetchPaginatedDataWithCount = useCallback(
    async <T>(
      options: IQueryOptions = { direction: "forward" },
    ): Promise<IPageResult<T>> => {
      const {
        searchTerm = "",
        pageSize = 10,
        lastDoc,
        direction = "forward",
      } = options;
      setIsFetching(true);
      try {
        const collectionRef = collection(db, COLLECTIONS.aiTools);

        let q = query(collectionRef);

        if (searchTerm) {
          const searchQuery = searchTerm.toLowerCase().trim();
          q = query(
            collectionRef,
            where("searchQuery", ">=", searchQuery),
            where("searchQuery", "<", searchQuery + "\uf8ff"),
            orderBy("searchQuery"),
          );
        } else {
          q = query(collectionRef, orderBy("searchQuery"));
        }

        const countSnapshot = await getCountFromServer(q);
        const total = countSnapshot.data().count;

        q = query(q, limit(pageSize));
        if (direction === "forward" && lastDoc) {
          q = query(q, startAfter(lastDoc));
        }
        if (direction === "backward") {
          q = query(q, endBefore(lastDoc));
        }

        const snapshot = await getDocs(q);
        const data: T[] = snapshot.docs.map(
          (doc) =>
            ({
              id: doc.id,
              ...doc.data(),
            } as T),
        );

        return {
          data,
          lastDoc: data.length > 0 ? data[data.length - 1] : undefined,
          total,
        };
      } catch (error) {
        console.error("Error fetching paginated data with count:", error);
        return {
          data: [],
          lastDoc: undefined,
          total: 0,
        };
      } finally {
        setIsFetching(false);
      }
    },
    [],
  );

  return {
    fetchPaginatedDataWithCount,
    isFetching,
  };
};
