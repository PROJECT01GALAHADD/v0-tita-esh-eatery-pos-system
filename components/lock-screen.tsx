"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Lock } from "lucide-react"

interface LockScreenProps {
  onUnlock: (pin: string) => boolean
  user: any
}

export function LockScreen({ onUnlock, user }: LockScreenProps) {
  const [pin, setPin] = useState("")
  const [error, setError] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (onUnlock(pin)) {
      setPin("")
      setError("")
    } else {
      setError("Invalid PIN")
      setPin("")
    }
  }

  const handlePinChange = (value: string) => {
    if (value.length <= 4 && /^\d*$/.test(value)) {
      setPin(value)
      setError("")
    }
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
            <Lock className="w-8 h-8 text-blue-600" />
          </div>
          <CardTitle className="text-2xl">Screen Locked</CardTitle>
          <CardDescription>Enter your 4-digit PIN to unlock</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">{/* User icon and user details */}</div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Input
                type="password"
                placeholder="Enter 4-digit PIN"
                value={pin}
                onChange={(e) => handlePinChange(e.target.value)}
                className="text-center text-2xl tracking-widest"
                maxLength={4}
                autoFocus
              />
              {error && <p className="text-sm text-red-600 mt-1">{error}</p>}
            </div>

            <Button type="submit" className="w-full" disabled={pin.length !== 4}>
              Unlock
            </Button>
          </form>

          <div className="text-center">
            <p className="text-xs text-gray-500">Demo PIN: 1234</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
