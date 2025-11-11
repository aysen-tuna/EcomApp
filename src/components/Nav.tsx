"use client";
import Link from "next/link";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";

import { ModeToggle } from "@/components/mode-toggle";
import { useAuth } from "@/app/AuthProvider";
import { Button } from "@/components/ui/button";

export function Nav() {
  const { user, logout, loading, isAdmin } = useAuth();

  return (
    <nav className="flex w-full justify-between items-center">
      <h1 className="text-lg font-bold ">
        <Link href="/" prefetch={false}>
          Ecom
        </Link>
      </h1>

      <div className="flex items-center gap-4">
        <NavigationMenu>
          <NavigationMenuList className=" flex list-none items-center gap-4">
            {user ? (
              <>
                <NavigationMenuItem>
                  <div
                    className="flex h-8 w-8 items-center justify-center rounded-full bg-neutral-300 text-neutral-900 dark:bg-neutral-800 dark:text-neutral-100 
             font-semibold uppercase select-none"
                  >
                    {(user.email?.[0] ?? "U").toUpperCase()}
                  </div>
                </NavigationMenuItem>

                {isAdmin && (
                  <NavigationMenuItem>
                    <NavigationMenuLink asChild>
                      <Link
                        href="/admin/products/new"
                        className="px-3 py-1 rounded-lg font-semibold text-amber-500 hover:bg-slate-300 dark:hover:bg-neutral-700"
                      >
                        Admin
                      </Link>
                    </NavigationMenuLink>
                  </NavigationMenuItem>
                )}

                <NavigationMenuItem>
                  <Button
                    type="button"
                    onClick={logout}
                    className="px-3 py-1 border rounded-lg dark:border-slate-600 border-slate-400 hover:bg-slate-300 dark:hover:bg-slate-700"
                  >
                    Logout
                  </Button>
                </NavigationMenuItem>
              </>
            ) : (
              <>
                <NavigationMenuItem>
                  <NavigationMenuLink asChild>
                    <Link href="/user/login">Login</Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>

                <NavigationMenuItem>
                  <NavigationMenuLink asChild>
                    <Link href="/user/signup">Sign Up</Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>
              </>
            )}
          </NavigationMenuList>
        </NavigationMenu>
        <ModeToggle />
      </div>
    </nav>
  );
}
