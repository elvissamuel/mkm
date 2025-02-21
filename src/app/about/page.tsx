import Image from "next/image"
import { Button } from "@/components/ui/button"

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white text-black">

      {/* Main Content */}
      <main className="container mx-auto px-4 py-16">
        {/* Header Section */}
        <section className="mb-20">
          <h1 className="mb-12 text-center font-serif text-4xl font-bold">Making Kings Mentorship</h1>
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
            <div>
              <p className="text-lg leading-relaxed text-gray-700">
                Making Kings Mentorship is an academy that is committed to empowering individuals with tools, resources,
                and teachings to enable them to have rounded success as a balance to family life and wellness.
              </p>
            </div>
            <div className="mx-auto max-w-md">
              <Image
                src="/mk-about.png"
                alt="Making Kings Logo"
                width={300}
                height={300}
                className="rounded-lg"
              />
            </div>
          </div>
        </section>

        {/* Mission & Vision Section */}
        <section className="mb-20 space-y-12">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="mb-4 font-serif text-2xl font-bold">Our Mission</h2>
            <p className="text-gray-700">
              Making Kings Mentorship is an academy that is committed to empowering individuals with tools, resources,
              and teachings to enable them to have rounded success as a balance to family life and wellness.
            </p>
          </div>
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="mb-4 font-serif text-2xl font-bold">Our Vision</h2>
            <p className="text-gray-700">
              Making Kings Mentorship is an academy that is committed to empowering individuals with tools, resources,
              and teachings to enable them to have rounded success as a balance to family life and wellness.
            </p>
          </div>
        </section>

        {/* Leadership Team Section */}
        <section className="mb-20">
          <h2 className="mb-12 text-center font-serif text-3xl font-bold">Our Leadership Team</h2>
          <div className="grid gap-8 lg:grid-cols-2 lg:items-center">
            <div className="space-y-6">
              <h3 className="font-serif text-2xl font-bold">Meet Coach Mimie</h3>
              <div className="space-y-4">
                <p className="text-gray-700">
                  Pastor Mimie Taryl Lee-Lus, fondly called Pastor Mimie, is the Conveyer of House of Balance Global
                  Network, Founder of Sweet Love with Purpose Academy, and a certified John Maxwell Leadership
                  professional Coach and Pastor of Light Nation Church Global.
                </p>
                <p className="text-gray-700">
                  Pastor Mimie is an ordained lover of God, a woman of great insight, and a public speaker who
                  communicates her messages with relatability, simplicity, and humor. She is passionate about creating
                  safe and supportive spaces in any environment she finds herself in.
                </p>
                <p className="text-gray-700">
                  She is the Lead Coach in Making Kings Mentorship platform where she helps both men and women with
                  identity and purpose discovery and personal development.
                </p>
              </div>
              <div className="flex items-center gap-4">
                <Button variant="outline" className="bg-[#B8860B] text-white hover:bg-[#8B6508]">
                  Learn More About the Team
                </Button>
              </div>
            </div>
            <div className="relative mx-auto aspect-square w-full max-w-md overflow-hidden rounded-3xl bg-gray-100">
              <Image src="/pm-about.png" alt="Coach Mimie" fill className="object-cover" />
            </div>
          </div>
        </section>

        {/* Explore Programs Section */}
        <section className="mb-20">
          <div className="rounded-2xl bg-[#FDF8F3] p-8 text-center">
            <h2 className="mb-4 font-serif text-2xl font-bold">Explore Our Programs</h2>
            <p className="mb-6 text-gray-700">
              Discover the Making Kings Mentorship programs designed to empower you on your journey to success.
            </p>
            <Button className="bg-black text-white hover:bg-gray-800">Explore Programs</Button>
          </div>
        </section>
      </main>

    </div>
  )
}

