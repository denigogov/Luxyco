// src/whitelabel/src/atoms/input/RHFInput.tsx

import {
  Controller,
  useFormContext,
  type FieldValues,
  type Path,
} from "react-hook-form";
import type { InputTypes } from "../../../whitelabel/src/atoms/input/a-input.types";
import Input from "../../../whitelabel/src/atoms/input/a-input";

export type RHFInputProps<T extends FieldValues> = Omit<
  InputTypes,
  "value" | "onChange" | "error" | "defaultValue"
> & {
  name: Path<T>;
  defaultValue?: any;
  rules?: any; // can be RegisterOptions<T, Path<T>> if you want strict typing
};

export function RHFInput<T extends FieldValues>(props: RHFInputProps<T>) {
  const { control } = useFormContext<T>();

  return (
    <Controller
      name={props.name}
      control={control}
      defaultValue={props.defaultValue ?? ""}
      rules={props.rules}
      render={({ field, fieldState }) => (
        <Input
          {...props}
          value={(field.value ?? "") as any}
          onChange={field.onChange}
          error={{ message: fieldState.error?.message }}
        />
      )}
    />
  );
}
