"use client"

import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { useParams } from "next/navigation"
import { useQuery } from "@tanstack/react-query"
import { QUERY_KEY } from "@/lib/rbac"
import { getSingleProgram, registerUser, sendEmail } from "@/lib/api-calls"
import { Program, User } from "@prisma/client"
import PayazaCheckout from "payaza-web-sdk";
import { PersonalInfoSchema, personalInfoSchema } from "@/lib/validation-schema"
import { useToast } from "@/hooks/use-toast"
import { ConnectionMode } from "payaza-web-sdk/lib/PayazaCheckout"


export default function ProgramRegistration() {
  const params = useParams() as {id: string};
  const [program, setProgram] = useState<Program>({} as Program)
  const { toast } = useToast();
  const [user, setUser] = useState<User>({} as User)

   useQuery({
      queryKey: [QUERY_KEY.GET_ALL_PROGRAMS],
      queryFn: async () => {
        const { data, error, validationErrors } = await getSingleProgram({id: params.id});
  
        if (data) {
          setProgram(data);
          console.log("program data: ", data);
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

    useEffect(()=> {
      const payazaCheckout = new PayazaCheckout({
        merchant_key: "PZ78-PKTEST-6B20E56B-2639-49E3-8926-0AC8363EDF8C",
        connection_mode: ConnectionMode.TEST, // Live || Test
        checkout_amount: Number(2000),
        currency_code: "NGN",   
        email_address: user.email,
        first_name: user.first_name,
        last_name: user.last_name,
        phone_number: user.phone_number as string,
        transaction_reference: 'your_reference',
        currency: "NG",
    
        onClose: function() {
          console.log("Closed")
        },
        callback: function(callbackResponse) {
          console.log(callbackResponse)
        }
      });

      payazaCheckout.showPopup();

    }, [user])

  const form = useForm<z.infer<typeof personalInfoSchema>>({
    resolver: zodResolver(personalInfoSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phoneCountry: "NG",
      phoneNumber: "",
      country: "",
      city: "",
    },
  })

  const onSubmit = async (input: PersonalInfoSchema) => {
    const { data, error, validationErrors } = await registerUser(input);

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
        description: "Failed to create user.",
      });

      return;
    }

    if (data) {
      toast({
        variant: "default",
        title: "Success",
        description: "User created successfully!",
      });
      
      setUser(data);
      form.reset();
    }
  };

  return (
    <div className="min-h-screen bg-white text-black">
      <main className="container mx-auto max-w-3xl px-4 py-16">
        <div className="mb-8 text-center">
          <h1 className="mb-2 font-serif text-3xl font-bold">Program Registration for {program.name}</h1>
          <p className="text-gray-600">Let&apos;s get you set up. It should only take a few minutes.</p>
          <div className="mx-auto mt-2 h-1 w-16 bg-[#B8860B]"></div>
        </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit, (error) => console.error("Form err: ", error))} className="space-y-6">
              <div className="grid gap-4 sm:grid-cols-2">
                <FormField
                  control={form.control}
                  name="firstName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>First Name*</FormLabel>
                      <FormControl>
                        <Input placeholder="John" className="bg-transparent focus:outline-none focus:ring-0 focus:border-gray-500 focus:border-none" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="lastName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Last Name*</FormLabel>
                      <FormControl>
                        <Input placeholder="Doe" className="bg-transparent focus:outline-none focus:ring-0 focus:border-gray-500 focus:border-none" {...field} />
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
                      <Input type="email" className="bg-transparent focus:outline-none focus:ring-0 focus:border-gray-500 focus:border-none" placeholder="john@example.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="space-y-2">
                <FormLabel>Phone Number*</FormLabel>
                <div className="grid grid-cols-[auto,1fr] gap-2">
                  <FormField
                    control={form.control}
                    name="phoneCountry"
                    render={({ field }) => (
                      <Select  onValueChange={field.onChange} defaultValue={field.value}>
                        <SelectTrigger className="bg-transparent focus:outline-none focus:ring-0 focus:border-gray-500 focus:border-none w-[100px]">
                          <SelectValue placeholder="Country" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="+234">🇳🇬 +234</SelectItem>
                          <SelectItem value="+1">🇺🇸 +1</SelectItem>
                          <SelectItem value="+44">🇬🇧 +44</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="phoneNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input placeholder="Enter phone number" className="bg-transparent focus:outline-none focus:ring-0 focus:border-gray-500 focus:border-none" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
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

              <div className="flex justify-between pt-6">
                <div>
                  <button onClick={() => sendEmail()} type="button">Payaza</button>
                </div>
                <Button type="submit" className="bg-[#B8860B] hover:bg-[#8B6508]">
                  {form.formState.isSubmitting ? "Submitting..." : "Proceed to Pay"}
                </Button>
              </div>
            </form>
          </Form>
      </main>
    </div>
  )
}

