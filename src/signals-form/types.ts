import { Signal } from "@preact/signals-react";
import { KeyOf } from "@/utils";

export interface FieldBase<TValue> {
  name: string;
  label: string | null;
  defaultValue: TValue | null;
  // rules?: Array<FieldRule<any, string>>;
}

export interface Field<TForm = any, Key extends KeyOf<TForm> = KeyOf<TForm>>
  extends FieldBase<TForm[Key]> {
  rules?: Array<FieldRule<TForm, Key>>;
}

export type TextField = FieldBase<string>;

// Key can be used for type safety in rule implementations, for instance with TForm[Key]
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export interface FieldRule<TForm, Key extends KeyOf<TForm>> {
  extension: string;
}

export type FieldCollection<TForm = any> = {
  [Key in KeyOf<TForm>]: Field<TForm, Key>;
};

export interface FormContext<TForm = any> {
  fields: FieldContextCollection<TForm>;
}

export type FieldContextCollection<TForm = any> = {
  [Key in KeyOf<TForm>]: FieldContext<TForm[Key]>;
};

export interface FieldContext<TValue = any> {
  valueSignal: Signal<TValue>;
  extensions: FieldContextExtensions;
}

type FieldContextExtensions = {
  [name: string]: FieldContextExtension;
};

export interface FieldContextExtension {}

export type FormState = Array<Field<any, any> & FieldContext<any>>;
