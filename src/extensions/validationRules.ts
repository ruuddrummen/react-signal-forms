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
  TForm = FormValues,
  TKey extends KeyOf<TForm> = KeyOf<TForm>
> extends FieldRule<TForm, TKey> {
  execute: ValidationTest<TForm, TKey>;
}

function isValidationRule<TForm, TKey extends KeyOf<TForm>>(
  rule: FieldRule<TForm, TKey>
): rule is ValidationFieldRule<TForm, TKey> {
  return rule.extension === EXTENSION_NAME;
}

type RuleContext<
  TForm = FormValues,
  TKey extends KeyOf<TForm> = KeyOf<TForm>
> = {
  value: TForm[TKey];
  form: IFormContext<TForm>;
};

type ValidationTest<TForm, TKey extends KeyOf<TForm>> = (
  context: RuleContext<TForm, TKey>
) => boolean;

/**
 * If TArgs == void - i.e. the rule has no arguments - return void;
 * if TArgs is a function, return a function with rule context parameter;
 * else return TArgs.
 */
type RuleArguments<
  TArgs,
  TForm = FormValues,
  TKey extends KeyOf<TForm> = KeyOf<TForm>
> = void extends TArgs
  ? void
  : TArgs extends () => infer ReturnType
  ? (context: RuleContext<TForm, TKey>) => ReturnType
  : TArgs;

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

type FieldRuleFunction<TArgs> = <TForm, TKey extends KeyOf<TForm>>(
  args: RuleArguments<TArgs, TForm, TKey>
) => FieldRule<TForm, TKey>;

type FormValues = Record<string, unknown>;
