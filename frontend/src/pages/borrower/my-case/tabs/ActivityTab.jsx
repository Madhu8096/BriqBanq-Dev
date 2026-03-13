export default function ActivityTab({ activities = [] }) {
  const getStatusColor = (status) => {
    switch (status) {
      case 'success': return 'bg-green-500'
      case 'warning': return 'bg-amber-500'
      case 'danger': return 'bg-red-500'
      default: return 'bg-blue-500'
    }
  }

  if (activities.length === 0) {
    return <p className="text-sm text-slate-500">No activity available.</p>
  }

  return (
    <div>
      <h3 className="text-lg font-semibold text-slate-900 mb-4">Activity Log</h3>
      <div className="space-y-4">
        {activities.map((activity) => (
          <div key={activity.id} className="flex items-start space-x-3">
            <div className={`flex-shrink-0 w-2 h-2 rounded-full mt-1.5 ${getStatusColor(activity.status)}`}></div>
            <div className="flex-1">
              <p className="text-sm font-medium text-slate-900">{activity.title}</p>
              <p className="text-sm text-slate-600 mt-0.5">{activity.description}</p>
              <p className="text-xs text-slate-500 mt-1">{activity.timestamp}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
