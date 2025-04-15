import React from "react";
import { Moon, Sun, Laptop } from "lucide-react";
import { useTheme } from "@/hooks/use-theme";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative h-9 w-9 rounded-full">
          <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="glass-card border-primary/10">
        <DropdownMenuItem 
          onClick={() => setTheme("light")}
          className={`flex items-center gap-2 ${theme === "light" ? "text-primary" : ""}`}
        >
          <Sun className="h-4 w-4" />
          Light
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => setTheme("dark")}
          className={`flex items-center gap-2 ${theme === "dark" ? "text-primary" : ""}`}
        >
          <Moon className="h-4 w-4" />
          Dark
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => setTheme("system")}
          className={`flex items-center gap-2 ${theme === "system" ? "text-primary" : ""}`}
        >
          <Laptop className="h-4 w-4" />
          System
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}