"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, Package, MessageSquare, UserCheck } from "lucide-react"
import { useQuery } from "@tanstack/react-query"
import { QUERY_KEY } from "@/lib/rbac"
import { getDashboardStats } from "@/lib/api-calls"
import { DashboardStats } from "@/lib/model"
import { Testimony, User } from "@prisma/client"

export default function Dashboard() {
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [recentUsers, setRecentUsers] = useState<User[]>([])
  const [recentTestimonies, setRecentTestimonies] = useState<Testimony[]>([])

  useQuery({
        queryKey: [QUERY_KEY.GET_OVERVIEW_STATS],
        queryFn: async () => {
          const { data, error, validationErrors } = await getDashboardStats();
    
          if (data) {
            setStats(
              data
            );
            setRecentTestimonies(data.recent?.testimonies)
            setRecentUsers(data.recent.users)
            setLoading(false)
          }
    
          if (validationErrors?.length) {
            console.error(validationErrors);
    
            return;
          }
    
          if (error) {
            console.error(error);
          }
        }
      });

  const statCards = [
    {
      title: "Premium Users",
      value: stats?.counts.premiumUsers,
      icon: UserCheck,
      color: "bg-[#c19b37]/20 text-[#c19b37]",
    },
    {
      title: "Free Users",
      value: stats?.counts.freeUsers,
      icon: Users,
      color: "bg-[#c19b37]/20 text-[#c19b37]",
    },
    {
      title: "Programs",
      value: stats?.counts.programs,
      icon: Package,
      color: "bg-[#c19b37]/20 text-[#c19b37]",
    },
    {
      title: "Testimonies",
      value: stats?.counts.testimonies,
      icon: MessageSquare,
      color: "bg-[#c19b37]/20 text-[#c19b37]",
    },
  ]

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
              {loading ? (
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
            {loading ? (
              <div className="space-y-2">
                {recentUsers.map((_, i) => (
                  <div key={i} className="h-12 animate-pulse rounded bg-[#c19b37]/20"></div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-400"> No recent signups to display.</p>
            )}
          </CardContent>
        </Card>

        <Card className="bg-[#0e1723] border-[#c19b37]/20">
          <CardHeader>
            <CardTitle className="text-[#c19b37]">Recent Testimonies</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-2">
                {recentTestimonies.map((_, i) => (
                  <div key={i} className="h-12 animate-pulse rounded bg-[#c19b37]/20"></div>
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
