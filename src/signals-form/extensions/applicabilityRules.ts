import { KeyOf } from "@/utils";
import { Signal, computed } from "@preact/signals-react";
import { IFieldContext, FieldContextExtension } from "../fieldContext";
import { IFormContext } from "../formContext";
import { alwaysTrueSignal } from "@/signals";
import { FieldRule, FieldCollection } from "../fields";
import { SignalFormExtension } from "./types";

const EXTENSION_NAME = "applicability";

interface ApplicabilityFieldContextExtension extends FieldContextExtension {
  isApplicableSignal: Signal<boolean>;
}

interface ApplicabilityFieldContext {
  isApplicable: () => boolean;
}

export const applicabilityExtension: SignalFormExtension<ApplicabilityFieldContext> =
  {
    extendFieldContext: (fieldContext) => {
      const extension = fieldContext._extensions[
        EXTENSION_NAME
      ] as ApplicabilityFieldContextExtension;

      (fieldContext as IFieldContext & ApplicabilityFieldContext).isApplicable =
        () => extension.isApplicableSignal.value;
    },
  };

interface ApplicabilityFieldRule<TForm, TKey extends KeyOf<TForm>>
  extends FieldRule<TForm, TKey> {
  execute: (context: IFormContext<TForm>) => boolean;
}

export function useApplicabilityRules(
  fields: FieldCollection,
  formContext: IFormContext
) {
  console.log("(Form) Initializing applicability rules");

  Object.keys(fields).forEach((key) => {
    const fieldContext = formContext.fields[key];

    const contextExtension: ApplicabilityFieldContextExtension = {
      isApplicableSignal: createApplicabilitySignal(fields, key, formContext),
    };

    fieldContext._extensions[EXTENSION_NAME] = contextExtension;
  });
}

export function applicableIf<TForm, TKey extends KeyOf<TForm>>(
  test: (context: IFormContext<TForm>) => boolean
): FieldRule<TForm, TKey> {
  return {
    execute: (context: IFormContext<TForm>) => test(context),
    extension: "applicability",
  } as ApplicabilityFieldRule<TForm, TKey>;
}

// export function isApplicable(fieldContext: IFieldContext) {
//   const extension = fieldContext._extensions[
//     EXTENSION_NAME
//   ] as ApplicabilityFieldContextExtension;

//   return extension.isApplicableSignal.value;
// }

function isApplicabilityRule<TForm, TKey extends KeyOf<TForm>>(
  rule: FieldRule<TForm, TKey>
): rule is ApplicabilityFieldRule<TForm, TKey> {
  return rule.extension === "applicability";
}

function createApplicabilitySignal(
  fields: FieldCollection,
  fieldName: string,
  formContext: IFormContext<any>
): Signal<boolean> {
  const rules = fields[fieldName].rules?.filter(isApplicabilityRule) ?? [];
  const fieldContext = formContext.fields[fieldName];

  if (rules.length > 0) {
    const signal = computed(() => {
      console.log(`(${fieldName}) Checking applicability rule`);
      return rules.every((r) => r.execute(formContext));
    });

    signal.subscribe((value) => {
      if (!value) {
        console.log(`(${fieldName}) Clearing field value`);
        fieldContext.setValue(null);
      }
    });

    return signal;
  } else {
    return alwaysTrueSignal;
  }
}
