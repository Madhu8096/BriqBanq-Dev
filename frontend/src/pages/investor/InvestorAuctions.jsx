import { useState, useMemo, useEffect } from "react";
import { auctionsData } from "../../data/auctionsData";
import InvestorAuctionCard from "../../components/auctions/InvestorAuctionCard";
import AuctionFilters from "../../components/auctions/AuctionFilters";
import AuctionStats from "../../components/auctions/AuctionStats";



import { auctionService } from "../../api/dataService";
import { LoadingState, ErrorState, EmptyState } from "../../components/common/States";


export default function InvestorAuctions() {
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
          setAuctions(res.data || []);
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

  if (loading) return <LoadingState />;
  if (error) return <ErrorState message={error} />;

  return (

    <div className="space-y-8">

      <div className="mb-2">
        <h2 className="text-2xl font-black text-[#0F172A] mb-1 tracking-tight">Active Auctions</h2>
        <p className="text-[#64748B] text-[13px] font-medium leading-relaxed">Participate in live bidding for premium mortgage assets</p>
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


      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 justify-items-center">
        {filteredAuctions.length > 0 ? (
          filteredAuctions.map((auction) => (
            <InvestorAuctionCard key={auction.id} auction={auction} />
          ))
        ) : (
          <div className="col-span-full w-full">
            <EmptyState
              message="No auctions found"
              submessage="Try searching for a different location or adjusting your status filters."
            />
          </div>
        )}
      </div>

    </div>
  );
}
