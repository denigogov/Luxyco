import type { StatusTypes } from "../../features/status/status.types";
import { apiGet } from "../http";

export function getStatusList(
  path: string,
  signal?: AbortSignal,
): Promise<StatusTypes[]> {
  return apiGet<StatusTypes[]>(path, signal);
}
