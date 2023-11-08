import { KeyOf } from "@/utils";
import { Signal, signal } from "@preact/signals-react";
import {
  FieldContextExtension,
  FieldContextExtensions,
  PropertyDescriptors,
} from "./extensions/types";

export type FieldContextCollection<TForm = any> = {
  [Key in KeyOf<TForm>]: IFieldContext<TForm[Key]>;
};

export interface IFieldContext<TValue = any> {
  value: TValue;
  setValue: (value: TValue) => void;
}

export class FieldContext<TValue = any> implements IFieldContext<TValue> {
  __valueSignal: Signal<TValue>;
  private __extensions: FieldContextExtensions;

  constructor(value: TValue) {
    this.__valueSignal = signal(value);
    this.__extensions = {};
  }

  get value() {
    return this.__valueSignal.value;
  }

  setValue = (value: TValue) => {
    this.__valueSignal.value = value;
  };

  addExtension = <TExtension extends FieldContextExtension, TContext>(
    name: string,
    fieldExtension: TExtension,
    fieldContextProperties: PropertyDescriptors<TContext>
  ) => {
    this.__extensions[name] = fieldExtension;

    Object.defineProperties(this, fieldContextProperties);
  };
}
