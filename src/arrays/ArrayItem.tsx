import { ArrayFieldBase } from "@/fields"
import React, { PropsWithChildren } from "react"
import { ArrayFormItemContextProvider } from "./reactContext"

export interface ArrayItemDescriptor {
  id: number
  arrayField: ArrayFieldBase
  remove: () => void
}

export const ArrayItem: React.FC<
  PropsWithChildren<{ item: ArrayItemDescriptor }>
> = ({ item, children }) => {
  return (
    <ArrayFormItemContextProvider
      value={{ itemId: item.id, arrayField: item.arrayField }}
    >
      {children}
    </ArrayFormItemContextProvider>
  )
}
