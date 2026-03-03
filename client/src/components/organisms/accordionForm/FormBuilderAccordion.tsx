// src/components/FormBuilderAccordion.tsx
import { useEffect, useMemo, useState } from "react";
import {
  FormProvider,
  useForm,
  type FieldValues,
  type Path,
} from "react-hook-form";
import type { ButtonTypes } from "../../../whitelabel/src/atoms/button/a-button.types";
import Button from "../../../whitelabel/src/atoms/button/A-Button";
import { RHFInput } from "../CustomizableForm/RHFInput";
import type { FormGroup } from "./FormBuilderAccordion.types";
import "./_formBuilderAccordion.styles.scss";

type Props<T extends FieldValues> = {
  groups: FormGroup<T>[];
  onSubmit: (values: T) => void | Promise<void>;
  submitButton: ButtonTypes;
  cancelButton?: ButtonTypes;
  className?: string;

  /** if true: you can only move away from current group when it's valid */
  gated?: boolean;
};

function pickInitialOpenId<T extends FieldValues>(groups: FormGroup<T>[]) {
  return groups.find((g) => g.defaultOpen)?.id ?? groups[0]?.id ?? "";
}

export function FormBuilderAccordion<T extends FieldValues>({
  groups,
  onSubmit,
  submitButton,
  cancelButton,
  className,
  gated = true,
}: Props<T>) {
  const [openGroupId, setOpenGroupId] = useState<string>(() =>
    pickInitialOpenId(groups),
  );
  const [groupValid, setGroupValid] = useState<Record<string, boolean>>({});

  // If groups change, keep openGroupId valid
  useEffect(() => {
    if (!groups.length) {
      setOpenGroupId("");
      return;
    }
    const stillExists = groups.some((g) => g.id === openGroupId);
    if (!stillExists) setOpenGroupId(pickInitialOpenId(groups));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [groups]);

  const allFields = useMemo(() => groups.flatMap((g) => g.fields), [groups]);

  const defaultValues = useMemo(() => {
    const dv: Record<string, any> = {};
    for (const f of allFields) {
      const isCheckbox = f.filedType === "checkbox";
      dv[String(f.name)] = f.defaultValue ?? (isCheckbox ? false : "");
    }
    return dv;
  }, [allFields]);

  const methods = useForm<T>({
    defaultValues: defaultValues as any,
    mode: "onChange",
    reValidateMode: "onChange",
  });

  const {
    formState: { isDirty, isSubmitting },
    trigger,
    getValues,
  } = methods;

  const getGroupFieldNames = (groupId: string) => {
    const g = groups.find((x) => x.id === groupId);
    if (!g) return [] as Path<T>[];
    return g.fields.map((f) => f.name) as Path<T>[];
  };

  const validateGroup = async (groupId: string) => {
    const names = getGroupFieldNames(groupId);
    if (names.length === 0) return true;

    const ok = await trigger(names, { shouldFocus: true });
    setGroupValid((prev) => ({ ...prev, [groupId]: ok }));
    return ok;
  };

  const requestOpenGroup = async (targetId: string) => {
    if (targetId === openGroupId) return;

    if (gated && openGroupId) {
      const ok = await validateGroup(openGroupId);
      if (!ok) return;
    }

    setOpenGroupId(targetId);
  };

  const handleSubmit = methods.handleSubmit(async (values) => {
    for (const g of groups) {
      const ok = await validateGroup(g.id);
      if (!ok) {
        setOpenGroupId(g.id);
        return;
      }
    }

    await onSubmit(values);
    methods.reset();
    setGroupValid({});
    setOpenGroupId(pickInitialOpenId(groups));
  });

  return (
    <div className={`m-accordion ${className ?? ""}`}>
      <FormProvider {...methods}>
        <form onSubmit={handleSubmit}>
          <ul
            className="m-accordion__list"
            uk-accordion="collapsible: true; multiple: false"
          >
            {groups.map((group, inx) => {
              const isOpen = group.id === openGroupId;
              const isValid = !!groupValid[group.id];

              const summary =
                group.summary && !isOpen && isValid
                  ? group.summary(getValues())
                  : "";

              return (
                <li
                  key={group.id}
                  className={[
                    "m-accordion__item",
                    isOpen ? "uk-open" : "",
                    isValid ? "is-valid" : "",
                  ]
                    .filter(Boolean)
                    .join(" ")}
                >
                  <a
                    className="uk-accordion-title m-accordion__header"
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      requestOpenGroup(group.id);
                    }}
                  >
                    <span className="m-accordion__number">{inx + 1}</span>

                    <div className="m-accordion__title-stack">
                      <span className="m-accordion__title">{group.title}</span>

                      {summary ? (
                        <span className="m-accordion__summary">{summary}</span>
                      ) : group.description && !isOpen ? (
                        <span className="m-accordion__description">
                          {group.description}
                        </span>
                      ) : null}
                    </div>

                    <span className="m-accordion__icon" aria-hidden="true" />
                  </a>

                  <div className="uk-accordion-content m-accordion__content">
                    <div className="uk-grid-small" data-uk-grid>
                      {group.fields.map((f, i) => (
                        <div
                          key={i}
                          className={
                            f.width ? `uk-width-1-${f.width}` : "uk-width-1-1"
                          }
                        >
                          <RHFInput {...f} />
                        </div>
                      ))}
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>

          <div className="m-accordion__footer">
            {cancelButton && <Button {...cancelButton} />}
            <Button
              {...submitButton}
              disabled={!isDirty || isSubmitting || submitButton.disabled}
              type="submit"
            />
          </div>
        </form>
      </FormProvider>
    </div>
  );
}
