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
  fields: FieldContextCollection<TForm>;
}

export type FieldContextCollection<TForm = any> = {
  [Key in KeyOf<TForm>]: FieldContext<TForm[Key]>;
};

/**
 * Base field context.
 */
export interface FieldContext<TValue = any> {
  valueSignal: Signal<TValue>;
}

/**
 * Field context for validation rules.
 */
export interface FieldContext<TValue = any> {
  isValidSignal?: Signal<boolean>;
}

/**
 * Field context for applicability rules.
 */
export interface FieldContext<TValue = any> {
  isApplicableSignal?: Signal<boolean>;
}

export type FormState = Array<Field<any, any> & FieldContext<any>>;
