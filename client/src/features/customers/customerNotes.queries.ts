import { useMutation, useQueryClient } from "@tanstack/react-query";
import { customerNotesKeys, customersKeys } from "./customers.keys";
import { deleteSingleNote } from "../../api/customers/notes.api";

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
