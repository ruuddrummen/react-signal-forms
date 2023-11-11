import {
  FieldContextExtension,
  FieldContextProperties,
  SignalFormExtension,
} from "../types"

const EXTENSION_NAME = "touched"

/**
 * Enables keeping track of fields being touched or not.
 */
export const touchedExtension: SignalFormExtension<
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
