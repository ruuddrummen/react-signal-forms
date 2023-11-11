import { touchedExtension } from "./planned/touched"
import { validationRulesExtension } from "./validation/extension"

export const defaultExtensions = [
  validationRulesExtension,
  touchedExtension,
] as const
