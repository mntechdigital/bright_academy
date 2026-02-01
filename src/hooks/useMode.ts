/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";

function useLocalStorageValue(key: string) {
  const [value, setValue] = useState(() => localStorage.getItem(key));

  useEffect(() => {
    // ✅ Cross-tab updates
    const handleStorage = (e: StorageEvent) => {
      if (e.key === key) {
        setValue(e.newValue);
      }
    };
    window.addEventListener("storage", handleStorage);

    // ✅ Same-tab updates (patch only getItem for listening)
    const originalSetItem = localStorage.setItem;
    localStorage.setItem = function (k, v) {
      const event = new Event("localstorage-change");
      (event as any).key = k;
      (event as any).value = v;
      window.dispatchEvent(event);
      originalSetItem.apply(this, [k, v]);
    };

    const handleCustom = (e: any) => {
      if (e.key === key) {
        setValue(e.value);
      }
    };
    window.addEventListener("localstorage-change", handleCustom);

    return () => {
      window.removeEventListener("storage", handleStorage);
      window.removeEventListener("localstorage-change", handleCustom);
      localStorage.setItem = originalSetItem;
    };
  }, [key]);

  return value;
}

export default useLocalStorageValue;
