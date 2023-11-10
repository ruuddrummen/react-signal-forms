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

function createExtension(
  field: Field,
  formContext: IFormContext
): ValidationFieldContextExtension {
  const fieldContext = formContext.fields[field.name];
  const rules = (field.rules?.filter(isValidationRule) ??
    []) as ValidationFieldRule[];

  if (rules.length > 0) {
    return {
      signal: computed(() => {
        console.log(`(${field.name}) Checking validation rules`);

        const results = rules.map((r) =>
          r.execute({ value: fieldContext.value, form: formContext })
        );

        const errors = results
          .map((r) => r?.error)
          .filter((e) => e != null) as string[];

        return {
          isValid: errors.length === 0,
          errors: errors,
        };
      }),
    };
  } else {
    return {
      signal: signal({
        isValid: true,
        errors: [],
      }),
    };
  }
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

type ValidationTestResult = null | {
  error: string | null;
};

export const validIf = createValidationRule<() => boolean>((context, test) =>
  test(context) ? null : { error: null }
);

export const isRequired = createValidationRule((context) =>
  context.value != null && context.value !== ""
    ? null
    : { error: "This field is required" }
);

export const requiredIf = createValidationRule<() => boolean>((context, test) =>
  !test(context) || (context.value != null && context.value !== "")
    ? null
    : { error: "This field is required" }
);
