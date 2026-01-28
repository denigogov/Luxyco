import { FormBuilder } from "../../../organisms/CustomizableForm/FormBuilder";
import type { RHFInputProps } from "../../../organisms/CustomizableForm/RHFInput";
import { CustomerNotesAdd } from "./customerNotesAdd.data";
import "./_newCustomerNote.scss";
import { useParams } from "react-router";
import { useCreateCustomerNote } from "../../../../features/customers/customerNotes.queries";
import { notificationAlert } from "../../../../utils/hooks/notify";
import type { NoteType } from "./customersNote.types";

const NewNote: React.FC = () => {
  const { customerId } = useParams<{ customerId: string }>();
  const customerIdNum = Number(customerId);
  const validId = Number.isFinite(customerIdNum) && customerIdNum > 0;

  const createMut = useCreateCustomerNote(customerIdNum);
  const fields = CustomerNotesAdd.filedsData as RHFInputProps<NoteType>[];

  const onSubmit = async (values: NoteType) => {
    if (!validId) return;

    try {
      await createMut.mutateAsync({
        ...values,
      });
      notificationAlert.success(CustomerNotesAdd.notification.success);
    } catch (err) {
      notificationAlert.error(CustomerNotesAdd.notification.error);
      console.error(err);
    }
  };

  return (
    <div className="b-newCustomerNote">
      <FormBuilder<NoteType>
        fields={fields}
        onSubmit={onSubmit}
        submitButton={{
          ...CustomerNotesAdd.submitButton,
          loading: createMut.isPending,
          disabled: createMut.isPending,
        }}
        className="uk-margin-small-top"
      />
    </div>
  );
};

export default NewNote;
