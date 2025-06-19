"use client"

import { useEffect, useRef, useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { useParams } from "next/navigation"
import { useQuery } from "@tanstack/react-query"
import { QUERY_KEY } from "@/lib/rbac"
import { getProgramById, getPrograms, getSingleProgram, registerUser, resendEmail, sendEmail } from "@/lib/api-calls"
import { Program, User } from "@prisma/client"
import { PersonalInfoSchema, personalInfoSchema } from "@/lib/validation-schema"
import { useToast } from "@/hooks/use-toast"
import Select from "react-select";
import countries from "world-countries";
import PaystackTrigger, { PaystackTriggerRef } from "@/components/PaystackTrigger";
import { getCountryCallingCode, CountryCode } from "libphonenumber-js"
import { getCode } from "country-list"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { UserWithSubscriptions } from "@/lib/model"

type CountryOption = {
  value: string;
  label: string;
  callingCode?: string;
};

interface Props {
  user: UserWithSubscriptions
}

export default function ApplicationForm({user}: Props) {
  const params = useParams() as {id: string};
  const [program, setProgram] = useState<Program & {local_price: string}>({...user.program, local_price: user.program.price === 78 ? "120,000" : "250,000" })
  const { toast } = useToast();
  // const [user, setUser] = useState<User>({} as User)
    const options: CountryOption[] = countries
    .filter(country => {
      try {
        // Map common country names to their ISO codes
        const countryNameMap: { [key: string]: string } = {
          "United States": "US",
          "United Kingdom": "GB",
          "United States of America": "US",
          "Great Britain": "GB",
          "U.S.A.": "US",
          "USA": "US",
          "UK": "GB",
          "U.K.": "GB"
        };

        const isoCode = countryNameMap[country.name.common] || getCode(country.name.common);
        if (!isoCode) return false;
        getCountryCallingCode(isoCode as CountryCode);
        return true;
      } catch {
        return false;
      }
    })
    .map((country) => {
      const countryNameMap: { [key: string]: string } = {
        "United States": "US",
        "United Kingdom": "GB",
        "United States of America": "US",
        "Great Britain": "GB",
        "U.S.A.": "US",
        "USA": "US",
        "UK": "GB",
        "U.K.": "GB"
      };
      const isoCode = countryNameMap[country.name.common] || getCode(country.name.common);
      const callingCode = getCountryCallingCode(isoCode as CountryCode);
      return {
        value: country.name.common,
        label: country.name.common,
        callingCode
      };
    });
    const [programs, setPrograms] = useState<(Program & {local_price: string})[]>([]);
    
      const { isLoading } = useQuery({
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

  const paystackRef = useRef<PaystackTriggerRef>(null);

  //  useQuery({
  //     queryKey: [QUERY_KEY.GET_SINGLE_PROGRAM],
  //     queryFn: async () => {
  //       const { data, error, validationErrors } = await getProgramById({id: user.program_id!});
  
  //       if (data) {
  //         setProgram({...data, local_price: data.price === 78 ? "120,000" : "250,000" });
  //       }
  
  //       if (validationErrors?.length) {
  //         console.error(validationErrors);
  
  //         return;
  //       }
  
  //       if (error) {
  //         console.error(error);
  //       }
  //     },
  //     enabled: !!user.program_id // Only run if user has a program_id
  //   });

    const handlePaymentSuccess = async (ref: any) => {
    const email = form.getValues("email");
    console.log("email", email)
    const {data} = await resendEmail({email, amount: program.price, program_id: program.id});

    if(data){
      toast({
        variant: "default",
        title: "Success",
        description: "Payment Successful!",
      });
    form.reset();
    }
  };

  const form = useForm<z.infer<typeof personalInfoSchema>>({
    resolver: zodResolver(personalInfoSchema),
    defaultValues: {
      firstName: user.first_name,
      lastName: user.last_name,
      email: user.email,
      phoneCountry: user.phone_number?.split("+")[1]?.split(" ")[0] || "",
      phoneNumber: user.phone_number?.slice(-10) || "",
      country: user.country || "",
      city: user.city || "",
      gender: user.gender || "female",
      programId: program.id || ""
    },
  })

  // Update form values when user data changes
  useEffect(() => {
    if (user.program_id) {
      form.setValue("programId", user.program_id);
    }
  }, [user.program_id, form]);

  // Set initial program when programs are loaded and user has a program_id
  // useEffect(() => {
  //   if (programs.length > 0 && user.program_id) {
  //     const userProgram = programs.find(p => p.id === user.program_id);
  //     if (userProgram) {
  //       setProgram({...userProgram, local_price: userProgram.price === 78 ? "120,000" : "250,000"});
  //     }
  //   }
  // }, [programs, user.program_id]);

    const selectedCountry = form.watch("country");
  const selectedCountryOption = options.find(option => option.value === selectedCountry);
  const countryCallingCode = selectedCountryOption?.callingCode || "";

  // Update phone_country_code when country changes
  useEffect(() => {
    if (selectedCountry) {
      form.setValue("phoneCountry", countryCallingCode);
    }
  }, [selectedCountry, countryCallingCode, form]);

  const onSubmit = async (input: PersonalInfoSchema) => {
    const paymentStatus = program.id ? getPaymentStatus(program.id) : null;
    
    if (paymentStatus?.isFullyPaid) {
      toast({
        variant: "default",
        title: "Already Paid",
        description: "You have already fully paid for this program!",
      });
      return;
    }

    // Directly trigger payment since user is already registered
    paystackRef.current?.triggerPayment();
  };

  // Calculate payment status for the selected program
  const getPaymentStatus = (programId: string) => {
    const subscription = user.user_subscriptions.find(sub => sub.program_id === programId);
    if (!subscription) return null;

    const totalPaid = subscription.payments.reduce((sum, payment) => sum + payment.amount, 0);
    const programPrice = subscription.program.price;
    const remainingAmount = programPrice - totalPaid;
    const isFullyPaid = remainingAmount <= 0;

    return {
      subscription,
      totalPaid,
      programPrice,
      remainingAmount: Math.max(0, remainingAmount),
      isFullyPaid,
      paymentStatus: subscription.payment_status
    };
  };

  return (
    <div className="min-h-screen bg-white text-black">
      <main className="container mx-auto max-w-3xl px-4 py-16">
        <div className="mb-8 text-center">
          <h1 className="mb-2 font-serif text-3xl font-bold">Program Registration for {program.name || user.program?.name}</h1>
          <p className="text-gray-600">Let&apos;s get you set up. It should only take a few minutes.</p>
          <div className="mx-auto mt-2 h-1 w-16 bg-[#B8860B]"></div>
        </div>

        {/* Payment Status Section */}
        {program.id && (
          <div className="mb-8 p-6 bg-blue-50 rounded-lg border border-blue-200">
            <div className="text-center">
              <h2 className="text-2xl font-semibold text-blue-800 mb-4">Your Payment Status</h2>
              {(() => {
                const paymentStatus = getPaymentStatus(program.id);
                if (!paymentStatus) {
                  return (
                    <div className="text-blue-600">
                      <p className="text-lg">No subscription found for this program.</p>
                      <p className="text-sm mt-2">Complete your registration to get started.</p>
                    </div>
                  );
                }

                return (
                  <div className="space-y-4">
                    <div className="flex justify-between items-center p-4 bg-white rounded-lg border border-blue-200">
                      <span className="text-gray-700 font-medium">Total Program Cost:</span>
                      <span className="text-2xl font-bold text-blue-800">${paymentStatus.programPrice}</span>
                    </div>
                    
                    <div className="flex justify-between items-center p-4 bg-white rounded-lg border border-blue-200">
                      <span className="text-gray-700 font-medium">Amount Paid:</span>
                      <span className="text-2xl font-bold text-green-600">${paymentStatus.totalPaid}</span>
                    </div>

                    {!paymentStatus.isFullyPaid && (
                      <div className="flex justify-between items-center p-4 bg-white rounded-lg border border-orange-200">
                        <span className="text-gray-700 font-medium">Remaining Balance:</span>
                        <span className="text-2xl font-bold text-orange-600">${paymentStatus.remainingAmount}</span>
                      </div>
                    )}

                    <div className="mt-4 p-3 rounded-lg bg-white border">
                      <div className="flex items-center justify-center space-x-2">
                        <div className={`w-3 h-3 rounded-full ${
                          paymentStatus.isFullyPaid ? 'bg-green-500' : 'bg-orange-500'
                        }`}></div>
                        <span className={`font-semibold ${
                          paymentStatus.isFullyPaid ? 'text-green-700' : 'text-orange-700'
                        }`}>
                          {paymentStatus.isFullyPaid ? 'Fully Paid' : 'Partially Paid'}
                        </span>
                      </div>
                    </div>

                    {paymentStatus.isFullyPaid && (
                      <div className="mt-4 p-4 bg-green-50 rounded-lg border border-green-200">
                        <p className="text-green-800 font-medium">🎉 Congratulations! You have full access to this program.</p>
                      </div>
                    )}
                  </div>
                );
              })()}
            </div>
          </div>
        )}

        <div className="mb-8 p-6 bg-gray-50 rounded-lg border border-gray-200">
          <div className="text-center">
            <h2 className="text-2xl font-semibold text-gray-800 mb-2">Program Investment</h2>
            <div className="flex flex-col items-center justify-center gap-2">
              <div className="flex items-center justify-center gap-2">
                <span className="text-4xl font-bold text-[#B8860B]">${program.price || user.program?.price}</span>
                <span className="text-gray-600">USD</span>
              </div>
              <div className="flex items-center justify-center gap-2">
                <span className="text-3xl font-bold text-[#B8860B]">₦{(program.price || user.program?.price) === 78 ? "120,000" : "250,000"}</span>
                <span className="text-gray-600">NGN</span>
              </div>
            </div>
            <p className="mt-2 text-gray-600">One-time payment for full program access</p>
          </div>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit, (error) => console.error("Form err: ", error))} className="space-y-6">
            <FormField
              control={form.control}
              name="programId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Select Program*</FormLabel>
                  <Select
                    options={programs.map(program => ({
                      value: program.id,
                      label: program.name
                    }))}
                    value={programs.find(program => program.id === field.value) ? {
                      value: field.value,
                      label: programs.find(program => program.id === field.value)?.name || ""
                    } : user.program ? {
                      value: user.program.id,
                      label: user.program.name
                    } : null}
                    onChange={(option) => {
                      field.onChange(option?.value);
                      const selectedProgram = programs.find(p => p.id === option?.value);
                      if (selectedProgram) {
                        setProgram({...selectedProgram, local_price: selectedProgram.price === 78 ? "120,000" : "250,000"});
                      }
                    }}
                  />
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid gap-4 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>First Name*</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="John" 
                        className="bg-transparent focus:outline-none focus:ring-0 focus:border-gray-500 focus:border-none" 
                        {...field} 
                        readOnly 
                      />
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
                      <Input 
                        placeholder="Doe" 
                        className="bg-transparent focus:outline-none focus:ring-0 focus:border-gray-500 focus:border-none" 
                        {...field} 
                        readOnly 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email Address*</FormLabel>
                    <FormControl>
                      <Input 
                        type="email" 
                        className="bg-transparent focus:outline-none focus:ring-0 focus:border-gray-500 focus:border-none" 
                        placeholder="john@example.com" 
                        {...field} 
                        readOnly 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="country"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Country of Residence*</FormLabel>
                    <FormControl>
                      <Input 
                        className="bg-transparent focus:outline-none focus:ring-0 focus:border-gray-500 focus:border-none" 
                        {...field} 
                        readOnly 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="city"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>City of Residence</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Texas" 
                        className="bg-transparent focus:outline-none focus:ring-0 focus:border-gray-500 focus:border-none" 
                        {...field} 
                        readOnly 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {selectedCountry && (
              <FormField
                control={form.control}
                name="phoneNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone Number</FormLabel>
                    <FormControl>
                      <div className="flex">
                        <div className="flex items-center px-3 bg-gray-100 border border-r-0 rounded-l-md">
                          +{countryCallingCode}
                        </div>
                        <Input 
                          placeholder="Enter your phone number" 
                          {...field} 
                          className="rounded-l-none bg-transparent"
                          readOnly
                        />
                      </div>
                    </FormControl>
                    <p className="text-sm text-muted-foreground mt-1">
                      Please ensure you provide your WhatsApp number to access the membership class.
                    </p>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            <FormField
              control={form.control}
              name="gender"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Gender</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="flex space-x-4"
                      disabled
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="female" id="female" />
                        <Label htmlFor="female">Female</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="male" id="male" className="border" />
                        <Label htmlFor="male">Male</Label>
                      </div>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-between pt-6">
              <div>
                {/* <button onClick={() => sendEmail()} type="button">Payaza</button> */}
              </div>
              {(() => {
                const paymentStatus = program.id ? getPaymentStatus(program.id) : null;
                const isFullyPaid = paymentStatus?.isFullyPaid || false;
                
                return (
                  <Button 
                    type="submit" 
                    className={`${
                      isFullyPaid 
                        ? "bg-green-600 hover:bg-green-700 cursor-not-allowed" 
                        : "bg-[#B8860B] hover:bg-[#8B6508]"
                    }`}
                    disabled={isFullyPaid}
                  >
                    {form.formState.isSubmitting 
                      ? "Processing..." 
                      : isFullyPaid 
                        ? "Already Paid ✓" 
                        : "Proceed to Pay"
                    }
                  </Button>
                );
              })()}
            </div>
          </form>
        </Form>

        <PaystackTrigger
          ref={paystackRef}
          email={form.getValues("email")}
          amount={program.price === 78 ? 120000 : 250000}
          onSuccess={handlePaymentSuccess}
        />
      </main>
    </div>
  )
}

