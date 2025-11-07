"use client"

import { createContext, useContext } from "react"
import type { ReactNode } from "react"

interface RadioGroupContextValue {
  value?: string
  onValueChange?: (value: string) => void
}

const RadioGroupContext = createContext<RadioGroupContextValue | null>(null)

export function RadioGroup({
  value,
  onValueChange,
  children,
  className,
}: {
  value?: string
  onValueChange?: (value: string) => void
  children: ReactNode
  className?: string
}) {
  return (
    <div className={className} role="radiogroup">
      <RadioGroupContext.Provider value={{ value, onValueChange }}>
        {children}
      </RadioGroupContext.Provider>
    </div>
  )
}

export function RadioGroupItem({
  value,
  id,
  className,
}: {
  value: string
  id?: string
  className?: string
}) {
  const ctx = useContext(RadioGroupContext)
  const checked = ctx?.value === value

  return (
    <input
      type="radio"
      id={id}
      className={className}
      checked={checked}
      onChange={() => ctx?.onValueChange?.(value)}
    />
  )
}

