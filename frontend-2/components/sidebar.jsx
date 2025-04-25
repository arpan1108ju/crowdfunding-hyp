"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { LayoutDashboard, Users, PlusCircle, Menu, X, ChevronLeft, ChevronRight, Flag, Shield, ShieldPlus } from "lucide-react"

import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { useAuth } from "@/hooks/use-auth"
import { ROLE } from "@/lib/constants"

export function Sidebar() {
  const pathname = usePathname()
  const { session } = useAuth()
  const [open, setOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [collapsed, setCollapsed] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])
  const isSuperAdmin = session?.role === ROLE.SUPERADMIN;
  const isAdmin = session?.role === ROLE.ADMIN;

  const routes = (() => {
    const base = [
      {
        label: "Dashboard",
        icon: LayoutDashboard,
        href: "/",
        active: pathname === "/",
      },
    ]

    if (!session) {
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
      icon: Flag,
      href: "/campaign",
      active: pathname === "/campaign",
    }

    const createCampaign = {
      label: "Create Campaign",
      icon: PlusCircle,
      href: "/campaign/create",
      active: pathname === "/campaign/create",
    }

    const adminPanel = {
      label: "Admin",
      icon: Shield,
      href: "/admin",
      active: pathname === "/admin",
    }

    const superAdminPanel = {
      label: "Super Admin",
      icon: ShieldPlus,
      href: "/superadmin",
      active: pathname === "/superadmin",
    }

    if (isSuperAdmin) {
      return [...base, profile, campaigns, createCampaign, adminPanel, superAdminPanel]
    }

    if (isAdmin) {
      return [...base, profile, campaigns, createCampaign, adminPanel]
    }

    return [...base, profile]
  })()

  useEffect(() => {

    setMounted(true)
  }, [])  

  if(!mounted){
    return null
  }

  const NavItem = ({ route }) => {
    if (collapsed) {
      return (
        <TooltipProvider delayDuration={0}>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant={route.active ? "secondary" : "ghost"} 
                className="justify-start px-2" 
                asChild
              >
                <Link href={route.href} className="flex items-center">
                  <route.icon className="h-5 w-5" />
                </Link>
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right" className="ml-1">
              {route.label}
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )
    }

    return (
      <Button 
        variant={route.active ? "secondary" : "ghost"} 
        className="justify-start" 
        asChild
      >
        <Link href={route.href} className="flex items-center">
          <route.icon className="h-5 w-5 mr-2" />
          <span>{route.label}</span>
        </Link>
      </Button>
    )
  }

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
            <div className="flex h-16 items-center border-b px-4">
              <Link href="/" className="flex items-center gap-2" onClick={() => setOpen(false)}>
                <span className="text-xl font-bold">Actions</span>
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
              </div>
            </ScrollArea>
          </div>
        </SheetContent>
      </Sheet>

      <div className={`
        hidden md:flex flex-shrink-0 
        transition-all duration-300 ease-in-out
        ${collapsed ? 'w-16' : 'w-64'}
      `}>
        <div className="flex flex-col w-full border-r bg-background">
          <div className="flex h-16 items-center border-b px-4 justify-between">
            {!collapsed && (
              <Link href="/" className="flex items-center gap-2">
                <span className="text-xl font-bold">Actions</span>
              </Link>
            )}
            <TooltipProvider delayDuration={0}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => setCollapsed(!collapsed)}
                    className={`${collapsed ? 'mx-auto' : 'ml-auto'}`}
                  >
                    {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="right" className="ml-1">
                  {collapsed ? 'Expand' : 'Collapse'} Actions
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <ScrollArea className="flex-1">
            <div className="flex flex-col gap-2 p-4">
              {routes.map((route) => (
                <NavItem key={route.href} route={route} />
              ))}
            </div>
          </ScrollArea>
        </div>
      </div>

      <div className={`ml-${collapsed ? '16' : '64'} transition-all duration-300`}>
        {/* Your main content goes here */}
      </div>
    </>
  )
}
