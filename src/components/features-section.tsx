import Image from "next/image"

interface Feature {
  title: string
  description: string
}

const FeaturesSection = ({ features }: { features: Feature[] }) => {
  return (
    <section className="py-12">
      <h2 className="text-3xl font-bold mb-8 text-center">Our Features</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {features.map((feature) => (
          <div key={feature.title} className="bg-white shadow-md rounded-lg p-6">
            <div className="mb-4">
              <Image src="/placeholder.svg?height=300&width=400" alt={feature.title} fill className="object-cover" />
            </div>
            <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
            <p className="text-gray-700">{feature.description}</p>
          </div>
        ))}
      </div>
    </section>
  )
}

export default FeaturesSection

