import { DashboardLayout } from "@/components/dashboard-layout"
import { DashboardHeader } from "@/components/dashboard-header"
import { JobsOverview } from "@/components/jobs-overview"
import { SkillsComparison } from "@/components/skills-comparison"
import { NewsSection } from "@/components/news-section"
import { LayoffTracker } from "@/components/layoff-tracker"
import { EmergingJobs } from "@/components/emerging-jobs"

export default function Home() {
  return (
    <DashboardLayout>
      <div className="flex flex-col gap-6 p-6 md:gap-8">
        <DashboardHeader />
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <JobsOverview />
          <LayoffTracker />
          <EmergingJobs />
        </div>
        <div className="grid gap-6 md:grid-cols-2">
          <SkillsComparison />
          <NewsSection />
        </div>
      </div>
    </DashboardLayout>
  )
}
