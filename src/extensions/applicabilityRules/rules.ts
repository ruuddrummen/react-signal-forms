import { ApplicabilityFieldRule, PLUGIN_NAME } from "./plugin"

import { FieldRule } from "../../fields"
import { IFormContext } from "../../formContext"
import { KeyOf } from "../../utils"

export function applicableIf<TForm, TKey extends KeyOf<TForm>>(
  test: (context: IFormContext<TForm>) => boolean
): FieldRule<TForm, TKey> {
  return {
    execute: (context: IFormContext<TForm>) => test(context),
    plugin: PLUGIN_NAME,
  } as ApplicabilityFieldRule<TForm, TKey>
}
