import { Signal, computed } from "@preact/signals-react";
import { Field, FieldRule } from "../fields";
import { IFormContext } from "../formContext";
import { alwaysTrueSignal } from "../signals";
import { FormValues } from "../types";
import { KeyOf } from "../utils";
import {
  FieldRuleFunction,
  RuleArguments,
  RuleContext,
  SignalFormExtension,
} from "./types";

const EXTENSION_NAME = "validation";

export const validationRules: SignalFormExtension<
  { isValidSignal: Signal<boolean> },
  { isValid: boolean }
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
        r.execute({ value: fieldContext.value, form: formContext })
      );
    });
  } else {
    return alwaysTrueSignal;
  }
}

export function createValidationRule<TArgs = void>(
  execute: (context: RuleContext, args: RuleArguments<TArgs>) => boolean
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
) => boolean;

export const validIf = createValidationRule<() => boolean>((context, test) =>
  test(context)
);

export const isRequired = createValidationRule(
  (context) => context.value != null && context.value !== ""
);

export const requiredIf = createValidationRule<() => boolean>(
  (context, test) =>
    !test(context) || (context.value != null && context.value !== "")
);
