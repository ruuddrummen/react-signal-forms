import { configureSignalForm } from "react-signal-forms"
import { defaultExtensions, extensions } from "react-signal-forms/extensions"

// Create the form and hook with the extensions you want to use.
export const { SignalForm, useFieldSignals } = configureSignalForm(
  ...defaultExtensions, // includes validation rules and touched signals.
  extensions.applicabilityRules // adds applicability rules and field signals.
)
