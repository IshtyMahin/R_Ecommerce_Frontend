type Specification = {
  processor: string;
  ram: string;
  storage: string;
  display: string;
};

export interface IProduct {
  _id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  weight: number;
  category: {
    _id: string;
    name: string;
  };
  imageUrls: string[];
  isActive: boolean;
  shop: {
    _id: string;
    shopName: string;
  };
  brand: {
    _id: string;
    name: string;
  };
  averageRating: number;
  ratingCount: number;
  availableColors: string[];
  specification: Specification;
  keyFeatures: string[];
  slug: string;
  createdAt: string;
  updatedAt: string;
  offerPrice: number;

  arModel?: string; // URL to GLB/GLTF model
  arScale?: number; // Default scale (0-1)
  arPosition?: { x: number; y: number; z: number }; // Default position
  arRotation?: { x: number; y: number; z: number }; // Default rotation
  arAvailable?: boolean; // Flag if AR is available
}
