import { signal, Signal, computed } from "@preact/signals-react";
import { useEffect } from "react";
import {
  Field,
  FieldCollection,
  FieldContext,
  FieldRule,
  FormContext,
} from "../types";
import { KeyOf, forEachKeyOf } from "../../utils";

interface ValidationFieldRule<TForm, TKey extends KeyOf<TForm>>
  extends FieldRule<TForm, TKey> {
  execute: (value: TForm[TKey], context: FormContext<TForm>) => boolean;
}

const alwaysTrueSignal = signal(true);

export function useValidation(
  fields: FieldCollection,
  formContext: Signal<FormContext>
) {
  useEffect(() => {
    console.log("(Form) Initializing new validation rules");

    Object.keys(fields).forEach((key) => {
      const rules = fields[key].rules?.filter(isValidationRule) ?? [];
      const fieldContext = formContext.value.fields[key];

      formContext.value.fields[key].value.isValidSignal =
        rules.length > 0
          ? computed(() => {
              const result = rules.every((r) =>
                r.execute(fieldContext.value.value, formContext.value)
              );

              console.log(
                `(${key}) Checked validation rule`,
                fieldContext.value,
                result
              );

              return result;
            })
          : alwaysTrueSignal;
    });
  }, [fields, formContext]);
}

export function useFieldValidation(
  _field: Field,
  fieldContext: Signal<FieldContext>
) {
  return fieldContext.value.isValidSignal!.value;
}

export function isValid<TForm, TKey extends KeyOf<TForm>>(
  test: (args: { value: TForm[TKey]; context: FormContext<TForm> }) => boolean
): FieldRule<TForm, TKey> {
  return {
    execute: (value: TForm[TKey], context: FormContext<TForm>) =>
      test({ value, context }),
    ruleType: "validation",
  } as ValidationFieldRule<TForm, TKey>;
}

function isValidationRule<TForm, TKey extends KeyOf<TForm>>(
  rule: FieldRule<TForm, TKey>
): rule is ValidationFieldRule<TForm, TKey> {
  return rule.ruleType === "validation";
}
