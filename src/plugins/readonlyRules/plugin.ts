import { createPlugin } from "@/plugins/createPlugin"
import { computed } from "@preact/signals-react"
import { FieldRuleInternal } from "../types"

export const PLUGIN_NAME = "readonly"

export const readonlyRulesPlugin = createPlugin(PLUGIN_NAME, {
  createFieldExtension(field, formContext) {
    return {
      readonlySignal: computed(() => {
        const rules = (field.rules?.filter(
          (r) => r.pluginName === PLUGIN_NAME
        ) ?? []) as FieldRuleInternal<boolean>[]

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
