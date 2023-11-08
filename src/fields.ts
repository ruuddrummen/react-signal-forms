import { KeyOf } from "./utils";

export interface FieldBase<TValue> {
  name: string;
  label: string | null;
  defaultValue: TValue | null;
}

export interface Field<TForm = any, Key extends KeyOf<TForm> = KeyOf<TForm>>
  extends FieldBase<TForm[Key]> {
  rules?: Array<FieldRule<TForm, Key>>;
}

export type TextField = FieldBase<string | null>;
export type NumberField = FieldBase<number | null>;
export type BooleanField = FieldBase<boolean | null>;

// Key can be used for type safety in rule implementations, for instance with TForm[Key]
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export interface FieldRule<TForm, _Key extends KeyOf<TForm>> {
  extension: string;
}

export type FieldCollection<TForm = any> = {
  [Key in KeyOf<TForm>]: Field<TForm, Key>;
};

export function createFields<TForm>(
  configure: (fieldsBuilder: FieldCollectionBuilder<TForm>) => void
): FieldCollection<TForm> {
  const fieldCollectionBuilder = new FieldCollectionBuilder<TForm>();
  configure(fieldCollectionBuilder);

  return fieldCollectionBuilder.build();
}

class FieldCollectionBuilder<TForm> {
  fieldBuilders: Array<FieldBuilder<TForm, KeyOf<TForm>>> = [];

  field<TKey extends KeyOf<TForm>>(
    name: TKey,
    configure: (fieldBuilder: FieldBuilder<TForm, TKey>) => void
  ) {
    const fieldBuilder = new FieldBuilder<TForm, TKey>(name);
    configure(fieldBuilder);
    this.fieldBuilders.push(fieldBuilder);
  }

  build(): FieldCollection<TForm> {
    const fields = this.fieldBuilders.reduce<FieldCollection<TForm>>(
      (fields, fieldBuilder) => {
        fields[fieldBuilder.name] = fieldBuilder.build();
        return fields;
      },
      {} as FieldCollection<TForm>
    );

    return fields;
  }
}

class FieldBuilder<TForm, TKey extends KeyOf<TForm>> {
  name: TKey;
  label: string | null = null;
  defaultValue: TForm[TKey] | null = null;
  rules: Array<FieldRule<TForm, TKey>> = [];

  constructor(name: TKey) {
    this.name = name;
  }

  build(): Field<TForm, TKey> {
    return {
      name: this.name,
      label: this.label,
      defaultValue: this.defaultValue,
      rules: this.rules,
    };
  }
}
