import { CalendarDays } from 'lucide-react';
import { formatDisplayDate } from '@/components/common/datetime-picker';

function DateTimeField({
  label,
  value,
  placeholder,
  onClick,
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="
        w-full
        rounded-2xl
        border
        border-neutral-200
        bg-white
        px-4
        py-4
        text-left
        transition
        active:scale-[0.99]
      "
    >
      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0">
          <div className="text-xs text-neutral-500 mb-1">
            {label}
          </div>

          <div className="truncate text-base font-medium text-neutral-900">
            {value
              ? formatDisplayDate(value)
              : placeholder}
          </div>
        </div>
        

        {/* Icon */}
        <CalendarDays
          size={20}
          className="text-neutral-500 shrink-0"
        />
      </div>
    </button>
  );
}

export  {DateTimeField};