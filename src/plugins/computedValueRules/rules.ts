import { createFieldRule } from "../createFieldRule"
import { FieldValueType } from "../types"
import { PLUGIN_NAME } from "./plugin"

export const computedValue = createFieldRule<() => FieldValueType, unknown>(
  PLUGIN_NAME,
  (context, compute) => {
    return compute(context)
  }
)
