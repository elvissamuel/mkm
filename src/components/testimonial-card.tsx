interface TestimonialCardProps {
  text: string
  author: string
  role: string
}

export default function TestimonialCard({ text, author, role }: TestimonialCardProps) {
  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-8 shadow-sm">
      <p className="mb-6 text-gray-700">{text}</p>
      <div>
        <p className="font-semibold">{author}</p>
        <p className="text-sm text-gray-600">{role}</p>
      </div>
    </div>
  )
}

