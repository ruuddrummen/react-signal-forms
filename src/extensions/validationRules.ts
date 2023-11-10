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
        r.execute({ value: fieldContext.value, form: formContext })
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

type RuleContext<
  TForm extends FormValues = FormValues,
  TKey extends KeyOf<TForm> = KeyOf<TForm>
> = {
  value: TForm[TKey];
  form: IFormContext<TForm>;
};

type ValidationTest<
  TForm extends FormValues = FormValues,
  TKey extends KeyOf<TForm> = KeyOf<TForm>
> = (context: RuleContext<TForm, TKey>) => boolean;

export function createValidationRule<TArgs = void>(
  execute: (context: RuleContext, args: TArgs) => boolean
): FieldRuleFunction<TArgs> {
  const result = (args: TArgs) =>
    ({
      extension: EXTENSION_NAME,
      execute: (context) => execute(context, args),
    } as ValidationFieldRule);

  return result as FieldRuleFunction<TArgs>;
}

type FieldRuleFunction<TArgs> = <
  TForm extends FormValues,
  TKey extends KeyOf<TForm>
>(
  args: TArgs
) => FieldRule<TForm, TKey>;

type FormValues = Record<string, unknown>;

export const isRequired = createValidationRule(
  ({ value }) => value != null && value !== ""
);

export const requiredIf = createValidationRule(
  (context, test: (context: RuleContext) => boolean) => {
    return !test(context) || (context.value != null && context.value !== "");
  }
);

export const validIf = createValidationRule(
  (context, test: (context: RuleContext) => boolean) => test(context)
);
