"use client";
import Link from "next/link";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { ModeToggle } from "@/components/mode-toggle";
import { useAuth } from "@/app/AuthProvider";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

import { useEffect, useState } from "react";

import { getCartCount, onCartChange } from "@/lib/cart";

export function Nav() {
  const { user, logout, isAdmin } = useAuth();
  const uid = user?.uid;
  const router = useRouter();

  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    const update = () => setCartCount(getCartCount(uid));
    update();
    return onCartChange(update);
  }, [uid]);

  return (
    <nav className="flex w-full flex-wrap justify-between items-center">
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
                  <Link
                    href={cartCount > 0 ? "/checkout" : "#"}
                    className="relative flex items-center justify-center"
                    aria-label="Go to checkout"
                  >
                    <div
                      className="flex h-9 w-9 items-center justify-center rounded-full
                      bg-neutral-300 text-neutral-900 dark:bg-neutral-800 dark:text-neutral-100
                      font-semibold uppercase select-none border border-neutral-400 dark:border-neutral-700"
                    >
                      {(user.email?.[0] ?? "U").toUpperCase()}
                    </div>

                    {cartCount > 0 ? (
                      <span
                        className="absolute -top-2 -right-2 min-w-5 h-5 px-1
                        rounded-full bg-red-600 text-white text-xs
                        flex items-center justify-center leading-none"
                      >
                        {cartCount > 99 ? "99+" : cartCount}
                      </span>
                    ) : null}
                  </Link>
                </NavigationMenuItem>

                <NavigationMenuItem>
                  <NavigationMenuLink asChild>
                    <Link href="/user/orders">My Orders</Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>

                {isAdmin && (
                  <NavigationMenuItem>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <button
                          className="px-3 py-1 rounded-lg font-semibold text-amber-500 
          hover:bg-neutral-300 dark:hover:bg-neutral-800"
                        >
                          Admin ▾
                        </button>
                      </DropdownMenuTrigger>

                      <DropdownMenuContent align="end" className="w-40">
                        <DropdownMenuItem asChild>
                          <Link href="/admin/products/new">Add Product</Link>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </NavigationMenuItem>
                )}

                <NavigationMenuItem>
                  <Button
                    type="button"
                    onClick={async () => {
                      await logout();
                      router.replace("/");
                    }}
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
