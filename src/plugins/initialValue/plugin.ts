import { createPlugin } from "../createPlugin"
import { FieldValueType } from "../types"

const PLUGIN_NAME = "initialValue"

/**
 * Adds the default or initial field value to its context.
 */
export const initialValuePlugin = createPlugin(PLUGIN_NAME, {
  createFieldExtension(field, formContext) {
    const initialValue = formContext.fields[field.name].peekValue()

    return {
      initialValue,
    }
  },

  createFieldProperties(extension) {
    return {
      initialValue: {
        get: () => extension.initialValue as FieldValueType,
      },
    }
  },
})
