/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from "react";
import { getRoles } from "../services/role";

export const useRoles = (query?: any) => {
  const [roles, setRoles] = useState<any | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRoles = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await getRoles(query);
        setRoles(response);
      } catch (err) {
        console.log(err);
        setError("Failed to fetch roles");
      } finally {
        setLoading(false);
      }
    };

    fetchRoles();
  }, [query]);

  return { roles, loading, error };
};
