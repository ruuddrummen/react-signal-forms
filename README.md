# React Signal Forms &middot; [![npm][npm-badge]][npm] [![build][build-badge]][build] [![github-pages][github-pages-badge]][github-pages] <!-- omit from toc -->

[npm-badge]: https://img.shields.io/npm/v/react-signal-forms?style=flat-square&color=blue
[npm]: https://www.npmjs.com/package/react-signal-forms
[build-badge]: https://img.shields.io/github/actions/workflow/status/ruuddrummen/react-signal-forms/main.yml?style=flat-square
[build]: https://github.com/ruuddrummen/react-signal-forms/actions/workflows/main.yml?query=branch%3Amain
[github-pages-badge]: https://img.shields.io/github/deployments/ruuddrummen/react-signal-forms/github-pages?label=demo&style=flat-square
[github-pages]: https://ruuddrummen.github.io/react-signal-forms/

> ⚠️ **DISCLAIMER.** The API is not yet stable, i.e. any version may introduce breaking changes.

A forms library which aims to provide a high performance modular experience by leveraging signals with [@preact/signals-react](https://github.com/preactjs/signals).

- Easy to use, easy to extend. Built from the ground with an DX friendly [plugin API](#plugin-api).
  - Pick and choose from the built-in plugins that fit your needs.
  - Plug in your own.
- Add built-in context aware and typesafe rules to your fields or create your own.
  - Like `required()`, `requiredIf(...)`, `applicableIf(...)`, `computed(...)`, etc.
- Only calculates and renders what is necessary [without you needing to think about it](#how-it-works-signals-and-field-rules).
- Field and rule specifications are separated from presentation, so UI components don't get clogged with configuration and business rules.
- Bring your own UI libraries and components.
- All strongly typed with TypeScript.

## Table of contents <!-- omit from toc -->

- [Getting started](#getting-started)
- [Exploring the demo](#exploring-the-demo)
- [Your first form](#your-first-form)
- [How it works: signals and field rules](#how-it-works-signals-and-field-rules)
- [Plugin API](#plugin-api)
  - [`createPlugin()`](#createplugin)
  - [`createFieldRule()`](#createfieldrule)
- [Array fields](#array-fields)
- [Nested forms](#nested-forms)

## Getting started

```
npm i react-signal-forms
```

## Exploring the demo

For a quick first look you can check out [the demo](https://ruuddrummen.github.io/react-signal-forms/) of react-signal-forms with Material UI, or run it yourself by cloning the repository and running:

```
npm run ci
npm run demo
```

If you want to explore the demo code, a good place to start would be [the basics example](/demo/src/examples/BasicsDemoForm.tsx#L74).

## Your first form

Start by initializing your form component and field hook, including the plugins you want to use:

```tsx
// Add plugins, built-in or your own.
export const { SignalForm, useForm, useField } = createSignalForm(
  ...defaultPlugins, // the defaults, includes validation rules and touched field signals.
  plugins.applicabilityRules // adds applicability rules and field signals.
)
```

> ℹ️ A full list of the currently available plugins can be found in the [plugins module](/src/plugins/index.ts).

Create field specifications for your forms:

```tsx
interface IYourData {
  justText: string
  aFieldWithRules: string
  aSelectField: string
}

const fields = signalForm<IYourData>().withFields((field) => {
  //                      ^ All specifications and rules will be strongly
  //                        typed based on your data interface.

  ...field("justText", "Just a text field"),

  ...field("aFieldWithRules", "A field with some rules", {
    defaultValue: "Demo",

    // Add rules to your field. Some examples:
    rules: [
      required(),
      minLength(6),
      requiredIf(({ form }) => form.fields.otherField.value === true),
      applicableIf(({ form })) => form.field.otherField.value === true)
    ]
  })

  ...field("aSelectField", "Select field").as<SelectField>({
    //          Plug in any field type you need, ^
    //          built-in or your own.
    options: [
      /* ...items */
    ]
  })

})
```

Add the `useField` hook to your inputs:

```tsx
interface TextInputProps {
  field: TextField // only accepts string fields.
}

const TextInput = ({ field }: TextInputProps) => {
  const {
    value,
    setValue,
    isValid,
    errors,
    isApplicable,
    ...otherSignals
    // ^ With intellisense matching your selected plugins.
  } = useField(field)

  if (!isApplicable) {
    return null
  }

  return (
    <input
      value={value}
      onChange={(e) => setValue(e.currentTarget.value)}
      {...otherProps}
    />
  )
}
```

You are now set to compose your form:

```tsx
const MyForm = () => {
  return (
    <SignalForm
      fields={fields}
      initialValues={valuesFromStore}
      onSubmit={handleSubmit}
    >
      <TextInput field={fields.justText} />
      <TextInput field={fields.aFieldWithRules} />
      <SelectInput field={fields.aSelectField} />
    </SignalForm>
  )
}
```

## How it works: signals and field rules

All internal state management is handled with [signals](https://preactjs.com/blog/introducing-signals/). Field rules are executed in computed signals, which by definition subscribe exactly to the signals they reference, and nothing more. An advantage of this approach is that rules automatically subscribe to the state that they reference, and are only re-evaluated when state used in the rule is updated. Even larger and more complex forms should still perform well without requiring manual optimizations.

A simple example to illustrate what this means for performance: if field A is only applicable when field B has a specific value, then:

- The applicability rule is only evaluated when the value of field B is updated. Updates on any other field do not trigger the evaluation of the rule.
- Field A is only re-rendered when the result of the applicability rule changes, i.e. from `true` to `false` or vice versa.

## Plugin API

Form features such as validation, applicability rules, and others are implemented as plugins with the plugin and field rule API's. The goal behind this concept is to keep feature implementations separate and simple, and to make adding features easier.

In most simpler cases, the native plugins should be enough to get you going. If necessary though, plugins and rules can be added or replaced to fulfill on specialized requirements.

> ℹ️ All [native plugins](/src/plugins/) use the methods described below, so you can use those as examples.

### `createPlugin()`

Plugins can be replaced and you can create and plug in your own to better fit your requirements. To do this you can use the [`createPlugin()`](/src/plugins/createPlugin.ts) method. To get started you can have a look at the [`initialValue`](/src/plugins/initialValue/) and [`readonlyRules`](/src/plugins/readonlyRules/) plugins, which are some of the simpler ones.

### `createFieldRule()`

Field rules can be added to any plugin using them. In general, rules can be created with the [`createFieldRule()`](/src/plugins/createFieldRule.ts) helper function. This function can be used as is, or it can be wrapped for specific plugins. For example, the validation plugin has wrapped this function in [`createValidationRule()`](/src/plugins/validation/rules.ts).

## Array fields

The implementation of forms with one or more arrays of items is supported by array fields. You can create specifications for an array field with `...field("yourArrayField").asArray(...)`.

For example:

```ts
type ExampleData = {
  arrayField: Array<{
    booleanField: boolean
    textField: string
  }>
}

const fields = signalForm<ExampleData>().withFields((field) => ({
  ...field("arrayField").asArray({
    fields: (field) => ({
      ...field("booleanField", "Toggle field"),
      ...field("textField", "Text field"),
    }),
  }),
}))
```

The array field itself and all fields in an array field support the same features and plugins as other fields. Note that field rules in an array form also have access to the parent form.

For example:

```ts
...field("textFieldInArray", "Text field in array", {
  rules: [
    applicableIf(
      ({ form }) => form.parent.fields.fieldInParent.value === "some value"
    )
  ]
})
```

Adding array fields to your form can then be done with the `useArrayField()` hook and the `<ArrayItem />` component. The hook provides a description of the items in the array, which can then be mapped to the `ArrayItem` component.

For example:

```tsx
const YourForm = () => (
  <SignalForm fields={yourFields}>
    {/* ... */}
    <YourArrayField />
    {/* ... */}
  </SignalForm>
)

const YourArrayField = () => {
  const { items, itemFields, add } = useArrayField(yourFields.arrayField)
  //             ^ can also be accessed with `yourFields.arrayField.fields`.

  return (
    <>
      {items.map((item) => (
        <YourLayout key={item.id}>
          {/*       ^ make sure to set `key` to `item.id` */}

          <ArrayItem item={item}>
            <TextInput field={itemFields.textField}>

            {/* Other layout and input components */}

            <Button onClick={item.remove}>Remove item</Button>
          </ArrayItem>
        </YourLayout>
      ))}

      <Button onClick={add}>Add item</Button>
    </>
  )
}
```

The demo includes [an example for array fields](https://ruuddrummen.github.io/react-signal-forms/#array-fields), and you can find the code in [ArrayFieldsDemo](./demo/src/examples/ArrayFieldDemo.tsx).

> ℹ️ For better performance when adding and removing items, wrap your array items in [`React.memo()`](https://react.dev/reference/react/memo). In the example above this could be done on the `<YourLayout />` component, and you can also find it used in the demo.

## Nested forms

> Planned.
