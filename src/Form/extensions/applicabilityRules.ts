import { Signal, computed, signal } from "@preact/signals-react";
import {
  FieldCollection,
  FieldContext,
  FieldRule,
  FormContext,
} from "../types";
import { patch } from "@/signals";
import { KeyOf } from "@/utils";

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
          patch(fieldContext, { value: null });
        }
      });

      fieldContext.value.isApplicableSignal = signal;
    } else {
      fieldContext.value.isApplicableSignal = alwaysTrueSignal;
    }
  });
}

export function applicableIf<TForm, TKey extends KeyOf<TForm>>(
  test: (context: FormContext<TForm>) => boolean
): FieldRule<TForm, TKey> {
  return {
    execute: (context: FormContext<TForm>) => test(context),
    ruleType: "applicability",
  } as ApplicabilityFieldRule<TForm, TKey>;
}

export function isApplicable(fieldContext: Signal<FieldContext>) {
  return fieldContext.value.isApplicableSignal!.value;
}

function isApplicabilityRule<TForm, TKey extends KeyOf<TForm>>(
  rule: FieldRule<TForm, TKey>
): rule is ApplicabilityFieldRule<TForm, TKey> {
  return rule.ruleType === "applicability";
}
