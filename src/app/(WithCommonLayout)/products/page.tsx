import AllProducts from "@/components/modules/products";
import ProductBanner from "@/components/modules/products/banner";
import CategoryCard from "@/components/ui/core/CategoryCard";
import NMContainer from "@/components/ui/core/NMContainer";
import { getAllCategories } from "@/services/Category";
import { getFlashSaleProducts } from "@/services/FlashSale";
import { getAllProducts } from "@/services/Product";
import { ICategory, IProduct } from "@/types";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Products",
  description: "Browse our product collection",
};


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
  searchParams?: any;
}) => {

  const query = searchParams || {};

  const isFlashSale = query.flash_sale?.toString() === "true";
  const page = parseInt(query.page?.toString() || "1", 10);
  const limit = parseInt(query.limit?.toString() || "12", 10);

  const { data: categories } = await getAllCategories();

  const response: IApiResponse = isFlashSale
    ? await getFlashSaleProducts(String(page), String(limit), query)
    : await getAllProducts(String(page), String(limit), query);

  const products = response.data || [];
  const pagination = {
    total: response.meta?.total ?? 0,
    limit,
    page,
    totalPage: response.meta?.totalPage ?? 0,
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
          {categories?.slice(0, 6).map((category: ICategory) => (
            <CategoryCard key={category._id} category={category} />
          ))}
        </div>
      )}

      <AllProducts products={products} pagination={pagination} />
    </NMContainer>
  );
};

export default AllProductsPage;
