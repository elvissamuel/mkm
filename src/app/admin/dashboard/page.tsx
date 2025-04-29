"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, Package, MessageSquare, UserCheck } from "lucide-react"

// Mock data - in a real app, you would fetch this from your API
const mockData = {
  premiumUsers: 24,
  freeUsers: 156,
  programs: 8,
  testimonies: 42,
}

export default function Dashboard() {
  const [stats, setStats] = useState({
    premiumUsers: 0,
    freeUsers: 0,
    programs: 0,
    testimonies: 0,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simulate API call
    const fetchData = async () => {
      try {
        // In a real app, you would fetch data from your API
        // const response = await fetch('/api/admin/stats')
        // const data = await response.json()

        // Using mock data for demonstration
        setTimeout(() => {
          setStats(mockData)
          setLoading(false)
        }, 1000)
      } catch (error) {
        console.error("Error fetching dashboard data:", error)
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const statCards = [
    {
      title: "Premium Users",
      value: stats.premiumUsers,
      icon: UserCheck,
      color: "bg-purple-100 text-purple-600",
    },
    {
      title: "Free Users",
      value: stats.freeUsers,
      icon: Users,
      color: "bg-blue-100 text-blue-600",
    },
    {
      title: "Programs",
      value: stats.programs,
      icon: Package,
      color: "bg-green-100 text-green-600",
    },
    {
      title: "Testimonies",
      value: stats.testimonies,
      icon: MessageSquare,
      color: "bg-amber-100 text-amber-600",
    },
  ]

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold tracking-tight">Dashboard Overview</h1>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {statCards.map((card, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium">{card.title}</CardTitle>
              <div className={`p-2 rounded-full ${card.color}`}>
                <card.icon className="h-4 w-4" />
              </div>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="h-7 w-16 animate-pulse rounded bg-gray-200"></div>
              ) : (
                <div className="text-2xl font-bold">{card.value}</div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Recent Signups</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-2">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="h-12 animate-pulse rounded bg-gray-200"></div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">No recent signups to display.</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Testimonies</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-2">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="h-12 animate-pulse rounded bg-gray-200"></div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">No recent testimonies to display.</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
