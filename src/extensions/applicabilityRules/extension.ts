import { Signal, computed } from "@preact/signals-react"
import { Field, FieldRule } from "../../fields"
import { IFormContext } from "../../formContext"
import { alwaysTrueSignal } from "../../signals"
import { KeyOf } from "../../utils"
import { SignalFormExtension } from "../types"

export const EXTENSION_NAME = "applicability"

type ApplicabilityFieldContextExtension = {
  isApplicableSignal: Signal<boolean>
}

export type ApplicabilityFieldProperties = {
  isApplicable: boolean
}

/**
 * Adds applicability rule handling and field signals.
 */
export const applicabilityRulesExtension: SignalFormExtension<
  ApplicabilityFieldContextExtension,
  ApplicabilityFieldProperties
> = {
  name: EXTENSION_NAME,
  createFieldExtension(field, formContext) {
    return {
      isApplicableSignal: createApplicabilitySignal(field, formContext),
    }
  },
  createFieldProperties(extension) {
    return {
      isApplicable: {
        get: () => extension.isApplicableSignal.value,
      },
    }
  },
}

function createApplicabilitySignal(
  field: Field,
  formContext: IFormContext<any>
): Signal<boolean> {
  const rules = field.rules?.filter(isApplicabilityRule) ?? []
  const fieldContext = formContext.fields[field.name]

  if (rules.length > 0) {
    const signal = computed(() => {
      console.log(`(${field.name}) Checking applicability rule`)
      return rules.every((r) => r.execute(formContext))
    })

    signal.subscribe((value) => {
      if (!value) {
        console.log(`(${field.name}) Clearing field value`)
        fieldContext.setValue(null)
      }
    })

    return signal
  } else {
    return alwaysTrueSignal
  }
}

export interface ApplicabilityFieldRule<TForm, TKey extends KeyOf<TForm>>
  extends FieldRule<TForm, TKey> {
  execute: (context: IFormContext<TForm>) => boolean
}

function isApplicabilityRule<TForm, TKey extends KeyOf<TForm>>(
  rule: FieldRule<TForm, TKey>
): rule is ApplicabilityFieldRule<TForm, TKey> {
  return rule.extension === EXTENSION_NAME
}
