import { configureSignalForm } from "react-signal-forms"
import { defaultPlugins, plugins } from "react-signal-forms/plugins"

// Create the form and hook with the extensions you want to use.
export const { SignalForm, useFormSignals, useFieldSignals } =
  configureSignalForm(
    ...defaultPlugins, // includes validation rules and touched signals.
    plugins.applicabilityRules, // adds applicability rules and field signals.
    plugins.readonlyRules
  )
