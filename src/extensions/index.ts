import { applicabilityRulesExtension } from "./applicabilityRules/extension"
import { diffChangesExtension } from "./planned/diffChanges"
import { touchedFieldsExtension } from "./planned/touched"
import { validationRulesExtension } from "./validation/extension"

export const defaultExtensions = [
  validationRulesExtension,
  // touchedFieldsExtension, // planned
] as const

export const extensions = {
  applicabilityRules: applicabilityRulesExtension,
  validationRules: validationRulesExtension,
  diffChanges: diffChangesExtension, // planned
  touchedFields: touchedFieldsExtension, // planned
}
