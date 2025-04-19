"use client";
import ProductCard from "@/components/ui/core/ProductCard";
import { IProduct } from "@/types";
import FilterBar from "./filterBar/FilterBar";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

interface IPagination {
  total: number;
  limit: number;
  page: number;
  totalPage: number;
}

const AllProducts = ({ 
  products,
  pagination 
}: { 
  products: IProduct[];
  pagination: IPagination;
}) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  
  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', newPage.toString());
    router.push(`${pathname}?${params.toString()}`, {
      scroll: false,
    });
  };

  return (
    <div className="my-10">
      <div className="mb-8">
        <FilterBar />
      </div>
      
      <div className="grid grid-cols-4 gap-8">
        {products?.map((product: IProduct, idx: number) => (
          <ProductCard key={idx} product={product} />
        ))}
      </div>

      {/* Pagination controls */}
{pagination.totalPage > 1 && (
  <div className="mt-12 flex items-center justify-center gap-2">
    {/* Previous button */}
    <Button
      variant="outline"
      size="sm"
      onClick={() => handlePageChange(pagination.page - 1)}
      disabled={pagination.page === 1}
      className="gap-1 px-3"
    >
      <ChevronLeft className="h-4 w-4" />
      <span className="sr-only sm:not-sr-only">Previous</span>
    </Button>

    {/* Page numbers */}
    <div className="flex items-center gap-1">
      {/* Always show first page */}
      <Button
        variant={pagination.page === 1 ? "default" : "outline"}
        size="sm"
        onClick={() => handlePageChange(1)}
        className="w-10 h-10 p-0"
      >
        1
      </Button>

      {/* Show ellipsis if needed before middle pages */}
      {pagination.page > 3 && pagination.totalPage > 5 && (
        <span className="flex items-center justify-center w-10 h-10 text-sm text-muted-foreground">
          ...
        </span>
      )}

      {/* Middle pages */}
      {Array.from({ length: Math.min(5, pagination.totalPage - 2) }, (_, i) => {
        let pageNum;
        if (pagination.page <= 3) {
          pageNum = i + 2; // 2,3,4,5,6
        } else if (pagination.page >= pagination.totalPage - 2) {
          pageNum = pagination.totalPage - (4 - i) - 1;
        } else {
          pageNum = pagination.page - 1 + i;
        }

        // Only show pages between first and last
        if (pageNum > 1 && pageNum < pagination.totalPage) {
          return (
            <Button
              key={pageNum}
              variant={pagination.page === pageNum ? "default" : "outline"}
              size="sm"
              onClick={() => handlePageChange(pageNum)}
              className="w-10 h-10 p-0"
            >
              {pageNum}
            </Button>
          );
        }
        return null;
      })}

      {/* Show ellipsis if needed after middle pages */}
      {pagination.page < pagination.totalPage - 2 && pagination.totalPage > 5 && (
        <span className="flex items-center justify-center w-10 h-10 text-sm text-muted-foreground">
          ...
        </span>
      )}

      {/* Always show last page if different from first */}
      {pagination.totalPage > 1 && (
        <Button
          variant={pagination.page === pagination.totalPage ? "default" : "outline"}
          size="sm"
          onClick={() => handlePageChange(pagination.totalPage)}
          className="w-10 h-10 p-0"
        >
          {pagination.totalPage}
        </Button>
      )}
    </div>

    {/* Next button */}
    <Button
      variant="outline"
      size="sm"
      onClick={() => handlePageChange(pagination.page + 1)}
      disabled={pagination.page === pagination.totalPage}
      className="gap-1 px-3"
    >
      <span className="sr-only sm:not-sr-only">Next</span>
      <ChevronRight className="h-4 w-4" />
    </Button>
  </div>
)}
    </div>
  );
};

export default AllProducts;