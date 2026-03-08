import { Link } from 'react-router-dom'

export default function AdminBreadcrumb({ items }) {
    return (
        <nav className="flex items-center gap-2 text-sm text-gray-500 mb-4">
            {items.map((item, index) => (
                <div key={index} className="flex items-center gap-2">
                    {item.path ? (
                        <Link to={item.path} className="hover:text-gray-700">
                            {item.label}
                        </Link>
                    ) : (
                        <span className="text-gray-900">{item.label}</span>
                    )}
                    {index < items.length - 1 && <span>›</span>}
                </div>
            ))}
        </nav>
    )
}
