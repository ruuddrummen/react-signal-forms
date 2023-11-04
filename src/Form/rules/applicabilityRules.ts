import {
  Signal,
  computed,
  signal,
  useSignalEffect,
} from "@preact/signals-react";
import {
  Field,
  FieldCollection,
  FieldContext,
  FieldRule,
  FormContext,
} from "../types";
import { useEffect } from "react";
import { patch } from "../../signals";
import { KeyOf } from "../../utils";

interface ApplicabilityFieldRule<TForm, TKey extends KeyOf<TForm>>
  extends FieldRule<TForm, TKey> {
  execute: (context: FormContext<TForm>) => boolean;
}

const alwaysTrueSignal = signal(true);

export function useApplicabilityRules(
  fields: FieldCollection,
  formContext: Signal<FormContext>
) {
  useEffect(() => {
    console.log("(Form) Initializing new applicability rules");

    Object.keys(fields).forEach(
      (key) => {
        const rules = fields[key].rules?.filter(isApplicabilityRule) ?? [];

        formContext.value.fields[key].value.isApplicableSignal =
          rules.length > 0
            ? computed(() => {
                console.log(`(${key}) Checking applicability rule`);
                return rules.every((r) => r.execute(formContext.value));
              })
            : alwaysTrueSignal;
      },
      [fields, formContext]
    );
  });
}

export function useFieldApplicability(
  field: Field,
  fieldContext: Signal<FieldContext>
) {
  useSignalEffect(() => {
    if (!fieldContext.value.isApplicableSignal!.value) {
      console.log(`(${field.name}) Clearing field value`);

      patch(fieldContext, { value: null });
    }
  });

  return fieldContext.value.isApplicableSignal!.value;
}

export function applicableIf<TForm, TKey extends KeyOf<TForm>>(
  test: (context: FormContext<TForm>) => boolean
): FieldRule<TForm, TKey> {
  return {
    execute: (context: FormContext<TForm>) => test(context),
    ruleType: "applicability",
  } as ApplicabilityFieldRule<TForm, TKey>;
}

function isApplicabilityRule<TForm, TKey extends KeyOf<TForm>>(
  rule: FieldRule<TForm, TKey>
): rule is ApplicabilityFieldRule<TForm, TKey> {
  return rule.ruleType === "applicability";
}
