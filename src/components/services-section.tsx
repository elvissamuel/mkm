import Image from "next/image"

export default function ServicesSection() {
  const services = [
    {
      title: "Individuals Seeking Personal Growth",
      description:
        "Making Kings Mentorship is for those seeking personal and professional transformation. We guide you in enhancing communication, interpersonal skills, and emotional intelligence, while helping you cultivate a balanced lifestyle, overcome challenges, and achieve greater self-awareness.",
    },
    {
      title: "Professionals",
      description:
        "Making Kings Mentorship is for those wanting to level up their professional career, looking to stand in their truth, and professionally develop themselves to achieve their goals.",
    },
    {
      title: "Aspiring Leaders",
      description:
        "Making Kings Mentorship is for those who want to develop the skills and qualities of a successful leader. Individuals who are passionate about helping others prosper by being social time and work to make a positive impact on the world around them.",
    },
  ]

  return (
    <section className="bg-white py-16">
      <div className="container mx-auto px-4 text-black">
        <h2 className="mb-12 text-center font-serif text-3xl font-bold">We Offer Our Services to:</h2>
        <div className="mx-auto max-w-6xl">
          <div className="grid gap-8 lg:grid-cols-2">
            <div className="space-y-8">
              {services.map((service, index) => (
                <div key={index} className="max-w-xl">
                  <h3 className="mb-2 font-serif text-xl font-semibold text-gray-900">{service.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{service.description}</p>
                </div>
              ))}
            </div>
            <div className="relative">
              <div className="relative aspect-[5/5] w-full overflow-hidden rounded-2xl bg-[#1e4e5f]">
                <Image
                  src="/service-img1.png"
                  alt="Professional development"
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

