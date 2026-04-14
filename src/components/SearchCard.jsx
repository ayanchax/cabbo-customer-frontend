
import { Search } from "lucide-react";
import { useState } from "react";
import {SearchSheet} from "@/components";

const SearchCard = () => {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Collapsed Card */}
      <div className="px-4 mt-2 max-w-2xl mx-auto">
          
        <button
          onClick={() => setOpen(true)}
          className="w-full bg-white rounded-2xl shadow-md border border-gray-100 px-4 py-4 flex items-center gap-3 active:scale-[0.99] transition hover:bg-gray-50"
        >
          <Search size={18} className="text-gray-400" />
          <span className="text-sm text-gray-500">
            Where do you want to go?
          </span>
        </button>
      </div>

      {/* Expanded Sheet */}
      {open && <SearchSheet onClose={() => setOpen(false)} />}
    </>
  );
};

export default SearchCard;