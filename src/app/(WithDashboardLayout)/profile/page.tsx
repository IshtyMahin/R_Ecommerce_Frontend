'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { format } from 'date-fns';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { getMyProfile } from '@/services/User';
import { DeviceType, getDeviceIcon } from '@/utils/device-utils';

interface ProfileData {
  _id: string;
  name: string;
  email: string;
  role: string;
  isActive: boolean;
  hasShop: boolean;
  lastLogin: string;
  updatedAt: string;
  clientInfo: {
    device: string;
    browser: string;
    os: string;
  };
  profile: {
    photo?: string;
    phoneNo?: string;
    address?: string;
    dateOfBirth?: string;
  } | null;
}

const ProfilePage = () => {
  const router = useRouter();
  const [userData, setUserData] = useState<ProfileData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const data = await getMyProfile();
        
        setUserData(data as ProfileData);
      } catch (err: any) {
        setError(err.message || 'Failed to load profile information');
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, []);

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto p-4 space-y-8">
        <div className="flex flex-col md:flex-row justify-between gap-6">
          <div className="flex items-center space-x-4">
            <Skeleton className="h-20 w-20 rounded-full" />
            <div className="space-y-2">
              <Skeleton className="h-6 w-48" />
              <Skeleton className="h-4 w-32" />
            </div>
          </div>
          <div className="flex gap-2">
            <Skeleton className="h-10 w-32" />
            <Skeleton className="h-10 w-40" />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="space-y-2">
              <Skeleton className="h-5 w-24" />
              <Skeleton className="h-9 w-full" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto p-4 text-center space-y-4">
        <h2 className="text-2xl font-bold text-red-600">Profile Error</h2>
        <p className="text-red-500">{error}</p>
        <Button
          variant="outline"
          onClick={() => window.location.reload()}
          className="mt-4"
        >
          Try Again
        </Button>
      </div>
    );
  }

  
  
  if (!userData) {
    return (
      <div className="max-w-4xl mx-auto p-4 text-center space-y-4">
        <h2 className="text-2xl font-bold">No Profile Data</h2>
        <p className="text-gray-500">We couldn&apos;t find any profile information for your account.</p>
        <Button
          variant="link"
          onClick={() => router.push('/profile/edit')}
        >
          Create Profile
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-8">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-center space-x-4">
          <div className="relative w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden">
            {userData.profile?.photo? (
              <img
                src={userData.profile.photo}
                alt="Profile"
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-2xl font-medium text-gray-500">
                {userData.name?.charAt(0).toUpperCase() || 'U'}
              </span>
            )}
          </div>
          <div>
            <h1 className="text-2xl font-bold">{userData.name}</h1>
            <div className="flex items-center gap-2 mt-1">
              <Badge
                variant={userData.role === 'admin' ? 'destructive' : 'secondary'}
                className="capitalize"
              >
                {userData.role}
              </Badge>
              {userData.hasShop && (
                <Badge variant="default">Shop Owner</Badge>
              )}
            </div>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button
            variant="outline"
            onClick={() => router.push('/profile/edit')}
          >
            Edit Profile
          </Button>
          <Button
            variant="outline"
            onClick={() => router.push('/settings')}
          >
            Account Settings
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Account Information */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Account Information</h2>
          <div className="space-y-3 bg-gray-50 p-4 rounded-lg">
            <div>
              <label className="text-sm text-gray-500">Full Name</label>
              <p className="font-medium">{userData.name || 'Not provided'}</p>
            </div>
            <div>
              <label className="text-sm text-gray-500">Email</label>
              <p className="font-medium">{userData.email}</p>
            </div>
            <div>
              <label className="text-sm text-gray-500">Account Status</label>
              <div className="flex items-center gap-2">
                <span
                  className={`h-2 w-2 rounded-full ${
                    userData.isActive ? 'bg-green-500' : 'bg-red-500'
                  }`}
                />
                <p className="font-medium">
                  {userData.isActive ? 'Active' : 'Inactive'}
                </p>
              </div>
            </div>
            <div>
              <label className="text-sm text-gray-500">Last Login</label>
              <p className="font-medium">
                {userData.lastLogin
                  ? format(new Date(userData.lastLogin), 'PPpp')
                  : 'Not available'}
              </p>
            </div>
          </div>
        </div>

        {/* Profile Details */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Profile Details</h2>
          {userData.profile ? (
            <div className="space-y-3 bg-gray-50 p-4 rounded-lg">
              <div>
                <label className="text-sm text-gray-500">Phone Number</label>
                <p className="font-medium">
                  {userData.profile.phoneNo || 'Not provided'}
                </p>
              </div>
              <div>
                <label className="text-sm text-gray-500">Address</label>
                <p className="font-medium">
                  {userData.profile.address || 'Not provided'}
                </p>
              </div>
              <div>
                <label className="text-sm text-gray-500">Date of Birth</label>
                <p className="font-medium">
                  {userData.profile.dateOfBirth
                    ? format(new Date(userData.profile.dateOfBirth), 'PPP')
                    : 'Not provided'}
                </p>
              </div>
            </div>
          ) : (
            <div className="text-center py-8 bg-gray-50 rounded-lg">
              <p className="text-gray-500">No profile details available</p>
              <Button
                variant="link"
                className="mt-2"
                onClick={() => router.push('/profile/edit')}
              >
                Create Profile
              </Button>
            </div>
          )}
        </div>

        {/* Device Information */}
        <div className="space-y-4 md:col-span-2">
          <h2 className="text-xl font-semibold">Device Information</h2>
          <div className="bg-gray-50 p-4 rounded-lg grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-gray-500">Device Type</label>
              <div className="flex items-center gap-2 mt-1">
  {getDeviceIcon(userData?.clientInfo?.device as DeviceType || DeviceType.UNKNOWN)}
  <p className="font-medium capitalize">
    {userData?.clientInfo?.device || "Unknown"}
  </p>
</div>

            </div>
            <div>
              <label className="text-sm text-gray-500">Browser</label>
              <p className="font-medium">{userData?.clientInfo?.browser || 'Unknown'}</p>
            </div>
            <div>
              <label className="text-sm text-gray-500">Operating System</label>
              <p className="font-medium">{userData?.clientInfo?.os || 'Unknown'}</p>
            </div>
            <div>
              <label className="text-sm text-gray-500">Last Activity</label>
              <p className="font-medium">
                {userData.updatedAt
                  ? format(new Date(userData.updatedAt), 'PPpp')
                  : 'Not available'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;