import { useLocation, useNavigate, useParams } from "react-router";
import { useEffect, useMemo, useRef } from "react";
import type { RHFInputProps } from "../../../organisms/CustomizableForm/RHFInput";
import { CustomerUpdate } from "./updateCustomer.data";
import { notificationAlert } from "../../../../utils/hooks/notify";
import { FormBuilder } from "../../../organisms/CustomizableForm/FormBuilder";
import type { UpdateCustomerFormValues } from "./updateCustomer.types";
import { useUpdateCustomer } from "../../../../features/customers/customers.queries";

const UpdateCustomer: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { customerId } = useParams<{
    customerId: string;
  }>();

  const customerID = Number(customerId);
  const isValidCustomerId = Number.isFinite(customerID) && customerID > 0;

  const customerFromState = location.state as
    | UpdateCustomerFormValues
    | undefined;

  const updateMut = useUpdateCustomer(customerID);

  const initialForm = useMemo<UpdateCustomerFormValues>(
    () => ({
      firstName: customerFromState?.firstName ?? "",
      lastName: customerFromState?.lastName ?? "",
      phoneNumber: customerFromState?.phoneNumber ?? "",
    }),
    [customerFromState],
  );

  const fields = useMemo(() => {
    return (
      CustomerUpdate.filedsData as RHFInputProps<UpdateCustomerFormValues>[]
    ).map((f) => ({
      ...f,
      defaultValue: initialForm[f.name],
    }));
  }, [initialForm]);

  const warnedRef = useRef(false);
  useEffect(() => {
    if (warnedRef.current) return;

    if (!isValidCustomerId) {
      warnedRef.current = true;
      notificationAlert.warning({
        title: "Невалиден линк",
        text: "ID-то на клиентот не е валидно. Ве пренасочуваме кон листата на клиенти.",
      });
      navigate("/customers", { replace: true });
      return;
    }

    if (!customerFromState) {
      warnedRef.current = true;
      notificationAlert.warning({
        title: "Не може да се отвори преку споделен линк",
        text: "За да се зачуваат точни податоци, отвори го клиентот и кликни 'Уреди' повторно.",
      });

      navigate(`/customers/${customerID}`, { replace: true });
    }
  }, [isValidCustomerId, customerFromState, customerID, navigate]);

  const onSubmit = async (values: UpdateCustomerFormValues) => {
    try {
      await updateMut.mutateAsync(values);

      navigate(-1);
      notificationAlert.success(CustomerUpdate.notification.success);
    } catch (err) {
      notificationAlert.error(CustomerUpdate.notification.error);
      console.error(err);
    }
  };

  return (
    <div className="b-newCustomerNote">
      <FormBuilder<UpdateCustomerFormValues>
        fields={fields}
        onSubmit={onSubmit}
        submitButton={{
          ...CustomerUpdate.submitButton,
        }}
        className="uk-margin-small-top"
      />
    </div>
  );
};
export default UpdateCustomer;
