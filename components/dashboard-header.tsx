"use client"

import { Card, CardContent } from "@/components/ui/card"
import { ModeToggle } from "@/components/mode-toggle"
import Link from "next/link"
import { X } from "lucide-react"
import { useState } from "react"

export function DashboardHeader() {
  const [showAlert, setShowAlert] = useState(true)

  return (
    <>
      {/* Alert Ribbon */}
      {showAlert && (
        <div className="dark:bg-blue-700 text-white py-2 px-4 bg-slate-600">
          <div className="container mx-auto flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="text-sm">
                Click here to learn more{" "}
                <Link href="/about" className="hover:underline font-medium">
                  about us
                </Link>
              </span>
            </div>
            <button
              onClick={() => setShowAlert(false)}
              className="text-white hover:text-gray-200 transition-colors"
              aria-label="Close alert"
            >
              <X size={16} />
            </button>
          </div>
        </div>
      )}

      {/* Main Header */}
      <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between mb-6">
            <div></div>
            <div className="flex items-center space-x-4">
              <ModeToggle />
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <h2 className="text-3xl font-bold tracking-tight">AI Job Market Trends</h2>
              <p className="text-muted-foreground">Track the impact of AI on the global job market</p>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <MetricCard title="Jobs Replaced" value="1.2M" change="+14.2%" />
              <MetricCard title="Jobs Created" value="850K" change="+23.7%" />
              <MetricCard title="Net Impact" value="-350K" change="-5.8%" />
              <MetricCard title="Skills Shift" value="42%" change="+8.3%" />
            </div>
          </div>
        </div>
      </div>
    </>
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
