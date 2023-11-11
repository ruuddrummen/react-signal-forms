import { createSignalForm } from "react-signal-forms"
import {
  applicabilityRulesExtension,
  defaultExtensions,
} from "react-signal-forms/extensions"

// Create the form and hook with the extensions you want to use.
export const { SignalForm, useFieldSignals } = createSignalForm(
  ...defaultExtensions, // includes validation rules and touched signals.
  applicabilityRulesExtension // adds applicability rules and field signals.
)
