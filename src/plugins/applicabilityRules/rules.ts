import { PLUGIN_NAME } from "./plugin"

import { createFieldRule } from "@/plugins"

/**
 * Makes a field applicable if the given test passes.
 */
export const applicableIf = createFieldRule<() => boolean, boolean>(
  PLUGIN_NAME,
  (context, test) => test(context)
)
