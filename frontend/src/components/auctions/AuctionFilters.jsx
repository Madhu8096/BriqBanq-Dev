export default function AuctionFilters({
  search,
  setSearch,
  statusFilter,
  setStatusFilter,
  sortOption,
  setSortOption,
}) {
  return (
    <div className="flex flex-col md:flex-row md:items-center gap-4 bg-white/60 backdrop-blur-md p-4 rounded-xl shadow-sm border border-gray-100">

      <input
        type="text"
        placeholder="Search by suburb, address or property type..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full md:flex-1 border rounded-lg px-4 py-2"
      />

      <select
        value={statusFilter}
        onChange={(e) => setStatusFilter(e.target.value)}
        className="border rounded-lg px-4 py-2 cursor-pointer"
      >
        <option value="all">All Auctions</option>
        <option value="live">Live Now</option>
        <option value="upcoming">Upcoming</option>
      </select>

      <select
        value={sortOption}
        onChange={(e) => setSortOption(e.target.value)}
        className="border rounded-lg px-4 py-2"
      >
        <option value="ending">Ending Soon</option>
        <option value="low-high">Price: Low to High</option>
        <option value="high-low">Price: High to Low</option>
      </select>

      <button className="border px-4 py-2 rounded-lg">
        Advanced Filters
      </button>

    </div>
  );
}
