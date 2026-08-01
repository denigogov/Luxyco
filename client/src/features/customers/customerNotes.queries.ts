import { useMutation, useQueryClient } from "@tanstack/react-query";
import { customerNotesKeys, customersKeys } from "./customers.keys";
import {
  createCustomerNote,
  deleteSingleNote,
  updateCustomerNote,
} from "../../api/customers/notes.api";
import type { NoteType } from "../../components/blocks/customers/Notes/customersNote.types";

type DeleteNoteIds = {
  customerId: number;
  noteId: number;
};

export function useDeleteCustomerNotes() {
  const qc = useQueryClient();

  return useMutation({
    mutationKey: customerNotesKeys.mutations.deleteOne(),

    mutationFn: ({ noteId }: DeleteNoteIds) => deleteSingleNote(noteId),

    onSuccess: async (_data, ids) => {
      qc.removeQueries({
        queryKey: customerNotesKeys.detail(ids.noteId),
        exact: true,
      });

      await Promise.all([
        qc.invalidateQueries({
          queryKey: customersKeys.detail(ids.customerId),
        }),
        qc.invalidateQueries({ queryKey: customersKeys.lists() }),
        qc.invalidateQueries({
          queryKey: customerNotesKeys.listByCustomer(ids.customerId),
        }),
      ]);
    },
  });
}

export function useCreateCustomerNote(customerId: number) {
  const qc = useQueryClient();

  return useMutation({
    mutationKey: customerNotesKeys.mutations.create(customerId),
    mutationFn: (dto: NoteType) => createCustomerNote(customerId, dto),
    onSuccess: async () => {
      await Promise.all([
        qc.invalidateQueries({ queryKey: customersKeys.detail(customerId) }),
        qc.invalidateQueries({ queryKey: customersKeys.lists() }),
        qc.invalidateQueries({
          queryKey: customerNotesKeys.listByCustomer(customerId),
        }),
      ]);
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
    mutationKey: customerNotesKeys.mutations.update(),
    mutationFn: (vars: UpdateNoteVars) =>
      updateCustomerNote(vars.noteId, vars.dto),

    onSuccess: async (updated, vars) => {
      qc.setQueryData(customerNotesKeys.detail(vars.noteId), updated);

      await Promise.all([
        qc.invalidateQueries({
          queryKey: customersKeys.detail(vars.customerId),
        }),
        qc.invalidateQueries({ queryKey: customersKeys.lists() }),
        qc.invalidateQueries({
          queryKey: customerNotesKeys.listByCustomer(vars.customerId),
        }),
      ]);
    },
  });
}
