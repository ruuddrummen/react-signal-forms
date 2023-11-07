import { KeyOf } from "@/utils";
import { Signal, computed } from "@preact/signals-react";
import { FieldContextExtension, FieldContext } from "../fieldContext";
import { IFormContext } from "../formContext";
import { alwaysTrueSignal } from "@/signals";
import { FieldRule, FieldCollection } from "../fields";
import { SignalFormExtension } from "./types";

const EXTENSION_NAME = "validation";

interface ValidationFieldRule<TForm, TKey extends KeyOf<TForm>>
  extends FieldRule<TForm, TKey> {
  execute: (value: TForm[TKey], context: IFormContext<TForm>) => boolean;
}

interface ValidationFieldContextExtension extends FieldContextExtension {
  isValidSignal: Signal<boolean>;
}

interface ValidationFieldContext {
  isValid: boolean;
}

export const validationExtension: SignalFormExtension<ValidationFieldContext> =
  {
    extendFormContext: (fields, formContext) => {
      Object.keys(formContext.fields).forEach((key) => {
        const fieldContext = formContext.fields[key] as FieldContext;

        fieldContext.addExtension<ValidationFieldContextExtension>(
          EXTENSION_NAME,
          {
            isValidSignal: createValidationSignal(fields, key, formContext),
          }
        );

        Object.defineProperty(fieldContext, "isValid", {
          get: function () {
            const extension = fieldContext.__extensions[
              EXTENSION_NAME
            ] as ValidationFieldContextExtension;

            return extension.isValidSignal.value;
          },
        });
      });
    },
  };

function createValidationSignal(
  fields: FieldCollection,
  fieldName: string,
  formContext: IFormContext
): Signal<boolean> {
  const fieldContext = formContext.fields[fieldName];
  const rules = fields[fieldName].rules?.filter(isValidationRule) ?? [];

  if (rules.length > 0) {
    return computed(() => {
      console.log(`(${fieldName}) Checking validation rule`);

      return rules.every((r) => r.execute(fieldContext.value, formContext));
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

function isValidationRule<TForm, TKey extends KeyOf<TForm>>(
  rule: FieldRule<TForm, TKey>
): rule is ValidationFieldRule<TForm, TKey> {
  return rule.extension === EXTENSION_NAME;
}
