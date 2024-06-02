"use client";
import React from "react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import Link from "next/link";
import Image from "next/image";
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import { navLinks } from "@/constants";
import { usePathname } from "next/navigation";
import { Button } from "../ui/button";

const MobileNav = () => {
  const pathname = usePathname();
  return (
    <header className="header">
      <Link
        className=" flex justify-center items-center gap-1 md:py2"
        href={"/"}
      >
        <Image
          src="/assets/images/logo-icon.svg"
          width={30}
          height={30}
          alt="icon"
        />
        <h1 className="text-center text-purple-600 font-bold text-xl w-[280] h-[28]">
          AesthetixAI
        </h1>
      </Link>
      <nav className=" flex gap-2">
        <SignedIn>
          <UserButton afterSignOutUrl="/" />

          <Sheet>
            <SheetTrigger>
              <Image
                src={"/assets/icons/menu.svg"}
                alt="menu"
                width={32}
                height={32}
                className=" cursor-pointer"
              />
            </SheetTrigger>
            <SheetContent>
              <>
                <Image
                  src="/assets/images/logo-text.svg"
                  alt="logo"
                  width={152}
                  height={23}
                />
                <ul className=" header-nav_elements">
                  {navLinks.slice(0, 6).map((link) => {
                    const isActive = link.route == pathname;
                    return (
                      <li
                        key={link.route}
                        className={`${
                          isActive && "gradient-text"
                        }  p-18 flex whitespace-nowrap text-dark-700`}
                      >
                        <Link className="sidebar-link" href={link.route}>
                          <Image
                            src={link.icon}
                            alt="menuIcon"
                            width={24}
                            height={24}
                          />
                          {link.label}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </>
            </SheetContent>
          </Sheet>
        </SignedIn>
        <SignedOut>
          <Button asChild className="button bg-purple-gradient bg-cover">
            <Link href={"/sign-in"}>Login</Link>
          </Button>
        </SignedOut>
      </nav>
    </header>
  );
};

export default MobileNav;
