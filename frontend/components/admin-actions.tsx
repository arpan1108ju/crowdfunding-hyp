"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Trash, Ban, CreditCard } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { useToast } from "@/components/ui/use-toast"

export function AdminActions({ campaignId }: { campaignId: string }) {
  const router = useRouter()
  const { toast } = useToast()
  const [isWithdrawing, setIsWithdrawing] = useState(false)
  const [isCancelling, setIsCancelling] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  const handleWithdraw = async () => {
    setIsWithdrawing(true)
    try {
      // In a real app, you would call an API to withdraw funds
      await new Promise((resolve) => setTimeout(resolve, 1000))
      toast({
        title: "Success",
        description: "Funds have been withdrawn successfully",
      })
      router.refresh()
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to withdraw funds",
        variant: "destructive",
      })
    } finally {
      setIsWithdrawing(false)
    }
  }

  const handleCancel = async () => {
    setIsCancelling(true)
    try {
      // In a real app, you would call an API to cancel the campaign
      await new Promise((resolve) => setTimeout(resolve, 1000))
      toast({
        title: "Success",
        description: "Campaign has been cancelled successfully",
      })
      router.push("/")
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to cancel campaign",
        variant: "destructive",
      })
    } finally {
      setIsCancelling(false)
    }
  }

  const handleDelete = async () => {
    setIsDeleting(true)
    try {
      // In a real app, you would call an API to delete the campaign
      await new Promise((resolve) => setTimeout(resolve, 1000))
      toast({
        title: "Success",
        description: "Campaign has been deleted successfully",
      })
      router.push("/")
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete campaign",
        variant: "destructive",
      })
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <div className="flex flex-col space-y-2">
      <h3 className="text-lg font-medium">Admin Actions</h3>
      <div className="flex flex-wrap gap-2">
        <Button variant="outline" onClick={handleWithdraw} disabled={isWithdrawing}>
          <CreditCard className="mr-2 h-4 w-4" />
          {isWithdrawing ? "Processing..." : "Withdraw Funds"}
        </Button>

        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button
              variant="outline"
              className="border-orange-200 text-orange-600 hover:bg-orange-50 hover:text-orange-700"
            >
              <Ban className="mr-2 h-4 w-4" />
              Cancel Campaign
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Cancel Campaign</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to cancel this campaign? This action will stop all future donations but will not
                refund existing ones.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleCancel}
                disabled={isCancelling}
                className="bg-orange-600 hover:bg-orange-700"
              >
                {isCancelling ? "Processing..." : "Yes, cancel campaign"}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="outline" className="border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700">
              <Trash className="mr-2 h-4 w-4" />
              Delete Campaign
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Campaign</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete this campaign? This action cannot be undone and all campaign data will
                be permanently removed.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleDelete} disabled={isDeleting} className="bg-red-600 hover:bg-red-700">
                {isDeleting ? "Processing..." : "Yes, delete campaign"}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  )
}
