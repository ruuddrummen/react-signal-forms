import { isArrayFieldContext } from "@/arrays/fieldContext"
import { FieldContextCollection } from "@/fieldContext"
import { Field, FieldContext, IFormContext } from "@/index"
import { createPlugin } from "@/plugins/create"
import { FormValues } from "@/types"
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
        get: () => () => {
          extensions.forEach((ext) => ext.touch())
        },
      },
    }
  },
})

function createFieldExtension(
  field: Field,
  formContext: IFormContext<any>
): {
  touchedSignal: Signal<boolean>
  touch: () => void
} {
  const fieldContext = formContext.fields[field.name] as FieldContext
  const touchedSignal = signal(false)

  fieldContext.addBlurEffect(() => {
    touchedSignal.value = true
  })

  const touch = () => {
    touchedSignal.value = true

    if (isArrayFieldContext(fieldContext)) {
      fieldContext.arrayItems.peek().forEach((item) =>
        Object.values(
          item.fields as FieldContextCollection<FormValues>
        ).forEach((arrayField) => {
          const extension = (arrayField as FieldContext).getExtension<
            typeof touchedFieldsPlugin
          >(PLUGIN_NAME)

          extension.touchedSignal.value = true
        })
      )
    }
  }

  return {
    touchedSignal,
    touch,
  }
}
