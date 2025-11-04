"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Progress } from "@/components/ui/progress"
import { CreditCard, TrendingUp, TrendingDown, DollarSign, Plus } from "lucide-react"
import { SidebarProvider } from "@/components/ui/sidebar"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { useAuth } from "@/components/auth-provider"

const cashRegisters = [
  {
    id: "REG-001",
    name: "Main Counter",
    location: "Front Desk",
    status: "Active",
    todayIncome: 1250.0,
    todayExpense: 320.0,
    totalTransactions: 45,
    lastTransaction: "2:30 PM",
    operator: "John Doe",
  },
  {
    id: "REG-002",
    name: "Bar Counter",
    location: "Bar Area",
    status: "Active",
    todayIncome: 890.0,
    todayExpense: 180.0,
    totalTransactions: 32,
    lastTransaction: "2:15 PM",
    operator: "Jane Smith",
  },
  {
    id: "REG-003",
    name: "Takeaway Counter",
    location: "Side Entrance",
    status: "Inactive",
    todayIncome: 0.0,
    todayExpense: 0.0,
    totalTransactions: 0,
    lastTransaction: "N/A",
    operator: "N/A",
  },
  {
    id: "REG-004",
    name: "VIP Section",
    location: "Private Dining",
    status: "Active",
    todayIncome: 2100.0,
    todayExpense: 450.0,
    totalTransactions: 18,
    lastTransaction: "1:45 PM",
    operator: "Mike Johnson",
  },
]

const dailyTransactions = [
  { time: "9:00 AM", register: "Main Counter", type: "Income", amount: 45.5, description: "Order #001" },
  { time: "9:15 AM", register: "Bar Counter", type: "Income", amount: 28.0, description: "Beverages" },
  { time: "9:30 AM", register: "Main Counter", type: "Expense", amount: 15.0, description: "Cash withdrawal" },
  { time: "10:00 AM", register: "VIP Section", type: "Income", amount: 125.0, description: "Order #002" },
  { time: "10:30 AM", register: "Main Counter", type: "Income", amount: 67.5, description: "Order #003" },
]

export default function CashRegistersPage() {
  const { user } = useAuth()

  // Check permissions - cash registers accessible by administrator, manager, cashier
  if (!user || !["administrator", "manager", "cashier"].includes(user.role)) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Access Denied</h1>
          <p className="text-muted-foreground">You don't have permission to access this page.</p>
        </div>
      </div>
    )
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active":
        return "bg-green-100 text-green-800"
      case "Inactive":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getTransactionColor = (type: string) => {
    return type === "Income" ? "text-green-600" : "text-red-600"
  }

  const totalIncome = cashRegisters.reduce((sum, reg) => sum + reg.todayIncome, 0)
  const totalExpense = cashRegisters.reduce((sum, reg) => sum + reg.todayExpense, 0)
  const totalTransactions = cashRegisters.reduce((sum, reg) => sum + reg.totalTransactions, 0)
  const activeRegisters = cashRegisters.filter((reg) => reg.status === "Active").length

  return (
    <SidebarProvider>
      <AppSidebar />
      <main className="flex-1">
        <div className="flex flex-col">
          <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <h1 className="text-xl font-semibold">Cash Registers</h1>
          </header>

          <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-3xl font-bold tracking-tight">Cash Registers</h2>
                <p className="text-muted-foreground">Monitor all cash register activities and transactions</p>
              </div>
              {["administrator", "manager"].includes(user.role) && (
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Register
                </Button>
              )}
            </div>

            <div className="grid gap-4 md:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Active Registers</CardTitle>
                  <CreditCard className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{activeRegisters}</div>
                  <p className="text-xs text-muted-foreground">out of {cashRegisters.length} total</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Income</CardTitle>
                  <TrendingUp className="h-4 w-4 text-green-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">${totalIncome.toFixed(2)}</div>
                  <p className="text-xs text-muted-foreground">Today's total income</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
                  <TrendingDown className="h-4 w-4 text-red-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-red-600">${totalExpense.toFixed(2)}</div>
                  <p className="text-xs text-muted-foreground">Today's total expenses</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Transactions</CardTitle>
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{totalTransactions}</div>
                  <p className="text-xs text-muted-foreground">Total transactions today</p>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Cash Registers Overview</CardTitle>
                <CardDescription>All cash registers and their current status</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Register ID</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Location</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Today's Income</TableHead>
                      <TableHead>Today's Expenses</TableHead>
                      <TableHead>Transactions</TableHead>
                      <TableHead>Operator</TableHead>
                      <TableHead>Last Transaction</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {cashRegisters.map((register) => (
                      <TableRow key={register.id}>
                        <TableCell className="font-medium">{register.id}</TableCell>
                        <TableCell>{register.name}</TableCell>
                        <TableCell>{register.location}</TableCell>
                        <TableCell>
                          <Badge className={getStatusColor(register.status)}>{register.status}</Badge>
                        </TableCell>
                        <TableCell className="text-green-600 font-medium">${register.todayIncome.toFixed(2)}</TableCell>
                        <TableCell className="text-red-600 font-medium">${register.todayExpense.toFixed(2)}</TableCell>
                        <TableCell>{register.totalTransactions}</TableCell>
                        <TableCell>{register.operator}</TableCell>
                        <TableCell>{register.lastTransaction}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Register Performance</CardTitle>
                  <CardDescription>Income distribution across registers</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {cashRegisters
                    .filter((reg) => reg.status === "Active")
                    .map((register) => {
                      const percentage = totalIncome > 0 ? (register.todayIncome / totalIncome) * 100 : 0
                      return (
                        <div key={register.id} className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span>{register.name}</span>
                            <span className="font-medium">${register.todayIncome.toFixed(2)}</span>
                          </div>
                          <Progress value={percentage} className="h-2" />
                          <div className="text-xs text-muted-foreground">{percentage.toFixed(1)}% of total income</div>
                        </div>
                      )
                    })}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Recent Transactions</CardTitle>
                  <CardDescription>Latest transactions across all registers</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {dailyTransactions.slice(0, 8).map((transaction, index) => (
                      <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <div className="font-medium">{transaction.register}</div>
                          <div className="text-sm text-muted-foreground">
                            {transaction.time} - {transaction.description}
                          </div>
                        </div>
                        <div className={`font-medium ${getTransactionColor(transaction.type)}`}>
                          {transaction.type === "Income" ? "+" : "-"}${transaction.amount.toFixed(2)}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </SidebarProvider>
  )
}
