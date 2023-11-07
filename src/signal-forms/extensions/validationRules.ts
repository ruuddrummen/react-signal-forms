import { alwaysTrueSignal } from "@/signals";
import { KeyOf } from "@/utils";
import { Signal, computed } from "@preact/signals-react";
import { Field, FieldRule } from "../fields";
import { IFormContext } from "../formContext";
import { FieldContextExtension, SignalFormExtension } from "./types";

const EXTENSION_NAME = "validation";

interface ValidationFieldContextExtension extends FieldContextExtension {
  isValidSignal: Signal<boolean>;
}

interface ValidationFieldProperties {
  isValid: boolean;
}

export const validationRules: SignalFormExtension<
  ValidationFieldContextExtension,
  ValidationFieldProperties
> = {
  name: EXTENSION_NAME,
  createFieldExtension(field, formContext) {
    return {
      isValidSignal: createValidationSignal(field, formContext),
    };
  },
  createFieldProperties(extension) {
    return {
      isValid: {
        get: () => extension.isValidSignal.value,
      },
    };
  },
};

function createValidationSignal(
  field: Field,
  formContext: IFormContext
): Signal<boolean> {
  const fieldContext = formContext.fields[field.name];
  const rules = field.rules?.filter(isValidationRule) ?? [];

  if (rules.length > 0) {
    return computed(() => {
      console.log(`(${field.name}) Checking validation rule`);

      return rules.every((r) => r.execute(fieldContext.value, formContext));
    });
  } else {
    return alwaysTrueSignal;
  }
}

interface ValidationFieldRule<TForm, TKey extends KeyOf<TForm>>
  extends FieldRule<TForm, TKey> {
  execute: (value: TForm[TKey], context: IFormContext<TForm>) => boolean;
}

function isValidationRule<TForm, TKey extends KeyOf<TForm>>(
  rule: FieldRule<TForm, TKey>
): rule is ValidationFieldRule<TForm, TKey> {
  return rule.extension === EXTENSION_NAME;
}

export function validIf<TForm, TKey extends KeyOf<TForm>>(
  test: (args: { value: TForm[TKey]; context: IFormContext<TForm> }) => boolean
): FieldRule<TForm, TKey> {
  return {
    extension: EXTENSION_NAME,
    execute: (value: TForm[TKey], context: IFormContext<TForm>) =>
      test({ value, context }),
  } as ValidationFieldRule<TForm, TKey>;
}

export function isRequired<TForm, TKey extends KeyOf<TForm>>(): FieldRule<
  TForm,
  TKey
> {
  return {
    extension: EXTENSION_NAME,
    execute(value, _context) {
      if (typeof value === "string" && value === "") {
        return false;
      }

      return value != null;
    },
  } as ValidationFieldRule<TForm, TKey>;
}
