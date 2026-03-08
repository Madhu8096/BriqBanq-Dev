export const escrowData = {
  totalHeld: 125000,

  details: {
    agent: "Australian Settlement Services",
    license: "ESA-2024-5678",
    settlementDate: "2026-02-28",
    accountNumber: "ESC-2024-1234",
  },

  security: [
    {
      title: "Secure Escrow",
      description: "Funds held in trust account",
    },
    {
      title: "Two-Factor Authorization",
      description: "All releases require 2FA",
    },
    {
      title: "Audit Trail",
      description: "All transactions logged",
    },
    {
      title: "Insured",
      description: "Professional indemnity insurance",
    },
  ],

  transactions: [
    {
      id: 1,
      date: "10 Feb 2026",
      type: "Initial Deposit",
      recipient: "Escrow Account",
      amount: 125000,
      status: "completed",
    },
    {
      id: 2,
      date: "12 Feb 2026",
      type: "Release to Seller",
      recipient: "Sarah Mitchell",
      amount: 100000,
      status: "completed",
    },
    {
      id: 3,
      date: "13 Feb 2026",
      type: "Agent Commission",
      recipient: "Melbourne Property Group",
      amount: 12500,
      status: "pending",
    },
    {
      id: 4,
      date: "13 Feb 2026",
      type: "Legal Fees",
      recipient: "Smith & Partners Legal",
      amount: 2500,
      status: "pending",
    },
  ],
};
