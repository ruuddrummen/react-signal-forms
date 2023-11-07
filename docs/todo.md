## TODO (General)

- [x] Create signal per value instead of per field.
- [x] Further separate rules and rule context from eachother.
- [x] Add type safety to field value in context / signal.
- [x] Add field types.
- [x] Map data types to field types.
- [x] Add properties and extensions to `useFieldContext`, such as
  - [x] `fieldContext.value`
  - [x] `fieldContext.setValue()`
  - [x] `fieldContext.isValid`
  - [x] `fieldContext.isApplicable`
- [ ] Add form scope signal such as `isSubmittingSignal`.
  - Including async support for submitting.
- [ ] Add child array forms.
- [ ] ❓ Add field groups with rules, such as applicability.
- [ ] Add more input components to demo.
  - [ ] Number input.
  - [ ] Toggle input.
- [ ] Make field types more specific than just data types.
- [ ] Create `DefaultForm` and `FieldValue` types for type safety when form interface is unknown.
  - Something like
    ```ts
      type FieldValue<T> = T extends Function ? never : T
      type DefaultForm = Record<string, FieldValue<...>>
    ```
- [ ] Add build and release pipeline.
- [ ] Make the repository public.
- [ ] Publish to npm.
- [ ] Add tests.
- [ ] Allow users to add custom fields.
- [ ] Allow users to add custom properties to existing field types.
