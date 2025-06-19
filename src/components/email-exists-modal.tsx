import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import { useToast } from "@/hooks/use-toast"
import { resendToExistingEmail } from "@/lib/api-calls"
import { useState } from "react";

interface EmailExistsModalProps {
  isOpen: boolean;
  onClose: () => void;
  email: string;
}

export default function EmailExistsModal({ isOpen, onClose, email }: EmailExistsModalProps) {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false)

  const handleResendEmail = async () => {
    try {
      setIsLoading(true)
      const { data } = await resendToExistingEmail({ email });
      
      if (data) {
        toast({
          variant: "default",
          title: "Email Sent",
          description: "Payment link has been resent to your email.",
        });
        onClose();
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to resend email. Please try again.",
      });
    }finally{
      setIsLoading(false)
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md bg-white text-slate-800 flex flex-col items-center justify-center">
        <DialogHeader className="pb-2 w-full flex flex-col items-center justify-center">
          <DialogTitle className="text-center text-xl font-bold text-secondary w-full">Email Already Registered</DialogTitle>
          <DialogDescription className="text-center text-sm w-full">
            An account with this email already exists. Please check your email for the payment link.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-2 w-full flex flex-col items-center justify-center">
          <p className="text-sm text-center text-muted-foreground w-full">
            If you haven't received the payment link or would like it to be resent, click the button below.
          </p>
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4 w-full">
            <Button 
              onClick={handleResendEmail}
              disabled={isLoading}
              className="bg-[#B8860B] hover:bg-[#8B6508] text-white px-8 h-8 text-sm w-full sm:w-auto"
            >
              {isLoading ? "Loading..." : "Resend Payment Link"}
            </Button>
            <Button
              onClick={onClose}
              disabled={isLoading}
              className="bg-[#B8860B] hover:bg-[#8B6508] text-white px-8 h-8 text-sm w-full sm:w-auto"
            >
              Back to registration
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
} 