import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import ServicesSection from "@/components/services-section"
import PricingSection from "@/components/pricing-section"
import TestimonialsSection from "@/components/testimonials-section"
import MentorshipOffers from "@/components/mentorship-offer"

export default function Home() {
  return (
    <div className="min-h-screen pt-8 pb-14 bg-white">

      {/* Hero Section */}
      <section className="relative bg-[#faecec] w-[80%] mx-auto rounded-3xl px-4 py-16 md:px-6 lg:px-12">
        <div className="container mx-auto">
          <div className="grid items-center gap-8 lg:grid-cols-2">
            <div className="max-w-xl">
              <h1 className="font-serif text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl md:text-6xl">
                Transform Your Life with Intentional Growth
              </h1>
              <p className="mt-4 text-lg text-gray-600">
                Join Coach Mentors Private Membership Program to Create Lasting Shifts in Career Development and
                Personal Development
              </p>
              <div className="mt-8 flex gap-4">
                <Button className="bg-[#B8860B] hover:bg-[#8B6508]">Explore Programs</Button>
                <Button variant="outline" className="text-black bg-white">Learn More</Button>
              </div>
            </div>
            <div className="relative h-full w-full">
              <Image
                src="/pm-hero.png"
                alt="pm"
                fill
                className="object-cover"
                priority
              />
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <ServicesSection />

      <MentorshipOffers />

      {/* Pricing Section */}
      <PricingSection />

      {/* Testimonials Section */}
      <TestimonialsSection />

      {/* Newsletter Section */}
      <section className="bg-[#faecec] py-16 text-black w-[80%] mx-auto  rounded-3xl">
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
    </div>
  )
}