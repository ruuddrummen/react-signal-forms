import { Signal, computed } from "@preact/signals-react";
import { Field, FieldRule } from "../fields";
import { IFormContext } from "../formContext";
import { alwaysTrueSignal } from "../signals";
import { KeyOf } from "../utils";
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
  const rules = (field.rules?.filter(isValidationRule) ??
    []) as Array<ValidationFieldRule>;

  if (rules.length > 0) {
    return computed(() => {
      console.log(`(${field.name}) Checking validation rule`);

      return rules.every((r) =>
        r.execute({ value: fieldContext.value, context: formContext })
      );
    });
  } else {
    return alwaysTrueSignal;
  }
}

interface ValidationFieldRule<
  TForm extends FormValues = FormValues,
  TKey extends KeyOf<TForm> = KeyOf<TForm>
> extends FieldRule<TForm, TKey> {
  execute: ValidationTest<TForm, TKey>;
}

function isValidationRule<TForm extends FormValues, TKey extends KeyOf<TForm>>(
  rule: FieldRule<TForm, TKey>
): rule is ValidationFieldRule<TForm, TKey> {
  return rule.extension === EXTENSION_NAME;
}

type TestContext<
  TForm extends FormValues = FormValues,
  TKey extends KeyOf<TForm> = KeyOf<TForm>
> = {
  value: TForm[TKey];
  context: IFormContext<TForm>;
};

type ValidationTest<
  TForm extends FormValues = FormValues,
  TKey extends KeyOf<TForm> = KeyOf<TForm>
> = (args: TestContext<TForm, TKey>) => boolean;

export function isRequired<
  TForm extends FormValues,
  TKey extends KeyOf<TForm>
>(): FieldRule<TForm, TKey> {
  return {
    extension: EXTENSION_NAME,
    execute({ value }) {
      if (typeof value === "string" && value === "") {
        return false;
      }

      return value != null;
    },
  } as ValidationFieldRule<TForm, TKey>;
}

export function validIf<TForm extends FormValues, TKey extends KeyOf<TForm>>(
  test: ValidationTest<TForm, TKey>
): FieldRule<TForm, TKey> {
  return {
    extension: EXTENSION_NAME,
    execute: test,
  } as ValidationFieldRule<TForm, TKey>;
}

export function requiredIf<TForm extends FormValues, TKey extends KeyOf<TForm>>(
  test: ValidationTest<TForm, TKey>
): FieldRule<TForm, TKey> {
  return {
    extension: EXTENSION_NAME,
    execute: (context) =>
      !test(context) || (context.value != null && context.value !== ""),
  } as ValidationFieldRule<TForm, TKey>;
}

export const requiredIf2 = createValidationRule((context, test) => {
  return test(context) && context.value != null && context.value !== "";
});

export function createValidationRule(
  execute: (context: TestContext, test: ValidationTest) => boolean
): FieldRuleFunction {
  const result = (test: ValidationTest) =>
    ({
      extension: EXTENSION_NAME,
      execute: (context) => execute(context, test),
    } as ValidationFieldRule);

  return result as FieldRuleFunction;
}

type FieldRuleFunction = <TForm extends FormValues, TKey extends KeyOf<TForm>>(
  test: ValidationTest<TForm, TKey>
) => FieldRule<TForm, TKey>;

type FormValues = Record<string, unknown>;
