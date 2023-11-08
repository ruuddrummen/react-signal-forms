import { FormValues } from "@/signal-forms";

export function useLocalStorageStore() {
  return {
    getValues: () => {
      return JSON.parse(
        localStorage.getItem("FormState") ?? "{}"
      ) as FormValues;
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
