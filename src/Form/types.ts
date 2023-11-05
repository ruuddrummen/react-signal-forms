import { Signal } from "@preact/signals-react";
import { KeyOf } from "@/utils";

export interface Field<TForm = any, TKey extends KeyOf<TForm> = KeyOf<TForm>> {
  name: string;
  label: string | null;
  rules?: Array<FieldRule<TForm, TKey>>;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export interface FieldRule<TForm, TKey extends KeyOf<TForm>> {
  ruleType: string;
}

export type FieldCollection<TForm = any> = Record<
  KeyOf<TForm>,
  Field<TForm, KeyOf<TForm>>
>;

export interface FormContext<TForm = any> {
  fields: Record<KeyOf<TForm>, FieldContext>;
}

/**
 * Base field context.
 */
export interface FieldContext {
  valueSignal: Signal<any>;
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

export type FieldContextCollection = { [name: string]: FieldContext };

export type FormState = Array<Field<any, any> & FieldContext>;
