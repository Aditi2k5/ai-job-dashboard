import { DashboardHeader } from "@/components/dashboard-header"
import { JobsOverview } from "@/components/jobs-overview"
import { SkillsComparison } from "@/components/skills-comparison"
import { LayoffTracker } from "@/components/layoff-tracker"
import { EmergingJobs } from "@/components/emerging-jobs"
import { DashboardSidebar } from "@/components/dashboard-sidebar"
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"

export default function Home() {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen">
        <DashboardSidebar />
        <SidebarInset>
          <DashboardHeader />
          <div className="container mx-auto px-6 py-6">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-6">
              <JobsOverview />
              <LayoffTracker />
            </div>
            <div className="grid gap-6 md:grid-cols-2">
              <EmergingJobs />
              <SkillsComparison />
            </div>
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  )
}
