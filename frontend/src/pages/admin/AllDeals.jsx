import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, Map, List, Eye, Timer, Calendar, BedDouble, Bath, Car, Loader2 } from 'lucide-react'
import { adminDealService } from '../../api/dataService'

export default function AllDeals() {
    const navigate = useNavigate()
    const [searchTerm, setSearchTerm] = useState('')
    const [stateFilter, setStateFilter] = useState('All States')
    const [statusFilter, setStatusFilter] = useState('All Status')
    const [sortBy, setSortBy] = useState('Newest')
    const [viewMode, setViewMode] = useState('grid')
    const [properties, setProperties] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    const fetchDeals = async () => {
        setLoading(true)
        try {
            const res = await adminDealService.getAllDeals(statusFilter === 'All Status' ? null : statusFilter)
            if (res.success) {
                // Map backend deals to UI format
                const mapped = (res.data.items || []).map(d => ({
                    id: d.id,
                    type: d.status.toLowerCase(),
                    address: d.title,
                    suburb: 'MIP Project', // Backend doesn't have suburb yet
                    badge: { 
                        label: d.status.toUpperCase(), 
                        variant: d.status.toLowerCase() === 'listed' ? 'live' : d.status.toLowerCase() 
                    },
                    bedrooms: 0,
                    bathrooms: 0,
                    parking: 0,
                    loanAmount: 0,
                    currentBid: 0,
                    buyNowPrice: d.asking_price || 0,
                    lvr: 0,
                    returnRate: 0,
                    propertyType: 'MIP Asset',
                    image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=400',
                    dealType: d.status.toLowerCase() === 'listed' ? 'auction' : 'buy_now'
                }))
                setProperties(mapped)
            } else {
                setError(res.error || "Failed to load deals")
            }
        } catch (err) {
            console.error("AllDeals: Error fetching data", err)
            setError("Unexpected error loading deals")
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchDeals()
    }, [statusFilter])

    const openDealRoom = (property) => {
        if (property.dealType === 'auction') {
            navigate(`/admin/auction-control?id=${property.id}`)
        } else if (property.dealType === 'buy_now') {
            navigate(`/admin/buy-now/${property.id}`)
        } else {
            navigate(`/admin/case-management`)
        }
    }

    const formatCurrency = (amount) => {
        if (!amount || amount === 0) return 'A$0'
        if (amount >= 1000000) return `A$${(amount / 1000000).toFixed(1)}M`
        if (amount >= 1000) return `A$${(amount / 1000).toFixed(0)}K`
        return `A$${amount}`
    }

    const getBadgeStyles = (variant) => {
        const styles = {
            live: 'bg-red-500 text-white',
            comingSoon: 'bg-indigo-600 text-white',
            active: 'bg-emerald-500 text-white',
            sold: 'bg-gray-500 text-white',
        }
        return styles[variant] || styles.active
    }

    return (
        <div className="space-y-6">
            {/* Page Header */}
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-900">All Deals</h1>
                <p className="text-sm text-gray-500 mt-1">Platform administration and compliance management</p>
            </div>

            {/* Search and Filters */}
            <div className="flex flex-wrap gap-3">
                <input
                    type="text"
                    placeholder="Search properties..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="flex-1 border border-gray-300 rounded px-3 py-2 text-sm"
                />
                <select
                    value={stateFilter}
                    onChange={(e) => setStateFilter(e.target.value)}
                    className="border border-gray-300 rounded px-3 py-2 text-sm"
                >
                    <option>All States</option>
                    <option>NSW</option>
                    <option>VIC</option>
                    <option>QLD</option>
                    <option>WA</option>
                </select>
                <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="border border-gray-300 rounded px-3 py-2 text-sm"
                >
                    <option>All Status</option>
                    <option>Live</option>
                    <option>Active</option>
                    <option>Coming Soon</option>
                    <option>Sold</option>
                </select>
                <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="border border-gray-300 rounded px-3 py-2 text-sm"
                >
                    <option>Newest</option>
                    <option>Oldest</option>
                    <option>Price: Low to High</option>
                    <option>Price: High to Low</option>
                </select>
                <button className="border border-gray-300 rounded px-3 py-2 text-sm hover:bg-gray-50">
                    <Search className="w-4 h-4 flex-shrink-0" />
                </button>
            </div>

            {/* Section Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-lg font-semibold text-gray-900">{properties.length} Properties</h2>
                    <p className="text-sm text-gray-500">Investment opportunities across Australia</p>
                </div>
                <div className="flex gap-2">
                    <button
                        onClick={() => setViewMode('map')}
                        className={`px-3 py-1.5 text-sm rounded ${viewMode === 'map' ? 'bg-indigo-600 text-white' : 'border border-gray-300 text-gray-700'
                            }`}
                    >
                        <Map className="w-4 h-4 inline-block mr-1 flex-shrink-0" /> Map View
                    </button>
                    <button
                        onClick={() => setViewMode('grid')}
                        className={`px-3 py-1.5 text-sm rounded ${viewMode === 'grid' ? 'bg-indigo-600 text-white' : 'border border-gray-300 text-gray-700'
                            }`}
                    >
                        <List className="w-4 h-4 inline-block mr-1 flex-shrink-0" /> List View
                    </button>
                </div>
            </div>

            {/* Property Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {properties.map((property) => (
                    <div key={property.id} className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                        {/* Image */}
                        <div className="relative h-48 bg-gray-200">
                            <img src={property.image} alt={property.address} className="w-full h-full object-cover" />
                            <div className="absolute top-3 left-3">
                                <span className={`px-2 py-1 rounded text-xs font-medium ${getBadgeStyles(property.badge.variant)}`}>
                                    {property.badge.label}
                                </span>
                            </div>
                            <div className="absolute bottom-3 left-3 flex gap-3 text-white text-sm">
                                <span className="flex items-center gap-1"><BedDouble className="w-3.5 h-3.5 flex-shrink-0" />{property.bedrooms}</span>
                                <span className="flex items-center gap-1"><Bath className="w-3.5 h-3.5 flex-shrink-0" />{property.bathrooms}</span>
                                <span className="flex items-center gap-1"><Car className="w-3.5 h-3.5 flex-shrink-0" />{property.parking}</span>
                            </div>
                        </div>

                        {/* Content */}
                        <div className="p-4">
                            <h3 className="text-base font-semibold text-gray-900">{property.address}</h3>
                            <p className="text-sm text-gray-500 mb-3">{property.suburb}</p>

                            <div className="space-y-2 mb-3">
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-500">Loan Amount:</span>
                                    <span className="text-gray-900 font-medium">{formatCurrency(property.loanAmount)}</span>
                                </div>
                                {property.currentBid && (
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-500">Current Bid:</span>
                                        <span className="text-green-600 font-medium">{formatCurrency(property.currentBid)}</span>
                                    </div>
                                )}
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-500">Buy Now Price:</span>
                                    <span className="text-green-600 font-medium">{formatCurrency(property.buyNowPrice)}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-500">LVR:</span>
                                    <span className="text-gray-900">{property.lvr}%</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-500">Return:</span>
                                    <span className="text-gray-900">{property.returnRate}%</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-500">Type:</span>
                                    <span className="text-gray-900">{property.propertyType ?? property.type}</span>
                                </div>
                            </div>

                            {/* Countdown or Auction Date */}
                            {property.countdown && (
                                <div className="bg-red-50 border border-red-200 rounded px-3 py-2 mb-3 text-sm text-red-700 font-medium">
                                    <Timer className="w-4 h-4 inline-block mr-1 flex-shrink-0" /> Ends in {property.countdown}
                                </div>
                            )}
                            {property.auctionDate && (
                                <div className="bg-indigo-50 border border-indigo-200 rounded px-3 py-2 mb-3 text-sm text-indigo-700 font-medium flex items-center gap-2">
                                    <Calendar className="w-4 h-4 flex-shrink-0" />
                                    <span>Auction {property.auctionDate}</span>
                                </div>
                            )}

                            {/* Footer */}
                            <div className="flex items-center justify-between text-sm text-gray-500 mb-3">
                                <span>{property.id}</span>
                                {property.bids && <span>{property.bids} bids</span>}
                            </div>

                            {/* Actions */}
                            <div className="flex gap-2">
                                {property.dealType === 'auction' ? (
                                    <>
                                        <button
                                            onClick={() => openDealRoom(property)}
                                            className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium px-4 py-2 rounded"
                                        >
                                            Place Bid
                                        </button>
                                        <button
                                            onClick={() => openDealRoom(property)}
                                            className="border border-gray-300 text-gray-700 px-3 py-2 rounded hover:bg-gray-50"
                                        >
                                            <Eye className="w-4 h-4 flex-shrink-0" />
                                        </button>
                                    </>
                                ) : property.dealType === 'buy_now' ? (
                                    <>
                                        <button
                                            onClick={() => openDealRoom(property)}
                                            className="flex-1 border border-gray-300 text-gray-700 text-sm font-medium px-4 py-2 rounded hover:bg-gray-50"
                                        >
                                            View
                                        </button>
                                        <button
                                            onClick={() => openDealRoom(property)}
                                            className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium px-4 py-2 rounded"
                                        >
                                            Buy Now
                                        </button>
                                    </>
                                ) : (
                                    <button
                                        onClick={() => openDealRoom(property)}
                                        className="w-full border border-gray-300 text-gray-700 text-sm font-medium px-4 py-2 rounded hover:bg-gray-50"
                                    >
                                        View Details
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}
