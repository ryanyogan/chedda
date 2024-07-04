import { client } from "@/lib/hono";
import { useQuery } from "@tanstack/react-query";

export function useGetAccounts() {
  let query = useQuery({
    queryKey: ["accounts"],
    queryFn: async () => {
      let response = await client.api.accounts.$get();

      if (!response.ok) {
        throw new Error("Failed to fetch accounts");
      }

      let { data } = await response.json();
      return data;
    },
  });

  return query;
}
