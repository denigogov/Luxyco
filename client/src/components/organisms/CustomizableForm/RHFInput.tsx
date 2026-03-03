import {
  Controller,
  useFormContext,
  type FieldValues,
  type Path,
  type RegisterOptions,
} from "react-hook-form";
import type { InputTypes } from "../../../whitelabel/src/atoms/input/a-input.types";
import Input from "../../../whitelabel/src/atoms/input/a-input";
import ACheckbox from "../../../whitelabel/src/atoms/formComponents/checkbox/A-checkbox";
import ARadioGroup from "../../../whitelabel/src/atoms/formComponents/radio/A-radio-group";
import type { TextareaTypes } from "../../../whitelabel/src/atoms/formComponents/textarea/a-textarea.types";
import ATextarea from "../../../whitelabel/src/atoms/formComponents/textarea/A-textarea";
import ASelect from "../../../whitelabel/src/atoms/formComponents/select/A-select";

type Option = { label: string; value: string | number; disabled?: boolean };

export type RHFInputProps<T extends FieldValues> = Omit<
  InputTypes,
  "value" | "onChange" | "error" | "defaultValue"
> & {
  name: Path<T>;
  defaultValue?: any;
  rules?: RegisterOptions<T, Path<T>>;
  width?: string | number;
  filedType?: "default" | "radio" | "checkbox" | "textarea" | "select";

  options?: Option[];
  textareaProps?: Omit<
    TextareaTypes,
    "name" | "value" | "onChange" | "error" | "defaultValue"
  >;

  // for select placeholder
  selectPlaceholder?: string;

  // optional: if you want number conversion
  selectValueType?: "string" | "number";
};

export function RHFInput<T extends FieldValues>({
  defaultValue,
  rules,
  filedType = "default",
  options,
  ...rest
}: RHFInputProps<T>) {
  const { control } = useFormContext<T>();

  return (
    <Controller
      name={rest.name}
      control={control}
      defaultValue={defaultValue ?? ""}
      rules={rules}
      render={({ field, fieldState }) => (
        <>
          {filedType === "default" && (
            <Input
              {...rest}
              {...field}
              error={{ message: fieldState.error?.message }}
            />
          )}
          {filedType === "checkbox" && (
            <ACheckbox
              {...rest}
              name={field.name}
              checked={!!field.value}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                field.onChange(e.target.checked)
              }
              error={{ message: fieldState.error?.message }}
            />
          )}

          {filedType === "radio" && (
            <ARadioGroup
              name={field.name}
              label={rest.label}
              options={options ?? []}
              value={field.value}
              onChange={(val: string | number) => field.onChange(val)}
              error={{ message: fieldState.error?.message }}
              disabled={rest.disabled}
              className={rest.className}
            />
          )}
          {filedType === "textarea" && (
            <ATextarea
              {...(rest.textareaProps ?? {})}
              name={field.name}
              label={rest.label}
              className={rest.className}
              disabled={rest.disabled}
              required={rest.required}
              placeholder={rest.placeholder}
              readOnly={rest.readOnly}
              value={field.value ?? ""}
              onChange={(e) => field.onChange(e.target.value)}
              error={{ message: fieldState.error?.message }}
            />
          )}

          {filedType === "select" && (
            <ASelect
              {...rest}
              name={field.name}
              label={rest.label}
              className={rest.className}
              disabled={rest.disabled}
              required={rest.required}
              placeholder={rest.selectPlaceholder}
              options={options ?? []}
              value={field.value ?? ""}
              onChange={(e) => {
                const raw = e.target.value;

                // if placeholder selected => ""
                if (raw === "") return field.onChange("");

                // optional number conversion
                if (rest.selectValueType === "number") {
                  const n = Number(raw);
                  field.onChange(Number.isNaN(n) ? raw : n);
                } else {
                  field.onChange(raw);
                }
              }}
              error={{ message: fieldState.error?.message }}
            />
          )}
        </>
      )}
    />
  );
}
