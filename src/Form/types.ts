import { Signal } from "@preact/signals-react";

export interface Field<TForm = any> {
  name: string;
  label: string;
  isValid?: (value: string) => boolean;
  rules?: Array<FieldRule<TForm>>;
}

export interface FieldRule<TForm> {
  ruleType: string;
}

export type FieldCollection<TForm = any> = Record<keyof TForm, Field>;

export interface FormContext<TForm = any> {
  fields: Record<keyof TForm, Signal<FieldContext>>; // { [name: string]: Signal<FieldContext> };
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
