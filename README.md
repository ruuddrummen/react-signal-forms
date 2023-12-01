# React Signal Forms &middot; [![npm][npm-badge]][npm] [![build][build-badge]][build] [![github-pages][github-pages-badge]][github-pages]

[npm-badge]: https://img.shields.io/npm/v/react-signal-forms?style=flat-square&color=blue
[npm]: https://www.npmjs.com/package/react-signal-forms
[build-badge]: https://img.shields.io/github/actions/workflow/status/ruuddrummen/react-signal-forms/main.yml?style=flat-square
[build]: https://github.com/ruuddrummen/react-signal-forms/actions/workflows/main.yml?query=branch%3Amain
[github-pages-badge]: https://img.shields.io/github/deployments/ruuddrummen/react-signal-forms/github-pages?label=demo&style=flat-square
[github-pages]: https://ruuddrummen.github.io/react-signal-forms/

> ⚠️ This library is still new, so everything is still subject to change. You can follow its development in the [project](https://github.com/users/ruuddrummen/projects/1) and [releases](https://github.com/ruuddrummen/react-signal-forms/releases). The docs will be updated as development progresses.

A forms library which aims to provide a high performance modular experience by leveraging signals with [@preact/signals-react](https://github.com/preactjs/signals).

- Easy to use, easy to extend. Built from the ground with an DX friendly [plugin model](#plugins).
  - Pick and choose from the built-in plugins that fit your needs.
  - Plug in your own.
- Add built-in context aware and typesafe rules to your fields or create your own.
  - Like `required()`, `requiredIf(...)`, `applicableIf(...)`, `computed(...)`, etc.
- Only calculates and renders what is necessary [without you needing to think about it](#rules-and-signals).
- Field and rule specifications are separated from presentation, so UI components don't get clogged with configuration and business rules.
- Bring your own UI libraries and components.
- All strongly typed with TypeScript.

## Getting started

```
npm i react-signal-forms
```

## Exploring the demo

For a quick first look you can check out [the demo](https://ruuddrummen.github.io/react-signal-forms/), or run it yourself by cloning the repository and running:

```
npm run ci
npm run demo
```

If you want to explore the demo code, a good place to start would be [the form](/demo/src/DemoForm.tsx).

## Your first form

Start by initializing your form component and field hook, including the plugins you want to use:

```tsx
// Add plugins, built-in or your own.
export const { SignalForm, useField } = createSignalForm(
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

## Rules and signals

All internal state management is done with signals. An advantage of this approach is that rules automatically subscribe to the state they need, and are only re-evaluated when state used in the rules are updated. The results of these rules are in turn also saved in (computed) signals.

A simple example to illustrate what this means for performance: if field A is only applicable if field B has a specific value, then:

- The applicability rule is only evaluated when the value of field B is updated. Updates on any other field do not trigger the evaluation of the rule.
- Field A is only re-rendered when the result of the applicability rule changes, i.e. from `true` to `false` or vice versa.

## Plugins

All form features other than the core - e.g. validation and applicability rules - are implemented as plugins. The goal behind this concept is to make the form implementation both scalable and extensible. In most simpler cases, the native plugins should be enough to get you going. If necessary though, plugins can be added or replaced to fulfill on specialized requirements.

If you have specific needs for solving more irregular or complex scenarios, you have some options:

- Custom rules can be added to existing plugins. If it fits your needs, than this is the easier option. The validation plugin for instance provides a `createValidationRule` function for this purpose. You can find docs and examples in [validation/rules.ts](/src/plugins/validation/rules.ts).
- Plugins can be replaced and you can create and plug in your own to fit your needs. To do this you can use the [`createPlugin()`](/src/plugins/create.ts) method. All [native plugins](/src/plugins/) are created using this method, so you can use those as examples to get started on your own.

## Array forms

Currently in development in [#61](https://github.com/ruuddrummen/react-signal-forms/issues/61).
