import { useEffect, useState } from "react";

const useDebounce = <T>(value: T, delay = 500) => {
  const [debounced, setDebounced] = useState<T>(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebounced(value);
    }, delay);

    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);

  return debounced;
};

export default useDebounce;
