import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { USER_ROLES, getDashboardPath } from "./authConfig";

import { authService } from "../../api/dataService";

export default function SignUp() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!name.trim() || !email.trim() || !password) {
      setError("Please fill in name, email and password.");
      return;
    }
    if (!role) {
      setError("Please select your role.");
      return;
    }
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{8,}$/;
    if (!passwordRegex.test(password)) {
      setError("Password must be at least 8 characters and include one uppercase letter, one lowercase letter, one number, and one special character.");
      return;
    }
    setLoading(true);
    try {
      // Split Name into First and Last
      const nameParts = name.trim().split(/\s+/);
      const firstName = nameParts[0];
      const lastName = nameParts.length > 1 ? nameParts.slice(1).join(" ") : "User";

      const registerPayload = {
        email: email.trim(),
        password,
        first_name: firstName,
        last_name: lastName,
        requested_roles: [role.toUpperCase()]
      };

      const registration = await authService.register(registerPayload);
      
      if (!registration.success) {
        setError(registration.error || "Registration failed.");
        setLoading(false);
        return;
      }

      // Automatically login after signup (get tokens)
      const loginResult = await authService.login(email.trim(), password);
      
        if (loginResult.success && loginResult.data?.access_token) {
          const { access_token } = loginResult.data;
          const userData = {
            id: registration.data.id,
            email: registration.data.email,
            name: `${registration.data.first_name} ${registration.data.last_name}`,
            role: role.toLowerCase(),
          };
          
          // Update AuthContext state
          login(access_token, userData);
        
        // Role-based redirection
        const redirectPath = getDashboardPath(role.toLowerCase());
        console.log(`[Signup] Redirecting to: ${redirectPath}`);
        navigate(redirectPath, { replace: true });
      } else {
        // Registration worked but login failed
        setError(loginResult.error || "Account created, but login failed. Please sign in manually.");
      }
    } catch (err) {
      console.error("[Signup] Unexpected error:", err);
      setError(err.message || "Sign up failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0e17] text-white flex flex-col">
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-cyan-500/10 rounded-full blur-[100px]" />
      </div>
      <header className="relative z-10 border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <Link to="/" className="text-xl font-bold bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
            Brickbanq
          </Link>
        </div>
      </header>
      <main className="relative z-10 flex-1 flex items-center justify-center p-6 py-12">
        <div className="w-full max-w-md rounded-2xl bg-white/5 border border-white/10 p-8 shadow-2xl">
          <h1 className="text-2xl font-bold text-white mb-1">Create account</h1>
          <p className="text-white/50 text-sm mb-6">Sign up and choose your role to access your dashboard.</p>
          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="p-3 rounded-lg bg-red-500/20 border border-red-500/30 text-red-200 text-sm">
                {error}
              </div>
            )}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-white/80 mb-2">Full name</label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Jane Smith"
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/30 focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 outline-none transition"
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-white/80 mb-2">Email</label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/30 focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 outline-none transition"
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-white/80 mb-2">Password</label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="At least 6 characters"
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/30 focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 outline-none transition"
              />
            </div>
            <div>
              <label htmlFor="role" className="block text-sm font-medium text-white/80 mb-2">I am a</label>
              <select
                id="role"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-slate-800 border border-white/20 text-white focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 outline-none transition appearance-none cursor-pointer"
                style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%23e2e8f0'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`, backgroundRepeat: "no-repeat", backgroundPosition: "right 0.75rem center", backgroundSize: "1.25rem", paddingRight: "2.5rem" }}
                aria-label="Select your role"
              >
                <option value="" style={{ backgroundColor: "#f1f5f9", color: "#0f172a" }}>Select your role</option>
                {USER_ROLES.map((r) => (
                  <option key={r.value} value={r.value} style={{ backgroundColor: "#ffffff", color: "#0f172a", padding: "0.5rem 0" }}>
                    {r.label}
                  </option>
                ))}
              </select>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-xl font-semibold bg-gradient-to-r from-emerald-500 to-cyan-500 text-[#0a0e17] hover:opacity-95 disabled:opacity-50 transition-opacity"
            >
              {loading ? "Creating account…" : "Sign up"}
            </button>
          </form>
          <p className="mt-6 text-center text-sm text-white/50">
            Already have an account?{" "}
            <Link to="/signin" className="text-emerald-400 hover:text-emerald-300 font-medium">
              Sign in
            </Link>
          </p>
        </div>
      </main>
    </div>
  );
}
