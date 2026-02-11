// src/components/FormBuilderAccordion.types.ts
import type { FieldValues, Path, RegisterOptions } from "react-hook-form";
import type { RHFInputProps } from "../CustomizableForm/RHFInput";

export type GroupSummaryFn<T extends FieldValues> = (values: T) => string;

export type FormGroup<T extends FieldValues> = {
  id: string;
  title: string;
  description?: string;
  defaultOpen?: boolean;

  fields: RHFInputProps<T>[];
  summary?: GroupSummaryFn<T>;
};
