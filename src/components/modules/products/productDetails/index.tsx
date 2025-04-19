"use client";

import { Button } from "@/components/ui/button";
import { IProduct } from "@/types";
import { Star, Check, Truck, Percent, Headphones, Zap, Palette, Award, ChevronRight, ChevronLeft, Rocket, Shield, RefreshCw } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { useAppDispatch } from "@/redux/hooks";
import { useRouter } from "next/navigation";
import { addProduct } from "@/redux/features/cartSlice";
import { toast } from "sonner";

const ProductDetails = ({ product }: { product: IProduct }) => {
  const [selectedImage, setSelectedImage] = useState(0);
  const [zoomActive, setZoomActive] = useState(false);
  const dispatch = useAppDispatch();
  const router = useRouter();

  const nextImage = () => {
    setSelectedImage((prev) => (prev + 1) % product.imageUrls.length);
  };

  const prevImage = () => {
    setSelectedImage((prev) => (prev - 1 + product.imageUrls.length) % product.imageUrls.length);
  };

  const handleAddToCart = () => {
    dispatch(addProduct(product));
    toast.success(`${product.name} added to cart`);
  };

  const handleBuyNow = () => {
    dispatch(addProduct(product));
    router.push('/cart');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Product Display Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Image Gallery */}
        <div className="space-y-4">
          <div 
            className="relative aspect-square w-full rounded-2xl overflow-hidden bg-gradient-to-br from-purple-100 to-blue-100 shadow-lg group"
            onMouseEnter={() => setZoomActive(true)}
            onMouseLeave={() => setZoomActive(false)}
          >
            <Image
              src={product.imageUrls[selectedImage]}
              alt={product.name}
              fill
              className={`object-fit transition-transform duration-300 ${
                zoomActive ? 'scale-105' : 'scale-100'
              }`}
              priority
            />
            
            {/* Navigation Arrows */}
            <button 
              onClick={prevImage}
              className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 rounded-full p-2 shadow-md hover:bg-white transition-all text-purple-600 hover:text-purple-800"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button 
              onClick={nextImage}
              className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 rounded-full p-2 shadow-md hover:bg-white transition-all text-purple-600 hover:text-purple-800"
            >
              <ChevronRight className="w-6 h-6" />
            </button>

            {/* Discount Badge */}
            {product.offerPrice && (
              <div className="absolute top-4 left-4 bg-gradient-to-r from-pink-500 to-purple-600 text-white px-3 py-1 rounded-full text-sm font-bold shadow-lg">
                {Math.round(100 - (product.offerPrice / product.price * 100))}% OFF
              </div>
            )}
          </div>
          
          {/* Thumbnail Strip */}
          <div className="flex space-x-3 overflow-x-auto py-2 scrollbar-hide">
            {product.imageUrls.map((img, idx) => (
              <button
                key={idx}
                onClick={() => setSelectedImage(idx)}
                className={`flex-shrink-0 relative w-16 h-16 rounded-lg overflow-hidden border-2 transition-all ${
                  selectedImage === idx 
                    ? 'border-purple-500 scale-110 shadow-md' 
                    : 'border-transparent hover:border-purple-300'
                }`}
              >
                <Image
                  src={img}
                  alt={`Thumbnail ${idx + 1}`}
                  fill
                  className="object-cover"
                />
              </button>
            ))}
          </div>
        </div>

        {/* Product Details */}
        <div className="space-y-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 ">
              {product.name}
            </h1>
            <div className="flex items-center mt-3 space-x-4">
              <div className="flex items-center bg-yellow-100 px-3 py-1 rounded-full text-yellow-800">
                <Star className="w-4 h-4 fill-yellow-500" />
                <span className="ml-1 text-sm font-medium">
                  {product.averageRating} ({product.ratingCount} reviews)
                </span>
              </div>
              <span className={`text-sm font-medium px-3 py-1 rounded-full ${
                product.stock > 0 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-red-100 text-red-800'
              }`}>
                {product.stock > 0 ? 'In Stock' : 'Out of Stock'}
              </span>
            </div>
          </div>

          {/* Price Section */}
          <div className="space-y-2">
            <div className="flex items-center space-x-4">
              <p className="text-3xl font-bold text-gray-900">
                {product.offerPrice ? (
                  <>
                    <span className="text-purple-600">${product.offerPrice}</span>
                    <span className="ml-2 text-base font-normal text-gray-500 line-through">
                      ${product.price}
                    </span>
                  </>
                ) : (
                  <span>${product.price}</span>
                )}
              </p>
              {product.offerPrice && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-800">
                  Save ${(product.price - product.offerPrice).toFixed(2)}
                </span>
              )}
            </div>
          </div>

          {/* Highlight Features */}
          <div className="bg-gradient-to-r from-purple-50 to-blue-50 p-4 rounded-xl border border-purple-100">
            <h3 className="font-medium text-gray-900 mb-2 flex items-center">
              <Zap className="w-5 h-5 text-purple-600 mr-2" />
              Key Features
            </h3>
            <ul className="space-y-2">
              {product.keyFeatures.slice(0, 3).map((feature, index) => (
                <li key={index} className="flex items-start">
                  <Check className="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">{feature}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Color Options */}
          {product.availableColors && product.availableColors.length > 0 && (
            <div className="bg-gradient-to-r from-pink-50 to-purple-50 p-4 rounded-xl border border-pink-100">
              <h3 className="font-medium text-gray-900 mb-2 flex items-center">
                <Palette className="w-5 h-5 text-pink-600 mr-2" />
                Color Options
              </h3>
              <div className="flex flex-wrap gap-2">
                {product.availableColors.map((color, index) => (
                  <button
                    key={index}
                    className="w-10 h-10 rounded-full border-2 border-gray-200 flex items-center justify-center hover:scale-110 transition-transform"
                    style={{ backgroundColor: color }}
                    aria-label={`Color option ${color}`}
                  >
                    {selectedImage === index && (
                      <Check className="w-4 h-4 text-white" />
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex space-x-4 pt-4">
            <Button
              onClick={handleBuyNow}
              disabled={product.stock === 0}
              className="flex-1 h-12 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold shadow-lg hover:shadow-xl transition-all"
            >
              Buy Now
            </Button>
            <Button
              onClick={handleAddToCart}
              disabled={product.stock === 0}
              variant="outline"
              className="flex-1 h-12 border-2 border-purple-600 text-purple-600 hover:bg-purple-50 font-semibold"
            >
              Add to Cart
            </Button>
          </div>

          {/* Vibrant Trust Badges */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-6">
            <div className="flex flex-col items-center bg-gradient-to-br from-blue-50 to-blue-100 p-3 rounded-lg border border-blue-200 shadow-sm">
              <Truck className="w-6 h-6 text-blue-600 mb-1" />
              <span className="text-sm text-center font-medium text-blue-800">Shipping</span>
            </div>
            <div className="flex flex-col items-center bg-gradient-to-br from-amber-50 to-amber-100 p-3 rounded-lg border border-amber-200 shadow-sm">
              <Check className="w-6 h-6 text-amber-600 mb-1" />
              <span className="text-sm text-center font-medium text-amber-800">Quality Guarantee</span>
            </div>
            <div className="flex flex-col items-center bg-gradient-to-br from-pink-50 to-pink-100 p-3 rounded-lg border border-pink-200 shadow-sm">
              <Headphones className="w-6 h-6 text-pink-600 mb-1" />
              <span className="text-sm text-center font-medium text-pink-800">24/7 Support</span>
            </div>
            <div className="flex flex-col items-center bg-gradient-to-br from-green-50 to-green-100 p-3 rounded-lg border border-green-200 shadow-sm">
            <Rocket className="w-6 h-6 text-green-600 mb-1" />
            <span className="text-sm text-center font-medium text-green-800">Fast Delivery</span>
          </div>
          <div className="flex flex-col items-center bg-gradient-to-br from-teal-50 to-teal-100 p-3 rounded-lg border border-teal-200 shadow-sm">
            <RefreshCw className="w-6 h-6 text-teal-600 mb-1" />
            <span className="text-sm text-center font-medium text-teal-800">Easy Returns</span>
          </div>
          <div className="flex flex-col items-center bg-gradient-to-br from-purple-50 to-purple-100 p-3 rounded-lg border border-purple-200 shadow-sm">
            <Shield className="w-6 h-6 text-purple-600 mb-1" />
            <span className="text-sm text-center font-medium text-purple-800">Secure Payment</span>
          </div>
          </div>
        </div>
      </div>

      {/* Colorful Specifications Section */}
      <div className="mt-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
          <Award className="w-6 h-6 text-purple-600 mr-2" />
          Product Specifications
        </h2>
        <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-2xl shadow-sm border border-purple-100 overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-4 divide-y md:divide-y-0 md:divide-x divide-purple-100">
            {Object.entries(product.specification).map(([key, value], index) => (
              <div 
                key={key} 
                className={`p-5 ${index % 2 === 0 ? 'md:border-r border-purple-100' : ''}`}
              >
                <h3 className="font-medium text-purple-700 capitalize mb-2">
                  {key.replace(/([A-Z])/g, ' $1')}
                </h3>
                <p className="text-gray-800 font-medium">
                  {typeof value === 'boolean' ? (value ? '✅ Yes' : '❌ No') : value}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;