# React Signal Forms

> **Note.** This library is brand new and under heavy development. You can follow its progress at the [development project](https://github.com/users/ruuddrummen/projects/1). Everything is still subject to change. We're only just getting started.

A forms library which aims to provide a high performance modular and extensible experience by leveraging the power of signals with [@preact/signals-react](https://github.com/preactjs/signals).

- Easy to use, easy to extend. Built from the ground with an DX friendly extension model.
  - Pick and choose what you need.
  - Plug in your own.
- Add rules to your fields.
  - Like `isRequired()` or `applicableIf(...)`.
  - Rules have access to your form context and other fields.
- Only calculates and renders what is necessary by leveraging signals.
- Bring your own UI libraries and components.
- Everything is strongly typed with Typescript.
- And many more smart and useful quotes.

## Getting started

To get started install the package with npm:

```
npm i react-signal-forms
```

## Your first form

Start by initializing your form component and field hook, including the extensions you want to use.

```tsx
export const { SignalForm, useFieldSignals } = createSignalForm(
  validationRules, // adds validation rule handling and field signals.
  applicabilityRules // adds applicability rule handling and field signals.
)
```

Create field specifications for your form data:

```tsx
const fields = createFields<YourDataInterface>((form) => {
  //                        ^ All specifications and rules will be strongly typed based on your data interface.

  form.field("myField", (field) => {
    field.label = "My field"
    field.defaultValue = "Demo"

    // Add rules to your field. Here are some examples:
    field.rules = [
      required(),
      minLength(6),
      requiredIf(({ form }) => form.fields.otherField.value === true),
      applicableIf(({ form })) => form.field.otherField.value === true)
    ]
  })

})
```

You can also create your own rules, more on that in [Extensions](#extensions).

Add the `useFieldSignals` to your inputs:

```tsx
const MyInput = () => {
  const { value, setValue, isValid, errors, isApplicable, ...otherSignals } =
    useFieldSignals()

  // Handle things like `isApplicable`.

  <input value={value} onChange={e => setValue(e.currentTarget.value)} {...otherProps} />
}
```

You are now set to compose your form:

```tsx
const MyForm = () => {
  return (
    <SignalForm fields={fields} initialValues={...} onSubmit={...}>
      <MyInput field={field.myField} />
    </SignalForm>
  )
}
```

## Running the demo

If you want to explore the library without any setup, you can run [the demo](./demo/) by cloning the repository and running:

```
npm run ci
npm run demo
```

If you want to explore the demo code, a good place to start would be [the form root](./demo/src/MyForm.tsx).

## Extensions

This is how the extension model works:

```ts
// Coming soon...
```
