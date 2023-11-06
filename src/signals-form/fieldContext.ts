import { Signal } from "@preact/signals-react";
import { KeyOf } from "@/utils";

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
