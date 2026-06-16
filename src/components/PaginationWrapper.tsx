  "use client";
  import { useRouter, useSearchParams } from "next/navigation";
  import Pagination from "./Pagination";

  export default function PaginationWrapper({
    active,
    totalPages,
    totalItems,
    pageParam = "page",
  }: {
    active: number;
    totalPages: number;
    totalItems: number;
    pageParam?: string;
  }) {
    const router = useRouter();
    const searchParams = useSearchParams();

    const handlePageChange = (page: number) => {
      const params = new URLSearchParams(searchParams);
      params.set(pageParam, String(page));
      router.push(`?${params.toString()}`);
    };

    return (
      <Pagination
        active={active}
        totalPages={totalPages}
        onPageChange={handlePageChange}
        totalItems={totalItems}
      />
    );
  }
