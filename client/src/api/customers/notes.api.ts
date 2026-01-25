import { apiDelete } from "../http";

export function deleteSingleNote(noteId: number, signal?: AbortSignal) {
  return apiDelete<void>(`/customer-notes/${noteId}/`, undefined, signal);
}
