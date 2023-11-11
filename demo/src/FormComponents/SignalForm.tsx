import { createSignalForm } from "react-signal-forms";
import {
  applicabilityRules,
  validationRules,
} from "react-signal-forms/extensions";
import { diffChanges } from "react-signal-forms/extensions/planned/diffChanges";

// Create the form and hook with the extensions you want to use.
export const { SignalForm, useFieldSignals } = createSignalForm(
  validationRules,
  applicabilityRules, // adds applicability rule support and field signals.
  diffChanges
);
