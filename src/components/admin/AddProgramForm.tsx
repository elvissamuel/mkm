"use client"

import * as React from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Plus } from "lucide-react"
import { createProgramSchema } from "@/lib/validation-schema"
import { createProgram } from "@/lib/api-calls"
import { useToast } from "@/hooks/use-toast"

interface AddProgramFormProps {
  onSubmit: (data: z.infer<typeof createProgramSchema>) => void
}

export function AddProgramForm({ onSubmit }: AddProgramFormProps) {
  const [isOpen, setIsOpen] = React.useState(false)
  const { toast } = useToast();

  const form = useForm<z.infer<typeof createProgramSchema>>({
    resolver: zodResolver(createProgramSchema),
    defaultValues: {
      name: "",
      features: "",
      duration: "",
      price: 0,
    },
  })

  const handleSubmit = (data: z.infer<typeof createProgramSchema>) => {
    onSubmit(data)
    form.reset()
    setIsOpen(false)
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="bg-[#c19b37] hover:bg-[#a8842e]">
          <Plus className="mr-2 h-4 w-4" />
          Add Program
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-[#0e1723] border-[#c19b37]/20 text-gray-200">
        <DialogHeader>
          <DialogTitle className="text-[#c19b37]">Add New Program</DialogTitle>
          <DialogDescription className="text-gray-400">
            Create a new program for your users.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-300">Program Name</FormLabel>
                  <FormControl>
                    <Input 
                      className="bg-[#0e1723] border-[#c19b37]/20 text-gray-200" 
                      placeholder="Enter program name" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="features"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-300">Features (comma separated)</FormLabel>
                  <FormControl>
                    <Textarea
                      className="bg-[#0e1723] border-[#c19b37]/20 text-gray-200"
                      placeholder="Enter features separated by commas"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription className="text-gray-400">
                    Separate each feature with a comma
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="duration"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-300">Duration</FormLabel>
                    <FormControl>
                      <Input
                        className="bg-[#0e1723] border-[#c19b37]/20 text-gray-200"
                        placeholder="e.g. 3 months"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-300">Price (in cents)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        className="bg-[#0e1723] border-[#c19b37]/20 text-gray-200"
                        placeholder="Enter price"
                        {...field}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <DialogFooter>
              <Button 
                type="submit" 
                className="bg-[#c19b37] hover:bg-[#a8842e]"
              >
                Save Program
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
} 