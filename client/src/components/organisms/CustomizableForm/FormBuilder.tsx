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
  cancelButton?: ButtonTypes;
  className?: string;
  noFormTag?: boolean;
};

export function FormBuilder<T extends FieldValues>({
  fields,
  onSubmit,
  submitButton,
  cancelButton,
  className,
  noFormTag,
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
    mode: "onChange",
    reValidateMode: "onChange",
  });

  const {
    formState: { isDirty, isSubmitting },
  } = methods;

  const Wrapper = noFormTag ? "div" : "form";

  const handleSubmit = methods.handleSubmit(async (values) => {
    await onSubmit(values);
    methods.reset();
  });

  return (
    <FormProvider {...methods}>
      <Wrapper
        className={`uk-grid-small ${className ?? ""}`}
        data-uk-grid
        {...(!noFormTag && { onSubmit: handleSubmit })}
      >
        {fields.map((f) => (
          <div
            key={String(f.name)}
            className={f.width ? `uk-width-1-${f.width}` : "uk-width-1-1"}
          >
            <RHFInput {...f} />
          </div>
        ))}
        <div
          className="
    uk-width-1-1
    uk-grid-small
    uk-margin-medium-top
    uk-child-width-1-1
    uk-child-width-auto@m
    uk-flex-right@m
  "
          uk-grid="true"
        >
          {cancelButton && (
            <div>
              <Button
                {...cancelButton}
                className="uk-width-1-1 uk-width-auto@m"
              />
            </div>
          )}

          <div>
            <Button
              {...submitButton}
              disabled={!isDirty || isSubmitting || submitButton.disabled}
              type={noFormTag ? "button" : "submit"}
              onClick={noFormTag ? handleSubmit : undefined}
              className="uk-width-1-1 uk-width-auto@m"
            />
          </div>
        </div>
      </Wrapper>
    </FormProvider>
  );
}
