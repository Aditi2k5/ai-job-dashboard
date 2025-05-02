"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useEffect, useRef } from "react"
import { Chart, registerables } from "chart.js"

Chart.register(...registerables)

export function JobsOverview() {
  const chartRef = useRef<HTMLCanvasElement>(null)
  const chartInstance = useRef<Chart | null>(null)

  useEffect(() => {
    if (chartRef.current) {
      const ctx = chartRef.current.getContext("2d")

      if (ctx) {
        // Destroy existing chart
        if (chartInstance.current) {
          chartInstance.current.destroy()
        }

        // Create new chart
        chartInstance.current = new Chart(ctx, {
          type: "bar",
          data: {
            labels: ["Data Entry", "Customer Service", "Accounting", "Content Writing", "Basic Analysis"],
            datasets: [
              {
                label: "Jobs at Risk (%)",
                data: [85, 72, 68, 62, 58],
                backgroundColor: "rgba(239, 68, 68, 0.7)",
                borderColor: "rgba(239, 68, 68, 1)",
                borderWidth: 1,
              },
            ],
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
              y: {
                beginAtZero: true,
                max: 100,
                title: {
                  display: true,
                  text: "Automation Risk (%)",
                },
              },
              x: {
                title: {
                  display: true,
                  text: "Job Categories",
                },
              },
            },
            plugins: {
              legend: {
                display: false,
              },
            },
          },
        })
      }
    }

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy()
      }
    }
  }, [])

  return (
    <Card className="col-span-2">
      <CardHeader>
        <CardTitle>Jobs Being Replaced</CardTitle>
        <CardDescription>Job categories with highest risk of automation by AI</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <canvas ref={chartRef}></canvas>
        </div>
      </CardContent>
    </Card>
  )
}
