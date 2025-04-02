"use client"

import { useEffect, useState, useRef, useCallback } from "react"
import Image from "next/image"
import { ChevronLeft, ChevronRight } from "lucide-react"
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
      description:
        "Stay motivated and on track with a structured accountability system, ensuring consistent progress towards your goals.",
      image: "/mentorship-img2.png",
    },
    {
      title: "360° Life Balance",
      description:
        "Cultivate a balanced and fulfilling life incorporating personal development, physical well-being, and success.",
      image: "/mentorship-img3.png",
    },
  ]

  const [currentIndex, setCurrentIndex] = useState(0)
  const [visibleItems, setVisibleItems] = useState(3)
  const sliderRef = useRef<HTMLDivElement>(null)

  // Update visible items based on screen size
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) {
        setVisibleItems(1) // Mobile: show 1
      } else if (window.innerWidth < 1024) {
        setVisibleItems(2) // Tablet: show 2
      } else {
        setVisibleItems(3) // Desktop: show 3
      }
    }

    // Set initial value
    handleResize()

    // Add event listener
    window.addEventListener("resize", handleResize)

    // Clean up
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  const nextSlide = useCallback(() => {
    if (currentIndex < offers.length - visibleItems) {
      setCurrentIndex((prev) => prev + 1)
    } else {
      setCurrentIndex(0) // Loop back to start
    }
  }, [currentIndex, offers.length, visibleItems])

  const prevSlide = useCallback(() => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1)
    } else {
      setCurrentIndex(offers.length - visibleItems) // Loop to end
    }
  }, [currentIndex, offers.length, visibleItems])

  return (
    <section className="overflow-hidden bg-white py-16">
      <div className="container mx-auto px-4">
        <div className="mb-8 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          <h2 className="font-serif text-2xl font-bold text-black sm:text-3xl">What Making Kings Mentorship Offers:</h2>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8 rounded-full"
              aria-label="Previous slide"
              onClick={prevSlide}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8 rounded-full"
              aria-label="Next slide"
              onClick={nextSlide}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="relative overflow-hidden">
          <div
            ref={sliderRef}
            className="flex transition-transform duration-300 ease-in-out"
            style={{
              transform: `translateX(-${currentIndex * (100 / visibleItems)}%)`,
            }}
          >
            {offers.map((offer, index) => (
              <div key={index} className="flex-shrink-0 px-3" style={{ width: `${100 / visibleItems}%` }}>
                <div className="h-full overflow-hidden rounded-2xl border border-gray-100 shadow-sm">
                  <div className="relative aspect-[4/3] w-full">
                    <Image
                      src={offer.image || "/placeholder.svg?height=300&width=400"}
                      alt={offer.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="bg-white p-4">
                    <h3 className="mb-2 font-serif text-xl font-semibold">{offer.title}</h3>
                    <p className="text-sm text-gray-600">{offer.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Mobile dots indicator */}
        <div className="mt-6 flex justify-center gap-2 sm:hidden">
          {Array.from({ length: offers.length - visibleItems + 1 }).map((_, index) => (
            <button
              key={index}
              className={`h-2 w-2 rounded-full ${currentIndex === index ? "bg-gray-800" : "bg-gray-300"}`}
              onClick={() => setCurrentIndex(index)}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  )
}

