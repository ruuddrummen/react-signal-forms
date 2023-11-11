/**
 * Read docs on `createValidationRule(...)` to see how it works.
 */

import { createValidationRule } from "./extension"

export const required = createValidationRule((context) =>
  context.value != null && context.value !== ""
    ? null
    : "This field is required"
)

export const requiredIf = createValidationRule<() => boolean>(
  (context, test) =>
    !test(context) || (context.value != null && context.value !== "")
      ? null
      : "This field is required"
)

export const minLength = createValidationRule<number>((context, length) =>
  typeof context.value === "string" && context.value.length >= length
    ? null
    : `Must be at least ${length} characters long`
)
