"use client"

import { useState } from "react"
import { useQuery, useQueryClient } from "@tanstack/react-query"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { QUERY_KEY } from "@/lib/rbac"
import { getTestimonies, approveTestimony } from "@/lib/api-calls"
import { Search, Check, X } from "lucide-react"
import { Testimony } from "@prisma/client"
import { useToast } from "@/hooks/use-toast"
import { ApproveTestimonySchema } from "@/lib/validation-schema"

interface TestimonyWithApproval extends Testimony {
  approved: boolean | null
}

export default function TestimoniesPage() {
  const [search, setSearch] = useState("")
  const [page, setPage] = useState(1)
  const [approvedFilter, setApprovedFilter] = useState<boolean | null>(null)
  const limit = 10
  const { toast } = useToast()
  const queryClient = useQueryClient()

  const { data: testimoniesData, isLoading } = useQuery({
    queryKey: [QUERY_KEY.GET_ALL_TESTIMONIES, page, limit, search, approvedFilter],
    queryFn: () => getTestimonies(page, limit, search, "created_at", "desc"),
  })

  console.log("dataaaa: ", testimoniesData)

  const testimonies = testimoniesData?.data?.testimonies || []
  const totalPages = testimoniesData?.data?.pagination?.totalPages || 0

  const handleApproveTestimony = async (input: ApproveTestimonySchema) => {
    const { data, error } = await approveTestimony(input)
    
    if (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update testimony status.",
      })
      return
    }

    if (data) {
      toast({
        variant: "default",
        title: "Success",
        description: `Testimony ${input.approved ? "approved" : "disapproved"} successfully!`,
      })
      // Invalidate the testimonies query to refresh the data
      await queryClient.invalidateQueries({ queryKey: [QUERY_KEY.GET_ALL_TESTIMONIES] })
    }
  }

  // Filter testimonies based on approved status
  const filteredTestimonies = approvedFilter === null 
    ? testimonies 
    : testimonies.filter(testimony => testimony.approved === approvedFilter)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight text-[#c19b37]">Testimonies</h1>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Button
              variant={approvedFilter === null ? "default" : "outline"}
              onClick={() => setApprovedFilter(null)}
              className="bg-[#c19b37] text-white hover:bg-[#a8842e]"
            >
              All
            </Button>
            <Button
              variant={approvedFilter === true ? "default" : "outline"}
              onClick={() => setApprovedFilter(true)}
              className="bg-[#c19b37] text-white hover:bg-[#a8842e]"
            >
              Approved
            </Button>
            <Button
              variant={approvedFilter === false ? "default" : "outline"}
              onClick={() => setApprovedFilter(false)}
              className="bg-[#c19b37] text-white hover:bg-[#a8842e]"
            >
              Pending
            </Button>
          </div>
          <div className="relative w-64">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search testimonies..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-8 bg-[#0e1723] border-[#c19b37]/20 text-gray-200"
            />
          </div>
        </div>
      </div>

      <div className="rounded-md border border-[#c19b37]/20">
        <Table>
          <TableHeader>
            <TableRow className="bg-[#0e1723] hover:bg-[#0e1723]">
              <TableHead className="text-gray-300">Name</TableHead>
              <TableHead className="text-gray-300">Email</TableHead>
              <TableHead className="text-gray-300">Phone</TableHead>
              <TableHead className="text-gray-300">Country</TableHead>
              <TableHead className="text-gray-300">Testimony</TableHead>
              <TableHead className="text-gray-300">Status</TableHead>
              <TableHead className="text-gray-300">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              [...Array(3)].map((_, i) => (
                <TableRow key={i} className="bg-[#0e1723] hover:bg-[#0e1723]">
                  {[...Array(7)].map((_, j) => (
                    <TableCell key={j}>
                      <div className="h-5 w-full animate-pulse rounded bg-[#c19b37]/20"></div>
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : filteredTestimonies.length > 0 ? (
              filteredTestimonies.map((testimony) => (
                <TableRow key={testimony.id} className="bg-[#0e1723] hover:bg-[#0e1723]">
                  <TableCell className="font-medium text-gray-300">
                    {testimony.first_name} {testimony.last_name}
                  </TableCell>
                  <TableCell className="text-gray-300">{testimony.email}</TableCell>
                  <TableCell className="text-gray-300">{testimony.phone_number}</TableCell>
                  <TableCell className="text-gray-300">{testimony.country}</TableCell>
                  <TableCell className="text-gray-300 max-w-md truncate">
                    {testimony.testimony}
                  </TableCell>
                  <TableCell className="text-gray-300">
                    {testimony.approved ? (
                      <span className="text-green-500">Approved</span>
                    ) : (
                      <span className="text-yellow-500">Pending</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        className={`h-8 w-8 ${testimony.approved ? "text-green-500" : "text-gray-400"}`}
                        onClick={() => handleApproveTestimony({id:testimony.id, approved:true})}
                      >
                        <Check className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className={`h-8 w-8 ${!testimony.approved ? "text-red-500" : "text-gray-400"}`}
                        onClick={() => handleApproveTestimony({id:testimony.id, approved:false})}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow className="bg-[#0e1723] hover:bg-[#0e1723]">
                <TableCell colSpan={7} className="text-center text-gray-300">
                  No testimonies found
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