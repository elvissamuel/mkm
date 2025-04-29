import TestimonialCard from "@/components/testimonial-card"
import TestimonyForm from "@/components/testimony-form"


export default function TestimonialsPage() {
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

