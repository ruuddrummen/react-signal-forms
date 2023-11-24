import { createPlugin } from "../create"

const PLUGIN_NAME = "diffChanges"

/**
 * Enables presentation of differences compared to previous values, and
 * reverting changes made since the last commit.
 */
export const diffChangesPlugin = createPlugin(PLUGIN_NAME, {
  createFieldExtension(_field, _formContext) {
    return {}
  },
})
