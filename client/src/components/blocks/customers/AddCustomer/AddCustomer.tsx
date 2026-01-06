import React, { useMemo, useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { useLocation } from "react-router";
import { useCreateCustomer } from "../../../../features/customers/customers.queries";
import { RHFInput } from "../../../organisms/CustomizableForm/RHFInput";
import Button from "../../../../whitelabel/src/atoms/button/A-Button";

type CreateCustomerFullForm = {
  // step 1
  firstName: string;
  lastName: string;
  phoneNumber: string;

  // step 2 (address) - keep as single address for now (you can make array later)
  street: string;
  city: string;
  village?: string;
  postalCode: string;
  country: string;
  formattedAddress: string;
  latitude: number;
  longitude: number;
  isDefault?: boolean;
  isVerifiedByProvider?: boolean;

  // step 3
  noteText?: string;
};

const AddCustomer: React.FC = () => {
  const { state } = useLocation();

  const createMut = useCreateCustomer();
  const [step, setStep] = useState<1 | 2 | 3>(1);

  const methods = useForm<CreateCustomerFullForm>({
    mode: "onSubmit",
    defaultValues: {
      firstName: state?.firstName,
      lastName: state?.lastName,
      phoneNumber: state?.phoneNumber,
      street: "",
      city: "",
      village: "",
      postalCode: "",
      country: "MK",
      formattedAddress: "",
      latitude: undefined as any,
      longitude: undefined as any,
      isDefault: true,
      isVerifiedByProvider: false,
      noteText: "",
    },
  });

  // --- FIELD CONFIG PER STEP (data-driven like your style) ---
  const step1Fields = useMemo(
    () =>
      [
        {
          name: "firstName",
          type: "text",
          label: "First name",
          placeholder: "John",
          rules: { required: "First name is required" },
        },
        {
          name: "lastName",
          type: "text",
          label: "Last name",
          placeholder: "Doe",
          rules: { required: "Last name is required" },
        },
        {
          name: "phoneNumber",
          type: "tel",
          label: "Phone number",
          placeholder: "+389...",
          rules: {
            required: "Phone is required",
            minLength: { value: 9, message: "Премногу Кратко" },
          },
        },
      ] as const,
    []
  );

  const step2Fields = useMemo(
    () =>
      [
        {
          name: "street",
          type: "text",
          label: "Street",
          placeholder: "Partizanska 1",
          rules: { required: "Street is required" },
        },
        {
          name: "city",
          type: "text",
          label: "City",
          placeholder: "Skopje",
          rules: { required: "City is required" },
        },
        {
          name: "village",
          type: "text",
          label: "Village (optional)",
          placeholder: "—",
          rules: {},
        },
        {
          name: "postalCode",
          type: "text",
          label: "Postal code",
          placeholder: "1000",
          rules: { required: "Postal code is required" },
        },
        {
          name: "country",
          type: "text",
          label: "Country",
          placeholder: "MK",
          rules: { required: "Country is required" },
        },
        {
          name: "formattedAddress",
          type: "text",
          label: "Formatted address",
          placeholder: "Partizanska 1, 1000 Skopje, MK",
          rules: { required: "Formatted address is required" },
        },
        {
          name: "latitude",
          type: "string",
          label: "Latitude",
          placeholder: "41.9981",
          rules: { required: "Latitude is required" },
        },
        {
          name: "longitude",
          type: "string",
          label: "Longitude",
          placeholder: "21.4254",
          rules: { required: "Longitude is required" },
        },
      ] as const,
    []
  );

  const step3Fields = useMemo(
    () =>
      [
        {
          name: "noteText",
          type: "text",
          label: "Customer note (optional)",
          placeholder: "Customer prefers WhatsApp...",
          rules: {},
        },
      ] as const,
    []
  );

  // validate only fields from current step
  const nextStep = async () => {
    const names =
      step === 1
        ? (step1Fields.map((f) => f.name) as any)
        : step === 2
        ? (step2Fields.map((f) => f.name) as any)
        : (step3Fields.map((f) => f.name) as any);

    const ok = await methods.trigger(names);
    if (!ok) return;

    setStep((s) => (s === 1 ? 2 : s === 2 ? 3 : 3));
  };

  const prevStep = () => setStep((s) => (s === 3 ? 2 : 1));

  const onFinalSubmit = methods.handleSubmit(async (values) => {
    // build payload for your new backend endpoint:
    const payload = {
      firstName: values.firstName,
      lastName: values.lastName,
      phoneNumber: values.phoneNumber,

      address: {
        street: values.street,
        city: values.city,
        village: values.village || undefined,
        postalCode: values.postalCode,
        country: values.country,
        formattedAddress: values.formattedAddress,

        // IMPORTANT if your DTO uses @IsDecimal():
        // send strings (not numbers) to satisfy validator
        latitude: String(values.latitude),
        longitude: String(values.longitude),

        isDefault: true,
        isVerifiedByProvider: false,
      },

      noteText: values.noteText?.trim() || undefined,
    };

    await createMut.mutateAsync(payload as any);
  });

  const currentFields =
    step === 1 ? step1Fields : step === 2 ? step2Fields : step3Fields;

  return (
    <div>
      <h1>New Customer (3 steps)</h1>

      <FormProvider {...methods}>
        <form
          onSubmit={step === 3 ? onFinalSubmit : (e) => e.preventDefault()}
          style={{ display: "grid", gap: 10, maxWidth: 520 }}
        >
          <div className="uk-text-meta">Step {step} / 3</div>

          {currentFields.map((f) => (
            <RHFInput key={String(f.name)} {...(f as any)} />
          ))}

          <div className="uk-flex uk-flex-between uk-margin-small-top">
            <Button
              label="Back"
              style="secondary"
              disabled={step === 1 || createMut.isPending}
              onClick={(e) => {
                e.preventDefault();
                prevStep();
              }}
            />

            {step < 3 ? (
              <Button
                label="Next"
                style="primary"
                disabled={createMut.isPending}
                onClick={(e) => {
                  e.preventDefault();
                  nextStep();
                }}
              />
            ) : (
              <Button
                label={createMut.isPending ? "Creating..." : "Create"}
                style="primary"
                loading={createMut.isPending}
                type="submit"
              />
            )}
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

export default AddCustomer;
