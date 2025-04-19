"use client";

import ProductCard from '@/components/ui/core/ProductCard';
import NMContainer from '@/components/ui/core/NMContainer';
import ProductBanner from '@/components/modules/products/banner';
import { useFavorites } from '@/context/FavoritesContext';

export default function FavoritesPage() {
  const { favorites } = useFavorites();

  return (
    <NMContainer>
      <ProductBanner 
        title="Your Favorites" 
        path="Home - Favorites" 
      />
      
      <h2 className="text-xl font-bold my-5">Your Favorite Products</h2>
      
      {favorites.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-gray-500">You haven't added any favorites yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-4 gap-8">
          {favorites.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      )}
    </NMContainer>
  );
}