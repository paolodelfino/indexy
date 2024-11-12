import useQueryStore from "@/stores/useQueryStore";
import { useEffect, useState } from "react";

/**
 * If pending is false, data is never undefined as long as it isn't specified by QueryData type
 */
export default function useQuery<QueryData>(
  queryId: string,
  queryFn: () => Promise<QueryData>,
) {
  const store = useQueryStore();

  useEffect(() => {
    store.subscribeQuery(queryId, () => fetch());
    return () => {
      store.unsubscribeQuery(queryId);
    };
  }, []);

  const [data, setData] = useState<QueryData>();
  const [once, setOnce] = useState(false);
  const [isPending, setIsPending] = useState(true);

  const fetch = async () => {
    setOnce(true);

    setIsPending(true);

    const data = await queryFn();

    setData(data);

    setIsPending(false);
  };

  return { data, fetch, isPending, once };
}
