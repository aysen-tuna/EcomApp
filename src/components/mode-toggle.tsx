"use client";

import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { useAuth } from "@/app/AuthProvider";
import { updateUserTheme } from "@/lib/firebase";

export function ModeToggle() {
  const { setTheme } = useTheme();
  const { user } = useAuth();
  async function apply(next: "light" | "dark" | "system") {
    setTheme(next);
    if (user?.uid) {
      try {
        await updateUserTheme(user.uid, next);
      } catch {}
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon">
          <Sun className="h-[1.2rem] w-[1.2rem] scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90" />
          <Moon className="absolute h-[1.2rem] w-[1.2rem] scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => apply("light")}>
          Light
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => apply("dark")}>Dark</DropdownMenuItem>
        <DropdownMenuItem onClick={() => apply("system")}>
          System
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
