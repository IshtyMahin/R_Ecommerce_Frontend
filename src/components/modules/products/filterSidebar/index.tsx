"use client";
import { useEffect, useState } from "react";
import { Slider } from "@/components/ui/slider";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
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

export default function FilterSidebar() {
  const [price, setPrice] = useState([0]);
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

  const handleSearchQuery = (query: string, value: string | number | boolean) => {
    const params = new URLSearchParams(searchParams.toString());

    if (value) {
      params.set(query, value.toString());
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
  }, [searchParams]);

  return (
    <div className="p-6 bg-white rounded-lg">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Filter</h2>
        {searchParams.toString().length > 0 && (
          <Button
            onClick={() => {
              setFlashSale(false);
              setPrice([0]);
              router.push(`${pathname}`, {
                scroll: false,
              });
            }}
            size="sm"
            className="bg-black hover:bg-gray-700 ml-5"
          >
            Clear Filters
          </Button>
        )}
      </div>

      {/* Flash Sale Filter */}
      <div className="mb-6">
        <h2 className="text-lg font-semibold mb-4">Special Offers</h2>
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
          <Label htmlFor="flash-sale" className="text-gray-500 font-light">
            Flash Sale Items
          </Label>
        </div>
      </div>

      {/* Filter by Price */}
      <div className="mb-6">
        <h2 className="text-lg font-semibold mb-4">Price</h2>
        <div className="flex items-center justify-between text-sm mb-2">
          <span>$0</span>
          <span>$500000</span>
        </div>
        <Slider
          max={500000}
          step={1}
          onValueChange={(value) => {
            setPrice(value);
            handleSearchQuery("price", value[0]);
          }}
          className="w-full"
        />
        <p className="text-sm mt-2">Selected Price: ${price[0]}</p>
      </div>

      {/* Product Categories Dropdown */}
      <div className="mb-6">
        <h2 className="text-lg font-semibold mb-4">Product Category</h2>
        {!isLoading && (
          <Select
            onValueChange={(value) => handleSearchQuery("category", value)}
            value={searchParams.get('category') || undefined}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select a category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All Categories</SelectItem>
              {categories?.map((category: { _id: string; name: string }) => (
                <SelectItem key={category._id} value={category._id}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      </div>

      {/* Brands Dropdown */}
      <div className="mb-6">
        <h2 className="text-lg font-semibold mb-4">Brands</h2>
        {!isLoading && (
          <Select
            onValueChange={(value) => handleSearchQuery("brand", value)}
            value={searchParams.get('brand') || undefined}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select a brand" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All Brands</SelectItem>
              {brands?.map((brand: { _id: string; name: string }) => (
                <SelectItem key={brand._id} value={brand._id}>
                  {brand.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      </div>

      {/* Rating */}
      <div className="mb-6">
        <h2 className="text-lg font-semibold mb-4">Rating</h2>
        <RadioGroup className="space-y-3">
          {[5, 4, 3, 2, 1].map((rating) => (
            <div key={rating} className="flex items-center space-x-2">
              <RadioGroupItem
                onClick={() => handleSearchQuery("rating", rating)}
                value={`${rating}`}
                id={`rating-${rating}`}
              />
              <Label htmlFor={`rating-${rating}`} className="flex items-center">
                {Array.from({ length: 5 }, (_, i) => (
                  <Star
                    size={18}
                    key={i}
                    fill={i < rating ? "orange" : "lightgray"}
                    stroke={i < rating ? "orange" : "lightgray"}
                  />
                ))}
              </Label>
            </div>
          ))}
        </RadioGroup>
      </div>
    </div>
  );
}