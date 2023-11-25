import { FieldRule, IFormContext } from "@/index"
import { KeyOf } from "@/utils"
import { PLUGIN_NAME, ReadonlyFieldRule } from "./plugin"

export function readonly<TForm, TKey extends KeyOf<TForm>>(): FieldRule<
  TForm,
  TKey
> {
  return {
    plugin: PLUGIN_NAME,
    test: () => true,
  } as ReadonlyFieldRule<TForm, TKey>
}

export function readonlyIf<TForm, TKey extends KeyOf<TForm>>(
  test: (form: IFormContext<TForm>) => boolean
): FieldRule<TForm, TKey> {
  return {
    plugin: PLUGIN_NAME,
    test: (form) => test(form),
  } as ReadonlyFieldRule<TForm, TKey>
}
