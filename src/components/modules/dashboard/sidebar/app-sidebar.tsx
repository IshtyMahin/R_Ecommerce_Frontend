"use client";

import * as React from "react";
import {
  Package,
  Tag,
  Award,
  Gift,
  ShoppingCart,
  User,
  Settings,
  LifeBuoy,
  Send,
  SquareTerminal,
  Lock,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { NavMain } from "./nav-main";
import { NavUser } from "./nav-user";
import Link from "next/link";
import Logo from "@/assets/svgs/Logo";
import { useUser } from "@/context/UserContext";

const adminMenuItems = [
  {
    title: "Dashboard",
    url: "/admin/dashboard",
    icon: SquareTerminal,
    isActive: true,
  },
  {
    title: "Profile",
    url: "/profile",
    icon: User,
  },
  {
    title: "Products",
    url: "/admin/dashboard/products",
    icon: Package,
  },
  {
    title: "Categories",
    url: "/admin/dashboard/category",
    icon: Tag,
  },
  {
    title: "Brands",
    url: "/admin/dashboard/brand",
    icon: Award,
  },
  {
    title: "Coupons",
    url: "/admin/dashboard/manage-coupon",
    icon: Gift,
  },
  {
    title: "Orders",
    url: "/admin/dashboard/manage-order",
    icon: ShoppingCart,
  },
  {
    title: "Users",
    url: "/admin/dashboard/users",
    icon: User,
  },
  {
    title: "Settings",
    url: "#",
    icon: Settings,
    items: [
      {
        title: "System Settings",
        url: "/admin/settings/system",
        icon: Settings,
      },
      {
        title: "Permissions",
        url: "/admin/settings/permissions",
        icon: Lock,
      },
    ],
  },
];

const userMenuItems = [
  {
    title: "My Dashboard",
    url: "/user/dashboard",
    icon: SquareTerminal,
    isActive: true,
  },
  {
    title: "My Orders",
    url: "/user/dashboard/orders",
    icon: ShoppingCart,
  },
  {
    title: "Profile",
    url: "/profile",
    icon: User,
  },
  {
    title: "Settings",
    url: "/user/dashboard/settings",
    icon: Settings,
  },
];

const commonSecondaryItems = [
  {
    title: "Support",
    url: "/support",
    icon: LifeBuoy,
  },
  {
    title: "Feedback",
    url: "/feedback",
    icon: Send,
  },
];

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { user, isLoading } = useUser();

  if (isLoading) {
    return (
      <Sidebar {...props}>
        <div className="p-4 text-center">Loading menu...</div>
      </Sidebar>
    );
  }

  const isAdmin = user?.role === "admin";
  const menuItems = isAdmin ? adminMenuItems : userMenuItems;

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link href="/">
                <div className="flex items-center justify-center">
                  <Logo />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <h2 className="font-bold text-xl">NextMart</h2>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={menuItems} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
        <NavMain items={commonSecondaryItems} />
      </SidebarFooter>
    </Sidebar>
  );
}