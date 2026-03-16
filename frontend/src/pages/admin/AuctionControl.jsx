import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import AdminStatCard from '../../components/admin/AdminStatCard'
import { createWebSocket } from '../../services/api'
import { adminAuctionService } from '../../api/dataService'

export default function AuctionControl() {
    const navigate = useNavigate()
    const [auctions, setAuctions] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [stats, setStats] = useState({
        live: 0,
        upcoming: 0,
        totalValue: 0,
        activeBidders: 0
    })

    const fetchAuctions = async () => {
        setLoading(true)
        try {
            const res = await adminAuctionService.listAuctions()
            if (res.success) {
                const mapped = res.data.items.map(a => ({
                    id: a.id,
                    address: a.title, // Mapping title to address for now
                    suburb: "NSW", // Placeholder or from metadata
                    status: a.status.toLowerCase(),
                    countdown: a.status === 'LIVE' ? "Active" : "Pending",
                    bedrooms: 0,
                    bathrooms: 0,
                    parking: 0,
                    defaultDays: 0,
                    arrearsDays: 0,
                    rate: 0,
                    debt: 0,
                    currentBid: a.current_highest_bid || 0,
                    propertyValue: a.starting_price || 0,
                    lvr: 0,
                    bidders: 0,
                    activity: 'Stable',
                    image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=400'
                }))
                setAuctions(mapped)
                
                // Calculate stats
                setStats({
                    live: mapped.filter(a => a.status === 'live').length,
                    upcoming: mapped.filter(a => a.status === 'scheduled').length,
                    totalValue: mapped.reduce((acc, a) => acc + Number(a.propertyValue), 0),
                    activeBidders: 0 // Placeholder
                })
            } else {
                setError(res.error || "Failed to fetch auctions")
            }
        } catch (err) {
            console.error(err)
            setError("An unexpected error occurred")
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchAuctions()
        // TODO: connect to live auction feed
        // const ws = createWebSocket('/ws/auctions')
        // ws.onmessage = (event) => {
        //   const data = JSON.parse(event.data)
        //   // Update auction data
        // }
        // return () => ws.close()
    }, [])

    const formatCurrency = (amount) => {
        if (!amount) return "$0k"
        return `$${(amount / 1000).toFixed(0)}k`
    }

    if (loading) return <div className="p-8 text-center">Loading auctions...</div>
    if (error) return <div className="p-8 text-center text-red-600">Error: {error}</div>

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
                    value={stats.live.toString()}
                    icon="●"
                    iconBg="bg-red-100"
                    iconColor="text-red-600"
                />
                <AdminStatCard
                    label="Upcoming"
                    value={stats.upcoming.toString()}
                    icon="📅"
                    iconBg="bg-blue-100"
                    iconColor="text-blue-600"
                />
                <AdminStatCard
                    label="Total Value"
                    value={`$${(stats.totalValue / 1000000).toFixed(1)}M`}
                    icon="$"
                    iconBg="bg-green-100"
                    iconColor="text-green-600"
                />
                <AdminStatCard
                    label="Active Bidders"
                    value={stats.activeBidders.toString()}
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
                            {auction.status === 'scheduled' && (
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
                        {auction.status === 'live' && (
                            <div className="bg-red-500 text-white px-4 py-2 text-sm font-medium">
                                ⏱ Active
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
                                {auction.currentBid > 0 && (
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-500">Current Bid:</span>
                                        <span className="text-green-600 font-medium">{formatCurrency(auction.currentBid)}</span>
                                    </div>
                                )}
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-500">Starting Price:</span>
                                    <span className="text-gray-900 font-medium">{formatCurrency(auction.propertyValue)}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-500">LVR:</span>
                                    <span className="text-gray-900">{auction.lvr}%</span>
                                </div>
                            </div>

                            {/* Activity */}
                            {auction.activity && (
                                <div className="bg-blue-50 border border-blue-200 rounded px-3 py-2 text-sm text-blue-700 font-medium">
                                    📊 Status: {auction.status}
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}
