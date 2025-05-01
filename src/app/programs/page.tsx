"use client"

import Image from "next/image"
import { Check } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import Link from "next/link"
import { useQuery } from "@tanstack/react-query"
import { useState } from "react"
import { getPrograms } from "@/lib/api-calls"
import { QUERY_KEY } from "@/lib/rbac"
import { Program } from "@prisma/client"

export default function ProgramsPage() {
  const [programs, setPrograms] = useState<(Program & {local_price: string, description: string, impact: string, callToAction: string, coachNote: string})[]>([]);
  
    useQuery({
      queryKey: [QUERY_KEY.GET_ALL_PROGRAMS],
      queryFn: async () => {
        const { data, error, validationErrors } = await getPrograms();
  
        if (data) {
          setPrograms(
            data.map(item => ({
              ...item,
              local_price: item.price === 78 ? "120,000" : "250,000",
              description: item.price === 78 ? "Singleness isn’t just a waiting room; it’s a season of preparation, purpose, and personal growth.  We’re excited to launch a transformational mentorship space just for singles where you’ll be equipped to live whole, walk in clarity, and embrace your season with wisdom and intention.  This is more than mentorship. It is alignment for destiny.  Are you ready?" : "Making Kings Mentorship is an academy that is committed to empowering individuals with tools, resources, and teachings to enable them to have rounded success as a balance to family life and wellness.",
              impact: "This mentorship program will bring about significant shifts in different areas of your life.",
              callToAction: "Register now to be a part of this life transforming program.",
              coachNote: "Coach Mimie is set to walk you into intentional growth and transformation."

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
  // const programs = [
  //   {
  //     title: "Mentorship for Singles",
  //     description: "Singleness isn’t just a waiting room; it’s a season of preparation, purpose, and personal growth.  We’re excited to launch a transformational mentorship space just for singles where you’ll be equipped to live whole, walk in clarity, and embrace your season with wisdom and intention.  This is more than mentorship. It is alignment for destiny.  Are you ready?",
  //     coachNote: "",
  //     impact: "This mentorship program will bring about significant shifts in different areas of your life.",
  //     callToAction: "Register now to be a part of this life transforming program.",
  //     features: [
  //       "Prepare you for relationship and marriage",
  //       "Close community",
  //       "Coaching calls with PM",
  //       "Accountability structure",
  //     ],
  //     price: "$78",
  //     localPrice: "₦120,000",
  //     period: "Annual Investment Fee",
  //   },
  //   {
  //     title: "Premium Mentorship Program",
  //     description: "Making Kings Mentorship is an academy that is committed to empowering individuals with tools, resources, and teachings to enable them to have rounded success as a balance to family life and wellness.",
  //     coachNote: "Coach Mimie is set to walk you into intentional growth and transformation.",
  //     impact: "This mentorship program will bring about significant shifts in different areas of your life.",
  //     callToAction: "Register now to be a part of this life transforming program.",
  //     features: [
  //       "Monthly group coaching session",
  //       "Accountability structure",
  //       "Payment allowed in two installments",
  //       "Access to weekly inspiring email",
  //       "Access to special resources and material",
  //     ],
  //     price: "$161.20",
  //     localPrice: "₦250,000",
  //     period: "One Time Annual Investment Fee",
  //   },
  // ]

  return (
    <div className="min-h-screen bg-white text-black">

      <main className="container mx-auto px-4 py-16">
        {/* Header Section */}
        <section className="mb-20">
          <h1 className="mb-12 text-center font-serif text-4xl font-bold">
            Our Programs
          </h1>
          <div className="grid gap-8 lg:grid-cols-2 lg:items-center">
            <div className="max-w-xl">
              <p className="text-lg leading-relaxed text-gray-700">
                Browse our program catalogue to see how we empower individuals with tools, resources,
                and teachings enabling them to have rounded success as a balance to family life
                and wellness.
              </p>
            </div>
            <div className="relative aspect-video w-full overflow-hidden rounded-2xl bg-gray-100">
              <Image
                src="/mentorship-img2.png"
                alt="Programs Overview"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </section>

        {/* Programs Section */}
        <section className="grid gap-8 md:grid-cols-2">
          {programs.map((program, index) => (
            <div key={index} className="space-y-6">
              <Badge
                variant="secondary"
                className="rounded-full bg-gray-900 px-6 py-2 text-base font-medium text-white hover:bg-gray-800"
              >
                {program.name}
              </Badge>
              <div className="space-y-4">
                <p className="text-gray-700">{program.description}</p>
                <p className="text-gray-700">{program.coachNote}</p>
                <p className="text-gray-700">{program.impact}</p>
                <p className="text-gray-700">{program.callToAction}</p>
              </div>
              <div>
                <h3 className="mb-4 font-medium">Key Features:</h3>
                <ul className="space-y-3">
                  {program.features.split(',').map((feature, idx) => (
                    <li key={idx} className="flex items-center gap-2">
                      <Check className="h-5 w-5 text-green-500" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <div className="mb-2">
                  <span className="text-2xl font-bold">{program.price}</span>{" "}
                  <span className="text-gray-600">({program.local_price})</span>
                </div>
                <p className="mb-4 text-sm text-gray-600">{program.duration}</p>
                <Link href={`/programs/${program.id}`}>
                  <Button className="bg-[#B8860B] hover:bg-[#8B6508]">
                    Register Now
                  </Button>
                </Link>
              </div>
            </div>
          ))}
        </section>

        {/* Newsletter Section */}
      <section className="bg-[#faecec] py-16 text-black w-[80%] mx-auto mt-20 mb-8 rounded-3xl">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="font-serif text-3xl font-bold">Explore More with Us Today</h2>
            <p className="mt-2 text-gray-600">Subscribe to our email newsletter and be part of our community today.</p>
            <div className="mt-6 flex gap-4">
              <Input type="email" placeholder="Your email address" className="rounded-full bg-transparent" />
              <Button className="rounded-full text-white bg-black hover:bg-gray-800">Subscribe Today</Button>
            </div>
          </div>
        </div>
      </section>

      </main>
    </div>
  )
}
