"use client";

import { useState, useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useRouter } from "next/navigation";
import { Star, MessageSquare, CheckCircle, XCircle, Filter, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { IReview } from "@/types/review";
import { useUser } from "@/context/UserContext";
import { createReview } from "@/services/Review";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

const reviewSchema = z.object({
  review: z.string().min(10, "Review must be at least 10 characters"),
  rating: z.number().min(1, "Please select a rating").max(5),
});

const ITEMS_PER_PAGE = 5;

const ProductReviewSection = ({
  productId,
  reviews,
  userHasPurchased,
}: {
  productId: string;
  reviews: IReview[];
  userHasPurchased: boolean;
}) => {
  const { user } = useUser();
  const [showForm, setShowForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [ratingFilter, setRatingFilter] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const router = useRouter();

  const form = useForm({
    resolver: zodResolver(reviewSchema),
    defaultValues: {
      review: "",
      rating: 0,
    },
  });

  // Filter and paginate reviews
  const filteredReviews = useMemo(() => {
    let result = [...reviews];
    
    if (ratingFilter) {
      result = result.filter(review => review.rating === ratingFilter);
    }
    
    // Sort by date (newest first)
    result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    
    return result;
  }, [reviews, ratingFilter]);

  // Pagination logic
  const totalPages = Math.ceil(filteredReviews.length / ITEMS_PER_PAGE);
  const paginatedReviews = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredReviews.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredReviews, currentPage]);

  const onSubmit = async (values: z.infer<typeof reviewSchema>) => {
    try {
      setIsSubmitting(true);
      const toastId = toast.loading('Submitting your review...');
  
      const { success, data, message } = await createReview({
        product: productId,
        review: values.review,
        rating: values.rating,
      });
  
      if (success) {
        toast.success('Review Submitted', {
          id: toastId,
          description: 'Thank you for your feedback!',
        });
        form.reset();
        setShowForm(false);
        router.refresh();
      } else {
        throw new Error(message);
      }
    } catch (err: any) {
      toast.error('Submission Failed', {
        description: err.message || 'Could not submit your review. Please try again.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleStarClick = (index: number) => {
    form.setValue("rating", index + 1);
  };

  const averageRating = reviews.length > 0
    ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
    : 0;

  const ratingDistribution = useMemo(() => {
    const distribution = [0, 0, 0, 0, 0];
    reviews.forEach(review => {
      distribution[review.rating - 1]++;
    });
    return distribution;
  }, [reviews]);

  return (
    <section className="mt-12 max-w-4xl mx-auto pb-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <MessageSquare className="w-6 h-6 text-primary" />
            Customer Reviews
          </h2>
          {reviews.length > 0 && (
            <div className="flex items-center gap-2 mt-2">
              <div className="flex items-center">
                <Star className="w-5 h-5 text-amber-400 fill-amber-400" />
                <span className="ml-1 font-medium">
                  {averageRating.toFixed(1)} ({reviews.length} reviews)
                </span>
              </div>
            </div>
          )}
        </div>

        {user ? (
          userHasPurchased ? (
            <Button
              variant={showForm ? "outline" : "default"}
              size="sm"
              onClick={() => setShowForm(!showForm)}
            >
              {showForm ? "Cancel" : "Write a Review"}
            </Button>
          ) : (
            <div className="text-sm text-muted-foreground">
              Purchase this product to leave a review
            </div>
          )
        ) : (
          <div className="text-sm text-muted-foreground">
            Sign in to leave a review
          </div>
        )}
      </div>

      {showForm && (
        <div className="bg-card rounded-lg border p-6 mb-8 shadow-sm">
          <h3 className="font-semibold text-lg mb-4">Share Your Experience</h3>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="rating"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Your Rating</FormLabel>
                    <FormControl>
                      <div className="flex items-center gap-2">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-6 h-6 cursor-pointer ${
                              i < field.value
                                ? "text-amber-400 fill-amber-400"
                                : "text-muted-foreground"
                            }`}
                            onClick={() => handleStarClick(i)}
                          />
                        ))}
                        <span className="text-sm ml-2 text-muted-foreground">
                          {field.value > 0
                            ? `${field.value} star${
                                field.value !== 1 ? "s" : ""
                              }`
                            : "Select rating"}
                        </span>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="review"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Your Review</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Share detailed thoughts about the product..."
                        className="min-h-[120px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex justify-end gap-3">
                <Button
                  variant="outline"
                  type="button"
                  onClick={() => setShowForm(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Submitting..." : "Submit Review"}
                </Button>
              </div>
            </form>
          </Form>
        </div>
      )}

      {/* Rating distribution and filter */}
      {reviews.length > 0 && (
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-medium">Rating Breakdown</h3>
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-muted-foreground" />
              <Select
                value={ratingFilter ? ratingFilter.toString() : "all"}
                onValueChange={(value) => 
                  setRatingFilter(value === "all" ? null : parseInt(value))
                }
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by rating" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Ratings</SelectItem>
                  {[5, 4, 3, 2, 1].map((rating) => (
                    <SelectItem key={rating} value={rating.toString()}>
                      {rating} Star{rating !== 1 ? "s" : ""}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            {[5, 4, 3, 2, 1].map((rating) => (
              <div key={rating} className="flex items-center gap-3">
                <div className="flex items-center w-20">
                  <span className="text-sm">{rating} star</span>
                </div>
                <div className="flex-1 bg-gray-100 dark:bg-gray-800 rounded-full h-2.5">
                  <div
                    className="bg-amber-400 h-2.5 rounded-full"
                    style={{
                      width: `${(ratingDistribution[rating - 1] / reviews.length) * 100}%`,
                    }}
                  />
                </div>
                <span className="text-sm text-muted-foreground w-10 text-right">
                  {ratingDistribution[rating - 1]}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      <Separator className="my-6" />

      {paginatedReviews.length > 0 ? (
        <div className="space-y-8">
          {paginatedReviews.map((review) => (
            <div key={review._id} className="flex gap-4">
              <Avatar className="h-10 w-10 border">
                <AvatarImage
                  src={typeof review.user === "object" ? review.user?.avatar : ""}
                />
                <AvatarFallback>
                  {typeof review.user === "object"
                    ? review.user.name?.charAt(0).toUpperCase()
                    : "A"}
                </AvatarFallback>
              </Avatar>

              <div className="flex-1">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                  <div className="font-medium">
                    {typeof review.user === "object"
                      ? review.user.name
                      : "Anonymous"}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${
                            i < review.rating
                              ? "text-amber-400 fill-amber-400"
                              : "text-muted-foreground"
                          }`}
                        />
                      ))}
                    </div>
                    <span>•</span>
                    <span>
                      {new Date(review.createdAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </span>
                  </div>
                </div>

                {review.isVerifiedPurchase && (
                  <div className="flex items-center gap-1 text-sm text-green-600 mb-2">
                    <CheckCircle className="w-4 h-4" />
                    <span>Verified Purchase</span>
                  </div>
                )}

                <p className="text-gray-700 dark:text-gray-300">
                  {review.review}
                </p>
              </div>
            </div>
          ))}
          {/* Pagination controls */}
          {totalPages > 1 && (
            <div className="mt-12 flex items-center justify-center gap-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(currentPage - 1)}
                disabled={currentPage === 1}
                className="gap-1"
              >
                <ChevronLeft className="h-4 w-4" />
                Previous
              </Button>
              
              <div className="flex items-center gap-2">
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let pageNum;
                  // Show first pages
                  if (currentPage <= 3) {
                    pageNum = i + 1;
                  } 
                  // Show last pages
                  else if (currentPage >= totalPages - 2) {
                    pageNum = totalPages - (4 - i);
                  }
                  // Show middle pages
                  else {
                    pageNum = currentPage - 2 + i;
                  }

                  return (
                    <Button
                      key={pageNum}
                      variant={currentPage === pageNum ? "default" : "outline"}
                      size="sm"
                      onClick={() => setCurrentPage(pageNum)}
                    >
                      {pageNum}
                    </Button>
                  );
                })}
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="gap-1"
              >
                Next
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
      ) : (
        <div className="text-center py-12">
          <MessageSquare className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium text-muted-foreground">
            {ratingFilter ? `No ${ratingFilter}-star reviews yet` : "No reviews yet"}
          </h3>
          <p className="mt-1 text-sm text-muted-foreground">
            {ratingFilter
              ? "Be the first to leave this rating"
              : "Be the first to share your thoughts about this product"}
          </p>
        </div>
      )}
    </section>
  );
};

export default ProductReviewSection;