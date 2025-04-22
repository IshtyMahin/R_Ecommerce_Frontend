'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { CalendarIcon, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';
import { getMyProfile, updateUserProfile } from '@/services/User';

// Define form schema
const profileFormSchema = z.object({
  name: z.string().min(2, {
    message: 'Name must be at least 2 characters.',
  }),
  phoneNo: z.string().optional(),
  address: z.string().optional(),
  dateOfBirth: z.date().optional(),
  photo: z.instanceof(File).optional().or(z.string().optional()), // Allow File or string
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;

export const ProfileEditForm = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [initialData, setInitialData] = useState<ProfileFormValues | null>(null);

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      name: '',
      phoneNo: '',
      address: '',
      dateOfBirth: undefined,
      photo: undefined,
    },
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await getMyProfile();
        const initialValues: ProfileFormValues = {
          name: data.name,
          phoneNo: data.profile?.phoneNo || '', // Map phoneNo to phone for display
          address: data.profile?.address || '',
          dateOfBirth: data.profile?.dateOfBirth ? new Date(data.profile.dateOfBirth) : undefined,
          photo: data.profile?.photo || '', // Use avatar for existing photo URL
        };
        setInitialData(initialValues);
        form.reset(initialValues);
      } catch (error) {
        toast.error('Failed to load profile data');
      }
    };

    fetchProfile();
  }, [form]);

  const onSubmit = async (data: ProfileFormValues) => {
    setIsLoading(true);
    try {
      const payload = {
        name: data.name,
        phoneNo: data.phoneNo || undefined, 
        address: data.address || undefined,
        dateOfBirth: data.dateOfBirth?.toISOString(),
        photo: data.photo, // File or string
        clientInfo: {
          device: /Mobi|Android/i.test(navigator.userAgent) ? 'mobile' : 'desktop',
          browser: (navigator as any)?.userAgentData?.brands?.[0]?.brand || navigator.userAgent,
          ipAddress: '', // Could be fetched from an API if needed
          pcName: '',
          os: navigator.platform,
          userAgent: navigator.userAgent,
        },
      };

      await updateUserProfile(payload);
      toast.success('Profile updated successfully');
      router.push('/profile');
    } catch (error: any) {
      toast.error(error.message || 'Failed to update profile');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Edit Profile</h1>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="photo"
            render={({ field }) => (
              <FormItem className="flex flex-col items-center">
                <FormControl>
                  <div className="relative w-24 h-24">
                    <div className="rounded-full w-full h-full bg-gray-100 flex items-center justify-center overflow-hidden">
                      {field.value ? (
                        <img
                          src={typeof field.value === 'string' ? field.value : URL.createObjectURL(field.value)}
                          alt="Profile"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="text-2xl font-medium text-gray-500">
                          {form.watch('name')?.charAt(0).toUpperCase() || 'U'}
                        </div>
                      )}
                    </div>
                    <label className="absolute bottom-0 right-0 bg-primary rounded-full p-2 cursor-pointer">
                      <input
                        type="file"
                        className="hidden"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          field.onChange(file);
                        }}
                      />
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="text-white"
                      >
                        <path d="M12 5v14M5 12h14" />
                      </svg>
                    </label>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Full Name</FormLabel>
                <FormControl>
                  <Input placeholder="Your name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="phoneNo"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Phone Number</FormLabel>
                <FormControl>
                  <Input placeholder="Your phone number" {...field} value={field.value || ''} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="address"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Address</FormLabel>
                <FormControl>
                  <Textarea placeholder="Your address" {...field} value={field.value || ''} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="dateOfBirth"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Date of Birth</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant="outline"
                        className={cn(
                          'w-full pl-3 text-left font-normal',
                          !field.value && 'text-muted-foreground'
                        )}
                      >
                        {field.value ? field.value.toLocaleDateString() : 'Pick a date'}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      disabled={(date) => date > new Date()}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" disabled={isLoading} className="w-full">
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              'Save Changes'
            )}
          </Button>
        </form>
      </Form>
    </div>
  );
};