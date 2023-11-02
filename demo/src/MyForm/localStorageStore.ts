import { FormValues } from "react-signal-forms";

export function useLocalStorageStore() {
  return {
    getValues: () => {
      const values = JSON.parse(
        localStorage.getItem("FormState") ?? "{}"
      ) as FormValues;
      console.log("Loaded values from localStorage", values);
      return values;
    },

    setValues: async (values: FormValues) => {
      console.log("Saving values to localStorage", values);
      await sleep(1000);
      localStorage.setItem("FormState", JSON.stringify(values));
    },
  };
}

function sleep(time: number) {
  return new Promise((resolve) => {
    setTimeout(resolve, time);
  });
}
