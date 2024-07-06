import { client } from "@/lib/hono";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";
import { toast } from "sonner";

type ResponseType = InferResponseType<
  (typeof client.api.accounts)["bulk-delete"]["$post"]
>;
type RequestType = InferRequestType<
  (typeof client.api.accounts)["bulk-delete"]["$post"]
>["json"];

export function useBulkDeleteAccounts() {
  let queryClient = useQueryClient();

  let mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async (json) => {
      let response = await client.api.accounts["bulk-delete"].$post({ json });
      return await response.json();
    },
    onSuccess: () => {
      toast.success("Account(s) deleted");
      queryClient.invalidateQueries({ queryKey: ["accounts"] });
      // TODO: ensure to invalidate future queries
    },
    onError: () => {
      toast.error("Failed to delete account(s)");
    },
  });

  return mutation;
}
