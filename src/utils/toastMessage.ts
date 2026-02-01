import { toast } from "sonner";

export const showSuccessToast = (message: string) => {
  toast.success(message, {
    icon: "✔️",
    className: "group toast-success",
    style: {
      background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
      border: "1px solid #34d399",
      color: "#fff",
      borderRadius: "12px",
      padding: "16px",
      boxShadow:
        "0 10px 25px -5px rgba(16, 185, 129, 0.4), 0 4px 6px -2px rgba(16, 185, 129, 0.05)",
      backdropFilter: "blur(8px)",
    },
    duration: 4000,
  });
};

export const showErrorToast = (message: string) => {
  toast.error(message, {
    icon: "✖️",
    className: "group toast-error",
    style: {
      background: "linear-gradient(135deg, #ef4444 0%, #dc2626 100%)",
      border: "1px solid #f87171",
      color: "#fff",
      borderRadius: "12px",
      padding: "16px",
      boxShadow:
        "0 10px 25px -5px rgba(239, 68, 68, 0.4), 0 4px 6px -2px rgba(239, 68, 68, 0.05)",
      backdropFilter: "blur(8px)",
    },
    duration: 4000,
  });
};
