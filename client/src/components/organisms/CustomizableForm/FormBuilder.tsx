// src/components/FormBuilder.tsx
import { useMemo } from "react";
import { FormProvider, useForm, type FieldValues } from "react-hook-form";
import { RHFInput, type RHFInputProps } from "./RHFInput";
import type { ButtonTypes } from "../../../whitelabel/src/atoms/button/a-button.types";
import Button from "../../../whitelabel/src/atoms/button/A-Button";

type FormBuilderProps<T extends FieldValues> = {
  fields: RHFInputProps<T>[];
  onSubmit: (values: T) => void | Promise<void>;
  submitButton: ButtonTypes;
  className?: string;
};

export function FormBuilder<T extends FieldValues>({
  fields,
  onSubmit,
  submitButton,
  className,
}: FormBuilderProps<T>) {
  const defaultValues = useMemo(() => {
    const dv: any = {};
    for (const f of fields) {
      dv[f.name] = f.defaultValue ?? "";
    }
    return dv;
  }, [fields]);

  const methods = useForm<T>({
    defaultValues,
    mode: "onSubmit",
  });

  return (
    <FormProvider {...methods}>
      <form
        className={className}
        onSubmit={methods.handleSubmit(onSubmit)}
        style={{ display: "grid", gap: 10 }}
      >
        {fields.map((f) => (
          <RHFInput key={String(f.name)} {...f} />
        ))}

        <Button {...submitButton} type="submit" />
      </form>
    </FormProvider>
  );
}
