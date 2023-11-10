import { Signal, computed } from "@preact/signals-react";
import { Field, FieldRule } from "../fields";
import { IFormContext } from "../formContext";
import { alwaysTrueSignal } from "../signals";
import { KeyOf } from "../utils";
import {
  FieldContextExtension,
  FieldContextProperties,
  SignalFormExtension,
} from "./types";

const EXTENSION_NAME = "applicability";

interface ApplicabilityFieldContextExtension extends FieldContextExtension {
  isApplicableSignal: Signal<boolean>;
}

interface ApplicabilityFieldProperties extends FieldContextProperties {
  isApplicable: boolean;
}

export const applicabilityRules: SignalFormExtension<
  ApplicabilityFieldContextExtension,
  ApplicabilityFieldProperties
> = {
  name: EXTENSION_NAME,
  createFieldExtension(field, formContext) {
    return {
      isApplicableSignal: createApplicabilitySignal(field, formContext),
    };
  },
  createFieldProperties(extension) {
    return {
      isApplicable: {
        get: () => extension.isApplicableSignal.value,
      },
    };
  },
};

function createApplicabilitySignal(
  field: Field,
  formContext: IFormContext<any>
): Signal<boolean> {
  const rules = field.rules?.filter(isApplicabilityRule) ?? [];
  const fieldContext = formContext.fields[field.name];

  if (rules.length > 0) {
    const signal = computed(() => {
      console.log(`(${field.name}) Checking applicability rule`);
      return rules.every((r) => r.execute(formContext));
    });

    signal.subscribe((value) => {
      if (!value) {
        console.log(`(${field.name}) Clearing field value`);
        fieldContext.setValue(null);
      }
    });

    return signal;
  } else {
    return alwaysTrueSignal;
  }
}

interface ApplicabilityFieldRule<TForm, TKey extends KeyOf<TForm>>
  extends FieldRule<TForm, TKey> {
  execute: (context: IFormContext<TForm>) => boolean;
}

export function applicableIf<TForm, TKey extends KeyOf<TForm>>(
  test: (context: IFormContext<TForm>) => boolean
): FieldRule<TForm, TKey> {
  return {
    execute: (context: IFormContext<TForm>) => test(context),
    extension: EXTENSION_NAME,
  } as ApplicabilityFieldRule<TForm, TKey>;
}

function isApplicabilityRule<TForm, TKey extends KeyOf<TForm>>(
  rule: FieldRule<TForm, TKey>
): rule is ApplicabilityFieldRule<TForm, TKey> {
  return rule.extension === EXTENSION_NAME;
}
