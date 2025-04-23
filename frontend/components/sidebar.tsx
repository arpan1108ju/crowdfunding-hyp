"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { LayoutDashboard, CreditCard, Users, Settings, PlusCircle, Menu, X } from "lucide-react"

import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { useAuth } from "@/components/providers/app-provider"

export function Sidebar() {
  const pathname = usePathname()
  // const { user } = useAuth()
  const { user } = useAuth()
  const [open, setOpen] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  // if (!mounted || loading) return null
 console.log(user)
  const isAdmin = user?.role === "admin"
  const isSuperAdmin = user?.role === "superadmin"

  const routes = (() => {
    const base = [
      {
        label: "Dashboard",
        icon: LayoutDashboard,
        href: "/",
        active: pathname === "/",
      },
    ]

    if (!user) {
      return base
    }

    const profile = {
      label: "Profile",
      icon: Users,
      href: "/profile",
      active: pathname === "/profile",
    }

    const campaigns = {
      label: "Campaigns",
      icon: LayoutDashboard,
      href: "/campaigns",
      active: pathname === "/campaigns",
    }

    const payments = {
      label: "Payments",
      icon: CreditCard,
      href: "/payments",
      active: pathname === "/payments",
    }

    const adminPanel = {
      label: "Admin",
      icon: Users,
      href: "/admin",
      active: pathname === "/admin",
    }

    const superAdminPanel = {
      label: "Super Admin",
      icon: Settings,
      href: "/superadmin",
      active: pathname === "/superadmin",
    }

    if (isSuperAdmin) {
      return [...base, profile, campaigns, payments, adminPanel, superAdminPanel]
    }

    if (isAdmin) {
      return [...base, profile, campaigns, adminPanel]
    }

    return [...base, profile]
  })()

  return (
    <>
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild className="md:hidden">
          <Button variant="outline" size="icon" className="absolute left-4 top-3 z-40">
            <Menu className="h-5 w-5" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="p-0">
          <div className="flex h-full flex-col">
            <div className="flex h-14 items-center border-b px-4">
              <Link href="/" className="flex items-center gap-2" onClick={() => setOpen(false)}>
                <span className="text-xl font-bold">CampaignPlatform</span>
              </Link>
              <Button variant="ghost" size="icon" className="ml-auto" onClick={() => setOpen(false)}>
                <X className="h-5 w-5" />
              </Button>
            </div>
            <ScrollArea className="flex-1">
              <div className="flex flex-col gap-2 p-4">
                {routes.map((route) => (
                  <Button key={route.href} variant={route.active ? "secondary" : "ghost"} className="justify-start" asChild>
                    <Link href={route.href} onClick={() => setOpen(false)}>
                      <route.icon className="mr-2 h-5 w-5" />
                      {route.label}
                    </Link>
                  </Button>
                ))}
                {isAdmin && (
                  <Button className="justify-start mt-4" asChild>
                    <Link href="/campaigns/new" onClick={() => setOpen(false)}>
                      <PlusCircle className="mr-2 h-5 w-5" />
                      Create Campaign
                    </Link>
                  </Button>
                )}
              </div>
            </ScrollArea>
          </div>
        </SheetContent>
      </Sheet>

      <aside className="hidden w-64 flex-col border-r bg-background md:flex">
        <div className="flex h-14 items-center border-b px-4">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-xl font-bold">CampaignPlatform</span>
          </Link>
        </div>
        <ScrollArea className="flex-1">
          <div className="flex flex-col gap-2 p-4">
            {routes.map((route) => (
              <Button key={route.href} variant={route.active ? "secondary" : "ghost"} className="justify-start" asChild>
                <Link href={route.href}>
                  <route.icon className="mr-2 h-5 w-5" />
                  {route.label}
                </Link>
              </Button>
            ))}
            {isAdmin && (
              <Button className="justify-start mt-4" asChild>
                <Link href="/campaigns/new">
                  <PlusCircle className="mr-2 h-5 w-5" />
                  Create Campaign
                </Link>
              </Button>
            )}
          </div>
        </ScrollArea>
      </aside>
    </>
  )
}
