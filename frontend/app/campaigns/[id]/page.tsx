import { notFound } from "next/navigation"
import { Users, Calendar, ArrowLeft } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { getCampaign } from "@/lib/services/campaign-service"

import { DonateForm } from "@/components/donate-form"
import { AdminActions } from "@/components/admin-actions"
import { CountdownTimer } from "@/components/remaining-timer"
import { useAuth } from "@/hooks/use-auth"


export default async function CampaignPage({
  params,
}: {
  params: { id: string }
}) {
    const {session} = useAuth();
  // const { session } = useAuth();

  try {
    const campaign = await getCampaign(params.id)
    const isAdmin = session?.role === "admin" || session?.role === "superadmin"
    const percentRaised = Math.round((campaign.raised / campaign.target) * 100)

    return (
      <div className="container mx-auto py-6">
        <Button variant="ghost" className="mb-6" asChild>
          <a href="/">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to campaigns
          </a>
        </Button>

        <div className="grid gap-6 md:grid-cols-2">
          <div>
            <img
              src={campaign.image || "/placeholder.svg"}
              alt={campaign.title}
              className="w-full rounded-lg object-cover"
              style={{ height: "300px" }}
            />
          </div>

          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold">{campaign.title}</h1>
              <p className="mt-2 text-lg text-muted-foreground">{campaign.description}</p>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-lg font-medium">
                  ${campaign.raised.toLocaleString()} raised of ${campaign.target.toLocaleString()}
                </span>
                <span className="text-lg font-medium">{percentRaised}%</span>
              </div>
              <Progress value={percentRaised} className="h-2" />
            </div>

            <div className="flex justify-between">
              <div className="flex items-center">
                <Users className="mr-2 h-5 w-5 text-muted-foreground" />
                <span className="text-lg">{campaign.backers} backers</span>
              </div>
              {/* <div className="flex items-center">
                <Calendar className="mr-2 h-5 w-5 text-muted-foreground" />
                <span className="text-lg">{campaign.daysLeft} days left</span>
              </div> */}
              <div className="flex items-center">
  <Calendar className="mr-2 h-5 w-5 text-muted-foreground" />
  <span className="text-lg">{campaign.daysLeft} days left</span>
</div>
<CountdownTimer daysLeft={campaign.daysLeft} />

            </div>

            {session ? (
              <DonateForm campaignId={params.id} />
            ) : (
              <Button asChild className="w-full">
                <a href="/login">Login to Donate</a>
              </Button>
            )}

            {isAdmin && <AdminActions campaignId={params.id} />}
          </div>
        </div>

        <Separator className="my-8" />

        <div className="space-y-6">
          <h2 className="text-2xl font-bold">About this campaign</h2>
          <p className="text-muted-foreground">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et
            dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex
            ea commodo consequat.
          </p>
          <p className="text-muted-foreground">
            Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
            Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est
            laborum.
          </p>
        </div>
      </div>
    )
  } catch (error) {
    notFound()
  }
}
