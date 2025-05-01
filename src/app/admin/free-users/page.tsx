"use client"

import { useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { QUERY_KEY } from "@/lib/rbac"
import { getUsers } from "@/lib/api-calls"
import { Search } from "lucide-react"
import { User } from "@prisma/client"

export default function FreeUsersPage() {
  const [search, setSearch] = useState("")
  const [page, setPage] = useState(1)
  const limit = 10

  const { data: usersData, isLoading } = useQuery({
    queryKey: [QUERY_KEY.GET_ALL_USERS, "USER", page, limit, search],
    queryFn: () => getUsers(page, limit, "USER", search),
  })

  const users = usersData?.data?.users || []
  const totalPages = usersData?.data?.pagination?.totalPages || 0

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight text-[#c19b37]">Free Users</h1>
        <div className="relative w-64">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search users..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-8 bg-[#0e1723] border-[#c19b37]/20 text-gray-200"
          />
        </div>
      </div>

      <div className="rounded-md border border-[#c19b37]/20">
        <Table>
          <TableHeader>
            <TableRow className="bg-[#0e1723] hover:bg-[#0e1723]">
              <TableHead className="text-gray-300">Name</TableHead>
              <TableHead className="text-gray-300">Email</TableHead>
              <TableHead className="text-gray-300">Phone</TableHead>
              <TableHead className="text-gray-300">Joined Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              [...Array(3)].map((_, i) => (
                <TableRow key={i} className="bg-[#0e1723] hover:bg-[#0e1723]">
                  {[...Array(4)].map((_, j) => (
                    <TableCell key={j}>
                      <div className="h-5 w-full animate-pulse rounded bg-[#c19b37]/20"></div>
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : users.length > 0 ? (
              users.map((user: User) => (
                <TableRow key={user.id} className="bg-[#0e1723] hover:bg-[#0e1723]">
                  <TableCell className="font-medium text-gray-300">
                    {user.first_name} {user.last_name}
                  </TableCell>
                  <TableCell className="text-gray-300">{user.email}</TableCell>
                  <TableCell className="text-gray-300">{user.phone_number}</TableCell>
                  <TableCell className="text-gray-300">
                    {new Date(user.created_at).toLocaleDateString()}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow className="bg-[#0e1723] hover:bg-[#0e1723]">
                <TableCell colSpan={4} className="text-center text-gray-300">
                  No users found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center gap-2">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="px-4 py-2 rounded-md bg-[#c19b37] text-white disabled:opacity-50"
          >
            Previous
          </button>
          <span className="px-4 py-2 text-gray-300">
            Page {page} of {totalPages}
          </span>
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="px-4 py-2 rounded-md bg-[#c19b37] text-white disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
    </div>
  )
} 