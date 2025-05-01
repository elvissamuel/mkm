"use client"

import type React from "react"
import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Pencil, Trash2 } from "lucide-react"
import { useQuery, useQueryClient } from "@tanstack/react-query"
import { QUERY_KEY } from "@/lib/rbac"
import { createProgram, deleteProgram, editProgram, getPrograms } from "@/lib/api-calls"
import { AddProgramForm } from "@/components/admin/AddProgramForm"
import { EditProgramForm } from "@/components/admin/EditProgramForm"
import { DeleteProgramDialog } from "@/components/admin/DeleteProgramDialog"
import { useToast } from "@/hooks/use-toast"
import { Program } from "@prisma/client"

interface ProgramWithLocalPrice extends Program {
  local_price: string
}

export default function ProgramsPage() {
  const [loading, setLoading] = useState(true)
  const [programs, setPrograms] = useState<ProgramWithLocalPrice[]>([])
  const [editingProgram, setEditingProgram] = useState<ProgramWithLocalPrice | null>(null)
  const [deletingProgram, setDeletingProgram] = useState<ProgramWithLocalPrice | null>(null)
  const { toast } = useToast()
  const queryClient = useQueryClient()
  
  useQuery({
    queryKey: [QUERY_KEY.GET_ALL_PROGRAMS],
    queryFn: async () => {
      const { data, error, validationErrors } = await getPrograms();

      if (data) {
        setPrograms(
          data.map(item => ({
            ...item,
            local_price: item.price === 78 ? "120,000" : "250,000"
          }))
        );
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

  const handleAddProgram = async (input: any) => {
    const { data, error, validationErrors } = await createProgram(input);
    
    if (validationErrors?.length) {
      toast({
        variant: "destructive",
        title: "Error",
        description: validationErrors[0].message,
      });
      return;
    }

    if (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to create program.",
      });
      return;
    }

    if (data) {
      toast({
        variant: "default",
        title: "Success",
        description: "Program created successfully!",
      });
      // Invalidate the programs query to refresh the data
      await queryClient.invalidateQueries({ queryKey: [QUERY_KEY.GET_ALL_PROGRAMS] });
    }
  }

  const handleEditProgram = async (input: any) => {
    const { data, error, validationErrors } = await editProgram(input);
    
    if (validationErrors?.length) {
      toast({
        variant: "destructive",
        title: "Error",
        description: validationErrors[0].message,
      });
      return;
    }

    if (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update program.",
      });
      return;
    }

    if (data) {
      toast({
        variant: "default",
        title: "Success",
        description: "Program updated successfully!",
      });
      setEditingProgram(null);
      // Invalidate the programs query to refresh the data
      await queryClient.invalidateQueries({ queryKey: [QUERY_KEY.GET_ALL_PROGRAMS] });
    }
  }

  const handleDeleteProgram = async () => {
    if (!deletingProgram) return;

    const { data, error, validationErrors } = await deleteProgram({ id: deletingProgram.id });
    
    if (validationErrors?.length) {
      toast({
        variant: "destructive",
        title: "Error",
        description: validationErrors[0].message,
      });
      return;
    }

    if (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete program.",
      });
      return;
    }

    if (data) {
      toast({
        variant: "default",
        title: "Success",
        description: "Program deleted successfully!",
      });
      setDeletingProgram(null);
      // Invalidate the programs query to refresh the data
      await queryClient.invalidateQueries({ queryKey: [QUERY_KEY.GET_ALL_PROGRAMS] });
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight text-[#c19b37]">Programs</h1>
        <AddProgramForm onSubmit={handleAddProgram} />
      </div>

      <div className="rounded-md border border-[#c19b37]/20">
        <Table>
          <TableHeader>
            <TableRow className="bg-[#0e1723] hover:bg-[#0e1723]">
              <TableHead className="text-gray-300">Name</TableHead>
              <TableHead className="text-gray-300">Features</TableHead>
              <TableHead className="text-gray-300">Duration</TableHead>
              <TableHead className="text-gray-300">Price($)</TableHead>
              <TableHead className="text-gray-300">Local Price(₦)</TableHead>
              <TableHead className="w-[100px] text-gray-300">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              [...Array(3)].map((_, i) => (
                <TableRow key={i} className="bg-[#0e1723] hover:bg-[#0e1723]">
                  {[...Array(5)].map((_, j) => (
                    <TableCell key={j}>
                      <div className="h-5 w-full animate-pulse rounded bg-[#c19b37]/20"></div>
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : programs.length > 0 ? (
              programs.map((program) => (
                <TableRow key={program.id} className="bg-[#0e1723] hover:bg-[#0e1723]">
                  <TableCell className="font-medium text-gray-300">{program.name}</TableCell>
                  <TableCell className="text-gray-300">{program.features}</TableCell>
                  <TableCell className="text-gray-300">{program.duration}</TableCell>
                  <TableCell className="text-gray-300">${(program.price).toFixed(2)}</TableCell>
                  <TableCell className="text-gray-300">₦{(parseFloat(program.local_price)).toFixed(2)}</TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="text-[#c19b37] hover:bg-[#c19b37]/20"
                        onClick={() => setEditingProgram(program)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="text-red-500 hover:bg-red-500/20"
                        onClick={() => setDeletingProgram(program)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow className="bg-[#0e1723] hover:bg-[#0e1723]">
                <TableCell colSpan={5} className="text-center text-gray-300">
                  No programs found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {editingProgram && (
        <EditProgramForm
          program={editingProgram}
          isOpen={!!editingProgram}
          onOpenChange={(open) => !open && setEditingProgram(null)}
          onSubmit={handleEditProgram}
        />
      )}

      {deletingProgram && (
        <DeleteProgramDialog
          program={deletingProgram}
          isOpen={!!deletingProgram}
          onOpenChange={(open) => !open && setDeletingProgram(null)}
          onConfirm={handleDeleteProgram}
        />
      )}
    </div>
  )
}
