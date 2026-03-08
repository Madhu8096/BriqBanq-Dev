import LenderHeader from "./LenderHeader";
import { Outlet } from "react-router-dom";
import { useEffect } from "react";
import { useAuth } from "../../context/AuthContext";

export default function LenderLayout() {
    const { currentRole, switchRole } = useAuth();

    useEffect(() => {
        if (currentRole !== "lender") {
            switchRole("lender");
        }
    }, [currentRole, switchRole]);

    return (
        <div className="flex flex-col h-screen bg-[#F8FAFC]">
            <LenderHeader />

            <main className="flex-1 overflow-y-auto pt-2 pb-10 scrollbar-hide">
                <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 min-h-full">
                    <Outlet />
                </div>
            </main>

        </div>
    );
}
