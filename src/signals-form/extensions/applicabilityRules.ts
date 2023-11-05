import { KeyOf } from "@/utils";
import { Signal, computed, signal } from "@preact/signals-react";
import {
  FieldCollection,
  FieldContext,
  FieldContextExtension,
  FieldRule,
  FormContext,
} from "../types";

const EXTENSION_NAME = "applicability";

interface ApplicabilityFieldRule<TForm, TKey extends KeyOf<TForm>>
  extends FieldRule<TForm, TKey> {
  execute: (context: FormContext<TForm>) => boolean;
}

interface ApplicabilityFieldContextExtension extends FieldContextExtension {
  isApplicableSignal: Signal<boolean>;
}

const alwaysTrueSignal = signal(true);

export function useApplicabilityRules(
  fields: FieldCollection,
  formContext: FormContext
) {
  console.log("(Form) Initializing applicability rules");

  Object.keys(fields).forEach((key) => {
    const fieldContext = formContext.fields[key];

    const contextExtension: ApplicabilityFieldContextExtension = {
      isApplicableSignal: createApplicabilitySignal(fields, key, formContext),
    };

    fieldContext.extensions[EXTENSION_NAME] = contextExtension;
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
  const extension = fieldContext.extensions[
    EXTENSION_NAME
  ] as ApplicabilityFieldContextExtension;

  return extension.isApplicableSignal.value;
}

function isApplicabilityRule<TForm, TKey extends KeyOf<TForm>>(
  rule: FieldRule<TForm, TKey>
): rule is ApplicabilityFieldRule<TForm, TKey> {
  return rule.extension === "applicability";
}

function createApplicabilitySignal(
  fields: FieldCollection,
  fieldName: string,
  formContext: FormContext<any>
): Signal<boolean> {
  const rules = fields[fieldName].rules?.filter(isApplicabilityRule) ?? [];
  const fieldContext = formContext.fields[fieldName];

  if (rules.length > 0) {
    const signal = computed(() => {
      console.log(`(${fieldName}) Checking applicability rule`);
      return rules.every((r) => r.execute(formContext));
    });

    signal.subscribe((value) => {
      if (!value) {
        console.log(`(${fieldName}) Clearing field value`);
        fieldContext.valueSignal.value = null;
      }
    });

    return signal;
  } else {
    return alwaysTrueSignal;
  }
}
