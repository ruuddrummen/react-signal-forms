import { FieldRule } from "@/fields"
import { IFormContext } from "@/formContext"
import { KeyOf } from "@/utils"
import { computed } from "@preact/signals-react"
import { createPlugin } from "../create"

export const PLUGIN_NAME = "readonly"

export const readonlyRulesPlugin = createPlugin(PLUGIN_NAME, {
  createFieldExtension(field, formContext) {
    return {
      readonlySignal: computed(() => {
        const rules = (field.rules?.filter((r) => r.plugin === PLUGIN_NAME) ??
          []) as ReadonlyFieldRule<any, any>[]

        console.log(`(${field.name}) Checking ${rules.length} readonly rules.`)

        return rules.some((r) => r.test(formContext))
      }),
    }
  },
  createFieldProperties(extension) {
    return {
      readonly: {
        get: () => extension.readonlySignal.value,
      },
    }
  },
})

export interface ReadonlyFieldRule<TForm, TKey extends KeyOf<TForm>>
  extends FieldRule<TForm, TKey> {
  test: (context: IFormContext<TForm>) => boolean
}
