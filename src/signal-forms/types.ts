export type FormValues<TForm = any> = {
  [K in keyof TForm]: TForm[K];
};
