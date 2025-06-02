"use client"

import type React from "react"
import {
  SidebarProvider,
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { ModeToggle } from "@/components/mode-toggle"
import { BarChart3, Briefcase, GraduationCap, Home, Newspaper, Settings, TrendingUp, Users } from "lucide-react"

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen">
        <AppSidebar />
        <main className="flex-1 ml-0">
          <header className="flex items-center justify-between border-b p-3 bg-background">
            <SidebarTrigger />
            <ModeToggle />
          </header>
          <div className="p-4">
            {children}
          </div>
        </main>
      </div>
    </SidebarProvider>
  )
}

function AppSidebar() {
  return (
    <Sidebar className="w-56">
      <SidebarHeader className="flex items-center px-3 py-3 border-b">
        <div className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-primary" />
          <h1 className="text-lg font-bold">Future of Jobs</h1>
        </div>
      </SidebarHeader>
      <SidebarContent className="px-2 py-2">
        <SidebarMenu className="space-y-1">
          <SidebarMenuItem>
            <SidebarMenuButton asChild isActive className="w-full">
              <a href="/" className="flex items-center gap-3 px-3 py-2">
                <Home className="h-4 w-4" />
                <span className="text-sm">Dashboard</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton asChild className="w-full">
              <a href="/jobs" className="flex items-center gap-3 px-3 py-2">
                <Briefcase className="h-4 w-4" />
                <span className="text-sm">Job Trends</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton asChild className="w-full">
              <a href="/skills" className="flex items-center gap-3 px-3 py-2">
                <GraduationCap className="h-4 w-4" />
                <span className="text-sm">Skills Analysis</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton asChild className="w-full">
              <a href="/layoffs" className="flex items-center gap-3 px-3 py-2">
                <Users className="h-4 w-4" />
                <span className="text-sm">Layoff Tracker</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton asChild className="w-full">
              <a href="/news" className="flex items-center gap-3 px-3 py-2">
                <Newspaper className="h-4 w-4" />
                <span className="text-sm">News & Insights</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton asChild className="w-full">
              <a href="/analytics" className="flex items-center gap-3 px-3 py-2">
                <BarChart3 className="h-4 w-4" />
                <span className="text-sm">Analytics</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter className="border-t px-2 py-2">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild className="w-full">
              <a href="/settings" className="flex items-center gap-3 px-3 py-2">
                <Settings className="h-4 w-4" />
                <span className="text-sm">Settings</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}