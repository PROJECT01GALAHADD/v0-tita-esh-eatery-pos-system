"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Eye, EyeOff } from "lucide-react"
import Image from "next/image"

interface LoginPageProps {
  onLogin: (username: string, password: string) => boolean
}

export function LoginPage({ onLogin }: LoginPageProps) {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (onLogin(username, password)) {
      setError("")
    } else {
      setError("Invalid username or password")
    }
  }

  const demoAccounts = [
    { username: "admin", password: "admin123", role: "Administrator" },
    { username: "cashier", password: "cash123", role: "Cashier" },
    { username: "waiter", password: "wait123", role: "Waiter" },
    { username: "chef", password: "chef123", role: "Chef" },
    { username: "manager", password: "mgr123", role: "Manager" },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-500 via-yellow-400 to-yellow-300 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl grid md:grid-cols-2 gap-8">
        <Card className="w-full shadow-xl border-green-200">
          <CardHeader className="text-center bg-gradient-to-b from-white to-green-50">
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

        <Card className="shadow-xl border-green-200">
          <CardHeader className="bg-gradient-to-b from-white to-yellow-50">
            <CardTitle className="text-lg text-red-700 font-bold">Demo Accounts</CardTitle>
            <CardDescription className="text-green-700">
              Use these accounts to test different user roles
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="space-y-3">
              {demoAccounts.map((account) => (
                <div
                  key={account.username}
                  className="p-3 border border-yellow-200 rounded-lg cursor-pointer hover:bg-yellow-50 transition-colors"
                  onClick={() => {
                    setUsername(account.username)
                    setPassword(account.password)
                  }}
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-semibold text-red-700">{account.role}</p>
                      <p className="text-sm text-gray-600">
                        {account.username} / {account.password}
                      </p>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-red-300 text-red-600 hover:bg-red-50 bg-transparent"
                    >
                      Use
                    </Button>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 p-3 bg-green-50 rounded-lg border border-green-200">
              <p className="text-sm text-green-800 font-semibold">
                <strong>Lock Screen PIN:</strong> 1234
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
