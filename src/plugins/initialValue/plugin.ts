import { createPlugin } from "../createPlugin"

const PLUGIN_NAME = "initialValue"

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
        get: () => extension.initialValue,
      },
    }
  },
})
