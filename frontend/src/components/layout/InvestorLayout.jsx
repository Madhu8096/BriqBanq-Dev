import InvestorHeader from "./InvestorHeader";
import { Outlet } from "react-router-dom";
import { useEffect } from "react";
import { useAuth } from "../../context/AuthContext";

export default function InvestorLayout() {
  const { currentRole, switchRole } = useAuth();

  useEffect(() => {
    if (currentRole !== "investor") {
      switchRole("investor");
    }
  }, [currentRole, switchRole]);

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <InvestorHeader />

      <main className="pt-2 px-4 sm:px-6 lg:px-8 pb-10 max-w-[1440px] mx-auto">
        <Outlet />
      </main>
    </div>
  );
}
