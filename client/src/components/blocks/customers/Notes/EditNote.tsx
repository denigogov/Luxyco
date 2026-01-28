import { useLocation, useNavigate, useParams } from "react-router";
import { FormBuilder } from "../../../organisms/CustomizableForm/FormBuilder";

import { CustomerNotesUpdate } from "./customerNotesUpdate.data";
import type { RHFInputProps } from "../../../organisms/CustomizableForm/RHFInput";
import { useEffect, useRef } from "react";
import { useUpdateCustomerNote } from "../../../../features/customers/customerNotes.queries";
import { notificationAlert } from "../../../../utils/hooks/notify";
import type { NoteType } from "./customersNote.types";

const EditNote: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { customerId, noteId } = useParams<{
    customerId: string;
    noteId: string;
  }>();

  const noteText = location.state?.noteText;
  const warnedRef = useRef(false);
  useEffect(() => {
    if (!noteText && !warnedRef.current) {
      warnedRef.current = true;

      notificationAlert.warning({
        title: "Линкот не може директно да се отвори",
        text: "Овој екран бара податоци од претходната страница. Отворете го клиентот и избери 'Уреди' повторно.",
      });

      navigate("/customers", { replace: true });
    }
  }, [noteText, navigate]);

  const fields = (
    CustomerNotesUpdate.filedsData as RHFInputProps<NoteType>[]
  ).map((f) => (f.name === "noteText" ? { ...f, defaultValue: noteText } : f));

  const updateMut = useUpdateCustomerNote();

  const onSubmit = async (values: NoteType) => {
    const customerID = Number(customerId);
    const noteID = Number(noteId);

    try {
      await updateMut.mutateAsync({
        customerId: customerID,
        noteId: noteID,
        dto: values,
      });

      navigate(-1);
      notificationAlert.success(CustomerNotesUpdate.notification.success);
    } catch (err) {
      notificationAlert.error(CustomerNotesUpdate.notification.error);
      console.error(err);
    }
  };

  return (
    <div className="b-newCustomerNote">
      <FormBuilder<NoteType>
        fields={fields}
        onSubmit={onSubmit}
        submitButton={{
          ...CustomerNotesUpdate.submitButton,
        }}
        className="uk-margin-small-top"
      />
    </div>
  );
};

export default EditNote;
