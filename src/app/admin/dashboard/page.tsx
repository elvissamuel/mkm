"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, Package, MessageSquare, UserCheck } from "lucide-react"
import { useQuery } from "@tanstack/react-query"
import { QUERY_KEY } from "@/lib/rbac"
import { getDashboardStats } from "@/lib/api-calls"
import { DashboardStats } from "@/lib/model"
import { Testimony, User } from "@prisma/client"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"

export default function Dashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [recentUsers, setRecentUsers] = useState<User[]>([])
  const [recentTestimonies, setRecentTestimonies] = useState<Testimony[]>([])

  const { isLoading, error } = useQuery({
    queryKey: [QUERY_KEY.GET_OVERVIEW_STATS],
    queryFn: async () => {
      const { data, error, validationErrors } = await getDashboardStats()
      
      if (data) {
        setStats(data)
        setRecentTestimonies(data.recent?.testimonies || [])
        setRecentUsers(data.recent?.users || [])
      }

      if (validationErrors?.length) {
        console.error(validationErrors)
        throw new Error("Validation errors occurred")
      }

      if (error) {
        console.error(error)
        throw error
      }

      return data
    },
  })

  const statCards = [
    {
      title: "Premium Users",
      value: stats?.counts.premiumUsers || 0,
      icon: UserCheck,
      color: "bg-[#c19b37]/20 text-[#c19b37]",
    },
    {
      title: "Free Users",
      value: stats?.counts.freeUsers || 0,
      icon: Users,
      color: "bg-[#c19b37]/20 text-[#c19b37]",
    },
    {
      title: "Programs",
      value: stats?.counts.programs || 0,
      icon: Package,
      color: "bg-[#c19b37]/20 text-[#c19b37]",
    },
    {
      title: "Testimonies",
      value: stats?.counts.testimonies || 0,
      icon: MessageSquare,
      color: "bg-[#c19b37]/20 text-[#c19b37]",
    },
  ]

  if (error) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold tracking-tight text-[#c19b37]">Dashboard Overview</h1>
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            {error instanceof Error ? error.message : "An error occurred while loading the dashboard"}
          </AlertDescription>
        </Alert>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold tracking-tight text-[#c19b37]">Dashboard Overview</h1>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {statCards.map((card, index) => (
          <Card key={index} className="bg-[#0e1723] border-[#c19b37]/20">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium text-gray-300">{card.title}</CardTitle>
              <div className={`p-2 rounded-full ${card.color}`}>
                <card.icon className="h-4 w-4" />
              </div>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="h-7 w-16 animate-pulse rounded bg-[#c19b37]/20"></div>
              ) : (
                <div className="text-2xl font-bold text-[#c19b37]">{card.value}</div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card className="bg-[#0e1723] border-[#c19b37]/20">
          <CardHeader>
            <CardTitle className="text-[#c19b37]">Recent Signups</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-2">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-12 animate-pulse rounded bg-[#c19b37]/20"></div>
                ))}
              </div>
            ) : recentUsers.length > 0 ? (
              <div className="space-y-2">
                {recentUsers.map((user) => (
                  <div key={user.id} className="flex items-center justify-between py-2">
                    <div>
                      <div className="font-medium text-gray-200">{user.first_name}</div>
                      <div className="text-sm text-gray-400">{user.email}</div>
                    </div>
                    <div className="text-sm text-[#c19b37]">{user.role}</div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-400">No recent signups to display.</p>
            )}
          </CardContent>
        </Card>

        <Card className="bg-[#0e1723] border-[#c19b37]/20">
          <CardHeader>
            <CardTitle className="text-[#c19b37]">Recent Testimonies</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-2">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-12 animate-pulse rounded bg-[#c19b37]/20"></div>
                ))}
              </div>
            ) : recentTestimonies.length > 0 ? (
              <div className="space-y-2">
                {recentTestimonies.map((testimony) => (
                  <div key={testimony.id} className="py-2">
                    <div className="font-medium text-gray-200">{testimony.first_name}</div>
                    <div className="text-sm text-gray-400 line-clamp-2">{testimony.testimony}</div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-400">No recent testimonies to display.</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
