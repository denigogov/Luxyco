// src/whitelabel/src/atoms/input/RHFInput.tsx

import {
  Controller,
  useFormContext,
  type FieldValues,
  type Path,
  type RegisterOptions,
} from "react-hook-form";
import type { InputTypes } from "../../../whitelabel/src/atoms/input/a-input.types";
import Input from "../../../whitelabel/src/atoms/input/a-input";

export type RHFInputProps<T extends FieldValues> = Omit<
  InputTypes,
  "value" | "onChange" | "error" | "defaultValue"
> & {
  name: Path<T>;
  defaultValue?: any;
  rules?: RegisterOptions<T, Path<T>>;
  width?: string | number;
};

export function RHFInput<T extends FieldValues>({
  defaultValue,
  rules,
  width,
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
        <Input
          {...rest}
          {...field}
          error={{ message: fieldState.error?.message }}
        />
      )}
    />
  );
}
