import { applicabilityRulesPlugin } from "./applicabilityRules/plugin"
import { diffChangesPlugin } from "./planned/diffChanges"
import { touchedFieldsPlugin } from "./touchedFields/plugin"
import { validationRulesPlugin } from "./validation/plugin"

export const defaultPlugins = [
  validationRulesPlugin,
  touchedFieldsPlugin,
] as const

export const plugins = {
  applicabilityRules: applicabilityRulesPlugin,
  validationRules: validationRulesPlugin,
  touchedFields: touchedFieldsPlugin,
  diffChanges: diffChangesPlugin, // planned
}

export { createPlugin } from "./create"

export type { RuleContext } from "./types"
