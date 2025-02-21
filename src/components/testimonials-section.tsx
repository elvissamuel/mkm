export default function TestimonialsSection() {
  const testimonials = [
    {
      text: "Before joining Making Kings, I felt stuck in a rut. My work was draining, and I felt disconnected from my purpose. The program helped me gain clarity and develop a clear vision for my future and build a support system that has been invaluable. I feel more confident, more fulfilled, and more excited about life than I've been in years.",
      author: "Jenny Wilson",
      role: "Marketing Manager",
    },
    {
      text: "Before joining Making Kings, I felt stuck in a rut. My work was draining, and I felt disconnected from my purpose. The program helped me gain clarity and develop a clear vision for my future and build a support system that has been invaluable. I feel more confident, more fulfilled, and more excited about life than I've been in years.",
      author: "Jenny Wilson",
      role: "Marketing Manager",
    },
    {
      text: "Before joining Making Kings, I felt stuck in a rut. My work was draining, and I felt disconnected from my purpose. The program helped me gain clarity and develop a clear vision for my future and build a support system that has been invaluable. I feel more confident, more fulfilled, and more excited about life than I've been in years.",
      author: "Jenny Wilson",
      role: "Marketing Manager",
    },
  ]

  return (
    <section className="bg-white py-16 text-black">
      <div className="container mx-auto px-4">
        <h2 className="mb-12 text-center font-serif text-3xl font-bold">What Our Mentees Say About The Program</h2>
        <div className="grid gap-6 md:grid-cols-3">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="rounded-lg border border-gray-200 bg-white p-8 shadow-sm">
              <p className="mb-6 text-gray-600">{testimonial.text}</p>
              <div>
                <p className="font-semibold">{testimonial.author}</p>
                <p className="text-sm text-gray-600">{testimonial.role}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

