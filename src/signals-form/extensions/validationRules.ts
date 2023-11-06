import { KeyOf } from "@/utils";
import { Signal, computed } from "@preact/signals-react";
import { IFieldContext, FieldContextExtension } from "../fieldContext";
import { IFormContext } from "../formContext";
import { alwaysTrueSignal } from "@/signals";
import { FieldRule, FieldCollection } from "../fields";

const EXTENSION_NAME = "validation";

interface ValidationFieldRule<TForm, TKey extends KeyOf<TForm>>
  extends FieldRule<TForm, TKey> {
  execute: (value: TForm[TKey], context: IFormContext<TForm>) => boolean;
}

interface ValidationFieldContextExtension extends FieldContextExtension {
  isValidSignal: Signal<boolean>;
}

export function useValidationRules(
  fields: FieldCollection,
  formContext: IFormContext
) {
  console.log("(Form) Initializing validation rules");

  Object.keys(fields).forEach((key) => {
    const fieldContext = formContext.fields[key];

    const contextExtension: ValidationFieldContextExtension = {
      isValidSignal: createValidationSignal(fields, key, formContext),
    };

    fieldContext.extensions[EXTENSION_NAME] = contextExtension;
  });
}

function createValidationSignal(
  fields: FieldCollection,
  fieldName: string,
  formContext: IFormContext<any>
): Signal<boolean> {
  const fieldContext = formContext.fields[fieldName];
  const rules = fields[fieldName].rules?.filter(isValidationRule) ?? [];

  if (rules.length > 0) {
    return computed(() => {
      console.log(`(${fieldName}) Checking validation rule`);

      return rules.every((r) => r.execute(fieldContext.value(), formContext));
    });
  } else {
    return alwaysTrueSignal;
  }
}

export function validIf<TForm, TKey extends KeyOf<TForm>>(
  test: (args: { value: TForm[TKey]; context: IFormContext<TForm> }) => boolean
): FieldRule<TForm, TKey> {
  return {
    execute: (value: TForm[TKey], context: IFormContext<TForm>) =>
      test({ value, context }),
    extension: EXTENSION_NAME,
  } as ValidationFieldRule<TForm, TKey>;
}

export function isValid(fieldContext: IFieldContext) {
  const contextExtension = fieldContext.extensions[
    EXTENSION_NAME
  ] as ValidationFieldContextExtension;

  return contextExtension.isValidSignal.value;
}

function isValidationRule<TForm, TKey extends KeyOf<TForm>>(
  rule: FieldRule<TForm, TKey>
): rule is ValidationFieldRule<TForm, TKey> {
  return rule.extension === EXTENSION_NAME;
}
