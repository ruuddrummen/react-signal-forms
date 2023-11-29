import { ArrayFieldBase } from "@/fields"
import React, { useContext } from "react"

interface IArrayContext {
  arrayField: ArrayFieldBase
}

const ArrayFormContext = React.createContext<IArrayContext | null>(null)

export const ArrayFormContextProvider = ArrayFormContext.Provider

export const useArrayFormContext = () => useContext(ArrayFormContext)

export interface ArrayItemDescriptor {
  id: number
  ref: (ref: HTMLDivElement) => void
}

const ArrayFormItemContext = React.createContext<{ id: number } | null>(null)

export const ArrayFormItemContextProvider = ArrayFormItemContext.Provider

export const useArrayFormItem = () => useContext(ArrayFormItemContext)
