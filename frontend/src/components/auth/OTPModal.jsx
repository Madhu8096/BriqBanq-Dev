import { useState, useEffect } from "react";
import { X, RefreshCw, CheckCircle2, AlertCircle } from "lucide-react";

export default function OTPModal({ email, isOpen, onClose, onVerify, onResend, loading }) {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [error, setError] = useState("");
  const [cooldown, setCooldown] = useState(0);
  const [resending, setResending] = useState(false);

  useEffect(() => {
    let timer;
    if (cooldown > 0) {
      timer = setInterval(() => setCooldown((prev) => prev - 1), 1000);
    }
    return () => clearInterval(timer);
  }, [cooldown]);

  if (!isOpen) return null;

  const handleChange = (index, value) => {
    if (!/^\d*$/.test(value)) return;
    
    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      document.getElementById(`otp-${index + 1}`).focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      document.getElementById(`otp-${index - 1}`).focus();
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");
    const otpString = otp.join("");
    if (otpString.length !== 6) {
      setError("Please enter all 6 digits.");
      return;
    }
    onVerify(otpString);
  };

  const handleResend = async () => {
    if (cooldown > 0 || resending) return;
    setResending(true);
    setError("");
    try {
      await onResend();
      setCooldown(30);
    } catch (err) {
      setError("Failed to resend OTP. Please try again.");
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-[#0a0e17]/80 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="w-full max-w-md bg-[#161b22] border border-white/10 rounded-2xl shadow-2xl p-8 relative animate-in zoom-in-95 duration-300">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-white/40 hover:text-white transition-colors"
        >
          <X size={20} />
        </button>

        <div className="flex flex-col items-center text-center">
          <div className="w-16 h-16 bg-emerald-500/10 rounded-full flex items-center justify-center mb-6">
            <CheckCircle2 className="text-emerald-500" size={32} />
          </div>
          
          <h2 className="text-2xl font-bold text-white mb-2">Verify your email</h2>
          <p className="text-white/50 text-sm mb-8">
            We've sent a 6-digit code to <span className="text-emerald-400 font-medium">{email}</span>. 
            The code expires in 5 minutes.
          </p>

          <form onSubmit={handleSubmit} className="w-full space-y-6">
            <div className="flex justify-between gap-2">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  id={`otp-${index}`}
                  type="text"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  disabled={loading}
                  className="w-12 h-14 bg-white/5 border border-white/10 rounded-xl text-center text-xl font-bold text-white focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 outline-none transition disabled:opacity-50"
                  autoFocus={index === 0}
                />
              ))}
            </div>

            {error && (
              <div className="flex items-center gap-2 text-red-400 text-sm bg-red-400/10 p-3 rounded-lg border border-red-400/20">
                <AlertCircle size={16} />
                <span>{error}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={loading || otp.some(d => !d)}
              className="w-full py-3.5 rounded-xl font-semibold bg-gradient-to-r from-emerald-500 to-cyan-500 text-[#0a0e17] hover:opacity-95 disabled:opacity-50 transition-all shadow-lg shadow-emerald-500/10 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <RefreshCw className="animate-spin" size={18} />
                  Verifying...
                </>
              ) : "Verify & Create Account"}
            </button>
          </form>

          <div className="mt-8 flex items-center justify-center gap-2 text-sm">
            <span className="text-white/40">Didn't receive the code?</span>
            <button
              onClick={handleResend}
              disabled={cooldown > 0 || resending}
              className={`font-medium transition-colors ${
                cooldown > 0 || resending 
                ? "text-white/20 cursor-not-allowed" 
                : "text-emerald-400 hover:text-emerald-300"
              }`}
            >
              {cooldown > 0 ? `Resend in ${cooldown}s` : resending ? "Sending..." : "Resend Code"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
