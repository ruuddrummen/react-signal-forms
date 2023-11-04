import { KeyOf } from "../utils";
import { Field, FieldCollection, FieldRule } from "./types";

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
      rules: this.rules,
    };
  }
}
