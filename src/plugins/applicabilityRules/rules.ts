import { IFormContextLike } from "@/formContext"
import { ApplicabilityFieldRule, PLUGIN_NAME } from "./plugin"

import { FieldRule, IFormContext } from "@/index"
import { KeyOf } from "@/utils"

export function applicableIf<
  TForm,
  TKey extends KeyOf<TForm>,
  TParentForm extends IFormContextLike,
>(
  test: (context: IFormContextLike<TForm, TParentForm>) => boolean
): FieldRule<TForm, TKey> {
  return {
    execute: (context: IFormContext<TForm>) => test(context),
    plugin: PLUGIN_NAME,
  } as ApplicabilityFieldRule<TForm, TKey>
}
