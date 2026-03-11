import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
const MOCK_DEALS = []
import AuctionHero from '../../components/admin/deals/AuctionHero'
import MetricsCards from '../../components/admin/deals/MetricsCards'
import LoanDetails from '../../components/admin/deals/LoanDetails'
import PropertyInformation from '../../components/admin/deals/PropertyInformation'
import AvailableDocuments from '../../components/admin/deals/AvailableDocuments'
import CurrentHighestBid from '../../components/admin/deals/CurrentHighestBid'
import PlaceYourBid from '../../components/admin/deals/PlaceYourBid'
import BidHistoryList from '../../components/admin/deals/BidHistory'
import InvestmentSummary from '../../components/admin/deals/InvestmentSummary'
import InvestmentMemorandumTab from '../../components/admin/deals/InvestmentMemorandumTab'
import { FileText, Gavel } from 'lucide-react'

export default function AuctionRoom() {
    const { id } = useParams()
    const [deal, setDeal] = useState(null)
    const [activeTab, setActiveTab] = useState('live') // 'live' or 'memo'
    const [bids, setBids] = useState([])
    const [highestBid, setHighestBid] = useState(0)

    useEffect(() => {
        const foundDeal = MOCK_DEALS.find(d => d.id === id) || MOCK_DEALS[0]
        setDeal(foundDeal)
        setBids(foundDeal.bidHistory)
        setHighestBid(foundDeal.financials.currentHighestBid)
    }, [id])

    if (!deal) return <div className="p-8">Loading...</div>

    const handlePlaceBid = (amount) => {
        const newBid = {
            id: bids.length + 1,
            bidder: 'You',
            amount: amount,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            isWinning: true,
            isYou: true,
            increment: amount - highestBid
        }

        // Update history (newest first)
        const updatedBids = [newBid, ...bids.map(b => ({ ...b, isWinning: false }))]
        setBids(updatedBids)
        setHighestBid(amount)
    }

    return (
        <div className="min-h-screen bg-[#FDFDFF] pb-20">
            {/* Header */}
            <div className="mb-8 px-8 pt-8">
                <h1 className="text-3xl font-black text-gray-900 tracking-tight">Auction Room</h1>
                <p className="text-sm text-gray-500 font-medium">Platform administration and compliance management</p>
            </div>

            {/* Hero Section */}
            <div className="px-8 mb-8">
                <AuctionHero deal={deal} />
            </div>

            {/* Tabs */}
            <div className="px-8 mb-8">
                <div className="flex gap-4 p-1.5 bg-gray-100/50 rounded-[1.5rem] w-fit">
                    <button
                        onClick={() => setActiveTab('live')}
                        className={`flex items-center gap-3 px-8 py-3.5 text-[11px] font-black uppercase tracking-widest rounded-[1.25rem] transition-all duration-500 ${activeTab === 'live'
                            ? 'bg-white text-indigo-600 shadow-[0_8px_24px_-4px_rgba(0,0,0,0.06)]'
                            : 'text-gray-400 hover:text-gray-600'
                            }`}
                    >
                        <Gavel className="w-4 h-4" />
                        Live Auction
                    </button>
                    <button
                        onClick={() => setActiveTab('memo')}
                        className={`flex items-center gap-3 px-8 py-3.5 text-[11px] font-black uppercase tracking-widest rounded-[1.25rem] transition-all duration-500 ${activeTab === 'memo'
                            ? 'bg-white text-indigo-600 shadow-[0_8px_24px_-4px_rgba(0,0,0,0.06)]'
                            : 'text-gray-400 hover:text-gray-600'
                            }`}
                    >
                        <FileText className="w-4 h-4" />
                        Investment Memorandum
                    </button>
                </div>
            </div>

            {activeTab === 'live' ? (
                <div className="px-8 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
                    <MetricsCards metrics={deal.metrics} />

                    <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                        {/* Left Column */}
                        <div className="xl:col-span-2 space-y-8">
                            <LoanDetails financials={deal.financials} metrics={deal.metrics} />
                            <PropertyInformation deal={deal} />
                            <AvailableDocuments documents={deal.documents} />
                        </div>

                        {/* Right Column */}
                        <div className="space-y-8">
                            <CurrentHighestBid
                                amount={highestBid}
                                bidderCount={deal.financials.bidderCount}
                                reservePrice={deal.financials.reservePrice}
                                isReserveMet={highestBid >= deal.financials.reservePrice}
                            />
                            <PlaceYourBid
                                currentBid={highestBid}
                                onPlaceBid={handlePlaceBid}
                            />
                            <BidHistoryList bids={bids} />
                            <InvestmentSummary financials={deal.financials} />
                        </div>
                    </div>
                </div>
            ) : (
                <div className="px-8">
                    <InvestmentMemorandumTab deal={deal} />
                </div>
            )}
        </div>
    )
}
