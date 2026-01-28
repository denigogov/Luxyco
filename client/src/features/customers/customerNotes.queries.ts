import { useMutation, useQueryClient } from "@tanstack/react-query";
import { customerNotesKeys, customersKeys } from "./customers.keys";
import {
  createCustomerNote,
  deleteSingleNote,
  updateCustomerNote,
} from "../../api/customers/notes.api";
import type {} from "../../components/blocks/customers/Notes/customerNotesAdd.data";
import type { NoteType } from "../../components/blocks/customers/Notes/customersNote.types";

type DeleteNoteIds = {
  customerId: number;
  noteId: number;
};

export function useDeleteCustomerNotes() {
  const qc = useQueryClient();

  return useMutation({
    mutationKey: ["customer-notes", "delete"] as const,

    mutationFn: ({ noteId }: DeleteNoteIds) => deleteSingleNote(noteId),

    onSuccess: (_data, ids) => {
      qc.invalidateQueries({ queryKey: customersKeys.detail(ids.customerId) });
      qc.invalidateQueries({
        queryKey: customerNotesKeys.listByCustomer(ids.customerId),
      });
    },
  });
}

export function useCreateCustomerNote(customerId: number) {
  const qc = useQueryClient();

  return useMutation({
    mutationKey: customersKeys.mutations.createAddress(customerId),
    mutationFn: (dto: NoteType) => createCustomerNote(customerId, dto),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: customersKeys.detail(customerId) });
      qc.invalidateQueries({ queryKey: customersKeys.lists() });
    },
  });
}

type UpdateNoteVars = {
  customerId: number;
  noteId: number;
  dto: Partial<NoteType>;
};

export function useUpdateCustomerNote() {
  const qc = useQueryClient();

  return useMutation({
    mutationKey: ["customer-notes", "update"] as const,
    mutationFn: (vars: UpdateNoteVars) =>
      updateCustomerNote(vars.noteId, vars.dto),

    onSuccess: (updated, vars) => {
      qc.invalidateQueries({ queryKey: customersKeys.detail(vars.customerId) });
      qc.setQueryData(customerNotesKeys.detail(vars.noteId), updated);
    },
  });
}
