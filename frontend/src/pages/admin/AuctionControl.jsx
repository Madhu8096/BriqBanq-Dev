import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import AdminStatCard from '../../components/admin/AdminStatCard'
import { createWebSocket } from '../../services/api'

const auctions = [
    {
        id: 'MIP-2026-001',
        address: '45 Victoria Street',
        suburb: 'Potts Point, NSW',
        status: 'live',
        countdown: '2h 45m',
        bedrooms: 2,
        bathrooms: 2,
        parking: 1,
        defaultDays: 89,
        arrearsDays: 127,
        rate: 8.25,
        debt: 980000,
        currentBid: 1100000,
        propertyValue: 1250000,
        lvr: 78.4,
        bidders: 7,
        activity: 'High Activity',
        image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=400'
    },
    {
        id: 'MIP-2026-002',
        address: '128 Brighton Boulevard',
        suburb: 'North Bondi, NSW',
        status: 'upcoming',
        bedrooms: 4,
        bathrooms: 3,
        parking: 2,
        defaultDays: 45,
        arrearsDays: 92,
        rate: 7.5,
        debt: 2100000,
        propertyValue: 3200000,
        lvr: 65.6,
        expectedReturn: 12.4,
        equity: 1100000,
        image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=400'
    },
]

export default function AuctionControl() {
    const navigate = useNavigate()

    useEffect(() => {
        // TODO: connect to live auction feed
        // const ws = createWebSocket('/ws/auctions')
        // ws.onmessage = (event) => {
        //   const data = JSON.parse(event.data)
        //   // Update auction data
        // }
        // return () => ws.close()
    }, [])

    const formatCurrency = (amount) => {
        return `$${(amount / 1000).toFixed(0)}k`
    }

    return (
        <div className="space-y-6">
            {/* Page Header */}
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-900">Auctions</h1>
                <p className="text-sm text-gray-500 mt-1">Platform administration and compliance management</p>
            </div>

            {/* Stat Cards */}
            <div className="grid grid-cols-4 gap-4">
                <AdminStatCard
                    label="Live Now"
                    value="1"
                    icon="●"
                    iconBg="bg-red-100"
                    iconColor="text-red-600"
                />
                <AdminStatCard
                    label="Upcoming"
                    value="1"
                    icon="📅"
                    iconBg="bg-blue-100"
                    iconColor="text-blue-600"
                />
                <AdminStatCard
                    label="Total Value"
                    value="$8.2M"
                    icon="$"
                    iconBg="bg-green-100"
                    iconColor="text-green-600"
                />
                <AdminStatCard
                    label="Active Bidders"
                    value="24"
                    icon="👥"
                    iconBg="bg-purple-100"
                    iconColor="text-purple-600"
                />
            </div>

            {/* Filters */}
            <div className="flex gap-3">
                <input
                    type="text"
                    placeholder="Search auctions..."
                    className="flex-1 border border-gray-300 rounded px-3 py-2 text-sm"
                />
                <select className="border border-gray-300 rounded px-3 py-2 text-sm">
                    <option>All Auctions</option>
                    <option>Live</option>
                    <option>Upcoming</option>
                    <option>Completed</option>
                </select>
                <select className="border border-gray-300 rounded px-3 py-2 text-sm">
                    <option>Ending Soon</option>
                    <option>Recently Started</option>
                    <option>Most Bids</option>
                </select>
                <button className="border border-gray-300 rounded px-3 py-2 text-sm hover:bg-gray-50">
                    Advanced Filters
                </button>
            </div>

            {/* Section Header */}
            <h2 className="text-lg font-semibold text-gray-900">{auctions.length} Auctions</h2>

            {/* Auction Cards */}
            <div className="grid grid-cols-2 gap-4">
                {auctions.map((auction) => (
                    <div
                        key={auction.id}
                        className="bg-white rounded-lg border border-gray-200 overflow-hidden cursor-pointer hover:shadow-lg transition-shadow"
                        onClick={() => navigate(`/admin/auction-room/${auction.id}`)}
                    >
                        {/* Image */}
                        <div className="relative h-48 bg-gray-200">
                            <img src={auction.image} alt={auction.address} className="w-full h-full object-cover" />
                            {auction.status === 'live' && (
                                <div className="absolute top-3 left-3">
                                    <span className="bg-red-500 text-white px-2 py-1 rounded text-xs font-medium">
                                        ● LIVE NOW
                                    </span>
                                </div>
                            )}
                            {auction.status === 'upcoming' && (
                                <div className="absolute top-3 left-3">
                                    <span className="bg-indigo-600 text-white px-2 py-1 rounded text-xs font-medium">
                                        📅 UPCOMING
                                    </span>
                                </div>
                            )}
                            <div className="absolute bottom-3 left-3 flex gap-3 text-white text-sm">
                                <span>{auction.bedrooms}🛏</span>
                                <span>{auction.bathrooms}🚿</span>
                                <span>{auction.parking}🚗</span>
                            </div>
                        </div>

                        {/* Countdown */}
                        {auction.countdown && (
                            <div className="bg-red-500 text-white px-4 py-2 text-sm font-medium">
                                ⏱ Ends in {auction.countdown}
                            </div>
                        )}

                        {/* Content */}
                        <div className="p-4">
                            <h3 className="text-base font-semibold text-gray-900 mb-1">{auction.address}</h3>
                            <p className="text-sm text-gray-500 mb-4">{auction.suburb}</p>

                            {/* Details Grid */}
                            <div className="grid grid-cols-3 gap-3 mb-3 text-sm">
                                <div>
                                    <p className="text-gray-500">Default</p>
                                    <p className="text-gray-900 font-medium">{auction.defaultDays}d</p>
                                </div>
                                <div>
                                    <p className="text-gray-500">Arrears</p>
                                    <p className="text-gray-900 font-medium">{auction.arrearsDays}d</p>
                                </div>
                                <div>
                                    <p className="text-gray-500">Rate</p>
                                    <p className="text-gray-900 font-medium">{auction.rate}%</p>
                                </div>
                            </div>

                            {/* Financial Details */}
                            <div className="space-y-2 mb-3">
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-500">Outstanding Debt:</span>
                                    <span className="text-gray-900 font-medium">{formatCurrency(auction.debt)}</span>
                                </div>
                                {auction.currentBid && (
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-500">Current Bid:</span>
                                        <span className="text-green-600 font-medium">{formatCurrency(auction.currentBid)}</span>
                                    </div>
                                )}
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-500">Property Value:</span>
                                    <span className="text-gray-900 font-medium">{formatCurrency(auction.propertyValue)}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-500">LVR:</span>
                                    <span className="text-gray-900">{auction.lvr}%</span>
                                </div>
                            </div>

                            {/* Activity or Return Info */}
                            {auction.bidders && (
                                <div className="bg-red-50 border border-red-200 rounded px-3 py-2 text-sm text-red-700 font-medium">
                                    🔥 {auction.bidders} bidders ⚠ {auction.activity}
                                </div>
                            )}
                            {auction.expectedReturn && (
                                <div className="bg-green-50 border border-green-200 rounded px-3 py-2 text-sm">
                                    <div className="flex justify-between mb-1">
                                        <span className="text-gray-600">Expected Return</span>
                                        <span className="text-green-700 font-medium">{auction.expectedReturn}%</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Equity</span>
                                        <span className="text-green-700 font-medium">{formatCurrency(auction.equity)}</span>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}
