"use client";
import { useEffect, useState } from "react";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Star } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { getAllCategories } from "@/services/Category";
import { getAllBrands } from "@/services/Brand";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

export default function FilterBar() {
  const [price, setPrice] = useState([0, 500000]);
  const [isLoading, setIsLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [flashSale, setFlashSale] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [{ data: categoriesData }, { data: brandsData }] =
          await Promise.all([getAllCategories(), getAllBrands()]);
        setCategories(categoriesData);
        setBrands(brandsData);
      } catch (error: any) {
        toast.error("Failed to fetch filters");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const handleSearchQuery = (query: string, value: string | number | boolean | number[]) => {
    const params = new URLSearchParams(searchParams.toString());

    if (value && (!Array.isArray(value) || value.length > 0)) {
      params.set(query, Array.isArray(value) ? value.join(",") : value.toString());
    } else {
      params.delete(query);
    }

    router.push(`${pathname}?${params.toString()}`, {
      scroll: false,
    });
  };

  useEffect(() => {
    const flashSaleParam = searchParams.get('flash_sale');
    setFlashSale(flashSaleParam === 'true');
    
    const priceParam = searchParams.get('price');
    if (priceParam) {
      setPrice(priceParam.split(',').map(Number));
    }
  }, [searchParams]);

  return (
    <div className="bg-white rounded-lg p-4 shadow-sm">
      <div className="flex flex-wrap items-center gap-4">
        {/* Flash Sale Toggle */}
        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="flash-sale"
            checked={flashSale}
            onChange={(e) => {
              setFlashSale(e.target.checked);
              handleSearchQuery("flash_sale", e.target.checked);
            }}
            className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
          />
          <Label htmlFor="flash-sale" className="whitespace-nowrap">
            Flash Sale
          </Label>
        </div>

        {/* Price Range Filter */}
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="whitespace-nowrap">
              Price: ${price[0]} - ${price[1]}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80">
            <div className="space-y-4">
              <Label>Price Range</Label>
              <Slider
                min={0}
                max={500000}
                step={1000}
                value={price}
                onValueChange={(value) => {
                  setPrice(value);
                }}
                onValueCommit={(value) => {
                  handleSearchQuery("price", value);
                }}
                className="w-full"
              />
              <div className="flex justify-between text-sm">
                <span>${price[0]}</span>
                <span>${price[1]}</span>
              </div>
            </div>
          </PopoverContent>
        </Popover>

        {/* Category Dropdown */}
        <Select
          onValueChange={(value) => {
            if (value === "all-categories") {
              handleSearchQuery("category", "");
            } else {
              handleSearchQuery("category", value);
            }
          }}
          value={searchParams.get('category') || "all-categories"}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all-categories">All Categories</SelectItem>
            {categories?.map((category: { _id: string; name: string }) => (
              <SelectItem key={category._id} value={category._id}>
                {category.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Brand Dropdown */}
        <Select
          onValueChange={(value) => {
            if (value === "all-brands") {
              handleSearchQuery("brand", "");
            } else {
              handleSearchQuery("brand", value);
            }
          }}
          value={searchParams.get('brand') || "all-brands"}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Brand" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all-brands">All Brands</SelectItem>
            {brands?.map((brand: { _id: string; name: string }) => (
              <SelectItem key={brand._id} value={brand._id}>
                {brand.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Rating Dropdown */}
        <Select
          onValueChange={(value) => {
            if (value === "all-ratings") {
              handleSearchQuery("rating", "");
            } else {
              handleSearchQuery("rating", value);
            }
          }}
          value={searchParams.get('rating') || "all-ratings"}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Rating" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all-ratings">All Ratings</SelectItem>
            {[5, 4, 3, 2, 1].map((rating) => (
              <SelectItem key={rating} value={`${rating}`}>
                <div className="flex items-center">
                  {Array.from({ length: 5 }, (_, i) => (
                    <Star
                      size={16}
                      key={i}
                      fill={i < rating ? "orange" : "lightgray"}
                      stroke={i < rating ? "orange" : "lightgray"}
                    />
                  ))}
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Clear Filters Button */}
        {searchParams.toString().length > 0 && (
          <Button
            onClick={() => {
              setFlashSale(false);
              setPrice([0, 500000]);
              router.push(`${pathname}`, {
                scroll: false,
              });
            }}
            variant="ghost"
            className="text-red-500 hover:text-red-700"
          >
            Clear All
          </Button>
        )}
      </div>
    </div>
  );
}