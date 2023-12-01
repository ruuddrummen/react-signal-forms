import {
  ContextProperties,
  FieldContextExtension,
  PropertyDescriptors,
  SignalFormPlugin,
} from "./types"

import { Field, IFieldContext, IFormContext } from "@/index"

/**
 * Creates a plugin. Note that the generic types can be inferred, and do not
 * have to be explicitely specified. Check out the native plugins to see
 * examples of how this method can be used.
 *
 * @param name The name of the plugin.
 * @param args Methods to extend forms and fields.
 * @returns A plugin which can be plugged into `configureSignalForm()`.
 */
export function createPlugin<
  TFieldContextExtension extends FieldContextExtension,
  TFieldContextProperties extends ContextProperties,
  TFormContextProperties extends ContextProperties,
>(
  name: string,
  args: {
    /**
     * Adds an extension to the context of the given field. This extension can
     * be used by properties on forms and fields, and cannot be accessed
     * directly by users.
     * @param field The field.
     * @param formContext The form context.
     */
    createFieldExtension(
      field: Field,
      formContext: IFormContext
    ): TFieldContextExtension

    /**
     * Adds properties to a field given the extension created by
     * `createFieldExtension(...)`. These properties can be accessed by calling
     * `useField(field)`.
     * @param extension The extension created by `createFieldExtension(...)`.
     */
    createFieldProperties?(
      extension: TFieldContextExtension
    ): PropertyDescriptors<TFieldContextProperties>

    /**
     * Adds prpoerties to a form given all fields contexts and extensions in the form.
     * @param args
     */
    createFormProperties?(args: {
      /**
       * All field contexts in the form.
       */
      fields: Array<IFieldContext & TFieldContextProperties>

      /**
       * All field extensions in the form.
       */
      extensions: TFieldContextExtension[]
    }): PropertyDescriptors<TFormContextProperties>
  }
): SignalFormPlugin<
  TFieldContextExtension,
  TFieldContextProperties,
  TFormContextProperties
> {
  return {
    name,
    ...args,
  }
}
