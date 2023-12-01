import { ArrayFieldBase } from "@/fields"
import React, { useContext } from "react"

const ArrayFormItemContext = React.createContext<{
  itemId: number
  arrayField: ArrayFieldBase
} | null>(null)

export const ArrayFormItemContextProvider = ArrayFormItemContext.Provider

export const useArrayFieldItem = () => useContext(ArrayFormItemContext)
