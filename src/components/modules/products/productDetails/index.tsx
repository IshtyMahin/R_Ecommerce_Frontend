"use client";

import { Button } from "@/components/ui/button";
import { IProduct } from "@/types";
import { Sparkles, Star } from "lucide-react";
import Image from "next/image";
import ProductReviewSection from "../productReview/ProductReview";
import { useEffect, useState } from "react";
import { IReview } from "@/types/review";
import { useUser } from "@/context/UserContext";
import { getProductReviews } from "@/services/Review";
import { hasPurchasedProduct } from "@/services/AuthService";
import dynamic from "next/dynamic";
import { useAppDispatch } from "@/redux/hooks";
import { useRouter } from "next/navigation";
import { addProduct } from "@/redux/features/cartSlice";
import { toast } from "sonner";

const ProductDetails = ({ product }: { product: IProduct }) => {
  const [reviews, setReviews] = useState<IReview[]>([]);
  const [userHasPurchased, setUserHasPurchased] = useState(false);
  const { user } = useUser();
  const dispatch = useAppDispatch();
 const router = useRouter();
  useEffect(() => {
    const fetchData = async () => {
      const reviewData = await getProductReviews(product._id,undefined, "5");
      setReviews(reviewData?.data?.result || []);

      if (user) {
        const hasPurchased = await hasPurchasedProduct(product._id);
        
        setUserHasPurchased(hasPurchased);
      }
    };

    fetchData();
  }, [product?._id, user]);

  const handleAddProduct = (product: IProduct) => {
    dispatch(addProduct(product));
    toast.success(`${product.name} added to cart`, {
      position: "top-right",
      duration: 2000,
    });
  };

  const handleBuyNow = (product: IProduct) => {
    dispatch(addProduct(product));
    toast.success(`${product.name} added to cart`, {
      position: "top-right",
      duration: 1500,
      action: {
        label: "View Cart",
        onClick: () => router.push('/cart'),
      },
    });
    router.push('/cart');
  };
  return (
    <>
    <div className="grid grid-cols-2 gap-4 border border-white p-4 rounded-md my-5 shadow-sm">
      <div>
        <Image
          src={product?.imageUrls[0]}
          alt="product image"
          width={500}
          height={500}
          className="rounded-md w-full object-cover h-80"
        />
        <div className="grid grid-cols-3 gap-4 mt-5">
          {product?.imageUrls.slice(0, 3).map((image: string, idx: number) => (
            <Image
              key={idx}
              src={image}
              alt="product image"
              width={500}
              height={500}
              className="rounded-md w-full object-cover h-40"
            />
          ))}
        </div>
      </div>
      <div className="bg-white rounded-md p-4">
        <h2 className="font-bold text-xl mb-4">{product?.name}</h2>
        <p className="text-justify text-gray-500 font-light text-sm">
          {product?.description}
        </p>
        <div className="flex items-center justify-between my-5 text-gray-500 text-xs">
          <p className="rounded-full px-4 py-1 bg-gray-100 flex items-center justify-center gap-1">
            <Star className="w-4 h-4" fill="orange" stroke="orange" />
            {product?.averageRating} Ratings
          </p>
          <p className="rounded-full px-4 py-1 bg-gray-100">
            Stock: {product?.stock}
          </p>
          <p className="rounded-full px-4 py-1 bg-gray-100">
            Brand: {product?.brand?.name}
          </p>
          <p className="rounded-full px-4 py-1 bg-gray-100">
            Category: {product?.category?.name}
          </p>
        </div>
        <hr />
        <p className="my-2 font-bold">
          Price:{" "}
          {product?.offerPrice ? (
            <>
              <span className="font-semibold mr-2 text-orange-400">
                $ {product?.offerPrice}
              </span>
              <del className="font-semibold text-xs">$ {product?.price}</del>
            </>
          ) : (
            <span className="font-semibold">$ {product?.price}</span>
          )}
        </p>
        <hr />
       
         <div className="space-x-2 flex">
            <Button
              onClick={() => handleBuyNow(product)}
              disabled={product?.stock === 0}
              className="w-full h-12 text-base font-medium shadow-sm hover:shadow-md transition-shadow"
              variant="default"
            >
              {product?.stock === 0 ? 'Out of Stock' : 'Buy Now'}
            </Button>

            <Button
              onClick={() => handleAddProduct(product)}
              disabled={product?.stock === 0}
              variant="outline"
              className="w-full h-11 border-2 text-base font-medium hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors"
            >
              {product?.stock === 0 ? 'Unavailable' : 'Add to Cart'}
            </Button>

        </div>

   
      </div>
    </div>
    <ProductReviewSection 
  productId={product?._id} 
  reviews={reviews} 
  userHasPurchased={userHasPurchased} 
/></>
  );
};

export default ProductDetails;
