import { KeyOf } from "@/utils";
import { Signal, signal } from "@preact/signals-react";

export type FieldContextCollection<TForm = any> = {
  [Key in KeyOf<TForm>]: IFieldContext<TForm[Key]>;
};

export interface IFieldContext<TValue = any> {
  value: TValue;
  setValue: (value: TValue) => void;
}

type FieldContextExtensions = {
  [name: string]: FieldContextExtension;
};

export interface FieldContextExtension {}

export class FieldContext<TValue = any> implements IFieldContext<TValue> {
  private __valueSignal: Signal<TValue>;
  __extensions: FieldContextExtensions;

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
    extension: TExtension,
    createContext: (
      extension: TExtension
    ) => Record<keyof TContext, PropertyDescriptor>
  ) => {
    this.__extensions[name] = extension;

    Object.defineProperties(this, createContext(extension));
  };
}
