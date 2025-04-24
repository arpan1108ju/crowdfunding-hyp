

  
import ThemeToggle from "@/components/theme-toggle";

  export default function Navbar() {
    return (
      <nav className="flex items-center justify-between p-4 border-b shadow-sm bg-background">
        <h1 className="text-xl font-semibold">My App</h1>
        <ThemeToggle />
      </nav>
    );
  }
  