import { useState } from "react";
import * as auctionService from "../services/auctionService";

export const useAuctions = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchAuctions = async () => {
        try {
            setLoading(true);
            const res = await auctionService.getAuctions();
            return res.data;
        } catch (err) {
            setError(err);
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return { fetchAuctions, loading, error };
};
