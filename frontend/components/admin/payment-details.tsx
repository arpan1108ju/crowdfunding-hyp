"use client"

import { useState } from "react"
import { Download, Filter } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

type Payment = {
  id: string
  campaignId: string
  campaignName: string
  userId: string
  userEmail: string
  amount: number
  date: string
  status: "completed" | "pending" | "failed"
}

export function PaymentDetails() {
  const [searchTerm, setSearchTerm] = useState("")

  // Mock data - would come from API in real app
  const payments: Payment[] = [
    {
      id: "1",
      campaignId: "1",
      campaignName: "Clean Water Initiative",
      userId: "1",
      userEmail: "user1@example.com",
      amount: 50,
      date: "2023-04-15",
      status: "completed",
    },
    {
      id: "2",
      campaignId: "2",
      campaignName: "Education for All",
      userId: "2",
      userEmail: "user2@example.com",
      amount: 75,
      date: "2023-03-22",
      status: "completed",
    },
    {
      id: "3",
      campaignId: "3",
      campaignName: "Renewable Energy Project",
      userId: "3",
      userEmail: "user3@example.com",
      amount: 100,
      date: "2023-02-10",
      status: "completed",
    },
    {
      id: "4",
      campaignId: "1",
      campaignName: "Clean Water Initiative",
      userId: "4",
      userEmail: "admin1@example.com",
      amount: 200,
      date: "2023-01-05",
      status: "completed",
    },
  ]

  const filteredPayments = payments.filter(
    (payment) =>
      payment.campaignName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.userEmail.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Input
          placeholder="Search payments..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
        <div className="flex gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <Filter className="mr-2 h-4 w-4" />
                Filter
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>All Payments</DropdownMenuItem>
              <DropdownMenuItem>Completed</DropdownMenuItem>
              <DropdownMenuItem>Pending</DropdownMenuItem>
              <DropdownMenuItem>Failed</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Button variant="outline" size="sm">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Campaign</TableHead>
              <TableHead>User</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredPayments.length > 0 ? (
              filteredPayments.map((payment) => (
                <TableRow key={payment.id}>
                  <TableCell>{new Date(payment.date).toLocaleDateString()}</TableCell>
                  <TableCell>{payment.campaignName}</TableCell>
                  <TableCell>{payment.userEmail}</TableCell>
                  <TableCell>${payment.amount.toFixed(2)}</TableCell>
                  <TableCell>
                    <div
                      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                        payment.status === "completed"
                          ? "bg-green-100 text-green-800"
                          : payment.status === "pending"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-red-100 text-red-800"
                      }`}
                    >
                      <span className="capitalize">{payment.status}</span>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center">
                  No payments found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
