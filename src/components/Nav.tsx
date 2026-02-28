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
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { getCartCount, onCartChange } from "@/lib/cart";
import { ShoppingCart, ChevronDown } from "lucide-react";

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
    <nav className="fixed top-0 left-0 right-0 z-50 w-full h-16 px-4 flex justify-between items-center bg-neutral-200 dark:bg-neutral-900 border-b border-neutral-300/60 dark:border-neutral-800">
      <Link href="/" prefetch={false} className="flex items-center">
        <img
          src="/shopwave_logo_black.webp"
          alt="ShopWave logo"
          className="h-16 w-auto block dark:hidden"
        />
        <img
          src="/shopwave_logo_white.webp"
          alt="ShopWave logo"
          className="h-16 w-auto hidden dark:block"
        />
      </Link>

      <div className="flex items-center gap-4">
        <NavigationMenu>
          <NavigationMenuList className=" flex list-none items-center gap-4">
            {user ? (
              <>
                <NavigationMenuItem>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button className="flex items-center gap-0.5">
                        <div
                          className="flex h-9 w-9 items-center justify-center rounded-full
                          bg-neutral-300 text-neutral-900 dark:bg-neutral-800 dark:text-neutral-100
                          font-semibold uppercase border border-neutral-400 dark:border-neutral-700"
                        >
                          {(user.email?.[0] ?? "U").toUpperCase()}
                        </div>

                        <ChevronDown className="h-4 w-4 opacity-70" />
                      </button>
                    </DropdownMenuTrigger>

                    <DropdownMenuContent align="end" className="w-44">
                      <DropdownMenuItem asChild>
                        <Link href="/user/orders">My Orders</Link>
                      </DropdownMenuItem>

                      <DropdownMenuItem
                        onClick={async () => {
                          await logout();
                          router.replace("/");
                        }}
                      >
                        Logout
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </NavigationMenuItem>

                {isAdmin && (
                  <NavigationMenuItem>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <button
                          className="flex items-center gap-0.5 px-3 py-1 rounded-lg font-semibold text-amber-500 
          hover:bg-neutral-300 dark:hover:bg-neutral-800"
                        >
                          Admin
                          <ChevronDown className="h-4 w-4 opacity-70" />
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
                  <Link
                    href={cartCount > 0 ? "/checkout" : "#"}
                    className="relative flex items-center justify-center"
                    aria-label="Go to checkout"
                  >
                    <ShoppingCart className="h-6 w-6" />

                    {cartCount > 0 && (
                      <span
                        className="absolute -top-2 -right-2 min-w-5 h-5 px-1
                        rounded-full bg-red-600 text-white text-xs
                        flex items-center justify-center leading-none"
                      >
                        {cartCount > 99 ? "99+" : cartCount}
                      </span>
                    )}
                  </Link>
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
        <div className="ml-2">
          <ModeToggle />
        </div>
      </div>
    </nav>
  );
}
