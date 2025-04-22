"use client";

import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

type TImageUploader = {
  label?: string;
  className?: string;
  multiple?: boolean;
  accept?: string;
  setImageFiles: React.Dispatch<React.SetStateAction<File[]>>;
  setImagePreview: React.Dispatch<React.SetStateAction<string[]>>;
  singleFile?: boolean;
};

const NMImageUploader = ({
  label = "Upload Images",
  className,
  multiple = true,
  accept = "image/*",
  setImageFiles,
  setImagePreview,
  singleFile = false,
}: TImageUploader) => {
  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    const fileArray = Array.from(files);

    if (singleFile) {
      setImageFiles([fileArray[0]]);
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview([reader.result as string]);
      reader.readAsDataURL(fileArray[0]);
    } else {
      fileArray.forEach((file) => {
        setImageFiles((prev) => [...prev, file]);

        const reader = new FileReader();
        reader.onloadend = () =>
          setImagePreview((prev) => [...prev, reader.result as string]);
        reader.readAsDataURL(file);
      });
    }

    event.target.value = "";
  };

  return (
    <div className={cn("flex flex-col items-center w-full gap-4", className)}>
      <Input
        id="image-upload"
        type="file"
        accept={accept}
        multiple={!singleFile && multiple}
        className="hidden"
        onChange={handleImageChange}
      />
      <label
        htmlFor="image-upload"
        className="w-full h-36 md:size-36 flex items-center justify-center border-2 border-dashed border-gray-300 rounded-md cursor-pointer text-center text-sm text-gray-500 hover:bg-gray-50 transition"
      >
        {label}
      </label>
    </div>
  );
};

export default NMImageUploader;
