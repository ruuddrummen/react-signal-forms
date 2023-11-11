import {
  FieldContextExtension,
  FieldContextProperties,
  SignalFormExtension,
} from "../types"

const EXTENSION_NAME = "diffChanges"

/**
 * Enables presentation of differences compared to previous values, and
 * reverting changes made since the last commit.
 */
export const diffChanges: SignalFormExtension<
  FieldContextExtension,
  FieldContextProperties
> = {
  name: EXTENSION_NAME,
  createFieldExtension(_field, _formContext) {
    return {}
  },
  createFieldProperties(_extension) {
    return {}
  },
}
