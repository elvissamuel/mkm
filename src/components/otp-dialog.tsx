"use client"

import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"

const otpSchema = z.object({
  otp: z.string().length(6, "OTP must be 6 digits"),
})

interface OtpDialogProps {
  isOpen: boolean
  onClose: () => void
  onVerify: (otp: string) => void
}

export default function OtpDialog({ isOpen, onClose, onVerify }: OtpDialogProps) {
  const [timeLeft, setTimeLeft] = useState(59)
  const [canResend, setCanResend] = useState(false)

  const form = useForm<z.infer<typeof otpSchema>>({
    resolver: zodResolver(otpSchema),
    defaultValues: {
      otp: "",
    },
  })

  useEffect(() => {
    if (!isOpen) return

    const timer = setInterval(() => {
      setTimeLeft((time) => {
        if (time <= 1) {
          setCanResend(true)
          clearInterval(timer)
          return 0
        }
        return time - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [isOpen])

  const onSubmit = (data: z.infer<typeof otpSchema>) => {
    onVerify(data.otp)
  }

  const handleResendCode = () => {
    if (!canResend) return
    setTimeLeft(59)
    setCanResend(false)
    // Add your resend code logic here
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md bg-white text-black">
        <DialogHeader>
          <DialogTitle className="text-center font-serif text-2xl">One-Time Password</DialogTitle>
        </DialogHeader>
        <div className="px-4 py-6">
          <p className="mb-6 text-center text-sm text-gray-600">
            Enter the One-Time Password (OTP) sent to the number linked to your card
          </p>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="otp"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <div className="flex justify-center">
                        <Input
                          {...field}
                          className="text-center text-lg tracking-[1em] bg-transparent"
                          maxLength={6}
                          placeholder="••••••"
                        />
                      </div>
                    </FormControl>
                    <FormMessage className="text-center" />
                  </FormItem>
                )}
              />
              <div className="text-center text-sm text-black">
                <span className="">Resend code: </span>
                {canResend ? (
                  <button type="button" onClick={handleResendCode} className="hover:underline">
                    Resend
                  </button>
                ) : (
                  <span>0:{timeLeft.toString().padStart(2, "0")}</span>
                )}
              </div>
              <div className="flex justify-end gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={onClose}
                  className="bg-black text-white hover:bg-gray-800"
                >
                  Cancel
                </Button>
                <Button type="submit" className="bg-[#B8860B] hover:bg-[#8B6508]">
                  Next
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  )
}

