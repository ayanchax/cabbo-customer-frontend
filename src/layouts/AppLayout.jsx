import {BottomNav} from "@/components";

const AppLayout = ({ children }) => {
  return (
    <div className="pb-20 min-h-screen bg-gray-50">
      {children}
      <BottomNav />
    </div>
  );
};

export default AppLayout;