"use client"

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { useRouter } from "next/navigation"
import * as z from "zod"
import { DollarSign } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useToast } from "@/components/ui/use-toast"
import { donateToCampaign } from "@/lib/services/campaign-service"
import { useAuth } from "@/components/providers/app-provider"

const formSchema = z.object({
  amount: z.string().refine(
    (val) => {
      const num = Number.parseFloat(val)
      return !isNaN(num) && num > 0
    },
    { message: "Please enter a valid amount" },
  ),
})

export function DonateForm({ campaignId }: { campaignId: string }) {
  const router = useRouter()
  const { toast } = useToast()
  const { user } = useAuth()
  const [isLoading, setIsLoading] = useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      amount: "",
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!user) {
      toast({
        title: "Error",
        description: "You must be logged in to donate",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)
    try {
      await donateToCampaign(campaignId, Number.parseFloat(values.amount), user.id)
      toast({
        title: "Success",
        description: `Thank you for your donation of $${values.amount}!`,
      })
      form.reset()
      router.refresh()
    } catch (error) {
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
      <div className="relative">
        <DollarSign className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
        <Input placeholder="Enter donation amount" className="pl-10" {...form.register("amount")} />
        {form.formState.errors.amount && (
          <p className="mt-1 text-sm text-red-500">{form.formState.errors.amount.message}</p>
        )}
      </div>
      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? "Processing..." : "Donate Now"}
      </Button>
    </form>
  )
}
