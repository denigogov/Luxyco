import React from "react";
import { useForm, FormProvider } from "react-hook-form";
import { useCreateCustomerAddress } from "../../../../../features/customers/customers.queries";
import { RHFInput } from "../../../../organisms/CustomizableForm/RHFInput";
import Button from "../../../../../whitelabel/src/atoms/button/A-Button";
import type { CustomerAddressTypes } from "../../Details/customerDetails.types";
import { useParams } from "react-router";
import { customerAddressAdd } from "./customerAddressAdd.data";
import Breadcrumbs from "../../../../../whitelabel/src/molecules/Breadcrumbs/M-Breadcrumbs";

const NewCustomerAddress: React.FC = () => {
  const { customerId } = useParams();

  const customerIdNum = Number(customerId);
  const validId = Number.isFinite(customerIdNum) && customerIdNum > 0;

  const createMut = useCreateCustomerAddress(customerIdNum);

  const methods = useForm<CustomerAddressTypes>({
    mode: "onSubmit",
    defaultValues: {
      street: "",
      city: "",
      village: "",
      postalCode: "",
      country: "MK",
      formattedAddress: "",
      latitude: undefined as any,
      longitude: undefined as any,
      isDefault: true,
      isVerifiedByProvider: true,
    } as any,
  });

  // all fields in one form

  // const onSubmit = methods.handleSubmit(async (values) => {
  //   const payload = {
  //     street: values.street,
  //     city: values.city,
  //     village: values.village || undefined,
  //     postalCode: values.postalCode,
  //     country: values.country,
  //     formattedAddress: values.formattedAddress,
  //     latitude: (values as any).latitude,
  //     longitude: (values as any).longitude,
  //     isDefault: true,
  //     isVerifiedByProvider: true,
  //   };
  //   if (!validId) return;
  //   await createMut.mutateAsync(payload as CustomerAddressTypes);
  // });
  const onSubmit = methods.handleSubmit(async (values) => {
    if (!validId) return <p className="uk-text-danger">Invalid customer id.</p>;

    await createMut.mutateAsync({
      ...values,
      isDefault: true,
      isVerifiedByProvider: true,
    });
  });

  return (
    <div>
      <Breadcrumbs {...customerAddressAdd.breadcrumbs} />
      <h1>New Customer</h1>
      <FormProvider {...methods}>
        <form
          onSubmit={onSubmit}
          style={{ display: "grid", gap: 10, maxWidth: 520 }}
        >
          {customerAddressAdd?.filedsData.map((f) => (
            <RHFInput key={String(f.name)} {...(f as any)} />
          ))}

          <div className="uk-flex uk-flex-right uk-gap-small uk-margin-small-top">
            <Button
              label={createMut.isPending ? "Creating..." : "Create"}
              style="primary"
              loading={createMut.isPending}
              disabled={createMut.isPending}
              type="submit"
            />
          </div>

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
              Customer created (ID: {(createMut.data as any)?.id})
            </p>
          ) : null}
        </form>
      </FormProvider>
    </div>
  );
};

export default NewCustomerAddress;
