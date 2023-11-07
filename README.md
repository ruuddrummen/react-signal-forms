# React Signal Forms

A forms library which aims to provide a high performance modular forms experience by leveraging the power of signals with [@preact/signals-react](https://github.com/preactjs/signals).

- Easy and lightweight to develop both simple and large complex forms.
- Only calculates and renders what is necessary by leveraging signals.
- Strongly typed with typescript.
- Built from the ground with an extension model.
  - Pick and choose what you need.
  - Easy to plugin your own.
  - Transparent user experience.
- And many more smart and useful quotes.

## Getting started (soon)

To get started install the package with npm:

```
  npm install react-signal-forms
```

## Running the demo

If you want to explore the library without any setup, you can run the demo by cloning the repository and running:

```
  npm install
  npm start
```

## Going through an example

<!-- prettier-ignore-start -->
```jsx
// Create the form and hook with the extensions you want to use.
export const { SignalForm, useFieldSignals } = createSignalForm(
  validationRules, // adds validation rule support and field signals.
  applicabilityRules // adds applicability rule support and field signals.
);

// Create a data interface.
interface MyFormData {
  simpleField: string;
  requiredField: string;
  validatedField: string;
  secretField: string;
  numberField: number;
  booleanField: boolean;
}

// Create the fields you want to use, based on you data interface.
const fields = createFields<MyFormData>((form) => {
  form.field("simpleField", (field) => {
    field.label = "Simple field with no rules";
    field.defaultValue = "test";
  });

  form.field("requiredField", (field) => {
    field.label = "Required field";
    field.rules = [
      // A validation rule making the field required.
      isRequired(),
    ];
  });

  form.field("validatedField", (field) => {
    field.label = "Field with validation - try typing SECRET";
    field.rules = [
      // A custom validation rule.
      validIf(({ value }) => value?.startsWith("SECRET")),
    ];
  });

  form.field("secretField", (field) => {
    field.label = "Secret field";
    field.rules = [
      // An applicability rule.
      applicableIf(({ fields }) =>
        fields.validatedField.value?.startsWith("SECRET")
      ),
    ];
  });
});

export const MyForm: React.FC = () => {
  return (
    <SignalForm fields={fields}>
      <MyTextInput field={fields.simpleField} />
      <MyTextInput field={fields.requiredField} />
      <MyTextInput field={fields.validatedField} />
      <MyTextInput field={fields.secretField} />
    </SignalForm>
  );
};


// Bring your own input components.
const MyTextInput: React.FC<{ field: TextField }> = ({ field }) => {
  // Get the field signals and callbacks.
  // Note: you get the basics and the extensions you choose above.
  const { value, setValue, isApplicable, isValid } = useFieldSignals(field);

  if (!isApplicable) {
    return null;
  }

  return (
    <input
      value={value}
      onChange={(e) => setValue(e.eventTarget.value)}
      /* other props */
    />
  );
};
```
<!-- prettier-ignore-end -->

## Extensions

This is how the extension model works: `Coming soon...`
