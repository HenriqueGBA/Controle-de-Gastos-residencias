import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

interface NavbarTab {
  label: React.ReactNode;
  value: string;
  to: string;
}

interface NavbarProps {
  tabs: NavbarTab[];
  title?: string;
  className?: string;
}

const Navbar: React.FC<NavbarProps> = ({ tabs, title, className = "" }) => {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <nav className={`flex items-center gap-2 w-full justify-center py-4 ${className}`}>
      {title && (
        <h2 className="text-lg font-bold text-gray-900 hidden sm:block mr-4">
          {title}
        </h2>
      )}
      <div className="inline-flex bg-white border border-gray-200 rounded-xl shadow-sm max-w-full overflow-x-auto gap-1 px-1 py-1">
        {tabs.map((tab) => {
          const active = location.pathname === tab.to;
          return (
            <button
              key={tab.value}
              onClick={() => navigate(tab.to)}
              className={
                "px-3 sm:px-5 py-2 sm:py-2.5 text-xs sm:text-sm font-medium rounded-md sm:rounded-lg whitespace-nowrap min-w-0 transition-all duration-200 " +
                (active
                  ? "bg-blue-600 text-white shadow"
                  : "text-gray-700 hover:bg-gray-100")
              }
              type="button"
            >
              <span className="truncate block max-w-[70px] sm:max-w-none">{tab.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};

export default Navbar;