import { Printer } from "lucide-react";

// ─── Sticky Print Button ──────────────────────────────────────────────────────

function PrintButton({ onClick }: { onClick: () => void }) {
  return (
    <div className="px-4 pb-4 md:px-8 md:pb-6">
      <button
        onClick={onClick}
        className="w-full flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-600 active:bg-orange-700 text-white font-semibold text-base py-4 rounded-xl transition-colors shadow-lg shadow-orange-200"
      >
        <Printer size={20} />
        Print
      </button>
    </div>
  );
}

export default PrintButton;