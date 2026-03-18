import { useState, useEffect } from "react";
import { X, RefreshCw } from "lucide-react";

export default function OTPModal({ email, isOpen, onClose, onVerify, onResend, loading }) {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [error, setError] = useState("");
  const [cooldown, setCooldown] = useState(0);

  useEffect(() => {
    let timer;
    if (cooldown > 0) {
      timer = setInterval(() => setCooldown((prev) => prev - 1), 1000);
    }
    return () => clearInterval(timer);
  }, [cooldown]);

  if (!isOpen) return null;

  const handleChange = (index, value) => {
    // Only allow numbers
    if (!/^\d?$/.test(value)) return;
    
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      document.getElementById(`otp-${index + 1}`).focus();
    }
  };

  const handleKeyDown = (index, e) => {
    // Handle backspace to focus previous input
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      document.getElementById(`otp-${index - 1}`).focus();
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");
    const otpString = otp.join("");
    if (otpString.length !== 6) {
      setError("Please enter the 6-digit code.");
      return;
    }
    onVerify(otpString);
  };

  const handleResend = async () => {
    if (cooldown > 0) return;
    const response = await onResend();
    if (response.success) {
      setCooldown(30);
      setError("");
    } else {
      setError(response.error || "Failed to resend code.");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="w-full max-w-sm bg-white rounded-2xl shadow-xl p-8 relative animate-in fade-in zoom-in-95 duration-300">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X size={20} />
        </button>

        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Verify OTP</h2>
          <p className="text-gray-500 text-sm mb-8">
            Enter the 6-digit code sent to <br />
            <span className="font-medium text-gray-900">{email}</span>
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
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
                  className="w-10 h-12 border-2 border-gray-200 rounded-lg text-center text-xl font-bold text-gray-900 focus:border-blue-500 focus:ring-0 outline-none transition disabled:bg-gray-50"
                  autoFocus={index === 0}
                />
              ))}
            </div>

            {error && (
              <p className="text-red-500 text-sm font-medium">{error}</p>
            )}

            <button
              type="submit"
              disabled={loading || otp.some(d => !d)}
              className="w-full py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 disabled:bg-blue-300 transition-colors flex items-center justify-center gap-2 shadow-lg shadow-blue-600/20"
            >
              {loading && <RefreshCw className="animate-spin" size={18} />}
              {loading ? "Verifying..." : "Submit OTP"}
            </button>
          </form>

          <div className="mt-8">
            <button
              onClick={handleResend}
              disabled={cooldown > 0 || loading}
              className={`text-sm font-medium flex items-center justify-center gap-2 mx-auto ${
                cooldown > 0 ? "text-gray-400" : "text-blue-600 hover:text-blue-700"
              }`}
            >
              {loading && <RefreshCw className="animate-spin" size={14} />}
              {cooldown > 0 ? `Resend OTP in ${cooldown}s` : "Resend OTP"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
