export function useLocalStorageStore(name: string) {
  const itemName = `values-${name}`

  return {
    getValues: () => {
      const values = JSON.parse(
        localStorage.getItem(itemName) ?? "{}"
      ) as Record<string, unknown>
      console.log("Loaded values from localStorage", values)
      return values
    },

    setValues: async (values: Record<string, unknown>) => {
      console.log("Saving values to localStorage", values)
      await sleep(1000)
      localStorage.setItem(itemName, JSON.stringify(values))
    },
  }
}

export function clearStorage() {
  Object.keys(localStorage).forEach((key) => {
    if (key.startsWith("values-")) {
      localStorage.removeItem(key)
    }
  })
}

function sleep(time: number) {
  return new Promise((resolve) => {
    setTimeout(resolve, time)
  })
}
