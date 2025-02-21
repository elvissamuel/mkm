"use client"

import * as React from "react"
import Image from "next/image"
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from "@/components/ui/button"

export default function MentorshipOffers() {
  const offers = [
    {
      title: "Transformation Tools",
      description: "Tools curated to support your journey, informative e-books and much more.",
      image: "/mentorship-img1.png",
    },
    {
      title: "Accountability Structure",
      description: "Stay motivated and on track with a structured accountability system, ensuring consistent progress towards your goals.",
      image: "/mentorship-img2.png",
    },
    {
      title: "360° Life Balance",
      description: "Cultivate a balanced and fulfilling life incorporating personal development, physical well-being, and success.",
      image: "/mentorship-img3.png",
    },
  ]

  return (
    <section className="overflow-hidden bg-white py-16">
      <div className="container mx-auto px-4">
        <div className="mb-8 flex items-center justify-between">
          <h2 className="font-serif text-3xl font-bold text-black">
            What Making Kings Mentorship Offers:
          </h2>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8 rounded-full"
              aria-label="Previous slide"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8 rounded-full"
              aria-label="Next slide"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <div className="flex gap-6">
          {offers.map((offer, index) => (
            <div key={index} className="relative min-w-[calc(33.333%-1rem)] text-black">
              <div className="relative aspect-[2/2] w-full overflow-hidden rounded-2xl">
                <Image
                  src={offer.image || "/placeholder.svg"}
                  alt={offer.title}
                  fill
                  className="object-cover"
                />
                <div className="absolute bottom-0 w-full bg-white p-4">
                  <h3 className="mb-2 font-serif text-xl font-semibold">
                    {offer.title}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {offer.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
