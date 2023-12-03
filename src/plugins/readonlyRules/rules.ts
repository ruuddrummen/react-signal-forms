import { createFieldRule } from "../createRule"
import { PLUGIN_NAME } from "./plugin"

export const readonly = createFieldRule<void, boolean>(PLUGIN_NAME, () => true)

export const readonlyIf = createFieldRule<() => boolean, boolean>(
  PLUGIN_NAME,
  (context, test) => test(context)
)
