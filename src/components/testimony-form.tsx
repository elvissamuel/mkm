"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { testimonyFormSchema, TestimonyFormSchema } from "@/lib/validation-schema"
import { trpc } from "@/app/_providers/trpc-provider"
import { useToast } from '@/hooks/use-toast'
import { useState } from "react"
import { addTestimony } from "@/lib/api-calls"


export default function TestimonyForm() {
  const { toast } = useToast()
  const [loading, setLoading] = useState(false);
  const form = useForm<TestimonyFormSchema>({
    resolver: zodResolver(testimonyFormSchema),
    defaultValues: {
      first_name: "",
      last_name: "",
      email: "",
      phone_number: "",
      country: "",
      city: "",
      testimony: "",
    },
  })

  // const addTestimony = trpc.createTestimony.useMutation({
  //   onSuccess: async () => {
  //     toast({title: "Testimony submitted successfully"});
  //     form.reset();
  //   },
  //   onError: (error) => {
  //     console.error(error);
  //     toast({
  //       title: 'Error in submitting testimony',
  //       description: error.message,
  //       variant: 'destructive',
  //     });
  //   },
  // });

  // function onSubmit(values: TestimonyFormSchema) {
  //   setLoading(true)
  //   console.log(values)
  //   addTestimony.mutate({ ...values });
  //   setLoading(false)
  // }

  const onSubmit = async (input: TestimonyFormSchema) => {
    const { data, error, validationErrors } = await addTestimony({ ...input });
  
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
        description: "Failed to create testimony.",
      });
  
      return;
    }
  
    if (data) {
      toast({
        variant: "default",
        title: "Success",
        description: "Testimony created successfully!",
      });
      // queryClient.invalidateQueries({ queryKey: [QUERY_KEY.GET_ALL_ACCOUNTS] });
      form.reset();
    }
  };

  return (
    <div className="rounded-2xl bg-[#FDF8F3] p-8">
      <div className="mb-8 text-center">
        <h2 className="mb-2 font-serif text-3xl font-bold">Share Your Testimony</h2>
        <p className="text-gray-600">
          We would love to hear how our programs has impacted your life, family and career.
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit, (error) => console.error("form err: ", error))} className="space-y-6">
          <div className="grid gap-6 sm:grid-cols-2">
            <FormField
              control={form.control}
              name="first_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>First Name*</FormLabel>
                  <FormControl>
                    <Input className="bg-transparent focus:outline-none focus:ring-0 focus:border-gray-500 focus:border-none" placeholder="John" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="last_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Last Name*</FormLabel>
                  <FormControl>
                    <Input className="bg-transparent focus:outline-none focus:ring-0 focus:border-gray-500 focus:border-none" placeholder="Doe" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email Address*</FormLabel>
                <FormControl>
                  <Input className="bg-transparent focus:outline-none focus:ring-0 focus:border-gray-500 focus:border-none" type="email" placeholder="john@example.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="space-y-2">
            
            <div className="grid grid-cols-[auto,1fr] gap-2">
                  <Select>
                    <SelectTrigger  className="bg-transparent focus:outline-none focus:ring-0 focus:border-gray-500 focus:border-none w-[100px]">
                      <SelectValue placeholder="🇳🇬 +234" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="NG">🇳🇬 +234</SelectItem>
                      <SelectItem value="US">🇺🇸 +1</SelectItem>
                      <SelectItem value="GB">🇬🇧 +44</SelectItem>
                    </SelectContent>
                  </Select>
                  </div>

              <FormField
                control={form.control}
                name="phone_number"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input className="bg-transparent focus:outline-none focus:ring-0 focus:border-gray-500 focus:border-none" placeholder="Enter phone number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

          <div className="grid gap-6 sm:grid-cols-2">
            <FormField
              control={form.control}
              name="country"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Country/Region*</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <SelectTrigger className="bg-transparent focus:outline-none focus:ring-0 focus:border-gray-500 focus:border-none">
                      <SelectValue placeholder="Select your country" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="NG">Nigeria</SelectItem>
                      <SelectItem value="US">United States</SelectItem>
                      <SelectItem value="GB">United Kingdom</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="city"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>City/Town*</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <SelectTrigger className="bg-transparent focus:outline-none focus:ring-0 focus:border-gray-500 focus:border-none">
                      <SelectValue placeholder="Select your city" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="lagos">Lagos</SelectItem>
                      <SelectItem value="abuja">Abuja</SelectItem>
                      <SelectItem value="ph">Port Harcourt</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="testimony"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Share Your Testimony*</FormLabel>
                <FormControl>
                  <Textarea placeholder="No. 1 example street" className="bg-transparent focus:outline-none focus:ring-0 focus:border-gray-500 focus:border-none min-h-[150px]" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="text-center">
            <Button disabled={loading} type="submit" className="bg-black text-white hover:bg-gray-800">
              {loading ? "Loading..." : "Submit Testimony"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  )
}

