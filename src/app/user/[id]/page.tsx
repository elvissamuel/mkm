"use client"
import { useParams } from "next/navigation"
import { useQuery } from "@tanstack/react-query"
import { getUserById } from "@/lib/api-calls"
import ApplicationForm from "@/components/application-form"
import { User } from "@prisma/client"
import { UserWithSubscriptions } from "@/lib/model"

export default function EditUserPage() {
  const params = useParams()
  const userId = params.id as string

  const { data: userData, isLoading, error } = useQuery({
    queryKey: ['user', userId],
    queryFn: () => getUserById(userId),
    enabled: !!userId
  })

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[#318784]"></div>
      </div>
    )
  }

  if (error || !userData?.data) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-red-500">Error loading user data</div>
      </div>
    )
  }

  return (
    <ApplicationForm
      user={userData.data as UserWithSubscriptions} 
    />
  )
} 