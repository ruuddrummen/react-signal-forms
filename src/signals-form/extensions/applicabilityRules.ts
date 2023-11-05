import { KeyOf } from "@/utils";
import { computed, signal } from "@preact/signals-react";
import {
  FieldCollection,
  FieldContext,
  FieldRule,
  FormContext,
} from "../types";

interface ApplicabilityFieldRule<TForm, TKey extends KeyOf<TForm>>
  extends FieldRule<TForm, TKey> {
  execute: (context: FormContext<TForm>) => boolean;
}

const alwaysTrueSignal = signal(true);

export function useApplicabilityRules(
  fields: FieldCollection,
  formContext: FormContext
) {
  console.log("(Form) Initializing applicability rules");

  Object.keys(fields).forEach((key) => {
    const rules = fields[key].rules?.filter(isApplicabilityRule) ?? [];
    const fieldContext = formContext.fields[key];

    if (rules.length > 0) {
      const signal = computed(() => {
        console.log(`(${key}) Checking applicability rule`);
        return rules.every((r) => r.execute(formContext));
      });

      signal.subscribe((value) => {
        if (!value) {
          console.log(`(${key}) Clearing field value`);
          fieldContext.valueSignal.value = null;
        }
      });

      fieldContext.isApplicableSignal = signal;
    } else {
      fieldContext.isApplicableSignal = alwaysTrueSignal;
    }
  });
}

export function applicableIf<TForm, TKey extends KeyOf<TForm>>(
  test: (context: FormContext<TForm>) => boolean
): FieldRule<TForm, TKey> {
  return {
    execute: (context: FormContext<TForm>) => test(context),
    extension: "applicability",
  } as ApplicabilityFieldRule<TForm, TKey>;
}

export function isApplicable(fieldContext: FieldContext) {
  return fieldContext.isApplicableSignal!.value;
}

function isApplicabilityRule<TForm, TKey extends KeyOf<TForm>>(
  rule: FieldRule<TForm, TKey>
): rule is ApplicabilityFieldRule<TForm, TKey> {
  return rule.extension === "applicability";
}
