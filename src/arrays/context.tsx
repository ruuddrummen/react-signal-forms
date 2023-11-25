import React, { useContext } from "react"

export interface IArrayItemContext {
  index: number
}

export const ArrayItemContext = React.createContext<IArrayItemContext | null>(
  null
)

export const ArrayItemContextProvider = ArrayItemContext.Provider

export const useArrayItemContext = useContext(ArrayItemContext)
