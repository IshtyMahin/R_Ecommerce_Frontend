"use client";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  FieldValues,
  SubmitHandler,
  useFieldArray,
  useForm,
} from "react-hook-form";
import { Textarea } from "@/components/ui/textarea";
import { useEffect, useState } from "react";

import { Plus } from "lucide-react";
import Logo from "@/assets/svgs/Logo";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { IBrand, ICategory } from "@/types";
import { getAllCategories } from "@/services/Category";
import { getAllBrands } from "@/services/Brand";
import { addProduct } from "@/services/Product";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import NMImageUploader from "@/components/ui/core/NMImageUploader";
import ImagePreviewer from "@/components/ui/core/NMImageUploader/ImagePreviewer";

export default function AddProductsForm() {
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [imagePreview, setImagePreview] = useState<string[]>([]);
  const [arModelFile, setArModelFile] = useState<File | null>(null);
  const [arModelPreview, setArModelPreview] = useState<string | null>(null);
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [brands, setBrands] = useState<IBrand[]>([]);

  const router = useRouter();

  const form = useForm({
    defaultValues: {
      name: "",
      description: "",
      price: "",
      category: "",
      brand: "",
      stock: "",
      weight: "",
      availableColors: [{ value: "" }],
      keyFeatures: [{ value: "" }],
      specification: [{ key: "", value: "" }],
      arScale: 1,
      arPosition: { x: 0, y: 0.5, z: 0 },
    },
  });

  const {
    formState: { isSubmitting },
  } = form;

  const { append: appendColor, fields: colorFields } = useFieldArray({
    control: form.control,
    name: "availableColors",
  });

  const { append: appendFeatures, fields: featureFields } = useFieldArray({
    control: form.control,
    name: "keyFeatures",
  });

  const { append: appendSpec, fields: specFields } = useFieldArray({
    control: form.control,
    name: "specification",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [categoriesData, brandsData] = await Promise.all([
          getAllCategories(),
          getAllBrands(),
        ]);

        setCategories(categoriesData?.data || []);
        setBrands(brandsData?.data || []);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const onSubmit: SubmitHandler<FieldValues> = async (data) => {
    try {
      const availableColors = data.availableColors.map(
        (color: { value: string }) => color.value
      );

      const keyFeatures = data.keyFeatures.map(
        (feature: { value: string }) => feature.value
      );

      const specification: { [key: string]: string } = {};
      data.specification.forEach(
        (item: { key: string; value: string }) =>
          (specification[item.key] = item.value)
      );

      const modifiedData = {
        ...data,
        availableColors,
        keyFeatures,
        specification,
        price: parseFloat(data.price),
        stock: parseInt(data.stock),
        weight: parseFloat(data.weight),
        arAvailable: !!arModelFile,
      };

      const formData = new FormData();
      formData.append("data", JSON.stringify(modifiedData));

      // Add product images
      imageFiles.forEach((file) => {
        formData.append("images", file);
      });

      // Add AR model if exists
      if (arModelFile) {
        formData.append("arModel", arModelFile);
      }
      for (const [key, value] of formData.entries()) {
        console.log(`${key}:`, value);
      }
      
      const res = await addProduct(formData);

      if (res.success) {
        toast.success(res.message);
        // router.push("/");
      } else {
        toast.error(res.message);
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to add product");
    }
  };

  const handleArModelUpload = (file: File) => {
    setArModelFile(file);
    const reader = new FileReader();
    reader.onload = () => {
      setArModelPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveArModel = () => {
    setArModelFile(null);
    setArModelPreview(null);
  };

  return (
    <div className="border-2 border-gray-300 rounded-xl flex-grow max-w-2xl p-5">
      <div className="flex items-center space-x-4 mb-5">
        <Logo />
        <h1 className="text-xl font-bold">Add Product</h1>
      </div>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          {/* Basic Information Section */}
          <div className="flex justify-between items-center border-t border-b py-3 my-5">
            <p className="text-primary font-bold text-xl">Basic Information</p>
          </div>
          
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Product Name</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Price</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category._id} value={category._id}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="brand"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Brand</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select brand" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {brands.map((brand) => (
                        <SelectItem key={brand._id} value={brand._id}>
                          {brand.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="stock"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Stock</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="weight"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Weight (kg)</FormLabel>
                  <FormControl>
                    <Input type="number" step="0.01" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="my-5">
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea className="h-36 resize-none" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Images Section */}
          <div>
            <div className="flex justify-between items-center border-t border-b py-3 my-5">
              <p className="text-primary font-bold text-xl">Images</p>
            </div>
            <div className="flex gap-4 flex-wrap">
              <NMImageUploader
                setImageFiles={setImageFiles}
                setImagePreview={setImagePreview}
                label="Upload Image"
                className="w-fit mt-0"
              />
              <ImagePreviewer
                className="flex flex-wrap gap-4"
                setImageFiles={setImageFiles}
                imagePreview={imagePreview}
                setImagePreview={setImagePreview}
              />
            </div>
          </div>

          <div className="my-6 p-4 border rounded-2xl shadow-sm space-y-4">
  <div>
    <label
      htmlFor="ar-model"
      className="block text-sm font-medium text-gray-700 mb-1"
    >
      Upload AR Model <span className="text-gray-500 text-xs">(.glb / .gltf)</span>
    </label>
    <input
      id="ar-model"
      type="file"
      accept=".glb,.gltf"
      onChange={(e) => {
        if (e.target.files?.[0]) handleArModelUpload(e.target.files[0]);
      }}
      className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-gray-100 file:text-gray-700 hover:file:bg-gray-200"
    />
  </div>

  {arModelFile && (
    <div className="flex items-center justify-between bg-gray-100 px-4 py-2 rounded-md">
      <p className="text-sm text-gray-600 truncate">
        Selected File: <span className="font-medium text-gray-800">{arModelFile.name}</span>
      </p>
      <button
        type="button"
        onClick={handleRemoveArModel}
        className="text-red-600 text-sm font-medium hover:underline"
      >
        Remove
      </button>
    </div>
  )}
</div>


          {/* Available Colors Section */}
          <div>
            <div className="flex justify-between items-center border-t border-b py-3 my-5">
              <p className="text-primary font-bold text-xl">Available Colors</p>
              <Button
                variant="outline"
                className="size-10"
                onClick={() => appendColor({ value: "" })}
                type="button"
              >
                <Plus className="text-primary" />
              </Button>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {colorFields.map((field, index) => (
                <FormField
                  key={field.id}
                  control={form.control}
                  name={`availableColors.${index}.value`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Color {index + 1}</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              ))}
            </div>
          </div>

          {/* Key Features Section */}
          <div>
            <div className="flex justify-between items-center border-t border-b py-3 my-5">
              <p className="text-primary font-bold text-xl">Key Features</p>
              <Button
                variant="outline"
                className="size-10"
                onClick={() => appendFeatures({ value: "" })}
                type="button"
              >
                <Plus className="text-primary" />
              </Button>
            </div>

            <div className="space-y-4">
              {featureFields.map((field, index) => (
                <FormField
                  key={field.id}
                  control={form.control}
                  name={`keyFeatures.${index}.value`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Feature {index + 1}</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              ))}
            </div>
          </div>

          {/* Specifications Section */}
          <div>
            <div className="flex justify-between items-center border-t border-b py-3 my-5">
              <p className="text-primary font-bold text-xl">Specifications</p>
              <Button
                variant="outline"
                className="size-10"
                onClick={() => appendSpec({ key: "", value: "" })}
                type="button"
              >
                <Plus className="text-primary" />
              </Button>
            </div>

            <div className="space-y-4">
              {specFields.map((field, index) => (
                <div key={field.id} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name={`specification.${index}.key`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Specification Name {index + 1}</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name={`specification.${index}.value`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Value</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              ))}
            </div>
          </div>

          <Button type="submit" className="mt-5 w-full" disabled={isSubmitting}>
            {isSubmitting ? "Adding Product..." : "Add Product"}
          </Button>
        </form>
      </Form>
    </div>
  );
}