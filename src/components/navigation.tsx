import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function Navigation() {
  return (
    <nav className="border-b bg-white px-4 py-4">
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex items-center gap-8 text-black">
          <div className="hidden space-x-6 md:flex">
            <Link href="/" className="text-sm hover:text-gray-600">
              Home
            </Link>
            <Link href="/about" className="text-sm hover:text-gray-600">
              About Us
            </Link>
            <Link href="/programs" className="text-sm hover:text-gray-600">
              Programs
            </Link>
            <Link href="/testimonials" className="text-sm hover:text-gray-600">
              Testimonials
            </Link>
            <Link href="/contact" className="text-sm hover:text-gray-600">
              Contact Us
            </Link>
          </div>
        </div>
        <Button className="bg-[#B8860B] hover:bg-[#8B6508] text-white">Register</Button>
      </div>
    </nav>
  )
}

