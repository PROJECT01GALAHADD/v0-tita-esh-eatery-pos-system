"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Eye, EyeOff } from "lucide-react"
import Image from "next/image"
// Demo accounts UI removed; real accounts are auto-seeded

interface LoginPageProps {
  onLoginAction: (username: string, password: string) => Promise<boolean>
}

export function LoginPage({ onLoginAction }: LoginPageProps) {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const ok = await onLoginAction(username, password)
    if (ok) {
      setError("")
    } else {
      setError("Invalid username or password")
    }
  }

  // Real accounts are auto-created on first load.
  // Default usernames/passwords:
  // admin/admin123, manager/mgr123, cashierwaiter/cw123, kitchen/kitchen123

  return (
    <div className="min-h-screen bg-linear-to-br from-red-500 via-yellow-400 to-yellow-300 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl grid md:grid-cols-2 gap-8">
        <Card className="w-full shadow-xl border-green-200 md:col-span-2">
          <CardHeader className="text-center bg-linear-to-b from-white to-green-50">
            <div className="mx-auto w-20 h-20 mb-4 relative">
              <Image
                src="/tita-esh-logo.png"
                alt="Tita Esh Eatery Logo"
                width={80}
                height={80}
                className="rounded-full shadow-lg"
                priority
              />
            </div>
            <CardTitle className="text-3xl font-bold text-red-700">Tita Esh Eatery</CardTitle>
            <CardDescription className="text-green-700 font-medium">POS System - Since 2004</CardDescription>
            <p className="text-xs text-gray-600 mt-2">Sign in to access your restaurant management system</p>
          </CardHeader>
          <CardContent className="pt-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username" className="text-gray-700 font-semibold">
                  Username
                </Label>
                <Input
                  id="username"
                  type="text"
                  placeholder="Enter your username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="border-green-300 focus:border-red-500"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-gray-700 font-semibold">
                  Password
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="border-green-300 focus:border-red-500"
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
              </div>

              {error && <p className="text-sm text-red-600 font-semibold">{error}</p>}

              <Button type="submit" className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold">
                Sign In
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
