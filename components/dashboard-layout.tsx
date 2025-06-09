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
import { DashboardSidebar } from "./dashboard-sidebar"

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen">
        {/* Main Navigation Sidebar */}
        <AppSidebar />
        
        {/* Articles Sidebar */}
        <DashboardSidebar />
        
        {/* Main Content */}
        <main className="flex-1 min-w-0 transition-all duration-300">
          <header className="flex items-center justify-between border-b p-3 bg-background sticky top-0 z-10">
            <div className="flex items-center gap-2">
              <SidebarTrigger />
            </div>
            <ModeToggle />
          </header>
          <div className="p-4 overflow-auto">
            {children}
          </div>
        </main>
      </div>
    </SidebarProvider>
  )
}

function AppSidebar() {
  return (
    <Sidebar className="border-r bg-sidebar" collapsible="icon">
      <SidebarHeader className="flex items-center px-3 py-3 border-b bg-sidebar">
        <div className="flex items-center gap-2 group-data-[collapsible=icon]:justify-center">
          <TrendingUp className="h-5 w-5 text-primary flex-shrink-0" />
          <h1 className="text-lg font-bold group-data-[collapsible=icon]:hidden">
            Future of Jobs
          </h1>
        </div>
      </SidebarHeader>
      
      <SidebarContent className="px-2 py-2 bg-sidebar">
        <SidebarMenu className="space-y-1">
          <SidebarMenuItem>
            <SidebarMenuButton asChild isActive className="w-full">
              <a href="/" className="flex items-center gap-3 px-3 py-2 group-data-[collapsible=icon]:justify-center">
                <Home className="h-4 w-4 flex-shrink-0" />
                <span className="text-sm group-data-[collapsible=icon]:hidden">Dashboard</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton asChild className="w-full">
              <a href="/jobs" className="flex items-center gap-3 px-3 py-2 group-data-[collapsible=icon]:justify-center">
                <Briefcase className="h-4 w-4 flex-shrink-0" />
                <span className="text-sm group-data-[collapsible=icon]:hidden">Job Trends</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton asChild className="w-full">
              <a href="/skills" className="flex items-center gap-3 px-3 py-2 group-data-[collapsible=icon]:justify-center">
                <GraduationCap className="h-4 w-4 flex-shrink-0" />
                <span className="text-sm group-data-[collapsible=icon]:hidden">Skills Analysis</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton asChild className="w-full">
              <a href="/layoffs" className="flex items-center gap-3 px-3 py-2 group-data-[collapsible=icon]:justify-center">
                <Users className="h-4 w-4 flex-shrink-0" />
                <span className="text-sm group-data-[collapsible=icon]:hidden">Layoff Tracker</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton asChild className="w-full">
              <a href="/news" className="flex items-center gap-3 px-3 py-2 group-data-[collapsible=icon]:justify-center">
                <Newspaper className="h-4 w-4 flex-shrink-0" />
                <span className="text-sm group-data-[collapsible=icon]:hidden">News & Insights</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton asChild className="w-full">
              <a href="/analytics" className="flex items-center gap-3 px-3 py-2 group-data-[collapsible=icon]:justify-center">
                <BarChart3 className="h-4 w-4 flex-shrink-0" />
                <span className="text-sm group-data-[collapsible=icon]:hidden">Analytics</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarContent>
      
      <SidebarFooter className="border-t px-2 py-2 bg-sidebar">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild className="w-full">
              <a href="/settings" className="flex items-center gap-3 px-3 py-2 group-data-[collapsible=icon]:justify-center">
                <Settings className="h-4 w-4 flex-shrink-0" />
                <span className="text-sm group-data-[collapsible=icon]:hidden">Settings</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}