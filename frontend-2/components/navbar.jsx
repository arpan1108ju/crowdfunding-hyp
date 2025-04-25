"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Search, User, Moon, Sun, LogOut, PlusCircle } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useAuth } from "@/hooks/use-auth"
import { ROLE } from "@/lib/constants"
import { useTokenService } from "@/hooks/use-token-service"

import ThemeToggle from "@/components/theme-toggle";
import { toast } from "sonner"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"



export default function Navbar() {

  const pathname = usePathname();
  const { session,logout } = useAuth();
  const [mounted, setMounted] = useState(false)

  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState([])
  const [showResults, setShowResults] = useState(false)

  const [balance, setBalance] = useState("0");
  const [tokenMetadata, setTokenMetadata] = useState(null);
  const { getBalance, getTokenMetadata } = useTokenService();

  const fetchBalance = async () => {
    try {
      const response = await getBalance();
      if (!response.success) {
        throw new Error(response.message);
      }
      setBalance(response.data.balance);
    } catch (error) {
      toast.error("Failed to fetch balance", {
        description: error.message
      });
      setBalance("0");
    }
  };

  const fetchTokenMetadata = async () => {
    try {
      const response = await getTokenMetadata();
      if (!response.success) {
        throw new Error(response.message);
      }
      setTokenMetadata(response.data.tokenMetadata);
    } catch (error) {
      toast.error("Failed to fetch token metadata", {
        description: error.message
      });
    }
  };

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

  const handleInputChange = (e) => {
    setSearchQuery(e.target.value)
    if (e.target.value === "") {
      setShowResults(false)
      setSearchResults([])
    }
  }

  useEffect(() => {

    setMounted(true);

    if(session?.isVerified){
      fetchBalance();
      fetchTokenMetadata();
    }
  }, [])

  if (!mounted) {
    return null
  }



    // return (
    //   <nav className="flex items-center justify-between p-4 border-b shadow-sm bg-background">
    //     <h1 className="text-xl font-semibold">My App</h1>
    //     <ThemeToggle />
    //   </nav>
    // );

    return (
      <header className="sticky top-0 z-10 w-full border-b bg-background">
        <div className="flex h-16 items-center px-4">
          <div className="flex items-center gap-2 md:w-64">
            <Link href="/" className="flex items-center gap-2">
              <span className="text-3xl font-bold">FundFab</span>
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
                className={`text-sm font-medium transition-colors hover:text-foreground hover:bg-accent px-3 py-2 rounded-md ${
                  pathname === "/" 
                    ? "text-foreground bg-accent" 
                    : "text-muted-foreground"
                }`}
              >
                Home
              </Link>
              <Link
                href="/about"
                className={`text-sm font-medium transition-colors hover:text-foreground hover:bg-accent px-3 py-2 rounded-md ${
                  pathname === "/about" 
                    ? "text-foreground bg-accent" 
                    : "text-muted-foreground"
                }`}
              >
                About
              </Link>
              
              {/* Admin Link - visible to only ADMIN  */}
              {session?.role === ROLE.ADMIN && (
                <Link
                  href="/admin"
                  className={`text-sm font-medium transition-colors hover:text-foreground hover:bg-accent px-3 py-2 rounded-md ${
                    pathname === "/admin" 
                      ? "text-foreground bg-accent" 
                      : "text-muted-foreground"
                  }`}
                >
                  Admin
                </Link>
              )}

              {/* SuperAdmin Link - visible only to SUPERADMIN */}
              {session?.role === ROLE.SUPERADMIN && (
                <Link
                  href="/superadmin"
                  className={`text-sm font-medium transition-colors hover:text-foreground hover:bg-accent px-3 py-2 rounded-md ${
                    pathname === "/superadmin" 
                      ? "text-foreground bg-accent" 
                      : "text-muted-foreground"
                  }`}
                >
                  Super Admin
                </Link>
              )}
            </nav>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="flex items-center gap-1 px-3 py-1.5 bg-accent rounded-md">
                      <span className="text-sm font-medium">
                        {session ? (
                          session.isVerified ? (
                            balance
                          ) : (
                            "0"
                          )
                        ) : (
                          "0"
                        )}
                      </span>
                      <span className="text-xs text-muted-foreground">{tokenMetadata?.symbol || 'CFT'}</span>
                    </div>
                  </TooltipTrigger>
                  {session && !session.isVerified && (
                    <TooltipContent>
                      <p>Account not verified</p>
                    </TooltipContent>
                  )}
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <span>
                      <Button
                        variant="ghost"
                        size="icon"
                        disabled={!session?.isVerified}
                        asChild
                      >
                        <Link href="/profile">
                          <PlusCircle className="h-4 w-4" />
                        </Link>
                    </Button>
                    </span>
                  </TooltipTrigger>
                  {session && !session.isVerified && (
                    <TooltipContent>
                      <p>Verify account to add tokens</p>
                    </TooltipContent>
                  )}
                </Tooltip>
            </div>
          <Tooltip>
                <TooltipTrigger asChild>
                      <ThemeToggle /> 
                </TooltipTrigger>
                <TooltipContent>
                  <p>Change Theme</p>
                </TooltipContent>

          </Tooltip>
            {session ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src="/placeholder.svg?height=32&width=32" alt={session.email} />
                      <AvatarFallback>{session.email?.charAt(0).toUpperCase()}</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <div className="flex flex-col space-y-1 p-2">
                    <p className="text-sm font-medium leading-none">Hi, {session.username}</p>
                    <p className="text-xs leading-none pt-2 text-muted-foreground">{session.role}</p>
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
                      toast.success("Success",{
                        description : "Logged out successfully"
                      })
                    }}
                  >
                    <LogOut className="mr-2 h-4 w-4" />
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
  