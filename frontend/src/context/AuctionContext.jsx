import { createContext, useState } from "react";
import { auctionsData } from "../data/auctionsData";

export const AuctionContext = createContext();

export function AuctionProvider({ children }) {
  const [auctions, setAuctions] = useState(auctionsData);

  return (
    <AuctionContext.Provider value={{ auctions, setAuctions }}>
      {children}
    </AuctionContext.Provider>
  );
}
