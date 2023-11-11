import { touchedExtension } from "./planned/touched"
import { validationRulesExtension } from "./validationRules"

export const defaultExtensions = [
  validationRulesExtension,
  touchedExtension,
] as const
