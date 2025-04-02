import { Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import Link from "next/link"

export default function PricingSection() {
  const plans = [
    {
      title: "Regular Mentorship Program",
      price: "$6.45",
      localPrice: "₦10,000",
      period: "Monthly Investment Fee",
      features: [
        "Monthly group coaching session",
        "Monthly workbook",
        "Accountability structure",
        "", // Empty strings for alignment with premium plan
        "",
      ],
    },
    {
      title: "Premium Mentorship Program",
      price: "$161.20",
      localPrice: "₦250,000",
      period: "One Time Annual Investment Fee",
      features: [
        "Monthly group coaching session",
        "Access to one on one sessions when needed",
        "Accountability structure",
        "Receive weekly inspiring emails",
        "Access to special resources and materials",
      ],
    },
  ]

  return (
    <section className="bg-gray-50 py-16">
      <div className="container mx-auto px-4">
        <h2 className="mb-2 text-center text-gray-900 font-serif text-3xl font-bold">Programs Available</h2>
        <p className="mb-12 text-center text-gray-600">Choose Your Path to Transformation</p>
        <div className="grid gap-8 md:grid-cols-2 lg:gap-12">
          {plans.map((plan, index) => (
            <Card key={index} className="flex flex-col bg-transparent p-6 text-gray-800">
              <div className="mb-4">
                <h3 className="font-serif text-2xl font-bold">{plan.title}</h3>
              </div>

              <div className="mb-6">
                <p className="text-3xl font-bold">
                  {plan.price} <span className="text-lg text-gray-600">({plan.localPrice})</span>
                </p>
                <p className="text-sm text-gray-600">{plan.period}</p>
              </div>

              <div className="mb-8 flex-grow">
                <p className="mb-4 font-semibold">Key Features:</p>
                <ul className="space-y-3">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className={`flex items-start gap-2 ${!feature && "invisible"}`}>
                      <Check className="mt-0.5 h-5 w-5 flex-shrink-0 text-green-500" />
                      <span>{feature || "Placeholder"}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-auto space-y-4">
                <Link href={"/programs/register"} className="block">
                  <Button className="w-full bg-[#B8860B] text-white hover:bg-[#8B6508]">Register Now</Button>
                </Link>
                <Link className="block" href={"/programs"}>
                  <Button variant="outline" className="w-full bg-transparent text-black">
                    Learn More
                  </Button>
                </Link>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}

