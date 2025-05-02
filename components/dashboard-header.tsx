import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export function DashboardHeader() {
  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">AI Job Market Trends</h1>
        <p className="text-muted-foreground">Track the impact of AI on the global job market</p>
      </div>
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="weekly">Weekly</TabsTrigger>
          <TabsTrigger value="monthly">Monthly</TabsTrigger>
          <TabsTrigger value="quarterly">Quarterly</TabsTrigger>
        </TabsList>
        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <MetricCard title="Jobs Replaced" value="1.2M" change="+14.2%" />
            <MetricCard title="Jobs Created" value="850K" change="+23.7%" />
            <MetricCard title="Net Impact" value="-350K" change="-5.8%" />
            <MetricCard title="Skills Shift" value="42%" change="+8.3%" />
          </div>
        </TabsContent>
        <TabsContent value="weekly" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <MetricCard title="Jobs Replaced" value="28.5K" change="+2.1%" />
            <MetricCard title="Jobs Created" value="22.3K" change="+4.5%" />
            <MetricCard title="Net Impact" value="-6.2K" change="-0.8%" />
            <MetricCard title="Skills Shift" value="3.2%" change="+0.5%" />
          </div>
        </TabsContent>
        <TabsContent value="monthly" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <MetricCard title="Jobs Replaced" value="112K" change="+8.7%" />
            <MetricCard title="Jobs Created" value="87K" change="+12.3%" />
            <MetricCard title="Net Impact" value="-25K" change="-2.1%" />
            <MetricCard title="Skills Shift" value="11.5%" change="+2.8%" />
          </div>
        </TabsContent>
        <TabsContent value="quarterly" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <MetricCard title="Jobs Replaced" value="342K" change="+11.8%" />
            <MetricCard title="Jobs Created" value="256K" change="+18.2%" />
            <MetricCard title="Net Impact" value="-86K" change="-3.4%" />
            <MetricCard title="Skills Shift" value="24.7%" change="+5.6%" />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

function MetricCard({ title, value, change }: { title: string; value: string; change: string }) {
  const isPositive = !change.startsWith("-")

  return (
    <Card>
      <CardContent className="p-6">
        <div className="space-y-2">
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <div className="flex items-center justify-between">
            <p className="text-2xl font-bold">{value}</p>
            <p className={`text-sm font-medium ${isPositive ? "text-green-500" : "text-red-500"}`}>{change}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
