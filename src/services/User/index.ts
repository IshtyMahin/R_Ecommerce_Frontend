import { getValidToken } from "@/lib/verifyToken";

// Define interfaces for type safety
interface ProfileResponse {
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

interface UpdateProfilePayload {
  name: string; // Not sent to backend (kept for form compatibility)
  phoneNo?: string; // Mapped to phoneNo
  address?: string;
  dateOfBirth?: string;
  photo?: File | string; // File for upload, string for existing photo URL
}

// Fetch user profile data
export const getMyProfile = async (): Promise<ProfileResponse> => {
  const token = await getValidToken();

  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_API}/user/me`, {
      headers: {
        Authorization: token,
      },
      cache: 'no-store', // Ensure fresh data
    });

    if (!res.ok) {
      throw new Error(`Failed to fetch profile: ${res.statusText}`);
    }

    return (await res.json()).data;
  } catch (error: any) {
    throw new Error(error.message || 'Failed to fetch profile');
  }
};

// Update user profile
export const updateUserProfile = async (profileData: UpdateProfilePayload): Promise<ProfileResponse> => {
  const token = await getValidToken();

  const formData = new FormData();

  const dataPayload = {
    phoneNo: profileData.phoneNo || undefined,
    address: profileData.address || undefined,
    dateOfBirth: profileData.dateOfBirth || undefined,
  };

  formData.append('data', JSON.stringify(dataPayload));

  if (profileData.photo && typeof profileData.photo !== 'string') {
    formData.append('profilePhoto', profileData.photo); 
  }

  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_API}/user/update-profile`, {
      method: 'PATCH',
      headers: {
        Authorization: token,
    
      },
      body: formData,
    });

    if (!res.ok) {
      throw new Error(`Failed to update profile: ${res.statusText}`);
    }

    return await res.json();
  } catch (error: any) {
    throw new Error(error.message || 'Failed to update profile');
  }
};

// Change user password
export const changeUserPassword = async (payload: {
  oldPassword: string;
  newPassword: string;
}): Promise<{ message: string }> => {
  const token = await getValidToken();

  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_API}/auth/change-password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: token,
      },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      throw new Error(`Failed to change password: ${res.statusText}`);
    }

    return await res.json();
  } catch (error: any) {
    throw new Error(error.message || 'Failed to change password');
  }
};