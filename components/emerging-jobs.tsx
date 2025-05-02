"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useEffect, useRef } from "react"
import { Chart, registerables } from "chart.js"

Chart.register(...registerables)

export function EmergingJobs() {
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
          type: "doughnut",
          data: {
            labels: [
              "AI Engineers",
              "Prompt Engineers",
              "AI Ethics Specialists",
              "AI Trainers",
              "AI Integration Specialists",
            ],
            datasets: [
              {
                data: [35, 25, 15, 15, 10],
                backgroundColor: [
                  "rgba(34, 197, 94, 0.7)",
                  "rgba(59, 130, 246, 0.7)",
                  "rgba(168, 85, 247, 0.7)",
                  "rgba(249, 115, 22, 0.7)",
                  "rgba(236, 72, 153, 0.7)",
                ],
                borderColor: [
                  "rgba(34, 197, 94, 1)",
                  "rgba(59, 130, 246, 1)",
                  "rgba(168, 85, 247, 1)",
                  "rgba(249, 115, 22, 1)",
                  "rgba(236, 72, 153, 1)",
                ],
                borderWidth: 1,
              },
            ],
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: {
                position: "right",
                labels: {
                  boxWidth: 12,
                  padding: 15,
                },
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
    <Card>
      <CardHeader>
        <CardTitle>Emerging Jobs</CardTitle>
        <CardDescription>New job categories created by AI advancements</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <canvas ref={chartRef}></canvas>
        </div>
      </CardContent>
    </Card>
  )
}
