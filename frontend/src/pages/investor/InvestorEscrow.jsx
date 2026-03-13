import { useState, useMemo, useEffect } from "react";
import { escrowService } from "../../api/dataService";
import { LoadingState, ErrorState } from "../../components/common/States";
import { formatCurrency } from "../../utils/formatters";
import { CheckCircle, Shield, Calendar, CreditCard, ArrowRight } from "lucide-react";

export default function InvestorEscrow() {
  const [escrow, setEscrow] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    const fetchEscrow = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await escrowService.getEscrowInfo();
        if (res.success) {
          const data = res.data;
          setEscrow(data);
          setTransactions(data?.transactions || []);
        } else {
          setError(res.error || "Failed to load escrow data");
        }
      } catch (err) {
        setError(err.message || "An unexpected error occurred");
      } finally {
        setLoading(false);
      }
    };
    fetchEscrow();
  }, []);

  const settlementDate = useMemo(() => escrow?.details?.settlementDate ? new Date(escrow.details.settlementDate) : null, [escrow]);
  const daysRemaining = useMemo(() => {
    if (!settlementDate) return 0;
    const today = new Date();
    return Math.ceil((settlementDate - today) / (1000 * 60 * 60 * 24));
  }, [settlementDate]);

  const totalHeld = escrow?.totalHeld || 0;
  const totalReleased = useMemo(() => {
    return (transactions || [])
      .filter((t) => t.status === "completed")
      .reduce((sum, t) => sum + (t.amount || 0), 0);
  }, [transactions]);

  const remainingBalance = totalHeld - totalReleased;
  const pendingTransactions = (transactions || []).filter((t) => t.status === "pending");

  const handleRelease = (id) => {
    setTransactions((prev) =>
      (prev || []).map((t) => (t.id === id ? { ...t, status: "completed" } : t))
    );
  };

  const handleReleaseAll = () => {
    setTransactions((prev) =>
      (prev || []).map((t) => (t.status === "pending" ? { ...t, status: "completed" } : t))
    );
  };

  if (loading) return <LoadingState />;
  if (error) return <ErrorState message={error} />;
  if (!escrow) return <ErrorState message="Escrow data not found" />;

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h2>Escrow Funds</h2>
          <p className="text-gray-500 font-medium">
            Manage your secure investment releases and balances
          </p>
        </div>
        <div className="bg-indigo-50 border border-indigo-100 px-4 py-2 rounded-xl flex items-center gap-2 text-indigo-700 text-[10px] font-medium uppercase tracking-wider">
          <Shield size={14} />
          Secured by Brickbanq
        </div>
      </div>

      {/* STATS CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard title="Total Funds Held" value={totalHeld} color="indigo" icon={<Shield size={20} />} />
        <StatCard title="Total Released" value={totalReleased} color="green" icon={<CheckCircle size={20} />} />
        <StatCard title="Remaining Balance" value={remainingBalance} color="gray" icon={<CreditCard size={20} />} />
      </div>

      {/* PENDING ALERT */}
      {pendingTransactions.length > 0 && (
        <div className="bg-gradient-to-r from-orange-50 to-white border-y md:border border-orange-200 p-6 md:rounded-3xl flex flex-col md:flex-row justify-between items-center gap-6 shadow-sm">
          <div className="flex items-center gap-4 text-center md:text-left">
            <div className="bg-orange-100 p-3 rounded-2xl text-orange-600 animate-bounce">
              <Calendar size={24} />
            </div>
            <div>
              <p className="font-semibold text-orange-900 leading-tight uppercase text-xs tracking-widest mb-1">
                Pending Actions Required
              </p>
              <p className="text-sm text-orange-700 font-medium">
                {pendingTransactions.length} transactions are awaiting your final release authorization.
              </p>
            </div>
          </div>

          <button
            onClick={handleReleaseAll}
            className="w-full md:w-auto bg-orange-600 text-white px-8 py-3.5 rounded-2xl font-semibold text-sm uppercase tracking-widest hover:bg-orange-700 transition-all shadow-lg shadow-orange-100 active:scale-95"
          >
            Authorize All Releases
          </button>
        </div>
      )}

      {/* TRANSACTION TABLE */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-50 flex items-center justify-between bg-gray-50/50">
          <h2 className="font-semibold text-gray-900 uppercase text-[10px] tracking-wider">Transaction Ledger</h2>
          <span className="text-[10px] font-medium text-gray-400 uppercase">Showing last {transactions.length} activities</span>
        </div>

        {/* Desktop Table */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left">
            <thead className="text-[10px] font-medium text-gray-400 uppercase tracking-wider bg-white">
              <tr>
                <th className="p-6">Date</th>
                <th className="py-6">Type</th>
                <th className="py-6">Recipient</th>
                <th className="py-6">Amount</th>
                <th className="py-6">Status</th>
                <th className="p-6 text-right">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-50">
              {(transactions || []).map((t) => (
                <tr key={t.id} className="hover:bg-gray-50/50 transition-colors group">
                  <td className="p-6 text-sm text-gray-500 font-normal">{t.date || "N/A"}</td>
                  <td className="py-6 font-medium text-gray-800 text-sm">{t.type}</td>
                  <td className="py-6">
                    <p className="text-sm font-semibold text-gray-900">{t.recipient || "Unknown"}</p>
                    <p className="text-[10px] text-gray-400 font-medium">Partner Verification Done</p>
                  </td>
                  <td className="py-6 text-lg font-semibold text-indigo-600">
                    {formatCurrency(t.amount)}
                  </td>

                  <td className="py-6">
                    {t.status === "completed" ? (
                      <span className="text-green-600 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-tighter">
                        <CheckCircle size={14} />
                        Released
                      </span>
                    ) : (
                      <span className="bg-gray-100 text-gray-500 px-3 py-1 rounded-full text-[10px] font-semibold uppercase tracking-widest">
                        Pending
                      </span>
                    )}
                  </td>

                  <td className="p-6 text-right">
                    {t.status === "pending" && (
                      <button
                        onClick={() => handleRelease(t.id)}
                        className="bg-white border border-indigo-600 text-indigo-600 px-5 py-2 rounded-xl text-[10px] font-semibold uppercase tracking-wider hover:bg-indigo-600 hover:text-white transition-all active:scale-95 whitespace-nowrap"
                      >
                        Release Funds
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* MOBILE CARDS */}
        <div className="md:hidden divide-y divide-gray-100">
          {(transactions || []).map((t) => (
            <div key={t.id} className="p-5 space-y-4 hover:bg-gray-50 transition-colors">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-[10px] font-semibold text-indigo-600 uppercase tracking-widest mb-1">{t.type}</p>
                  <p className="font-semibold text-gray-900">{t.recipient}</p>
                  <p className="text-[10px] text-gray-400 font-bold">{t.date}</p>
                </div>
                <p className="text-xl font-semibold text-gray-900">{formatCurrency(t.amount)}</p>
              </div>

              {t.status === "pending" ? (
                <button
                  onClick={() => handleRelease(t.id)}
                  className="w-full bg-indigo-600 text-white py-3.5 rounded-2xl font-semibold text-xs uppercase tracking-widest transition-all active:scale-[0.98] shadow-lg shadow-indigo-100"
                >
                  Release Funds Now
                </button>
              ) : (
                <div className="bg-green-50 text-green-600 py-3 rounded-2xl flex items-center justify-center gap-2 text-xs font-semibold uppercase tracking-widest border border-green-100">
                  <CheckCircle size={16} />
                  Successfully Released
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* ESCROW DETAILS + SECURITY */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* ESCROW DETAILS */}
        <div className="bg-gradient-to-br from-indigo-900 to-indigo-950 p-5 rounded-2xl text-white shadow-xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-10 opacity-5 group-hover:opacity-10 transition-opacity">
            <Shield size={200} />
          </div>

          <h3 className="text-base font-bold uppercase tracking-tight mb-4 border-b border-white/10 pb-3 text-indigo-100">
            Escrow Authority Details
          </h3>

          <div className="space-y-3 relative z-10">
            <DetailItem label="Escrow Agent" value={escrow?.details?.agent} sub={`License: ${escrow?.details?.license || 'N/A'}`} />
            <DetailItem
              label="Anticipated Settlement"
              value={settlementDate?.toDateString() || "TBD"}
              sub={daysRemaining > 0 ? `${daysRemaining} days remaining` : "Processing completed"}
            />
            <DetailItem label="Secure Escrow Account" value={escrow?.details?.accountNumber} mono />
          </div>

          <div className="mt-4 p-3 bg-white/5 rounded-xl border border-white/10 text-[9px] leading-tight opacity-60 italic">
            All escrow activities are monitored and compliant with the Australian Financial Complaints Authority (AFCA).
          </div>
        </div>

        {/* SECURITY */}
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm space-y-4">
          <div className="flex items-center gap-3">
            <div className="bg-green-50 p-2 rounded-xl text-green-600">
              <Shield size={20} />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 uppercase tracking-tight">Security Protocols</h3>
              <p className="text-[10px] text-gray-400 font-medium uppercase tracking-wider">Compliance & Protection Level 4</p>
            </div>
          </div>

          <div className="space-y-4">
            {(escrow?.security || []).map((item, index) => (
              <div key={index} className="flex items-start gap-4 group">
                <div className="mt-1 bg-green-50 text-green-600 p-1 rounded-full group-hover:scale-110 transition-transform">
                  <CheckCircle size={14} />
                </div>
                <div>
                  <p className="font-semibold text-gray-900 text-sm uppercase tracking-tight mb-1">{item.title}</p>
                  <p className="text-xs text-gray-500 leading-relaxed font-medium transition-colors group-hover:text-gray-700">
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, color, icon }) {
  const iconColors = {
    indigo: "bg-indigo-50 text-indigo-600",
    green: "bg-green-50 text-green-600",
    gray: "bg-gray-50 text-gray-600",
  };

  return (
    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex justify-between items-start group hover:shadow-md transition-shadow">
      <div>
        <p className="text-xs font-medium text-gray-400 mb-1">{title}</p>
        <h2 className="text-3xl font-bold text-gray-900 mb-1">{formatCurrency(value)}</h2>
        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Escrow Active</p>
      </div>
      <div className={`p-3 rounded-xl ${iconColors[color]}`}>
        {icon}
      </div>
    </div>
  );
}

function DetailItem({ label, value, sub, mono }) {
  return (
    <div>
      <p className="text-white/40 text-[9px] font-medium uppercase tracking-wider mb-0.5">{label}</p>
      <p className={`text-base font-bold ${mono ? 'font-mono' : ''}`}>{value || "Pending Verification"}</p>
      {sub && <p className="text-[9px] text-white/40 font-normal italic mt-0.5">{sub}</p>}
    </div>
  );
}
