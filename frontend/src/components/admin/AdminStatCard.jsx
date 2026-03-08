export default function AdminStatCard({ label, value, growth, icon: Icon, iconBg, iconColor }) {
    return (
        <div className="bg-white rounded-lg border border-gray-200 p-6 flex justify-between items-start">
            <div>
                <p className="text-sm text-gray-500">{label}</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">{value}</p>
                {growth && (
                    <span className="text-sm text-green-600 font-medium mt-1 inline-block">{growth}</span>
                )}
            </div>
            <div className={`w-12 h-12 rounded-full ${iconBg} flex items-center justify-center flex-shrink-0`}>
                {typeof Icon === 'string' ? (
                    // Fallback for emoji (backward compatibility during migration)
                    <span className={`text-xl ${iconColor}`}>{Icon}</span>
                ) : Icon ? (
                    // Lucide React component
                    <Icon className={`w-5 h-5 ${iconColor} flex-shrink-0`} />
                ) : null}
            </div>
        </div>
    )
}
