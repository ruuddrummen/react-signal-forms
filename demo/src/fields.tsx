import { SelectField, signalForm } from "react-signal-forms"
import {
  applicableIf,
  minLength,
  mustBeEqualToField,
  readonly,
  readonlyIf,
  required,
  requiredIf,
  validIf,
} from "react-signal-forms/rules"
import { FormData } from "./FormData"

/**
 * Specifications for your fields.
 */
export const fields = signalForm<FormData>().withFields((field) => ({
  // Just fields.
  ...field("text", "A text field", {
    defaultValue: "Welcome to the demo",
  }),
  ...field("number", "A number field"),
  ...field("boolean", "A boolean field"),
  ...field("select", "A select field").as<SelectField>({
    options: [
      {
        label: "Option 1",
        value: "Value 1",
      },
      {
        label: "Option 2",
        value: "Value 2",
      },
      {
        label: "Option 3",
        value: "Value 3",
      },
    ],
  }),

  // Required rules.
  ...field("alwaysRequired", "Required field", {
    rules: [required()],
  }),
  ...field("mustBeEqualToOtherField", "Must be equal to required field", {
    rules: [mustBeEqualToField("alwaysRequired")],
  }),
  ...field("hasMinimumLength", "At least 6 characters long", {
    rules: [required(), minLength(6)],
  }),
  ...field("makeFieldRequired", "Make next field required"),
  ...field("canBeRequired", "Required depending on other values", {
    rules: [
      requiredIf(({ form }) => form.fields.makeFieldRequired.value === true),
    ],
  }),

  // Applicability rules.
  ...field("showSecretField", "Show secret field"),
  ...field("secret", "Value is cleared when not applicable", {
    defaultValue: "Default value",
    rules: [
      applicableIf(({ fields }) => fields.showSecretField.value === true),
    ],
  }),

  // Readonly rules.
  ...field("alwaysReadonly", "Readonly field", {
    defaultValue: "Always readonly",
    rules: [readonly()],
  }),
  ...field("makeFieldReadonly", "Make the next field readonly"),
  ...field("canBeReadOnly", "Can be readonly", {
    rules: [readonlyIf((form) => form.fields.makeFieldReadonly.value === true)],
  }),

  // Combining rules.
  ...field("makeComplicatedFieldApplicable", "Make the field applicable"),
  ...field("complicatedField", "Only validated if applicable", {
    rules: [
      applicableIf(
        ({ fields }) => fields.makeComplicatedFieldApplicable.value === true
      ),
      required(),
      minLength(5),
      validIf(({ value }) => ({
        validIf: value?.endsWith("signals") ?? false,
        errorMessage: "Value must end with 'signals'",
      })),
    ],
  }),
}))
