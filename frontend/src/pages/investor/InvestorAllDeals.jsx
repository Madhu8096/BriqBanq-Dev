import { useState, useMemo, useEffect, useRef } from "react";
import InvestorDealCard from "../../components/deals/InvestorDealCard";

import { dealsService } from "../../api/dataService";
import { LoadingState, ErrorState, EmptyState } from "../../components/common/States";

export default function InvestorAllDeals() {
  const [deals, setDeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // UI States (for dropdowns/inputs)
  const [search, setSearch] = useState("");
  const [selectedState, setSelectedState] = useState("All States");
  const [selectedStatus, setSelectedStatus] = useState("All Status");
  const [sortBy, setSortBy] = useState("Newest");
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [advancedFilters, setAdvancedFilters] = useState({
    minROI: "",
    maxROI: "",
    minPrice: "",
    maxPrice: "",
    tenure: "Any"
  });

  // Applied States (the ones actually used for filtering)
  const [appliedFilters, setAppliedFilters] = useState({
    search: "",
    state: "All States",
    status: "All Status",
    sortBy: "Newest",
    advanced: {
      minROI: "",
      maxROI: "",
      minPrice: "",
      maxPrice: "",
      tenure: "Any"
    }
  });

  const fetchDeals = async (showLoading = true) => {
    try {
      if (showLoading) setLoading(true);
      setError(null);
      const res = await dealsService.getDeals();
      if (res.success) {
        const data = res.data;
        setDeals(Array.isArray(data) ? data : (data?.items || []));
      } else {
        setError(res.error || "Failed to load deals.");
      }
    } catch (err) {
      if (err.response?.status !== 401) {
        setError(err.message || "An unexpected error occurred.");
      }
    } finally {
      if (showLoading) setLoading(false);
    }
  };

  useEffect(() => {
    fetchDeals();
    // Real-time updates: Auto-refresh every 30 seconds
    const interval = setInterval(() => fetchDeals(false), 30000);
    return () => clearInterval(interval);
  }, []);

  const handleApplyFilters = () => {
    setAppliedFilters({
      search,
      state: selectedState,
      status: selectedStatus,
      sortBy,
      advanced: { ...advancedFilters }
    });
    setShowAdvanced(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleApplyFilters();
    }
  };

  const filteredDeals = useMemo(() => {
    let data = [...(deals || [])];
    const { search: s, state, status, sortBy: sort, advanced } = appliedFilters;

    // SEARCH
    if (s) {
      data = data.filter((deal) =>
        `${deal.title || ''} ${deal.suburb || ''} ${deal.postcode || ''} ${deal.property_address || ''}`
          .toLowerCase()
          .includes(s.toLowerCase())
      );
    }

    // STATE FILTER
    if (state !== "All States") {
      data = data.filter((deal) => deal.state === state);
    }

    // STATUS FILTER
    if (status !== "All Status") {
      const statusMap = {
        "Live Auction": "LISTED", // Status remains LISTED while an auction is active
        "Coming Soon": "DRAFT",  // Not yet listed
        "Active": "UNDER_CONTRACT", // Or similar
        "Sold": "CLOSED"
      };
      const backendStatus = statusMap[status] || status;
      data = data.filter((deal) => (deal.status?.toUpperCase() || '') === backendStatus.toUpperCase());
    }

    // ADVANCED FILTERS
    if (advanced.minROI) {
      data = data.filter(deal => (deal.interest_rate || 0) >= parseFloat(advanced.minROI));
    }
    if (advanced.maxROI) {
      data = data.filter(deal => (deal.interest_rate || 0) <= parseFloat(advanced.maxROI));
    }
    if (advanced.minPrice) {
      data = data.filter(deal => (deal.loanAmount || 0) >= parseFloat(advanced.minPrice));
    }
    if (advanced.maxPrice) {
      data = data.filter(deal => (deal.loanAmount || 0) <= parseFloat(advanced.maxPrice));
    }
    if (advanced.tenure !== "Any") {
      const tenureVal = parseInt(advanced.tenure);
      data = data.filter(deal => deal.tenure === tenureVal);
    }

    // SORT
    if (sort === "Price: Low to High") {
      data.sort((a, b) => (a.loanAmount || 0) - (b.loanAmount || 0));
    } else if (sort === "Price: High to Low") {
      data.sort((a, b) => (b.loanAmount || 0) - (a.loanAmount || 0));
    } else if (sort === "Oldest") {
      data.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
    } else {
      // Default: Newest
      data.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    }

    return data;
  }, [deals, appliedFilters]);

  if (loading) return <LoadingState />;
  if (error) return <ErrorState message={error} />;

  return (
    <div className="space-y-8">

      <div className="mb-2 flex justify-between items-end">
        <div>
          <h2 className="text-2xl font-black text-[#0F172A] mb-1 tracking-tight">Investment Opportunities</h2>
          <p className="text-[#64748B] text-[13px] font-medium leading-relaxed">
            Browse available deals and manage your bids with real-time market data
          </p>
        </div>
        <button 
          onClick={() => fetchDeals(true)}
          className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
          title="Refresh Data"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 2v6h-6"></path><path d="M3 12a9 9 0 0 1 15-6.7L21 8"></path><path d="M3 22v-6h6"></path><path d="M21 12a9 9 0 0 1-15 6.7L3 16"></path></svg>
        </button>
      </div>

      {/* FILTER BAR */}
      <div className="relative bg-white/60 backdrop-blur-md p-4 rounded-xl shadow-sm border border-gray-100 space-y-4">
        <div className="flex flex-col md:flex-row md:items-center gap-4">
          <div className="flex-1 relative">
            <input
              type="text"
              placeholder="Search suburb, postcode or address..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={handleKeyDown}
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
              <option>Oldest</option>
              <option>Price: Low to High</option>
              <option>Price: High to Low</option>
            </select>

            <button 
              onClick={() => setShowAdvanced(!showAdvanced)}
              className={`border border-gray-200 px-4 py-2 rounded-lg text-sm font-semibold transition-colors whitespace-nowrap ${showAdvanced ? 'bg-indigo-50 text-indigo-700 border-indigo-200' : 'text-gray-600 hover:bg-gray-50'}`}
            >
              Advanced Filters
            </button>

            <button 
              onClick={handleApplyFilters}
              className="bg-indigo-600 px-6 py-2 rounded-lg text-sm font-semibold text-white hover:bg-indigo-700 transition-colors shadow-sm"
            >
              Apply Changes
            </button>
          </div>
        </div>

        {/* ADVANCED FILTERS PANEL */}
        {showAdvanced && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4 pt-4 border-t border-dashed border-gray-200 animate-in fade-in slide-in-from-top-2 duration-200">
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">Min Price (A$)</label>
              <input 
                type="number" 
                placeholder="0"
                value={advancedFilters.minPrice}
                onChange={(e) => setAdvancedFilters({...advancedFilters, minPrice: e.target.value})}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500/20 outline-none"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">Max Price (A$)</label>
              <input 
                type="number" 
                placeholder="Any"
                value={advancedFilters.maxPrice}
                onChange={(e) => setAdvancedFilters({...advancedFilters, maxPrice: e.target.value})}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500/20 outline-none"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">Min ROI (%)</label>
              <input 
                type="number" 
                placeholder="0"
                value={advancedFilters.minROI}
                onChange={(e) => setAdvancedFilters({...advancedFilters, minROI: e.target.value})}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500/20 outline-none"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">Max ROI (%)</label>
              <input 
                type="number" 
                placeholder="Any"
                value={advancedFilters.maxROI}
                onChange={(e) => setAdvancedFilters({...advancedFilters, maxROI: e.target.value})}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500/20 outline-none"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">Tenure (Months)</label>
              <select 
                value={advancedFilters.tenure}
                onChange={(e) => setAdvancedFilters({...advancedFilters, tenure: e.target.value})}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500/20 outline-none"
              >
                <option>Any</option>
                <option>6</option>
                <option>12</option>
                <option>18</option>
                <option>24</option>
              </select>
            </div>
          </div>
        )}
      </div>

      {/* CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredDeals.length > 0 ? (
          filteredDeals.map((deal) => {
            // Normalize data for the card if backend field names differ from expected
            const normalizedDeal = {
              ...deal,
              loanAmount: deal.asking_price || deal.loanAmount || 0,
              returnRate: deal.interest_rate || deal.returnRate || 0,
              // Add other mappings if needed
            };
            return <InvestorDealCard key={deal.id} deal={normalizedDeal} />;
          })
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
