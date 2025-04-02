"use client"

import { useEffect, useState, useCallback } from "react"
import { ChevronLeft, ChevronRight, X } from "lucide-react"

export default function TestimonialsSection() {
  const testimonials = [
    {
      text: "Making Kings Mentorship truly lived up to its name! Last year's journey was transformative, gradually shifting my mindset to that of a king. Each class served as a wake-up call, urging me to strive for more. The program was comprehensive, impacting every aspect of my life. Im deeply grateful, Coach Mimie, for crafting such an intentional and impactful curriculum. Thank you, ma! I love you.",
      author: "Oyenyen Oluwatosimi",
    },
    {
      text: "I particularly love that Pastor Mimie is highly knowledgeable in coaching and she is person-centred (in other words, she doesn't use the one rule fits all scale). She would introduce a concept, then give different perspectives to capture the varying experiences of her students. While providing advice, she puts into consideration the individual's personal experience and prayerfully guides them. I will 100% recommend this mentorship program for individuals who are intentional about their overall development (physical, spiritual, emotional, intellectual, financial, mental, health, and social wellbeing). It was worth my time and money.",
      author: "Eugenia Oshin",
    },
    {
      text: "Making Kings Mentorship has been nothing short of inspiring, enlightening, educative and transformational. I want to express my heart-felt gratitude to Coach Mimie for her dedication and committment to us all at MKM. I can't remember the number of times I would say to myself after a session that we were getting way more than what we gave as a commitment fee. There was no ambiguity in the teachings but all through it was practical wisdom and applicable knowledge that was being shared throughout the mentorship covering different areas of life. The examples and activities given are such that still remains in my memory due to the relatability of everything taught.I still practice many of what was taught and they are still a guiding light for me. Coach Mimie is an Inspiration to me and I am super excited to have been mentored and still being mentored by her. What a Privilege!",
      author: "Damilola Babameru",
    },
    {
      text: "Making Kings Mentorship was a game-changer for me! It brought clarity and purpose to my life. As my first mentorship platform, I was amazed by the growth I experienced, even though I joined in September. One thing I love so much about the platform is how it teaches us to balance personal growth and spiritual growth. One of the most impactful lessons I learned was from Pastor Mimie during our one-on-one session: 'No matter what you want to acquire in life, if it's not to the end that Christ is seen, then it's not worth it.'Joining Making Kings Mentorship was the liberation I needed! I'm forever grateful to God for the gift of Coach Mimie, who is indeed raising kings. Thank you, Coach Mimie, for creating this platform. I'm so grateful! May God bless you, ma. I love you, ma!",
      author: "Okeke Victory",
    },
    // {
    //   text: "I joined Making Kings Mentorship with high expectations, and I'm happy to say that those expectations were exceeded. Coach Mimie's approach to mentorship is holistic and personalized. The program addresses every aspect of life and provides practical tools for growth. The investment I made in this program has yielded returns that far outweigh the cost. I'm forever grateful for this opportunity.",
    //   author: "Sarah Thompson",
    // },
    // {
    //   text: "What sets Making Kings Mentorship apart is the genuine care and attention given to each mentee. Coach Mimie doesn't just teach concepts; she walks with you through your journey of transformation. The program is structured yet flexible enough to address individual needs. The principles I've learned have become foundational to my daily decisions. I highly recommend this program to anyone serious about personal development.",
    //   author: "David Rodriguez",
    // },
  ]

  const [currentIndex, setCurrentIndex] = useState(0)
  const [selectedTestimonial, setSelectedTestimonial] = useState<number | null>(null)
  const [visibleTestimonials, setVisibleTestimonials] = useState(3) // Default for desktop

  // Update visible testimonials based on screen size
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) {
        setVisibleTestimonials(1) // Mobile: show 1
      } else if (window.innerWidth < 1024) {
        setVisibleTestimonials(2) // Tablet: show 2
      } else {
        setVisibleTestimonials(3) // Desktop: show 3
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
    setCurrentIndex((prevIndex) => (prevIndex === testimonials.length - visibleTestimonials ? 0 : prevIndex + 1))
  }, [testimonials.length, visibleTestimonials])

  const prevSlide = useCallback(() => {
    setCurrentIndex((prevIndex) => (prevIndex === 0 ? testimonials.length - visibleTestimonials : prevIndex - 1))
  }, [testimonials.length, visibleTestimonials])

  const openFullTestimonial = (index: number) => {
    setSelectedTestimonial(index)
  }

  const closeFullTestimonial = () => {
    setSelectedTestimonial(null)
  }

  // Auto-scroll effect
  useEffect(() => {
    const interval = setInterval(() => {
      nextSlide()
    }, 5000) // Move every 5 seconds

    return () => clearInterval(interval)
  }, [nextSlide])

  return (
    <section className="bg-white py-16 text-black">
      <div className="container mx-auto px-4">
        <h2 className="mb-12 text-center font-serif text-3xl font-bold">What Our Mentees Say About The Program</h2>

        <div className="relative">
          {/* Navigation buttons */}
          <button
            onClick={prevSlide}
            className="absolute -left-2 top-1/2 z-10 -translate-y-1/2 rounded-full bg-white p-2 shadow-md hover:bg-gray-100 sm:-left-4 md:-left-6"
            aria-label="Previous testimonial"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>

          <div className="overflow-hidden">
            <div
              className="flex transition-transform duration-500 ease-in-out"
              style={{ transform: `translateX(-${currentIndex * (100 / visibleTestimonials)}%)` }}
            >
              {testimonials.map((testimonial, index) => (
                <div
                  key={index}
                  className="flex-shrink-0 px-2 sm:px-3"
                  style={{ width: `${100 / visibleTestimonials}%` }}
                >
                  <div className="flex h-[350px] flex-col rounded-lg border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
                    <div className="flex-grow overflow-hidden">
                      <p className="line-clamp-6 text-gray-600">{testimonial.text}</p>
                    </div>
                    <div className="mt-4 flex items-center justify-between">
                      <p className="font-semibold">{testimonial.author}</p>
                      <button
                        onClick={() => openFullTestimonial(index)}
                        className="text-sm font-medium text-gray-500 hover:text-gray-700"
                      >
                        Read more
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={nextSlide}
            className="absolute -right-2 top-1/2 z-10 -translate-y-1/2 rounded-full bg-white p-2 shadow-md hover:bg-gray-100 sm:-right-4 md:-right-6"
            aria-label="Next testimonial"
          >
            <ChevronRight className="h-6 w-6" />
          </button>
        </div>
      </div>

      {/* Full testimonial modal */}
      {selectedTestimonial !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="relative max-h-[80vh] w-full max-w-2xl overflow-auto rounded-lg bg-white p-8">
            <button
              onClick={closeFullTestimonial}
              className="absolute right-4 top-4 rounded-full p-1 hover:bg-gray-100"
              aria-label="Close"
            >
              <X className="h-6 w-6" />
            </button>
            <div className="mb-6">
              <p className="text-gray-600">{testimonials[selectedTestimonial].text}</p>
            </div>
            <p className="font-semibold">{testimonials[selectedTestimonial].author}</p>
          </div>
        </div>
      )}
    </section>
  )
}

