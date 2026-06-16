import { Loader2 } from "lucide-react";

export default function Loading() {
  return (
    <div className="fixed inset-0 bg-white bg-opacity-80 flex items-center justify-center z-50">
      <Loader2 className="animate-spin text-gray-600" size={40} />
    </div>
  );
}
