import { ArrayFieldBase } from "@/fields"
import React, { useContext } from "react"

interface IArrayContext {
  field: ArrayFieldBase
}

const ArrayFormContext = React.createContext<IArrayContext | null>(null)

export const ArrayFormContextProvider = ArrayFormContext.Provider

export const useArrayFormContext = () => useContext(ArrayFormContext)

interface IArrayItemContext {
  index: number
}

const ArrayFormItemContext = React.createContext<IArrayItemContext | null>(null)

export const ArrayFormItemContextProvider = ArrayFormItemContext.Provider

export const useArrayFormItemContext = () => useContext(ArrayFormItemContext)
