import { useEffect, useMemo, useRef } from "react";
import { useLocation, useNavigate, useParams } from "react-router";
import { notificationAlert } from "../../../../../utils/hooks/notify";
import type { RHFInputProps } from "../../../../organisms/CustomizableForm/RHFInput";
import type { CustomerAddressTypes } from "../../Details/customerDetails.types";
import { CustomerAddressesUpdate } from "./editAddresses.data";
import { FormBuilder } from "../../../../organisms/CustomizableForm/FormBuilder";
import { useUpdateCustomerAddresses } from "../../../../../features/customers/customersAddresses.queries";

const EditAddresses = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { customerId, addressId } = useParams<{
    customerId: string;
    addressId: string;
  }>();

  const customerFromState = location.state as CustomerAddressTypes | undefined;

  const updateMut = useUpdateCustomerAddresses();

  const initialForm = useMemo<Partial<CustomerAddressTypes>>(
    () => ({
      street: customerFromState?.street ?? "",
      city: customerFromState?.city ?? "",
      village: customerFromState?.village ?? "",
      postalCode: customerFromState?.postalCode ?? "",
      country: customerFromState?.country ?? "",
      formattedAddress: customerFromState?.formattedAddress ?? "",
      isDefault: customerFromState?.isDefault ?? false,
      isVerifiedByProvider: customerFromState?.isVerifiedByProvider ?? false,
    }),
    [customerFromState],
  );

  const fields = useMemo(() => {
    return (
      CustomerAddressesUpdate.filedsData as RHFInputProps<CustomerAddressTypes>[]
    ).map((f) => ({
      ...f,
      defaultValue: initialForm[f.name],
    }));
  }, [initialForm]);

  const warnedRef = useRef(false);
  useEffect(() => {
    if (!customerFromState && !warnedRef.current) {
      warnedRef.current = true;

      notificationAlert.warning({
        title: "Не може да се отвори преку споделен линк",
        text: "За да се зачуваат точни податоци, страницата за уредување мора да се отвори од клиентот. Ве пренасочуваме до профилот на клиентот.",
      });
      navigate(`/customers/${customerId}`, { replace: true });
    }
  }, [customerFromState, navigate, customerId]);

  const onSubmit = async (values: CustomerAddressTypes) => {
    const customerID = Number(customerId);
    const addressID = Number(addressId);

    try {
      const valueData = {
        ...values,
        formattedAddress: `${values.street}, ${values.postalCode} ${values.city} - ${values.village}`,
      };
      await updateMut.mutateAsync({
        addressId: addressID,
        dto: valueData,
        customerId: customerID,
      });

      navigate(-1);
      notificationAlert.success(CustomerAddressesUpdate.notification.success);
    } catch (err) {
      notificationAlert.error(CustomerAddressesUpdate.notification.error);
      console.error(err);
    }
  };

  return (
    <div className="b-newCustomerNote">
      <FormBuilder<CustomerAddressTypes>
        fields={fields}
        onSubmit={onSubmit}
        submitButton={{
          ...CustomerAddressesUpdate.submitButton,
        }}
        className="uk-margin-small-top"
      />
    </div>
  );
};
export default EditAddresses;
