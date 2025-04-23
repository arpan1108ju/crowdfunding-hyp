import { CampaignList } from "@/components/campaign-list"
import { getCurrentUser } from "@/lib/auth"

export default async function Home() {
  const user = await getCurrentUser()

  return (
    <div className="container mx-auto py-6">
      <h1 className="text-3xl font-bold mb-6">All Campaigns</h1>
      <CampaignList />
    </div>
  )
}
