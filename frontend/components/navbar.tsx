// "use client"

// import { useState, useEffect } from "react"
// import Link from "next/link"
// import { usePathname } from "next/navigation"
// import { Search, User, Moon, Sun } from "lucide-react"

// import { Button } from "@/components/ui/button"
// import { Input } from "@/components/ui/input"
// import { useTheme } from "@/components/theme-provider"
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuSeparator,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu"
// import { useAuth } from "@/components/providers/app-provider"
// import { logoutUser } from "@/lib/auth"

// export function Navbar() {
//   const pathname = usePathname()
//   const { theme, setTheme } = useTheme()
//   const { user } = useAuth()
//   const [mounted, setMounted] = useState(false)

//   // Avoid hydration mismatch
//   useEffect(() => {
//     setMounted(true)
//   }, [])

//   if (!mounted) {
//     return null
//   }

//   return (
//     <header className="sticky top-0 z-10 w-full border-b bg-background">
//       <div className="flex h-16 items-center px-4">
//         <div className="flex items-center gap-2 md:w-64">
//           <Link href="/" className="flex items-center gap-2">
//             <span className="text-xl font-bold">CampaignPlatform</span>
//           </Link>
//         </div>
//         <div className="flex flex-1 items-center gap-4 md:gap-8">
//           <form className="flex-1 md:flex-initial">
//             <div className="relative">
//               <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
//               <Input
//                 type="search"
//                 placeholder="Search campaigns..."
//                 className="w-full rounded-lg bg-background pl-8 md:w-[300px] lg:w-[400px]"
//               />
//             </div>
//           </form>
//           <nav className="hidden gap-6 md:flex">
//             <Link
//               href="/"
//               className={`text-sm font-medium ${
//                 pathname === "/" ? "text-foreground" : "text-muted-foreground"
//               } transition-colors hover:text-foreground`}
//             >
//               Home
//             </Link>
//             <Link href="/about" className="text-sm font-medium hover:underline">
//             About
//             </Link>

//           </nav>
//         </div>
//         <div className="flex items-center gap-4">
//           <Button variant="ghost" size="icon" onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>
//             {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
//             <span className="sr-only">Toggle theme</span>
//           </Button>
//           {user ? (
//             <DropdownMenu>
//               <DropdownMenuTrigger asChild>
//                 <Button variant="ghost" className="relative h-8 w-8 rounded-full">
//                   <Avatar className="h-8 w-8">
//                     <AvatarImage src="/placeholder.svg?height=32&width=32" alt={user.email} />
//                     <AvatarFallback>{user.email.charAt(0).toUpperCase()}</AvatarFallback>
//                   </Avatar>
//                 </Button>
//               </DropdownMenuTrigger>
//               <DropdownMenuContent className="w-56" align="end" forceMount>
//                 <div className="flex flex-col space-y-1 p-2">
//                   <p className="text-sm font-medium leading-none">Hi, {user.email}</p>
//                   <p className="text-xs leading-none text-muted-foreground">{user.role}</p>
//                 </div>
//                 <DropdownMenuSeparator />
//                 <DropdownMenuItem asChild>
//                   <Link href="/profile">
//                     <User className="mr-2 h-4 w-4" />
//                     <span>Profile</span>
//                   </Link>
//                 </DropdownMenuItem>
//                 <DropdownMenuSeparator />
//                 <DropdownMenuItem
//                   className="cursor-pointer"
//                   onSelect={async (e) => {
//                     e.preventDefault()
//                     await logoutUser()
//                     window.location.href = "/login"
//                   }}
//                 >
//                   Log out
//                 </DropdownMenuItem>
//               </DropdownMenuContent>
//             </DropdownMenu>
//           ) : (
//             <Button asChild>
//               <Link href="/login">Login</Link>
//             </Button>
//           )}
//         </div>
//       </div>
//     </header>
//   )
// }


"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Search, User, Moon, Sun } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useTheme } from "@/components/theme-provider"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useAuth } from "@/hooks/use-auth"

export function Navbar() {
  const pathname = usePathname()
  const { theme, setTheme } = useTheme()
  const { session,logout } = useAuth();
  const [mounted, setMounted] = useState(false)

  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState<string[]>([])
  const [showResults, setShowResults] = useState(false)

  // Sample campaigns list
  const campaigns = [
    "Food Drive",
    "Save the Forest",
    "Water for All",
    "Tree Plantation",
    "Blood Donation",
  ]

  const handleSearch = () => {
    const results = campaigns.filter((campaign) =>
      campaign.toLowerCase().includes(searchQuery.toLowerCase())
    )
    setSearchResults(results)
    setShowResults(true)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value)
    if (e.target.value === "") {
      setShowResults(false)
      setSearchResults([])
    }
  }

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  return (
    <header className="sticky top-0 z-10 w-full border-b bg-background">
      <div className="flex h-16 items-center px-4">
        <div className="flex items-center gap-2 md:w-64">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-xl font-bold">CampaignPlatform</span>
          </Link>
        </div>
        <div className="flex flex-1 items-center gap-4 md:gap-8">
          <form className="flex-1 md:flex-initial relative" onSubmit={(e) => e.preventDefault()}>
            <div className="relative flex items-center">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search campaigns..."
                className="w-full rounded-lg bg-background pl-8 pr-10 md:w-[300px] lg:w-[400px]"
                value={searchQuery}
                onChange={handleInputChange}
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute right-1.5 top-1.5 h-6 w-6"
                onClick={handleSearch}
              >
                <Search className="h-4 w-4" />
              </Button>
            </div>
            {showResults && (
              <div className="absolute z-10 mt-1 w-full rounded-lg border bg-white p-2 shadow">
                {searchResults.length > 0 ? (
                  searchResults.map((result, idx) => (
                    <div key={idx} className="p-1 text-sm hover:bg-muted cursor-pointer">
                      {result}
                    </div>
                  ))
                ) : (
                  <div className="p-1 text-sm text-muted-foreground">No matches found.</div>
                )}
              </div>
            )}
          </form>
          <nav className="hidden gap-6 md:flex">
            <Link
              href="/"
              className={`text-sm font-medium ${
                pathname === "/" ? "text-foreground" : "text-muted-foreground"
              } transition-colors hover:text-foreground`}
            >
              Home
            </Link>
            <Link href="/about" className="text-sm font-medium hover:underline">
              About
            </Link>
          </nav>
        </div>
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          >
            {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            <span className="sr-only">Toggle theme</span>
          </Button>
          {session ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src="/placeholder.svg?height=32&width=32" alt={session.email} />
                    <AvatarFallback>{session.email.charAt(0).toUpperCase()}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <div className="flex flex-col space-y-1 p-2">
                  <p className="text-sm font-medium leading-none">Hi, {session.email}</p>
                  <p className="text-xs leading-none text-muted-foreground">{session.role}</p>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/profile">
                    <User className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="cursor-pointer"
                  onSelect={async (e) => {
                    e.preventDefault()
                    await logout()
                    window.location.href = "/login"
                  }}
                >
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button asChild>
              <Link href="/login">Login</Link>
            </Button>
          )}
        </div>
      </div>
    </header>
  )
}
