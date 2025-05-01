// export const dynamic = 'force-dynamic';
import AdminLogin from "@/components/login/login-form"
import type React from "react"

import { Suspense } from "react"


export default function Page() {

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <AdminLogin />
    </Suspense>
  )
}
