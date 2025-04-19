import AllProducts from "@/components/modules/products";
import ProductBanner from "@/components/modules/products/banner";
import CategoryCard from "@/components/ui/core/CategoryCard";
import NMContainer from "@/components/ui/core/NMContainer";
import { getAllCategories } from "@/services/Category";
import { getFlashSaleProducts } from "@/services/FlashSale";
import { getAllProducts } from "@/services/Product";
import { ICategory, IProduct } from "@/types";

type SearchParams = { [key: string]: string | string[] | undefined };

interface IApiResponse {
  data: IProduct[];
  meta?: {
    total: number;
    limit: number;
    page: number;
    totalPage: number;
  };
}

const AllProductsPage = async ({
  searchParams,
}: {
  searchParams: SearchParams;
}) => {
  const query = searchParams;
  const isFlashSale = query.flash_sale === 'true';
  const page = query.page || '1';
  const limit = '1'; 

  const { data: categories } = await getAllCategories();
  
  const response: IApiResponse = isFlashSale 
    ? await getFlashSaleProducts(page.toString(), limit, query)
    : await getAllProducts(page.toString(), limit, query);

    
  const products = response.data || [];
  const pagination = response.meta || {
    total: 0,
    limit: parseInt(limit),
    page: parseInt(page.toString()),
    totalPage: 0
  };

  return (
    <NMContainer>
      <ProductBanner 
        title={isFlashSale ? "Flash Sale Products" : "All Products"} 
        path={`Home - ${isFlashSale ? "Flash Sale" : "Products"}`} 
      />
      
      <h2 className="text-xl font-bold my-5">
        {isFlashSale ? "Flash Sale Collection" : "Featured Collection"}
      </h2>
      
      {!isFlashSale && (
        <div className="grid grid-cols-6 gap-6">
          {categories?.slice(0, 6).map((category: ICategory, idx: number) => (
            <CategoryCard key={idx} category={category} />
          ))}
        </div>
      )}
      
      <AllProducts products={products} pagination={pagination} />
    </NMContainer>
  );
};

export default AllProductsPage;