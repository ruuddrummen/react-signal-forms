import { Signal } from "@preact/signals-react";

export interface Field {
  name: string;
  label: string;
  isValid?: (value: string) => boolean;
  createApplicabilitySignal?: (
    fields: FieldContextCollection
  ) => Signal<boolean>;
}

export type FieldCollection = { [name: string]: Field };

export interface FormContext {
  fields: { [name: string]: Signal<FieldContext> };
}

/**
 * Base field context.
 */
export interface FieldContext {
  value: any;
}

/**
 * Field context for validation rules.
 */
export interface FieldContext {
  isValidSignal?: Signal<boolean>;
}

/**
 * Field context for applicability rules.
 */
export interface FieldContext {
  isApplicableSignal?: Signal<boolean>;
}

export type FieldContextCollection = { [name: string]: Signal<FieldContext> };

export type FormState = Array<Field & FieldContext>;
