import React, { useEffect, useState } from "react";
import * as walletService from "../../services/walletService";

export default function WalletTransactions() {
    const [transactions, setTransactions] = useState([]);

    useEffect(() => {
        walletService.getTransactions()
            .then(res => setTransactions(res.data))
            .catch(console.error);
    }, []);

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">Wallet Transactions</h1>
            <ul className="space-y-4">
                {transactions.map((tx, idx) => (
                    <li key={idx} className="border p-4 rounded shadow">
                        Transaction ID: {tx.id} | Amount: {tx.amount}
                    </li>
                ))}
            </ul>
        </div>
    );
}
