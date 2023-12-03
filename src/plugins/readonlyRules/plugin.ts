import { FieldRule } from "@/fields"
import { FieldRuleInternal } from "@/plugins"
import { createPlugin } from "@/plugins/createPlugin"
import { computed } from "@preact/signals-react"

export const PLUGIN_NAME = "readonly"

/**
 * Supports the creation of rules for making fields readonly. Check out the docs
 * on {@linkcode createPlugin} for details on each method.
 */
export const readonlyRulesPlugin = createPlugin(PLUGIN_NAME, {
  createFieldExtension(field, formContext) {
    return {
      readonlySignal: computed(() => {
        const rules = field.rules?.filter(isReadonlyRule) ?? []

        return rules.some((r) => r.execute(field, formContext))
      }),
    }
  },
  createFieldProperties(extension) {
    return {
      readonly: {
        get: () => extension.readonlySignal.value,
      },
    }
  },
})

function isReadonlyRule(rule: FieldRule): rule is FieldRuleInternal<boolean> {
  return rule.pluginName === PLUGIN_NAME
}
