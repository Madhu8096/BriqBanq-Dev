import { useState, useMemo, useEffect } from "react";
import InvestorDealCard from "../../components/deals/InvestorDealCard";

import { dealsService } from "../../api/dataService";
import { LoadingState, ErrorState, EmptyState } from "../../components/common/States";

export default function InvestorAllDeals() {
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
          setDeals(res.data || []);
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

  if (loading) return <LoadingState />;
  if (error) return <ErrorState message={error} />;

  return (
    <div className="space-y-8">

      <div className="mb-2">
        <h2 className="text-2xl font-black text-[#0F172A] mb-1 tracking-tight">Investment Opportunities</h2>
        <p className="text-[#64748B] text-[13px] font-medium leading-relaxed">
          Browse available deals and manage your bids with real-time market data
        </p>
      </div>

      {/* FILTER BAR - Matched with Auctions Style */}
      <div className="flex flex-col md:flex-row md:items-center gap-4 bg-white/60 backdrop-blur-md p-4 rounded-xl shadow-sm border border-gray-100">
        <div className="flex-1 relative">
          <input
            type="text"
            placeholder="Search suburb, postcode or address..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full border border-gray-200 bg-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-sm pr-10"
          />
          <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
          </div>
        </div>

        <div className="flex flex-wrap md:flex-nowrap gap-3">
          <select
            value={selectedState}
            onChange={(e) => setSelectedState(e.target.value)}
            className="border border-gray-200 bg-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-sm cursor-pointer min-w-[120px]"
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
            className="border border-gray-200 bg-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-sm cursor-pointer min-w-[120px]"
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
            className="border border-gray-200 bg-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-sm cursor-pointer min-w-[120px]"
          >
            <option>Newest</option>
            <option>Price: Low to High</option>
            <option>Price: High to Low</option>
          </select>

          <button className="border border-gray-200 px-4 py-2 rounded-lg text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-colors whitespace-nowrap">
            Advanced Filters
          </button>
        </div>
      </div>

      {/* CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredDeals.length > 0 ? (
          filteredDeals.map((deal) => (
            <InvestorDealCard key={deal.id} deal={deal} />
          ))
        ) : (
          <div className="col-span-full w-full">
            <EmptyState
              message="No deals found"
              submessage="Try searching for a different suburb or adjusting your filters."
            />
          </div>
        )}
      </div>

    </div>
  );
}
