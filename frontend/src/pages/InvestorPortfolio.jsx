import React, { useEffect, useState } from "react";
import * as auctionService from "../services/auctionService";
import * as bidService from "../services/bidService";

export default function InvestorPortfolio() {
    const [myBids, setMyBids] = useState([]);

    useEffect(() => {
        bidService.getMyBids()
            .then(res => setMyBids(res.data))
            .catch(console.error);
    }, []);

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">Investor Portfolio</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {myBids.map((bid, i) => (
                    <div key={i} className="border p-4 rounded">
                        <p>Bid Amount: {bid.amount}</p>
                        <p>Auction ID: {bid.auction_id}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}
