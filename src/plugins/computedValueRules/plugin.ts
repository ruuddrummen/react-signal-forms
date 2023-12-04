import { FieldRule } from "@/index"
import { FieldRuleInternal, createPlugin } from "@/plugins"
import { effect } from "@preact/signals-react"

export const PLUGIN_NAME = "computedValues"

export const computedValueRulesPlugin = createPlugin(PLUGIN_NAME, {
  createFieldExtension(field, formContext) {
    const rules = field.rules?.filter(isComputedValueRule) ?? []

    if (rules.length === 0) {
      return {}
    }

    effect(() => {
      const results = rules.map((rule) => rule.execute(field, formContext))
      const value = results[results.length - 1]

      formContext.fields[field.name].setValue(value)
    })

    return {}
  },
})

function isComputedValueRule(
  fieldRule: FieldRule
): fieldRule is FieldRuleInternal<unknown> {
  return fieldRule.pluginName === PLUGIN_NAME
}
