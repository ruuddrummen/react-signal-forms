import { Signal } from "@preact/signals-react";
import { KeyOf } from "@/utils";

export type FieldContextCollection<TForm = any> = {
  [Key in KeyOf<TForm>]: IFieldContext<TForm[Key]>;
};

export interface IFieldContext<TValue = any> {
  // valueSignal: Signal<TValue>;
  extensions: FieldContextExtensions;
  value: () => TValue;
  setValue: (value: TValue) => void;
}

type FieldContextExtensions = {
  [name: string]: FieldContextExtension;
};

export interface FieldContextExtension {}

export class FieldContext<TValue = any> implements IFieldContext<TValue> {
  private valueSignal: Signal<TValue>;
  extensions: FieldContextExtensions;

  constructor(valueSignal: Signal<TValue>, extensions: FieldContextExtensions) {
    this.valueSignal = valueSignal;
    this.extensions = extensions;
  }

  value() {
    return this.valueSignal.value;
  }

  setValue(value: TValue) {
    this.valueSignal.value = value;
  }
}
