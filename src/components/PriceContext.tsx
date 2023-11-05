import React, { createContext, ReactNode, useContext, useState } from 'react'

interface PriceContextType {
  priceState: string
  setPriceState: (price: string) => void
}
export const PriceContext = createContext<PriceContextType | undefined>(undefined)

export function PriceProvider({ children }: { children: ReactNode }) {
  const [priceState, setPriceState] = useState('$')

  return <PriceContext.Provider value={{ priceState, setPriceState }}>{children}</PriceContext.Provider>
}
