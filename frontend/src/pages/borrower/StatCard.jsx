export default function StatCard({ label, value, icon, iconBg, iconColor, subtext }) {
  return (
    <div className="bg-white rounded-lg border border-slate-200 p-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-sm text-slate-600">{label}</p>
          <p className="text-3xl font-bold text-slate-900 mt-1">{value}</p>
          {subtext && <p className="text-xs text-slate-500 mt-1">{subtext}</p>}
        </div>
        <div className={`w-12 h-12 ${iconBg} rounded-lg flex items-center justify-center flex-shrink-0`}>
          <span className={`text-2xl ${iconColor}`}>{icon}</span>
        </div>
      </div>
    </div>
  )
}
