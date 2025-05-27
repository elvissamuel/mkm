import { Facebook, Instagram, Youtube } from "lucide-react"
import Link from "next/link"
export const Footer = () => {

  return (
    <footer className="bg-black px-4 py-20 text-white">
        <div className="container mx-auto">
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <p className="text-sm">© All Right Reserved. Making Kings for All Nations 2025</p>
            <div className="flex gap-4">
              <Link href="#" className="text-sm hover:text-gray-300">
                Terms
              </Link>
              <Link href="#" className="text-sm hover:text-gray-300">
                Privacy
              </Link>
            </div>
            <div className="flex gap-4">
              <Link href="#" className="hover:text-gray-300">
                <Facebook size={20} />
              </Link>
              <Link href="#" className="hover:text-gray-300">
                <Instagram size={20} />
              </Link>
              <Link href="#" className="hover:text-gray-300">
                <Youtube size={20} />
              </Link>
            </div>
          </div>
        </div>
      </footer>
  )
}