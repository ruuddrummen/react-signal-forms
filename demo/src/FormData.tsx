/**
 * Your data type or interface.
 */
export interface FormData {
  text: string
  number: number
  boolean: boolean

  select: string

  alwaysRequired: string
  mustBeEqualToOtherField: string

  hasMinimumLength: string

  makeFieldRequired: boolean
  canBeRequired: string

  showSecretField: boolean
  secret: string

  alwaysReadonly: string
  makeFieldReadonly: boolean
  canBeReadOnly: string

  makeComplicatedFieldApplicable: boolean
  complicatedField: string

  arrayField: Array<{
    textFieldInArray: string
  }>
}
