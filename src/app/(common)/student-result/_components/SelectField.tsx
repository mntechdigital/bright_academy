import { ChevronDown } from "lucide-react";

function SelectField({
  label,
  value,
  options,
  onChange,
  icon,
}: {
  label: string;
  value: string;
  options: string[];
  onChange: (v: string) => void;
  icon?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-xs text-gray-400">{label}</label>
      <div className="relative">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full appearance-none bg-white border border-gray-200 rounded-lg px-4 py-3 pr-10 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-orange-400"
        >
          {options.map((o) => (
            <option key={o} value={o}>
              {o}
            </option>
          ))}
        </select>
        <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
          {icon ?? <ChevronDown size={16} />}
        </div>
      </div>
    </div>
  );
}

export default SelectField;