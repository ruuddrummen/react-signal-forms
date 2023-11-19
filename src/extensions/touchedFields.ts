import { Signal, signal } from "@preact/signals-react"
import { FieldContext } from "../fieldContext"
import { Field } from "../fields"
import { IFormContext } from "../formContext"
import { SignalFormExtension } from "./types"

const EXTENSION_NAME = "touched"

type TouchedFieldExtension = {
  touchedSignal: Signal<boolean>
}

type TouchedFieldProperties = {
  isTouched: boolean
}

type TouchedFormProperties = {
  touchAll(): void
}

/**
 * Enables keeping track of fields being touched or not.
 */
export const touchedFieldsExtension: SignalFormExtension<
  TouchedFieldExtension,
  TouchedFieldProperties,
  TouchedFormProperties
> = {
  name: EXTENSION_NAME,
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
}

function createFieldExtension(
  field: Field,
  formContext: IFormContext<any>
): TouchedFieldExtension {
  const fieldContext = formContext.fields[field.name] as FieldContext
  const touchedSignal = signal(false)

  fieldContext.addBlurEffect(() => {
    touchedSignal.value = true
  })

  return {
    touchedSignal,
  }
}