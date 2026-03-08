import { TrendingUp, Award, Clock, PieChart, ArrowUpRight } from "lucide-react";

export default function InvestorPerformanceCards({ data }) {
    const cards = [
        {
            title: "Total Return",
            value: `A$${data.totalReturn}K`,
            subtitle: "Since inception",
            tag: "8.2%",
            icon: TrendingUp,
            iconColor: "text-emerald-500",
            bgColor: "bg-emerald-50",
            borderColor: "border-emerald-100",
            tagColor: "text-emerald-600 bg-emerald-50",
        },
        {
            title: "Avg ROI",
            value: `${data.avgROI}%`,
            subtitle: "Above market average",
            tag: "TOP 10%",
            icon: Award,
            iconColor: "text-blue-500",
            bgColor: "bg-blue-50",
            borderColor: "border-blue-100",
            tagColor: "text-blue-600 bg-blue-50",
        },
        {
            title: "Holding Period",
            value: `${data.holdingPeriod}d`,
            subtitle: "~5 months average",
            tag: "AVG",
            icon: Clock,
            iconColor: "text-purple-500",
            bgColor: "bg-purple-50",
            borderColor: "border-purple-100",
            tagColor: "text-purple-600 bg-purple-50",
        },
        {
            title: "Diversification",
            value: `${data.diversification}/10`,
            subtitle: "Well balanced",
            tag: "STRONG",
            icon: PieChart,
            iconColor: "text-amber-500",
            bgColor: "bg-amber-50",
            borderColor: "border-amber-100",
            tagColor: "text-emerald-600 bg-emerald-50 font-bold",
        },
    ];

    return (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {cards.map((card, idx) => {
                const Icon = card.icon;
                return (
                    <div
                        key={idx}
                        className={`bg-white rounded-2xl p-4 border-2 ${card.borderColor} shadow-sm hover:shadow-md transition-all group`}
                    >
                        <div className="flex justify-between items-start mb-3">
                            <div className={`w-8 h-8 ${card.bgColor} rounded-lg flex items-center justify-center`}>
                                <Icon size={16} className={card.iconColor} />
                            </div>
                            <div className={`text-[9px] font-extrabold px-1.5 py-0.5 rounded-md flex items-center gap-1 ${card.tagColor}`}>
                                {card.title === "Total Return" && <ArrowUpRight size={10} />}
                                {card.tag}
                            </div>
                        </div>

                        <p className="text-[#64748B] text-[11px] font-bold mb-0.5">{card.title}</p>
                        <h3 className="text-xl font-extrabold text-[#0F172A] mb-0.5">{card.value}</h3>
                        <p className="text-gray-400 text-[10px] font-semibold">{card.subtitle}</p>
                    </div>
                );
            })}
        </div>
    );
}
