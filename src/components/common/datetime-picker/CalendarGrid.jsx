import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";

// Only keep the essential CSS overrides for DayPicker internals
const compactDayPickerStyles = `
  .rdp {
    --rdp-cell-size: 32px;
    --rdp-accent-color: #1a1a1a;
    --rdp-background-color: #fff;
    font-size: 0.95rem;
    border-radius: 0.75rem;
    box-shadow: none;
    width: 100%;
    max-width: 100%;
  }
  .rdp-cell {
    padding: 0;
    min-width: 32px;
    min-height: 32px;
    max-width: 36px;
    max-height: 36px;
  }
  .rdp-day {
    padding: 0;
    margin: 0;
    border-radius: 8px;
    font-size: 0.95rem;
    width: 32px;
    height: 32px;
    line-height: 32px;
  }
`;

function CalendarGrid({
  selectedDate,
  onSelect,
  minDateTime,
  mode = "single",
}) {
  const today = minDateTime || new Date();

  // Max selectable date = today + 90 days
  const maxDate = new Date();
  maxDate.setDate(today.getDate() + 90);
  return (
    <div className="flex w-full justify-center items-center px-0 sm:px-2 py-1 bg-white">
      <style>{compactDayPickerStyles}</style>
      <DayPicker
        mode={mode}
        selected={selectedDate}
        onSelect={onSelect}
        disabled={{
          before: today,
          after: maxDate,
        }}
        month ={selectedDate || today}
        startMonth={today}
        endMonth={maxDate}
        ariaLabel="Day Picker"
         
        
         
      />
    </div>
  );
}

export { CalendarGrid };
