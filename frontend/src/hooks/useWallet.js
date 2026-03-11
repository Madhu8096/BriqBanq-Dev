import { useState } from "react";
import * as walletService from "../services/walletService";

export const useWallet = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchBalance = async (walletId) => {
        try {
            setLoading(true);
            const res = await walletService.getWalletBalance(walletId);
            return res.data;
        } catch (err) {
            setError(err);
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return { fetchBalance, loading, error };
};
