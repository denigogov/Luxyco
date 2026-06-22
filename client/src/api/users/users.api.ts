import type {
  UserQueryTypes,
  UserResponseTypes,
} from "../../features/users/users.types";
import { apiGet } from "../http";

const USERS_URL = "/users";

export function getUserList(
  params: UserQueryTypes,
  signal?: AbortSignal,
): Promise<UserResponseTypes> {
  const sp = new URLSearchParams();

  if (params.page != null) sp.set("page", String(params.page));
  if (params.limit != null) sp.set("limit", String(params.limit));
  if (params.active != null) sp.set("active", String(params.active));
  if (params.userType != null) sp.set("userType", String(params.userType));

  const query = sp.toString();
  const path = query ? `${USERS_URL}?${query}` : USERS_URL;

  return apiGet<any>(path, signal);
}
