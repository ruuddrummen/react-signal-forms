import { createSignalForm } from "react-signal-forms";
import {
  applicabilityRules,
  validationRules,
} from "react-signal-forms/extensions";

// Create the form and hook with the extensions you want to use.
export const { SignalForm, useFieldSignals } = createSignalForm(
  validationRules, // adds validation rule handling and field signals.
  applicabilityRules // adds applicability rule handling and field signals.
);
