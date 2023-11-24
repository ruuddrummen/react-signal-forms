# React Signal Forms

> ⚠️ This library is brand new and under heavy development. You can follow its progress at the [development project](https://github.com/users/ruuddrummen/projects/1). Everything is still subject to change, as we are only just getting started. The docs will be updated as development progresses.

The form library that conforms to your needs. Start with what you need now, plug in what you need later. A forms library which aims to provide a high performance modular and extensible experience by leveraging signals with [@preact/signals-react](https://github.com/preactjs/signals).

- Easy to use, easy to extend. Built from the ground with an DX friendly [plugin model](#plugins).
  - Pick and choose what you need.
  - Plug in your own.
- Add built-in context aware rules to your fields or create your own.
  - Like `required()`, `requiredIf(...)`, `applicableIf(...)`, `computed(...)`, etc.
- Only calculates and renders what is necessary [without you needing to think about it](#rules-and-signals).
- Field and rule specifications are separated from presentation, so UI components don't get clogged with configuration and business rules.
- Bring your own UI libraries and components.
- All strongly typed with TypeScript.

## Getting started

To get started install the package with npm:

```
npm i react-signal-forms
```

## Exploring the demo

For a quick first look you can check out [the demo](https://ruuddrummen.github.io/react-signal-forms/), or run it yourself by cloning the repository and running:

```
npm run ci
npm run demo
```

If you want to explore the demo code, a good place to start would be [the form](./demo/src/DemoForm.tsx).

## Your first form

Start by initializing your form component and field hook, including the plugins you want to use:

```tsx
// Add plugins, built-in or your own.
export const { SignalForm, useFieldSignals } = createSignalForm(
  ...defaultPlugins, // the defaults, includes validation rules and touched field signals.
  plugins.applicabilityRules // adds applicability rules and field signals.
)
```

Create specifications for your forms:

```tsx
interface IYourData {
  yourTextField: string
  yourSelectField: string
}

const fields = signalForm<IYourData>().withFields((field) => {
  //                      ^ All specifications and rules will be strongly
  //                        typed based on your data interface.

  ...field("yourTextField", "Text field", {
    defaultValue: "Demo",

    // Add rules to your field. Some examples:
    rules: [
      required(),
      minLength(6),
      requiredIf(({ form }) => form.fields.otherField.value === true),
      applicableIf(({ form })) => form.field.otherField.value === true)
    ]
  })

  ...field("yourSelectField", "Select field").as<SelectField>({
    //          Plug in any field type you need, ^
    //          built-in or your own.
    options: [
      /* ...items */
    ]
  })

})
```

Add the `useFieldSignals` hook to your inputs:

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
  } = useFieldSignals()

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
      <TextInput field={field.yourTextField} />
      <SelectInput field={field.yourSelectField} />
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

All form features other than value handling - e.g. validation and applicability rules - are implemented as plugins. The goal behind this idea is to make the form implementation both scalable and extensible. In most simpler cases though, the native plugins should be enough to get you going.

If you have specific needs for solving more irregular or complex scenarios, you have some options:

- Custom rules can be added to existing plugins. If it fits your needs, than this is the easier option. The validation plugin for instance provides a `createValidationRule` function for this purpose. You can find docs and examples in [validation/rules.ts](./src/plugins/validation/rules.ts).
- Plugins can be replaced and you can create and plug in your own to fit your needs. To do this you can use the `createPlugin()` method. All [native plugins](/src/plugins/) are created using this method, so you can use those as examples to get started on your own.
