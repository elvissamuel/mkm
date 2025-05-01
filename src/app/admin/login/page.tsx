export const dynamic = 'force-dynamic';
import type React from "react"

import { Suspense } from "react"


export default function AdminLogin() {

  return (
    <Suspense fallback={<div>Loading...</div>}>
    <AdminLogin />
    </Suspense>
  )
}
