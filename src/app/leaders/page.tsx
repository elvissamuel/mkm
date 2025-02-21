import Image from "next/image"

interface TeamMember {
  name: string
  role: string
  bio: string[]
  image: string
}

export default function LeadershipPage() {
  const leadCoach: TeamMember = {
    name: "Coach Mimie",
    role: "Lead Coach",
    bio: [
      "Pastor Mimie Ferri Lee-Lus, fondly called Pastor Mimie, is the Conveyer of House of Blessed Global Network, Founder of Sweet Love with Purpose Academy, Lead Coach at Making Kings Mentorship platform and Co-lead Pastor of Light Nation Church Global.",
      "Pastor Mimie is an ardent lover of God, a woman of great insight, and a public speaker who communicates her message with relatability, simplicity, and humor. She is a beautiful soul who radiates love and dispenses joy into any environment she finds herself in.",
      "At House of Blessed Global Network, she is raising a community of over 2000 people who travels daily in the place of prayer while prayer is a tool of transformation",
      "She has an unending calling and a burning passion for family wellness, hence her inspiration for becoming a certified relationship coach and marriage counsellor. She is the Lead Counsellor at Sweet Love with Purpose.",
      "She is the Lead Coach at Making Kings Mentorship platform where she helps both men and women with identity and purpose discovery and personal development.",
      "She is a grief and loss specialist, anxiety and depression therapist, suicide prevention and crisis specialist, and infidelity recovery specialist.",
      "As the Co-lead pastor of Light Nation Church, she has a mandate together with her husband to raise endtime armies who will shape systems and cultures.",
      "She is happily married to Apostle Ferri Lee-Lus, and they are together raising their godly seeds.",
    ],
    image: "/pm-about.png",
  }

  const teamMembers: TeamMember[] = [
    {
      name: "Coach",
      role: "Leadership Coach",
      bio: [
        "Pastor Mimie is an ardent lover of God, a woman of great insight, and a public speaker who communicates her message with relatability, simplicity, and humor. She is a beautiful soul who radiates love and dispenses joy into any environment she finds herself in.",
        "She has an unending calling and a burning passion for family wellness, hence her inspiration for becoming a certified relationship coach and marriage counsellor. She is the Lead Counsellor at Sweet Love with Purpose.",
      ],
      image: "/pm-about.png",
    },
    {
      name: "Coach",
      role: "Leadership Coach",
      bio: [
        "Pastor Mimie is an ardent lover of God, a woman of great insight, and a public speaker who communicates her message with relatability, simplicity, and humor. She is a beautiful soul who radiates love and dispenses joy into any environment she finds herself in.",
        "She has an unending calling and a burning passion for family wellness, hence her inspiration for becoming a certified relationship coach and marriage counsellor. She is the Lead Counsellor at Sweet Love with Purpose.",
      ],
      image: "/pm-about.png",
    },
    {
      name: "Coach",
      role: "Leadership Coach",
      bio: [
        "Pastor Mimie is an ardent lover of God, a woman of great insight, and a public speaker who communicates her message with relatability, simplicity, and humor. She is a beautiful soul who radiates love and dispenses joy into any environment she finds herself in.",
        "She has an unending calling and a burning passion for family wellness, hence her inspiration for becoming a certified relationship coach and marriage counsellor. She is the Lead Counsellor at Sweet Love with Purpose.",
      ],
      image: "/pm-about.png",
    },
    {
      name: "Coach",
      role: "Leadership Coach",
      bio: [
        "Pastor Mimie is an ardent lover of God, a woman of great insight, and a public speaker who communicates her message with relatability, simplicity, and humor. She is a beautiful soul who radiates love and dispenses joy into any environment she finds herself in.",
        "She has an unending calling and a burning passion for family wellness, hence her inspiration for becoming a certified relationship coach and marriage counsellor. She is the Lead Counsellor at Sweet Love with Purpose.",
      ],
      image: "/pm-about.png",
    },
  ]

  return (
    <div className="min-h-screen bg-white">
      <main className="container mx-auto max-w-5xl px-4 py-16 text-black">
        {/* Header Section */}
        <h1 className="mb-8 text-center font-serif text-4xl font-bold">Our Leadership Team</h1>
        <p className="mx-auto mb-16 max-w-3xl text-center text-gray-700">
          Pastor Mimie, is the Lead Coach at Making Kings Mentorship Platform, a platform where she helps both men and
          women with identity and purpose discovery and personal development.
        </p>

        {/* Lead Coach Section */}
        <section className="mb-20">
          <div className="space-y-8">
            <h2 className="font-serif text-2xl">Meet {leadCoach.name}</h2>
            <div className="flex flex-col gap-8 lg:flex-row lg:items-start lg:gap-12">
              <div className="flex-1 space-y-4">
                {leadCoach.bio.map((paragraph, index) => (
                  <p key={index} className="text-gray-700">
                    {paragraph}
                  </p>
                ))}
              </div>
              <div className="relative h-[400px] w-full shrink-0 overflow-hidden rounded-2xl lg:w-[400px]">
                <Image src={leadCoach.image || "/placeholder.svg"} alt={leadCoach.name} fill className="object-cover" />
              </div>
            </div>
          </div>
        </section>

        {/* Team Members Section */}
        <section>
          <h2 className="mb-12 font-serif text-2xl">Meet Other Team Members</h2>
          <div className="space-y-16">
            {teamMembers.map((member, index) => (
              <div key={index} className="space-y-8">
                <h3 className="font-serif text-xl">Meet {member.name}</h3>
                <div
                  className={`flex flex-col gap-8 lg:flex-row lg:items-start lg:gap-12 ${
                    index % 2 === 0 ? "" : "lg:flex-row-reverse"
                  }`}
                >
                  <div className="flex-1 space-y-4">
                    {member.bio.map((paragraph, idx) => (
                      <p key={idx} className="text-gray-700">
                        {paragraph}
                      </p>
                    ))}
                  </div>
                  <div className="relative h-[300px] w-full shrink-0 overflow-hidden rounded-2xl lg:w-[300px]">
                    <Image src={member.image || "/placeholder.svg"} alt={member.name} fill className="object-cover" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  )
}

