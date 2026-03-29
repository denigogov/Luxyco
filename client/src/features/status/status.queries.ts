import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { statusKeys } from "./status.keys";
import { getStatusList } from "../../api/status/status.api";

export function useStatusList() {
  return useQuery({
    queryKey: statusKeys.list(),
    queryFn: ({ signal }) => getStatusList("status", signal),
    placeholderData: keepPreviousData,
    staleTime: 5 * 60 * 1000,
  });
}
