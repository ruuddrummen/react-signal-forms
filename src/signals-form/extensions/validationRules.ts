import { KeyOf } from "@/utils";
import { computed, signal } from "@preact/signals-react";
import {
  FieldCollection,
  FieldContext,
  FieldRule,
  FormContext,
} from "../types";

interface ValidationFieldRule<TForm, TKey extends KeyOf<TForm>>
  extends FieldRule<TForm, TKey> {
  execute: (value: TForm[TKey], context: FormContext<TForm>) => boolean;
}

const alwaysTrueSignal = signal(true);

export function useValidationRules(
  fields: FieldCollection,
  formContext: FormContext
) {
  console.log("(Form) Initializing validation rules");

  Object.keys(fields).forEach((key) => {
    const rules = fields[key].rules?.filter(isValidationRule) ?? [];
    const fieldContext = formContext.fields[key];

    if (rules.length > 0) {
      fieldContext.isValidSignal = computed(() => {
        const result = rules.every((r) =>
          r.execute(fieldContext.valueSignal.value, formContext)
        );

        console.log(
          `(${key}) Checked validation rule`,
          fieldContext.valueSignal,
          result
        );

        return result;
      });
    } else {
      fieldContext.isValidSignal = alwaysTrueSignal;
    }
  });
}

export function validIf<TForm, TKey extends KeyOf<TForm>>(
  test: (args: { value: TForm[TKey]; context: FormContext<TForm> }) => boolean
): FieldRule<TForm, TKey> {
  return {
    execute: (value: TForm[TKey], context: FormContext<TForm>) =>
      test({ value, context }),
    ruleType: "validation",
  } as ValidationFieldRule<TForm, TKey>;
}

export function isValid(fieldContext: FieldContext) {
  return fieldContext.isValidSignal!.value;
}

function isValidationRule<TForm, TKey extends KeyOf<TForm>>(
  rule: FieldRule<TForm, TKey>
): rule is ValidationFieldRule<TForm, TKey> {
  return rule.ruleType === "validation";
}
