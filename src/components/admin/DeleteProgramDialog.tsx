"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Program } from "@prisma/client"

interface DeleteProgramDialogProps {
  program: Program & { local_price: string }
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  onConfirm: () => void
}

export function DeleteProgramDialog({ program, isOpen, onOpenChange, onConfirm }: DeleteProgramDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="bg-[#0e1723] border-[#c19b37]/20 text-gray-200">
        <DialogHeader>
          <DialogTitle className="text-[#c19b37]">Delete Program</DialogTitle>
          <DialogDescription className="text-gray-400">
            Are you sure you want to delete "{program.name}"? This action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="border-[#c19b37]/20 text-gray-300 hover:bg-[#c19b37]/20"
          >
            Cancel
          </Button>
          <Button
            onClick={onConfirm}
            className="bg-red-500 hover:bg-red-600"
          >
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
} 