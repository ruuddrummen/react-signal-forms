import { Field, FieldRule, IFormContext } from "@/index"
import { createPlugin } from "@/plugins/createPlugin"
import { alwaysTrueSignal } from "@/signals"
import { KeyOf } from "@/utils"
import { Signal, computed } from "@preact/signals-react"
import { FieldRuleInternal } from "../types"

export const PLUGIN_NAME = "applicability"

/**
 * Adds applicability rule handling and field signals. The value of fields which are not
 * applicable is set to `undefined`. When a field becomes applicable its value is set to
 * its default value, or `null` if no default value is specified.
 */
export const applicabilityRulesPlugin = createPlugin(PLUGIN_NAME, {
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
})

function createApplicabilitySignal(
  field: Field,
  formContext: IFormContext<any>
): Signal<boolean> {
  const rules = field.rules?.filter(isApplicabilityRule) ?? []
  const fieldContext = formContext.fields[field.name]

  if (rules.length > 0) {
    const isApplicableSignal = computed(() => {
      return rules.every((r) => r.execute(field, formContext))
    })

    isApplicableSignal.subscribe((value) => {
      if (!value) {
        fieldContext.setValue(undefined)
      } else if (fieldContext.peekValue() === undefined) {
        fieldContext.setValue(field.defaultValue ?? null)
      }
    })

    return isApplicableSignal
  } else {
    return alwaysTrueSignal
  }
}

function isApplicabilityRule<TForm, TKey extends KeyOf<TForm>>(
  rule: FieldRule<TForm, TKey>
): rule is FieldRuleInternal<boolean> {
  return rule.pluginName === PLUGIN_NAME
}
