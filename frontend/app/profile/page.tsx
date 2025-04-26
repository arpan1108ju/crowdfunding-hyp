import { notFound } from "next/navigation"
import { CreditCard, User } from "lucide-react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"

export default async function ProfilePage() {

  const user = await getCurrentUser()

  if (!user) {
    notFound()
  }

  return (
    <div className="container mx-auto py-6">
      <h1 className="text-3xl font-bold mb-6">Profile</h1>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <User className="mr-2 h-5 w-5" />
              Account Information
            </CardTitle>
            <CardDescription>Your personal account details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Email</p>
              <p>{user.email}</p>
              {/* <p>abc@gmail.com</p> */}
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Role</p>
              <p className="capitalize">{user.role}</p>
              {/* <p className="capitalize">Admin</p> */}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <CreditCard className="mr-2 h-5 w-5" />
              Wallet
            </CardTitle>
            <CardDescription>Your current balance and token information</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Current Balance</p>
              <p className="text-2xl font-bold">$1,250.00</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Token Metadata</p>
              <p>Campaign Token (CPT)</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Conversion Rates</p>
              <div className="grid grid-cols-2 gap-2 mt-2">
                <div className="rounded-md border p-2">
                  <p className="text-xs text-muted-foreground">USD to CPT</p>
                  <p className="font-medium">1 USD = 10 CPT</p>
                </div>
                <div className="rounded-md border p-2">
                  <p className="text-xs text-muted-foreground">CPT to USD</p>
                  <p className="font-medium">10 CPT = 1 USD</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Separator className="my-8" />

      <div className="space-y-6">
        <h2 className="text-2xl font-bold">Payment History</h2>
        <div className="rounded-md border">
          <div className="p-4 grid grid-cols-4 font-medium">
            <div>Date</div>
            <div>Campaign</div>
            <div>Amount</div>
            <div>Status</div>
          </div>
          <Separator />
          <div className="p-4 grid grid-cols-4">
            <div>Apr 15, 2023</div>
            <div>Clean Water Initiative</div>
            <div>$50.00</div>
            <div className="text-green-600">Completed</div>
          </div>
          <Separator />
          <div className="p-4 grid grid-cols-4">
            <div>Mar 22, 2023</div>
            <div>Education for All</div>
            <div>$75.00</div>
            <div className="text-green-600">Completed</div>
          </div>
          <Separator />
          <div className="p-4 grid grid-cols-4">
            <div>Feb 10, 2023</div>
            <div>Renewable Energy Project</div>
            <div>$100.00</div>
            <div className="text-green-600">Completed</div>
          </div>
        </div>
      </div>
    </div>
  )
}
