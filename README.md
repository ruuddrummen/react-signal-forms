# React Signal Forms

> ⚠️ This library is brand new and under heavy development. You can follow its progress at the [development project](https://github.com/users/ruuddrummen/projects/1). Everything is still subject to change, as we are only just getting started. The docs will be updated as development progresses.

The form library that grows with your needs. A forms library which aims to provide a high performance modular and extensible experience by leveraging the power of signals with [@preact/signals-react](https://github.com/preactjs/signals).

- Easy to use, easy to extend. Built from the ground with an DX friendly extension model.
  - Pick and choose what you need.
  - Plug in your own.
- Add built-in context aware rules to your fields or create your own.
  - Like `required()`, `requiredIf(...)`, `applicableIf(...)`, `computed(...)`, etc.
- Only calculates and renders what is necessary by leveraging signals.
- Field and rule specifications are separated from UI.
- Bring your own UI libraries and components.
- Everything is strongly typed with Typescript.

## Getting started

To get started install the package with npm:

```
npm i react-signal-forms
```

## Exploring the demo

If you want to explore the library without any setup, you can run [the demo](./demo/) by cloning the repository and running:

```
npm run ci
npm run demo
```

If you want to explore the demo code, a good place to start would be [the demo form](./demo/src/DemoForm.tsx).

## Your first form

Start by initializing your form component and field hook, including the extensions you want to use.

```tsx
// Add extensions, replace extensions, or plug in your own.
export const { SignalForm, useFieldSignals } = createSignalForm(
  ...defaultExtensions, // the defaults, includes validation rules and touched signals.
  extensions.applicabilityRules // adds applicability rules and field signals.
  // other extensions...
)

// Or just stick to the defaults (planned).
export const { SignalForm, useFieldSignals } = createSignalForm()
```

> ⚠️ Touched signals are coming soon.

Create field specifications for your form data:

```tsx
interface IYourData {
  yourTextField: string
  yourSelectField: string
}

const fields = signalForm<IYourData>().createFields((field) => {
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
    //          Plug in any field type you need. ^
    options: [
      /* ...items */
    ]
  })

})
```

> ℹ️ For now there are only a few extensions, configuration options and rules. More will be coming, and you will also be able create and plug in your own. More on that in [Extensions](#extensions).

Add the `useFieldSignals` hook to your inputs:

```tsx
interface MyInputProps {
  field: TextField // only accepts string fields.
}

const MyInput = ({ field }: MyInputProps) => {
  const {
    value,
    setValue,
    isValid,
    errors,
    isApplicable,
    ...otherSignals
    //  ^ With intellisense matching your selected extensions.
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
      <MyInput field={field.yourTextField} />
    </SignalForm>
  )
}
```

## Rules and signals

All internal state management is handled with signals. An advantage of this approach is that rules automatically subscribe to the state they need, and are only re-evaluated when state used in the rules are updated. The results of these rules are in turn also saved in (computed) signals.

A simple example to illustrate what this means for performance: if field A is only applicable if field B has a specific value, then:

- The applicability rule is only evaluated when the value of field B is updated. Updates on any other field do not trigger the evaluation of the rule.
- Field A is only re-rendered when the result of the applicability rule changes, i.e. from `true` to `false` or vice versa.

## Extensions

Form features - e.g. validation and applicability rules - are implemented in separated extensions. The goal behind this idea is to make the form implementation both scalable and extensible. In most simpler cases though, the native extensions should be enough to get you going.

If you have specific needs for solving more irregular or complex scenarios, you have some options:

- Custom rules can be added to existing extensions. If it fits your needs, than this is the easier option. The validation extension for instance provides a `createValidationRule` function for this purpose. You can find docs and examples in [validation/rules.ts](./src/extensions/validation/rules.ts).
- Extensions can be replaced and custom extensions can be plugged in to fit your needs. To do this you can implement the `SignalFormExtension` interface. This is currently in (super) early development.
