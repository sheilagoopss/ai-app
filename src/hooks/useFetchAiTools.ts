import { useEffect, useState, useCallback } from "react";
import {
  getFirestore,
  collection,
  query,
  orderBy,
  limit,
  startAfter,
  getDocs,
  where,
} from "firebase/firestore";
import { COLLECTIONS } from "@/firebase/collections";
import { Tool } from "@/types/tools";

export interface IPaginationResult<Tool> {
  data: Tool[];
  loading: boolean;
  error: Error | null;
  nextPage: () => Promise<void>;
  reset: () => void;
}

export const useFetchAiTools = (
  pageSize: number,
  searchTerm: string = "",
): IPaginationResult<Tool> => {
  const [data, setData] = useState<Tool[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [lastVisible, setLastVisible] = useState<any>(null);
  const [resetTrigger, setResetTrigger] = useState(0);
  const [hasMore, setHasMore] = useState(true);

  const fetchPage = useCallback(async () => {
    if (!hasMore) return;

    try {
      setLoading(true);
      setError(null);

      const db = getFirestore();
      const colRef = collection(db, COLLECTIONS.aiTools);

      let q = query(colRef);

      if (searchTerm) {
        const searchQuery = searchTerm.toLowerCase().trim();
        q = query(
          colRef,
          where("searchQuery", ">=", searchQuery),
          where("searchQuery", "<", searchQuery + "\uf8ff"),
          orderBy("searchQuery"),
        );
      } else {
        q = query(colRef, orderBy("searchQuery"));
      }

      q = query(q, limit(pageSize));
      if (lastVisible) {
        q = query(q, startAfter(lastVisible));
      }

      const snapshot = await getDocs(q);
      const newData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Tool[];

      setData((prevData) => {
        const filter = [...prevData, ...newData].reduce((acc, item) => {
          if (!acc.some((i) => i.uuid === item.uuid)) {
            acc.push(item);
          }
          return acc;
        }, [] as Tool[]);
        return filter;
      });

      setLastVisible(snapshot.docs[snapshot.docs.length - 1]);
      setHasMore(newData.length === pageSize);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  }, [pageSize, searchTerm, lastVisible, hasMore]);

  const nextPage = async () => {
    if (!loading && hasMore) {
      await fetchPage();
    }
  };

  const reset = useCallback(() => {
    setData([]);
    setLastVisible(null);
    setHasMore(true);
    setResetTrigger((prev) => prev + 1);
  }, []);

  // useEffect(() => {
  //   reset();
  //   fetchPage();
  // }, [fetchPage, reset, searchTerm, resetTrigger]);

  return { data, loading, error, nextPage, reset };
};
