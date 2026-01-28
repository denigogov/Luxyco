import type {} from "../../components/blocks/customers/Notes/customerNotesAdd.data";
import type { NoteType } from "../../components/blocks/customers/Notes/customersNote.types";
import { apiDelete, apiPatch, apiPost } from "../http";

export function deleteSingleNote(noteId: number, signal?: AbortSignal) {
  return apiDelete<void>(`/customer-notes/${noteId}/`, undefined, signal);
}

export function createCustomerNote(customerId: number, dto: NoteType) {
  return apiPost(`/customer-notes/${customerId}`, dto);
}

export function updateCustomerNote(customerId: number, dto: Partial<NoteType>) {
  return apiPatch<NoteType>(`/customer-notes/${customerId}`, dto);
}
