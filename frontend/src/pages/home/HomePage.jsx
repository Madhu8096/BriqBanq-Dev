import { Link } from "react-router-dom";

const ROLES = [
  { id: "borrower", label: "Borrower", desc: "Manage your mortgage resolution", icon: "🏠" },
  { id: "lender", label: "Lender", desc: "Portfolio & loan management", icon: "🏦" },
  { id: "investor", label: "Investor", desc: "Deals, auctions & contracts", icon: "📈" },
  { id: "lawyer", label: "Lawyer", desc: "Cases, e-signatures & review", icon: "⚖️" },
  { id: "admin", label: "Admin", desc: "Platform administration", icon: "🔧" },
  { id: "superadmin", label: "Super Admin", desc: "Full system control", icon: "👑" },
  { id: "receiver", label: "Receiver", desc: "Receivership & reporting", icon: "📋" },
];

// Professional Australian real estate / luxury property (Unsplash)
const HERO_BG_IMAGE = "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=2070&q=80";

export default function HomePage() {
  return (
    <div className="min-h-screen text-slate-800 overflow-hidden relative">
      {/* Australian real estate background */}
      <div
        className="fixed inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${HERO_BG_IMAGE})` }}
        aria-hidden
      />
      {/* Strong light overlay so text is always readable */}
      <div className="fixed inset-0 bg-white/94 pointer-events-none" />
      <div className="fixed inset-0 bg-gradient-to-b from-white/80 via-white/75 to-white/90 pointer-events-none" />

      {/* Nav – solid bar for clear text */}
      <header className="relative z-10 border-b border-slate-200 bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <span className="text-2xl font-bold tracking-tight bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
              Brickbanq
            </span>
          </Link>
          <nav className="flex items-center gap-2">
            <Link
              to="/signin"
              className="px-4 py-2.5 text-sm font-medium text-slate-700 hover:text-slate-900 transition-colors rounded-lg hover:bg-slate-100"
            >
              Sign In
            </Link>
            <Link
              to="/signup"
              className="px-5 py-2.5 text-sm font-semibold bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-lg hover:opacity-95 transition-opacity shadow-lg shadow-emerald-500/25"
            >
              Sign Up
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero – high-contrast text */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 pt-20 pb-28 md:pt-28 md:pb-36">
        <div className="max-w-3xl">
          <p className="text-emerald-700 font-semibold tracking-widest uppercase mb-4 text-sm">
            Mortgage resolution & property finance
          </p>
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight leading-[1.1] text-slate-900 [text-shadow:0_1px_2px_rgba(255,255,255,0.8)]">
            One platform for{" "}
            <span className="bg-gradient-to-r from-emerald-700 via-teal-700 to-emerald-700 bg-clip-text text-transparent">
              borrowers, lenders & investors
            </span>
          </h1>
          <p className="mt-6 text-lg text-slate-800 max-w-xl leading-relaxed font-medium">
            Resolve mortgages, run live auctions, and manage contracts securely. Choose your role and get started in seconds.
          </p>
          <div className="mt-10 flex flex-wrap gap-4">
            <Link
              to="/signup"
              className="inline-flex items-center gap-2 px-6 py-3.5 text-base font-semibold bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-xl hover:opacity-95 transition-opacity shadow-lg shadow-emerald-500/25"
            >
              Get started
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
            </Link>
            <Link
              to="/signin"
              className="inline-flex items-center gap-2 px-6 py-3.5 text-base font-semibold text-slate-800 border-2 border-slate-400 rounded-xl hover:bg-slate-100 transition-colors bg-white shadow-sm"
            >
              Sign in
            </Link>
          </div>
        </div>
      </section>

      {/* Who uses Brickbanq – 7 roles – solid cards for readability */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 pb-24">
        <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-2">Who uses Brickbanq</h2>
        <p className="text-slate-800 mb-10 max-w-xl font-medium">Sign in or sign up and select your role to access your dashboard.</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {ROLES.map((role) => (
            <div
              key={role.id}
              className="group relative p-5 rounded-2xl bg-white border border-slate-200 shadow-md hover:border-emerald-400 hover:shadow-lg transition-all duration-300"
            >
              <span className="text-2xl mb-3 block">{role.icon}</span>
              <h3 className="text-lg font-semibold text-slate-900">{role.label}</h3>
              <p className="text-sm text-slate-700 mt-1 font-medium">{role.desc}</p>
              <Link
                to="/signin"
                className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-emerald-700 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                Sign in as {role.label}
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* CTA strip – solid card */}
      <section className="relative z-10 border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-6 py-16">
          <div className="rounded-2xl bg-white border border-slate-200 shadow-xl p-8 md:p-12 text-center">
            <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-3">Ready to get started?</h2>
            <p className="text-slate-800 mb-6 max-w-lg mx-auto font-medium">Create an account, choose your role, and access your dashboard in one click.</p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                to="/signup"
                className="px-6 py-3 font-semibold bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-xl hover:opacity-95 transition-opacity shadow-md"
              >
                Sign Up
              </Link>
              <Link
                to="/signin"
                className="px-6 py-3 font-semibold text-slate-800 border-2 border-slate-400 rounded-xl hover:bg-slate-50 transition-colors bg-white"
              >
                Sign In
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer – solid bar */}
      <footer className="relative z-10 border-t border-slate-200 py-8 bg-white">
        <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <span className="text-sm text-slate-700 font-medium">© Brickbanq. Mortgage resolution platform.</span>
          <div className="flex gap-6 text-sm">
            <Link to="/signin" className="text-slate-700 font-medium hover:text-slate-900 transition-colors">Sign In</Link>
            <Link to="/signup" className="text-slate-700 font-medium hover:text-slate-900 transition-colors">Sign Up</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
