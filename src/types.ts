// export type FormValues<TForm = any> = {
//   [K in keyof TForm]: TForm[K];
// };

export type FormValues = Record<string, unknown>;
