// src/services/auctionService.js
import { dealsData } from "../data/dealsData";

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const auctionService = {
    /**
     * Fetches a single auction/deal by its ID.
     * Preparation for backend: Replace this with a fetch call to your API.
     */
    getAuctionById: async (id) => {
        await delay(600);
        const deal = dealsData.find(d => d.id === id);
        if (!deal) return null;

        // Add defensive fallbacks for complex objects
        return {
            ...deal,
            images: deal.images || [deal.image].filter(Boolean) || [],
            bidHistory: deal.bidHistory || [],
            documents: deal.documents || [],
            metrics: deal.metrics || {},
            financials: deal.financials || {},
            propertyDetails: deal.propertyDetails || {}
        };
    },

    /**
     * Places a bid on a specific auction.
     * Preparation for backend: POST to /api/auctions/:id/bid
     */
    placeBid: async (id, amount) => {
        await delay(800);
        // Simulate validation
        if (!id || !amount) throw new Error("Invalid bid parameters");

        // In a real app, this would return the new auction state or a success message
        return {
            success: true,
            newBid: amount,
            timestamp: new Date().toISOString()
        };
    },

    /**
     * Fetches bid history for a specific auction.
     */
    getBidHistory: async (id) => {
        await delay(400);
        const deal = dealsData.find(d => d.id === id);
        return deal?.bidHistory || [];
    },

    /**
     * Fetches related documents for a specific auction.
     */
    getDocuments: async (id) => {
        await delay(400);
        const deal = dealsData.find(d => d.id === id);
        return deal?.documents || [];
    }
};
