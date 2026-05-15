import { NavLink } from "react-router-dom";
import { Home, Clock, User } from "lucide-react";
import { ROUTES } from "@/utils";
 
const navItems = [
  {
    label: "Home",
    path: ROUTES.HOME,
    icon: Home,
  },
  {
    label: "Trips",
    path: ROUTES.TRIPS,
    icon: Clock,
  },
  {
    label: "Profile",
    path: ROUTES.PROFILE,
    icon: User,
  },
];

const BottomNav = () => {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-100">
      <div className="max-w-md mx-auto flex justify-between px-6 py-2">
        
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex flex-col items-center justify-center text-xs transition-colors ${
                isActive
                  ? "text-primary font-medium"
                  : "text-gray-400"
              }`
            }
          >
            <item.icon size={22} strokeWidth={1.8} />
            <span className="mt-1">{item.label}</span>
          </NavLink>
        ))}
      </div>
    </div>
  );
};

export default BottomNav;
