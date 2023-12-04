import { FieldRule } from "@/index"
import { effect } from "@preact/signals-react"
import { createPlugin } from "../createPlugin"
import { FieldRuleInternal } from "../types"

export const PLUGIN_NAME = "computedValues"

export const computedValueRulesPlugin = createPlugin(PLUGIN_NAME, {
  createFieldExtension(field, formContext) {
    const rules = field.rules?.filter(isComputedValueRule) ?? []

    if (rules.length === 0) {
      return {}
    }

    effect(() => {
      const results = rules.map((rule) => rule.execute(field, formContext))
      const value = results[-1]

      formContext.fields[field.name].value = value
    })

    return {}
  },
})

function isComputedValueRule(
  fieldRule: FieldRule
): fieldRule is FieldRuleInternal<unknown> {
  return fieldRule.pluginName === PLUGIN_NAME
}
