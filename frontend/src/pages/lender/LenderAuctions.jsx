import { useState, useMemo, useEffect } from "react";
import { auctionsData } from "../../data/auctionsData";
import LenderAuctionCard from "../../components/auctions/LenderAuctionCard";
import AuctionFilters from "../../components/auctions/AuctionFilters";
import AuctionStats from "../../components/auctions/AuctionStats";
import { auctionService } from "../../api/dataService";
import { LoadingState, ErrorState, EmptyState } from "../../components/common/States";

export default function LenderAuctions() {
    const [auctions, setAuctions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [search, setSearch] = useState("");
    const [filterStatus, setFilterStatus] = useState("all");
    const [sortOption, setSortOption] = useState("ending");

    useEffect(() => {
        const fetchAuctions = async () => {
            try {
                setLoading(true);
                setError(null);
                const res = await auctionService.getAuctions();
                if (res.success) {
                    const data = res.data;
                    setAuctions(Array.isArray(data) ? data : (data?.items || []));
                } else {
                    setError(res.error || "Failed to load auctions.");
                }
            } catch (err) {
                setError(err.message || "An unexpected error occurred.");
            } finally {
                setLoading(false);
            }
        };
        fetchAuctions();
    }, []);

    const filteredAuctions = useMemo(() => {
        let result = (auctions || []).filter((auction) => {
            const matchesSearch =
                auction.title?.toLowerCase().includes(search.toLowerCase()) ||
                auction.location?.toLowerCase().includes(search.toLowerCase());

            const matchesStatus =
                filterStatus === "all" || auction.status === filterStatus;

            return matchesSearch && matchesStatus;
        });

        if (sortOption === "low-high") {
            result.sort((a, b) => (a.propertyValue || 0) - (b.propertyValue || 0));
        }

        if (sortOption === "high-low") {
            result.sort((a, b) => (b.propertyValue || 0) - (a.propertyValue || 0));
        }

        if (sortOption === "ending") {
            result.sort(
                (a, b) => new Date(a.endTime || 0) - new Date(b.endTime || 0)
            );
        }

        return result;
    }, [auctions, search, filterStatus, sortOption]);

    const categorizedAuctions = useMemo(() => {
        const live = filteredAuctions.filter(a => a.status === "live");
        const upcoming = filteredAuctions.filter(a => a.status === "upcoming");
        const sold = filteredAuctions.filter(a => a.status === "sold");

        return { live, upcoming, sold };
    }, [filteredAuctions]);

    if (loading) return <LoadingState />;
    if (error) return <ErrorState message={error} />;

    const isSearching = search || filterStatus !== "all";

    return (
        <div className="space-y-10 animate-fade-in pt-6 pb-12">

            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-semibold text-slate-900 mb-1">Active Auctions</h1>
                    <p className="text-slate-500 text-sm font-medium">
                        Institutional monitoring of live and upcoming distressed asset recovery
                    </p>
                </div>
            </div>

            <AuctionStats auctions={auctionsData} />

            <AuctionFilters
                search={search}
                setSearch={setSearch}
                statusFilter={filterStatus}
                setStatusFilter={setFilterStatus}
                sortOption={sortOption}
                setSortOption={setSortOption}
            />

            {filteredAuctions.length > 0 ? (
                <div className="space-y-16">
                    {/* 1. LIVE AUCTIONS */}
                    {(isSearching ? filteredAuctions : categorizedAuctions.live).length > 0 && (
                        <div className="space-y-6">
                            <SectionHeading
                                title={isSearching ? "Search Results" : "Live Recovery Auctions"}
                                count={(isSearching ? filteredAuctions : categorizedAuctions.live).length}
                                color="text-red-600"
                                badgeColor="bg-red-50 text-red-600 border-red-100"
                                isLive
                            />
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 justify-items-center">
                                {(isSearching ? filteredAuctions : categorizedAuctions.live).map((auction) => (
                                    <LenderAuctionCard key={auction.id} auction={auction} />
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Upcoming and Sold only if not searching or if relevant items exist */}
                    {!isSearching && (
                        <>
                            {categorizedAuctions.upcoming.length > 0 && (
                                <div className="space-y-6">
                                    <SectionHeading
                                        title="Upcoming Opportunities"
                                        count={categorizedAuctions.upcoming.length}
                                        color="text-indigo-600"
                                        badgeColor="bg-indigo-50 text-indigo-600 border-indigo-100"
                                    />
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 justify-items-center opacity-90 transition-opacity hover:opacity-100">
                                        {categorizedAuctions.upcoming.map((auction) => (
                                            <LenderAuctionCard key={auction.id} auction={auction} />
                                        ))}
                                    </div>
                                </div>
                            )}

                            {categorizedAuctions.sold.length > 0 && (
                                <div className="space-y-6">
                                    <SectionHeading
                                        title="Completed Recoveries (Sold)"
                                        count={categorizedAuctions.sold.length}
                                        color="text-slate-900"
                                        badgeColor="bg-slate-100 text-slate-900 border-slate-200"
                                    />
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 justify-items-center grayscale-[0.5] opacity-80 hover:grayscale-0 hover:opacity-100 transition-all">
                                        {categorizedAuctions.sold.map((auction) => (
                                            <LenderAuctionCard key={auction.id} auction={auction} />
                                        ))}
                                    </div>
                                </div>
                            )}
                        </>
                    )}
                </div>
            ) : (
                <div className="col-span-full w-full py-20 bg-white rounded-[2.5rem] border border-dashed border-gray-200 flex flex-col items-center justify-center text-center shadow-sm">
                    <div className="w-20 h-20 bg-gray-50 rounded-3xl flex items-center justify-center mb-6">
                        <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#CBD5E1" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2">No auctions matching your criteria</h3>
                    <p className="text-gray-400 font-medium max-w-sm">Adjust your filters or try a broader search term to discover more opportunities.</p>
                </div>
            )}

        </div>
    );
}

function SectionHeading({ title, count, color, badgeColor, isLive }) {
    return (
        <div className="flex items-center gap-4 pb-2">
            <h3 className={`text-lg font-semibold text-slate-900 tracking-tight flex items-center gap-3`}>
                {isLive && <span className="w-2 h-2 bg-red-600 rounded-full animate-pulse shadow-[0_0_10px_rgba(220,38,38,0.5)]"></span>}
                {title}
            </h3>
            <span className={`px-2.5 py-0.5 rounded-lg text-xs font-bold border ${badgeColor}`}>
                {count}
            </span>
            <div className="flex-1 h-[1px] bg-slate-100 ml-2"></div>
        </div>
    );
}
