
'use client'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp"
import { useState } from "react"
import { Button } from "../ui/button"
import { useToast } from "../ui/use-toast"
import { VerifyOtp, resendOtp } from "../ApiServices/ApiServices"
import { useEffect } from "react"
import { Smartphone } from "lucide-react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth/auth-provider"
const OtpModel = ({ openotpModel, HandleCloseOtpModel }: { openotpModel: boolean, HandleCloseOtpModel: () => boolean }) => {

    const [email, setEmail] = useState("")
    const [otp, setOtp] = useState("")
    const [otpLoading, setOtpLoading] = useState(false)
    const [resendotp, setResendOtp] = useState(false);

    const { auth, refreshUser } = useAuth()

    const router = useRouter();
    const user = localStorage.getItem("user");
    const verifyUser = JSON.parse(user || "{}");

    useEffect(() => {
        if (verifyUser?.email) {
            setEmail(verifyUser?.email)
        }
    }, [verifyUser])


    const handleVerifyOtp = async (e: React.FormEvent) => {
        e.preventDefault()
        try {
            setOtpLoading(true)
            const result = await VerifyOtp({ email, otp })
            if (result?.statuscode == 200) {
                toast({
                    title: "Login Successful",
                    description: result?.message || "Welcome to Super Admin Dashboard",
                })

                HandleCloseOtpModel()
                localStorage.removeItem("user")
                localStorage.setItem("user", JSON.stringify(result?.data));
                await refreshUser()
             console.log("result",result?.data?.user?.role)
                switch (result?.data?.user?.role) {
                    case "super Admin":
                        router.push("/superadmindashboard")
                        break;
                    case "admin":
                        router.push("/dashboard")
                        break;
                    case "organizer":
                        router.push("/organizerdashboard")
                        break;
                    case "attendee":
                        router.push("/dashboard")
                        break;
                    default:
                        toast({
                            title: "Unknown role",
                            description: "This role is not recognized.",
                            variant: "destructive",
                        });
                }
            }

        } catch (error) {
            setOtpLoading(false)
            toast({
                title: "Error",
                description: error?.response?.data?.message || "Something went wrong during login.",
                variant: "destructive",
            });
        }
    }

    const resendOtpAgin = async () => {
        try {
            setResendOtp(true)
            const result = await resendOtp({ email })
            if (result?.statuscode == 200) {
                toast({
                    title: "OTP Sent Successfully",
                    description:
                        result?.message || "An OTP has been sent to your email. Please verify to continue.",
                });
                setResendOtp(false)
            }

        } catch (error) {
            setResendOtp(false)
            toast({
                title: "Error",
                description: error?.response?.data?.message || "Something went wrong during login.",
                variant: "destructive",
            });
        }
    }

    const { toast } = useToast()
    return <>

        <Dialog open={openotpModel} onOpenChange={HandleCloseOtpModel}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader className="text-center">
                    <div className="mx-auto mb-4 p-3 bg-blue-100">
                        <Smartphone className="h-6 w-6 text-blue-600" />
                    </div>
                    <DialogTitle className="text-xl font-bold font-poppins">Verify Your Identity</DialogTitle>
                    <DialogDescription className="text-gray-600 font-inter">
                        We've sent a 6-digit verification code to
                        <br />
                        <span className="font-medium text-gray-900">{email}</span>
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleVerifyOtp} className="space-y-6">
                    <div className="space-y-4">
                        <Label htmlFor="otp" className="text-sm font-medium text-gray-700 font-poppins text-center block">
                            Verification Code
                        </Label>
                        <div className="flex justify-center">
                            <InputOTP maxLength={6} value={otp} onChange={(value) => setOtp(value)}>
                                <InputOTPGroup>
                                    <InputOTPSlot index={0} className="w-12 h-12 text-lg font-mono font-semibold" />
                                    <InputOTPSlot index={1} className="w-12 h-12 text-lg font-mono font-semibold" />
                                    <InputOTPSlot index={2} className="w-12 h-12 text-lg font-mono font-semibold" />
                                    <InputOTPSlot index={3} className="w-12 h-12 text-lg font-mono font-semibold" />
                                    <InputOTPSlot index={4} className="w-12 h-12 text-lg font-mono font-semibold" />
                                    <InputOTPSlot index={5} className="w-12 h-12 text-lg font-mono font-semibold" />
                                </InputOTPGroup>
                            </InputOTP>
                        </div>
                    </div>

                    <div className="flex gap-3">
                        <Button
                            type="button"
                            variant="outline"
                            className="flex-1 h-11 bg-transparent font-poppins"
                            onClick={() => HandleCloseOtpModel()}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 font-poppins"
                            disabled={otpLoading || otp.length !== 6}
                        >
                            {otpLoading ? (
                                <div className="flex items-center gap-2">
                                    <div className="w-4 h-4 border-2 border-white/30 border-t-white animate-spin"></div>
                                    Verifying...
                                </div>
                            ) : (
                                "Verify & Login"
                            )}
                        </Button>
                    </div>

                    <div className="text-center">
                        <p className="text-sm text-gray-600 font-inter">
                            Didn't receive the code?{" "}
                            <button
                                type="button"
                                className="text-blue-600 hover:text-blue-500 font-medium"
                                onClick={resendOtpAgin}
                            >
                                {resendotp ? "Resending..." : "Resend OTP"}
                            </button>
                        </p>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    </>
}

export default OtpModel