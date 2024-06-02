"use client";
import { navLinks } from "@/constants";
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";
import { Button } from "../ui/button";

const Sidebar = () => {
  const pathname = usePathname();
  return (
    <aside className=" sidebar">
      <div className=" size-full flex-col flex gap-4">
        <Link
          href={"/"}
          className="sidebar-logo flex justify-center gap-0 items-center"
        >
          <Image
            src="/assets/images/logo-icon.svg"
            width={60}
            height={60}
            alt="icon"
          />
          <h1 className="text-center text-purple-600 font-bold text-3xl">
            AesthetixAI
          </h1>
        </Link>
        <nav className=" sidebar-nav">
          <SignedIn>
            <ul className=" sidebar-nav_elements">
              {navLinks.slice(0, 6).map((link) => {
                const isActive = link.route == pathname;
                return (
                  <li
                    key={link.route}
                    className={` cursor-pointer sidebar-nav_element group ${
                      isActive
                        ? " bg-purple-gradient text-white"
                        : "text-gray-700"
                    }`}
                  >
                    <Link className="sidebar-link" href={link.route}>
                      <Image
                        className={`${isActive && "brightness-200"}`}
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
            <ul className=" sidebar-nav_elements">
              {navLinks.slice(6).map((link) => {
                const isActive = link.route == pathname;
                return (
                  <li
                    key={link.route}
                    className={` cursor-pointer sidebar-nav_element group ${
                      isActive
                        ? " bg-purple-gradient text-white"
                        : "text-gray-700"
                    }`}
                  >
                    <Link className="sidebar-link" href={link.route}>
                      <Image
                        className={`${isActive && "brightness-200"}`}
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
              <li className=" flex-center cursor-pointer gap-2 p-4">
                <UserButton showName afterSignOutUrl="/" />
              </li>
            </ul>
          </SignedIn>
          <SignedOut>
            <Button asChild className="button bg-purple-gradient bg-cover">
              <Link href={"/sign-in"}>Login</Link>
            </Button>
          </SignedOut>
        </nav>
      </div>
    </aside>
  );
};

export default Sidebar;
