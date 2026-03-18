import { useState, useMemo, useEffect } from "react";
import LenderDealCard from "../../components/deals/LenderDealCard";
import { dealsService } from "../../api/dataService";
import { LoadingState, ErrorState, EmptyState } from "../../components/common/States";

export default function LenderAllDeals() {
    const [deals, setDeals] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [search, setSearch] = useState("");
    const [selectedState, setSelectedState] = useState("All States");
    const [selectedStatus, setSelectedStatus] = useState("All Status");
    const [sortBy, setSortBy] = useState("Newest");

    useEffect(() => {
        const fetchDeals = async () => {
            try {
                setLoading(true);
                setError(null);
                const res = await dealsService.getDeals();
                if (res.success) {
                    const data = res.data;
                    setDeals(Array.isArray(data) ? data : (data?.items || []));
                } else {
                    setError(res.error || "Failed to load deals.");
                }
            } catch (err) {
                setError(err.message || "An unexpected error occurred.");
            } finally {
                setLoading(false);
            }
        };
        fetchDeals();
    }, []);

    const filteredDeals = useMemo(() => {
        let data = [...(deals || [])];

        // SEARCH
        if (search) {
            data = data.filter((deal) =>
                `${deal.title || ''} ${deal.suburb || ''} ${deal.postcode || ''}`
                    .toLowerCase()
                    .includes(search.toLowerCase())
            );
        }

        // STATE FILTER
        if (selectedState !== "All States") {
            data = data.filter((deal) => deal.state === selectedState);
        }

        // STATUS FILTER
        if (selectedStatus !== "All Status") {
            data = data.filter((deal) => deal.status === selectedStatus);
        }

        // SORT
        if (sortBy === "Price: Low to High") {
            data.sort((a, b) => (a.loanAmount || 0) - (b.loanAmount || 0));
        }

        if (sortBy === "Price: High to Low") {
            data.sort((a, b) => (b.loanAmount || 0) - (a.loanAmount || 0));
        }

        return data;
    }, [deals, search, selectedState, selectedStatus, sortBy]);

    const categorizedDeals = useMemo(() => {
        const auctions = filteredDeals.filter(d => d.status === "Live Auction");
        const buyNow = filteredDeals.filter(d => d.status === "Buy Now" || d.status === "Active");
        const upcoming = filteredDeals.filter(d => d.status === "Coming Soon");
        const sold = filteredDeals.filter(d => d.status === "Sold");

        return { auctions, buyNow, upcoming, sold };
    }, [filteredDeals]);

    if (loading) return <LoadingState />;
    if (error) return <ErrorState message={error} />;

    const isSearching = search || selectedState !== "All States" || selectedStatus !== "All Status";

    return (
        <div className="space-y-10 animate-fade-in pt-6 pb-12">
            <div>
                <h1 className="text-2xl font-semibold text-slate-900 mb-1">All Deals</h1>
                <p className="text-slate-500 text-sm font-medium">
                    Monitor and participate in live lender auctions and acquisitions
                </p>
            </div>

            {/* FILTER BAR */}
            <div className="flex flex-col md:flex-row md:items-center gap-4 bg-white/60 backdrop-blur-md p-4 rounded-xl shadow-sm border border-gray-100">
                <div className="flex-1 relative">
                    <input
                        type="text"
                        placeholder="Search by suburb, postcode or asset ID..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full border border-gray-200 bg-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all text-sm font-medium pr-10"
                    />
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                    </div>
                </div>

                <div className="flex flex-wrap md:flex-nowrap gap-3">
                    <select
                        value={selectedState}
                        onChange={(e) => setSelectedState(e.target.value)}
                        className="border border-gray-200 bg-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all text-sm font-medium cursor-pointer min-w-[120px]"
                    >
                        <option>All States</option>
                        <option>VIC</option>
                        <option>NSW</option>
                        <option>QLD</option>
                        <option>WA</option>
                    </select>

                    <select
                        value={selectedStatus}
                        onChange={(e) => setSelectedStatus(e.target.value)}
                        className="border border-gray-200 bg-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all text-sm font-medium cursor-pointer min-w-[140px]"
                    >
                        <option>All Status</option>
                        <option>Live Auction</option>
                        <option>Coming Soon</option>
                        <option>Active</option>
                        <option>Sold</option>
                    </select>

                    <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                        className="border border-gray-200 bg-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all text-sm font-medium cursor-pointer min-w-[150px]"
                    >
                        <option>Newest First</option>
                        <option>Price: Low to High</option>
                        <option>Price: High to Low</option>
                    </select>
                </div>
            </div>

            {/* CATEGORIZED VIEW */}
            {filteredDeals.length > 0 ? (
                <div className="space-y-16">
                    {/* 1. LIVE AUCTIONS */}
                    {(isSearching ? filteredDeals : categorizedDeals.auctions).length > 0 && (
                        <div className="space-y-6">
                            <SectionHeader
                                title={isSearching ? "Search Results" : "Live Recovery Auctions"}
                                count={(isSearching ? filteredDeals : categorizedDeals.auctions).length}
                                color="text-red-600"
                                badgeColor="bg-red-50 text-red-600 border-red-100"
                            />
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                {(isSearching ? filteredDeals : categorizedDeals.auctions).map((deal) => (
                                    <LenderDealCard key={deal.id} deal={deal} />
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Remaining categories only show when not searching or if items exist in section */}
                    {!isSearching && (
                        <>
                            {categorizedDeals.buyNow.length > 0 && (
                                <div className="space-y-6">
                                    <SectionHeader
                                        title="Direct Acquisition (Buy Now)"
                                        count={categorizedDeals.buyNow.length}
                                        color="text-green-600"
                                        badgeColor="bg-green-50 text-green-600 border-green-100"
                                    />
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                        {categorizedDeals.buyNow.map((deal) => (
                                            <LenderDealCard key={deal.id} deal={deal} />
                                        ))}
                                    </div>
                                </div>
                            )}

                            {categorizedDeals.upcoming.length > 0 && (
                                <div className="space-y-6">
                                    <SectionHeader
                                        title="Upcoming Opportunities"
                                        count={categorizedDeals.upcoming.length}
                                        color="text-blue-600"
                                        badgeColor="bg-blue-50 text-blue-600 border-blue-100"
                                    />
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 opacity-90 transition-opacity hover:opacity-100">
                                        {categorizedDeals.upcoming.map((deal) => (
                                            <LenderDealCard key={deal.id} deal={deal} />
                                        ))}
                                    </div>
                                </div>
                            )}

                            {categorizedDeals.sold.length > 0 && (
                                <div className="space-y-6">
                                    <SectionHeader
                                        title="Recovered Assets (Sold)"
                                        count={categorizedDeals.sold.length}
                                        color="text-slate-900"
                                        badgeColor="bg-slate-100 text-slate-900 border-slate-200"
                                    />
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 grayscale-[0.5] opacity-80 hover:grayscale-0 hover:opacity-100 transition-all">
                                        {categorizedDeals.sold.map((deal) => (
                                            <LenderDealCard key={deal.id} deal={deal} />
                                        ))}
                                    </div>
                                </div>
                            )}
                        </>
                    )}
                </div>
            ) : (
                <div className="w-full py-20 bg-white rounded-[2.5rem] border border-dashed border-gray-200 flex flex-col items-center justify-center text-center">
                    <div className="w-20 h-20 bg-gray-50 rounded-3xl flex items-center justify-center mb-6">
                        <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#CBD5E1" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2">No matching assets found</h3>
                    <p className="text-gray-400 font-medium max-w-sm">Adjust your filters or search terms to find available lender opportunities.</p>
                </div>
            )}
        </div>
    );
}

function SectionHeader({ title, count, color, badgeColor }) {
    return (
        <div className="flex items-center gap-4 pb-2">
            <h3 className={`text-lg font-semibold text-slate-900 tracking-tight`}>{title}</h3>
            <span className={`px-2.5 py-0.5 rounded-lg text-xs font-bold border ${badgeColor}`}>
                {count}
            </span>
            <div className="flex-1 h-[1px] bg-slate-100 ml-2"></div>
        </div>
    );
}
