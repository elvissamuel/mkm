"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Check } from "lucide-react"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import OtpDialog from "@/components/otp-dialog"

const personalInfoSchema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phoneCountry: z.string(),
  phoneNumber: z.string().min(10, "Phone number must be at least 10 digits"),
  address: z.string().min(5, "Please enter a valid address"),
  apartment: z.string().optional(),
  country: z.string().min(1, "Please select a country"),
  city: z.string().min(1, "Please select a city"),
})

const paymentInfoSchema = z.object({
  program: z.enum(["regular", "premium"]),
  cardName: z.string().min(2, "Please enter the cardholder name"),
  cardNumber: z.string().min(16, "Please enter a valid card number"),
  expiryDate: z.string().min(5, "Please enter a valid expiry date"),
  cvv: z.string().min(3, "Please enter a valid CVV"),
  discountCode: z.string().optional(),
})

export default function ProgramRegistration() {
  const [step, setStep] = useState(1)
  const [showOtp, setShowOtp] = useState(false)

  const form1 = useForm<z.infer<typeof personalInfoSchema>>({
    resolver: zodResolver(personalInfoSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phoneCountry: "NG",
      phoneNumber: "",
      address: "",
      apartment: "",
      country: "",
      city: "",
    },
  })

  const form2 = useForm<z.infer<typeof paymentInfoSchema>>({
    resolver: zodResolver(paymentInfoSchema),
    defaultValues: {
      program: "premium",
      cardName: "",
      cardNumber: "",
      expiryDate: "",
      cvv: "",
      discountCode: "",
    },
  })

  const programs = {
    regular: {
      title: "Regular Program",
      price: "$6.45",
      localPrice: "₦10,000",
      period: "Monthly Fee",
    },
    premium: {
      title: "Premium Program",
      price: "$161.2",
      localPrice: "₦250,000",
      period: "One Time Annual Fee",
    },
  }

  const features = [
    "Monthly group coaching session",
    "Accountability structure",
    "Access to weekly inspiring email",
    "Access to special resources and material",
  ]

  const onSubmitStep1 = (data: z.infer<typeof personalInfoSchema>) => {
    console.log(data)
    setStep(2)
  }

  const onSubmitStep2 = (data: z.infer<typeof paymentInfoSchema>) => {
    console.log(data)
    // Handle payment submission
  }

  const handleOtpVerify = () => {
    console.error("verified")
  }

  return (
    <div className="min-h-screen bg-white text-black">
      <main className="container mx-auto max-w-3xl px-4 py-16">
        <div className="mb-8 text-center">
          <h1 className="mb-2 font-serif text-3xl font-bold">Program Registration</h1>
          <p className="text-gray-600">Let&apos;s get you set up. It should only take a few minutes.</p>
          <div className="mx-auto mt-2 h-1 w-16 bg-[#B8860B]"></div>
        </div>

        {step === 1 ? (
          <Form {...form1}>
            <form onSubmit={form1.handleSubmit(onSubmitStep1)} className="space-y-6">
              <div className="grid gap-4 sm:grid-cols-2">
                <FormField
                  control={form1.control}
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
                  control={form1.control}
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
                control={form1.control}
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
                    control={form1.control}
                    name="phoneCountry"
                    render={({ field }) => (
                      <Select  onValueChange={field.onChange} defaultValue={field.value}>
                        <SelectTrigger className="bg-transparent focus:outline-none focus:ring-0 focus:border-gray-500 focus:border-none w-[100px]">
                          <SelectValue placeholder="Country" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="NG">🇳🇬 +234</SelectItem>
                          <SelectItem value="US">🇺🇸 +1</SelectItem>
                          <SelectItem value="GB">🇬🇧 +44</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  />
                  <FormField
                    control={form1.control}
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

              <FormField
                control={form1.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Address*</FormLabel>
                    <FormControl>
                      <Input placeholder="No. 1 example street" className="bg-transparent focus:outline-none focus:ring-0 focus:border-gray-500 focus:border-none" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form1.control}
                name="apartment"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Apartment, suite, unit (optional)</FormLabel>
                    <FormControl>
                      <Input placeholder="Check to your address" className="bg-transparent focus:outline-none focus:ring-0 focus:border-gray-500 focus:border-none" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid gap-4 sm:grid-cols-2">
                <FormField
                  control={form1.control}
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
                  control={form1.control}
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
                <Button variant="outline" className="text-white" type="button">
                  Previous
                </Button>
                <Button type="submit" className="bg-[#B8860B] hover:bg-[#8B6508]">
                  Next
                </Button>
              </div>
            </form>
          </Form>
        ) : (
          <Form {...form2}>
            <form onSubmit={form2.handleSubmit(onSubmitStep2)} className="grid gap-8 md:grid-cols-2">
              <div>
                <div className="mb-6">
                  <h2 className="mb-4 font-serif text-xl font-semibold">Change Mentorship Program</h2>
                  <FormField
                    control={form2.control}
                    name="program"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="space-y-4">
                            {Object.entries(programs).map(([key, program]) => (
                              <div key={key} className="flex items-center space-x-2">
                                <RadioGroupItem className=" bg-black" value={key} id={key} />
                                <FormLabel htmlFor={key} className="flex flex-1 items-center justify-between">
                                  <span>{program.title}</span>
                                  <span>
                                    {program.price} ({program.localPrice})
                                    <br />
                                    <span className="text-sm text-gray-500">{program.period}</span>
                                  </span>
                                </FormLabel>
                              </div>
                            ))}
                          </RadioGroup>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div>
                  <h3 className="mb-4 font-medium">Key Features:</h3>
                  <ul className="space-y-3">
                    {features.map((feature, index) => (
                      <li key={index} className="flex items-center gap-2">
                        <Check className="h-5 w-5 text-green-500" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div>
                <div className="mb-6">
                  <h2 className="mb-4 font-serif text-xl font-semibold">Payment Method</h2>
                  <Tabs defaultValue="card" className="w-full">
                    <TabsList className="grid w-full grid-cols-2 bg-transparent border">
                      <TabsTrigger value="card">Credit Card</TabsTrigger>
                      <TabsTrigger value="paypal">PayPal</TabsTrigger>
                    </TabsList>
                    <TabsContent value="card" className="space-y-4">
                      <FormField
                        control={form2.control}
                        name="cardName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Cardholder Name</FormLabel>
                            <FormControl>
                              <Input className="bg-transparent focus:outline-none focus:ring-0 focus:border-gray-500 focus:border-none" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form2.control}
                        name="cardNumber"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Card Number</FormLabel>
                            <FormControl>
                              <Input className="bg-transparent focus:outline-none focus:ring-0 focus:border-gray-500 focus:border-none" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <div className="grid grid-cols-2 gap-4">
                        <FormField
                          control={form2.control}
                          name="expiryDate"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Expiry Date</FormLabel>
                              <FormControl>
                                <Input className="bg-transparent focus:outline-none focus:ring-0 focus:border-gray-500 focus:border-none" placeholder="MM/YY" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form2.control}
                          name="cvv"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>CVV</FormLabel>
                              <FormControl>
                                <Input className="bg-transparent focus:outline-none focus:ring-0 focus:border-gray-500 focus:border-none" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      <Button type="button" variant="outline" className="w-full bg-black text-white hover:bg-gray-800">
                        Add New Card
                      </Button>
                    </TabsContent>
                    <TabsContent value="paypal">
                      <div className="rounded-lg border border-gray-200 p-4 text-center">
                        PayPal integration will be implemented here
                      </div>
                    </TabsContent>
                  </Tabs>
                </div>

                <div className="mb-6">
                  <h3 className="mb-2 font-medium">Discount Code</h3>
                  <div className="flex gap-2">
                    <FormField
                      control={form2.control}
                      name="discountCode"
                      render={({ field }) => (
                        <FormItem className="flex-1">
                          <FormControl>
                            <Input className="bg-transparent focus:outline-none focus:ring-0 focus:border-gray-500 focus:border-none" placeholder="Enter code" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button type="button" variant="outline" className="shrink-0 text-white">
                      Apply
                    </Button>
                  </div>
                </div>

                <div className="rounded-lg border border-gray-200 p-4">
                  <h3 className="mb-4 font-medium">Summary</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Mentorship program</span>
                      <span>
                        {programs[form2.watch("program")].price} ({programs[form2.watch("program")].localPrice})
                      </span>
                    </div>
                    <div className="flex justify-between text-gray-500">
                      <span>Discount</span>
                      <span>--</span>
                    </div>
                    <div className="flex justify-between border-t pt-2 font-medium">
                      <span>Total</span>
                      <span>
                        {programs[form2.watch("program")].price} ({programs[form2.watch("program")].localPrice})
                      </span>
                    </div>
                    <p className="text-sm text-gray-500">Your next payment will be charged on 12th Feb, 2024</p>
                  </div>
                </div>

                <div className="mt-6 flex justify-between">
                  <Button type="button" className="text-white" variant="outline" onClick={() => setStep(1)}>
                    Previous
                  </Button>
                  <Button type="submit" className="bg-[#B8860B] hover:bg-[#8B6508]">
                    Pay Now
                  </Button>
                  <Button onClick={(e)=> {e.preventDefault(); setShowOtp(true)}} type="button" className="bg-[#B8860B] hover:bg-[#8B6508]">
                    Verify
                  </Button>
                  <OtpDialog isOpen={showOtp} onClose={() => setShowOtp(false)} onVerify={handleOtpVerify} />
                </div>
              </div>
            </form>
          </Form>
        )}
      </main>
    </div>
  )
}

