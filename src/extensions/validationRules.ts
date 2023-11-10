import { Signal, computed, signal } from "@preact/signals-react";
import { Field, FieldRule } from "../fields";
import { IFormContext } from "../formContext";
import { FormValues } from "../types";
import { KeyOf } from "../utils";
import {
  FieldContextExtension,
  FieldContextProperties,
  FieldRuleFunction,
  RuleArguments,
  RuleContext,
  SignalFormExtension,
} from "./types";

const EXTENSION_NAME = "validation";

interface ValidationFieldContextExtension extends FieldContextExtension {
  signal: Signal<{
    isValid: boolean;
    errors: string[];
  }>;
}

interface ValidationFieldContextProperties extends FieldContextProperties {
  isValid: boolean;
  errors: string[];
}

export const validationRules: SignalFormExtension<
  ValidationFieldContextExtension,
  ValidationFieldContextProperties
> = {
  name: EXTENSION_NAME,
  createFieldExtension(field, formContext) {
    return createExtension(field, formContext);
  },
  createFieldProperties(extension) {
    return {
      isValid: {
        get: () => extension.signal.value.isValid,
      },
      errors: {
        get: () => extension.signal.value.errors,
      },
    };
  },
};

const defaultContextExtension: ValidationFieldContextExtension = {
  signal: signal({
    isValid: true,
    errors: [],
  }),
};

function createExtension(
  field: Field,
  formContext: IFormContext
): ValidationFieldContextExtension {
  const fieldContext = formContext.fields[field.name];
  const rules = (field.rules?.filter(isValidationRule) ??
    []) as ValidationFieldRule[];

  if (rules.length === 0) {
    return defaultContextExtension;
  }

  return {
    signal: computed(() => {
      console.log(`(${field.name}) Checking validation rules`);

      const results = rules.map((r) =>
        r.execute({ value: fieldContext.value, form: formContext })
      );

      const errors = results.filter((e) => typeof e === "string") as string[];

      return {
        isValid: errors.length === 0,
        errors: errors,
      };
    }),
  };
}

export function createValidationRule<TArgs = void>(
  execute: (
    context: RuleContext,
    args: RuleArguments<TArgs>
  ) => ValidationTestResult
): FieldRuleFunction<TArgs> {
  const result = (args: RuleArguments<TArgs>) =>
    ({
      extension: EXTENSION_NAME,
      execute: (context) => execute(context as any, args as any),
    } as ValidationFieldRule);

  return result as FieldRuleFunction<TArgs>;
}

function isValidationRule(rule: FieldRule): rule is ValidationFieldRule {
  return rule.extension === EXTENSION_NAME;
}

interface ValidationFieldRule<
  TForm = FormValues,
  TKey extends KeyOf<TForm> = KeyOf<TForm>
> extends FieldRule<TForm, TKey> {
  execute: ValidationTest<TForm, TKey>;
}

type ValidationTest<TForm, TKey extends KeyOf<TForm>> = (
  context: RuleContext<TForm, TKey>
) => ValidationTestResult;

type ValidationTestResult = null | string;

export const validIf = createValidationRule<() => boolean>((context, test) =>
  test(context) ? null : "This value is not valid"
);

export const isRequired = createValidationRule((context) =>
  context.value != null && context.value !== ""
    ? null
    : "This field is required"
);

export const requiredIf = createValidationRule<() => boolean>((context, test) =>
  !test(context) || (context.value != null && context.value !== "")
    ? null
    : "This field is required"
);
