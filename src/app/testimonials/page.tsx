import TestimonialCard from "@/components/testimonial-card"
import TestimonyForm from "@/components/testimony-form"


export default function TestimonialsPage() {
  const testimonials = [
    {
      text: "Before joining Making Kings, I felt stuck in a rut. My work was draining, and I felt disconnected from my purpose. The program helped me rediscover my passions, develop a clear vision for my future, and build a support system that has been invaluable. I'm now more confident, more fulfilled, and more excited about life than I've been in years.",
      author: "Jenny Wilson",
      role: "Marketing Manager",
    },
    {
      text: "Before joining Making Kings, I felt stuck in a rut. My work was draining, and I felt disconnected from my purpose. The program helped me rediscover my passions, develop a clear vision for my future, and build a support system that has been invaluable. I'm now more confident, more fulfilled, and more excited about life than I've been in years.",
      author: "Jenny Wilson",
      role: "Marketing Manager",
    },
    {
      text: "Before joining Making Kings, I felt stuck in a rut. My work was draining, and I felt disconnected from my purpose. The program helped me rediscover my passions, develop a clear vision for my future, and build a support system that has been invaluable. I'm now more confident, more fulfilled, and more excited about life than I've been in years.",
      author: "Jenny Wilson",
      role: "Marketing Manager",
    },
    {
      text: "Before joining Making Kings, I felt stuck in a rut. My work was draining, and I felt disconnected from my purpose. The program helped me rediscover my passions, develop a clear vision for my future, and build a support system that has been invaluable. I'm now more confident, more fulfilled, and more excited about life than I've been in years.",
      author: "Jenny Wilson",
      role: "Marketing Manager",
    },
  ]

  return (
    <div className="min-h-screen bg-white text-black">
      <main className="container mx-auto px-4 py-16">
        <div className="mb-16 text-center">
          <h1 className="mb-2 font-serif text-4xl font-bold">Life Transforming Stories</h1>
          <p className="text-gray-600">Hear life changing testimonies from our mentees from around the world.</p>
        </div>

        <div className="mb-20 grid gap-6 md:grid-cols-2">
          {testimonials.map((testimonial, index) => (
            <TestimonialCard key={index} {...testimonial} />
          ))}
        </div>

        <TestimonyForm />
      </main>
    </div>
  )
}

