import { Field, FieldContext, IFormContext } from "@/index"
import { createPlugin } from "@/plugins/create"
import { Signal, signal } from "@preact/signals-react"

const PLUGIN_NAME = "touched"

/**
 * Enables keeping track of fields being touched or not.
 */
export const touchedFieldsPlugin = createPlugin(PLUGIN_NAME, {
  createFieldExtension(field, formContext) {
    return createFieldExtension(field, formContext)
  },
  createFieldProperties(extension) {
    return {
      isTouched: {
        get: () => extension.touchedSignal.value,
      },
    }
  },
  createFormProperties({ extensions }) {
    return {
      touchAll: {
        get: () => () =>
          extensions.forEach((e) => (e.touchedSignal.value = true)),
      },
    }
  },
})

function createFieldExtension(
  field: Field,
  formContext: IFormContext<any>
): {
  touchedSignal: Signal<boolean>
} {
  const fieldContext = formContext.fieldSignals[field.name] as FieldContext
  const touchedSignal = signal(false)

  fieldContext.addBlurEffect(() => {
    touchedSignal.value = true
  })

  return {
    touchedSignal,
  }
}
