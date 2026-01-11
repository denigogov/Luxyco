import React from "react";
import { useCreateCustomerAddress } from "../../../../../features/customers/customers.queries";
import { FormBuilder } from "../../../../organisms/CustomizableForm/FormBuilder";
import type { RHFInputProps } from "../../../../organisms/CustomizableForm/RHFInput";
import type {
  CustomerAddressTypes,
  CustomerDetailsTypes,
} from "../../Details/customerDetails.types";
import { useLocation, useParams } from "react-router";
import { customerAddressAdd } from "./customerAddressAdd.data";
import Breadcrumbs from "../../../../../whitelabel/src/molecules/Breadcrumbs/M-Breadcrumbs";
import "./_newCustomerAddress.scss";
import { phoneNumberFormat } from "../../../../../utils/helpers/phoneNumberFormat";

const NewCustomerAddress: React.FC = () => {
  const location = useLocation();
  const customerFromState = location.state as CustomerDetailsTypes | undefined;
  const customerName = [
    customerFromState?.firstName,
    customerFromState?.lastName,
  ]
    .filter(Boolean)
    .join(" ");

  const { customerId } = useParams();
  const customerIdNum = Number(customerId);
  const validId = Number.isFinite(customerIdNum) && customerIdNum > 0;

  const createMut = useCreateCustomerAddress(customerIdNum);

  const fields =
    customerAddressAdd.filedsData as RHFInputProps<CustomerAddressTypes>[];

  const onSubmit = async (values: CustomerAddressTypes) => {
    if (!validId) return;

    console.log(values);
    await createMut.mutateAsync({
      ...values,
      formattedAddress: `${values.street}, ${values.city} `,
      latitude: "11.1111",
      longitude: "11.1111",
      isDefault: true,
      isVerifiedByProvider: false,
    });
  };

  return (
    <div className="b-newCustomerAddress">
      <Breadcrumbs {...customerAddressAdd.breadcrumbs} />

      {customerName && (
        <div className="b-newCustomerAddress__customerData">
          <div className="b-newCustomerAddress__customerData-initial">
            {customerFromState?.firstName.charAt(0)}{" "}
            {customerFromState?.lastName.charAt(0)}
          </div>
          <div>
            <p className="b-newCustomerAddress__customerData-name">
              {customerName}
            </p>
            {customerFromState?.phoneNumber && (
              <p>{phoneNumberFormat(customerFromState?.phoneNumber)}</p>
            )}
          </div>
        </div>
      )}

      <div className="uk-flex uk-flex-center uk-margin-medium-top">
        <div className="uk-box-shadow-medium uk-padding">
          <FormBuilder<CustomerAddressTypes>
            fields={fields}
            onSubmit={onSubmit}
            submitButton={{
              ...customerAddressAdd.submitButton,
              label:
                createMut.isPending || createMut.isSuccess
                  ? ""
                  : "Додај Адреса ",
              loading: createMut.isPending,
              disabled: createMut.isPending,
            }}
            cancelButton={
              customerAddressAdd?.cancelButton && {
                ...customerAddressAdd?.cancelButton,
                label: createMut.isSuccess ? "врати се назад" : "Откажи",
                disabled: createMut.isPending,
              }
            }
            className="uk-margin-small-top"
          />
          {createMut.isError ? (
            <p className="uk-text-danger uk-margin-small-top">
              {String(
                (createMut.error as any)?.body ??
                  (createMut.error as any)?.message
              )}
            </p>
          ) : null}
          {createMut.isSuccess ? (
            <p className="uk-text-success uk-margin-small-top">
              Успешно додадена адреса
            </p>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default NewCustomerAddress;
