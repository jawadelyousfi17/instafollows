"use server";

import axios from "axios";

// 1. Define the shape of the API Response based on your snippet
interface InstagramProfileResponse {
  data: {
    data: {
      username: string;
      full_name: string;
      biography: string;
      is_private: boolean;
      profile_pic_url: string;
      profile_pic_url_hd?: string;
      edge_followed_by: {
        count: number;
      };
      edge_follow: {
        count: number;
      };
      edge_owner_to_timeline_media: {
        count: number;
      };
    };
  };
}

// 2. Define the clean output structure
export interface FormattedProfile {
  username: string;
  fullName: string;
  bio: string;
  profilePic: string; // The URL to the profile picture
  stats: {
    followers: number;
    following: number;
    posts: number;
  };
  isPrivate: boolean;
}

export async function getInstagramProfile(
  username: string,
): Promise<FormattedProfile | { error: string }> {
  // RapidAPI config
  const options = {
    method: "GET", // NOTE: RapidAPI usually uses GET for fetching data, but the user snippet used POST? I'll check the snippet. The user snippet says POST.
    url: "https://instagram-scraper-2022.p.rapidapi.com/ig/info_username/", // Wait, the user provided a different URL and KEY. Let me refer to the USER SNIPPET.
    params: { user: username },
    headers: {
      "x-rapidapi-key": "763cf1c4b9msh06c005a3b61ac0ap1158e4jsn4a236ac9db52",
      "x-rapidapi-host": "instagram-scraper-2022.p.rapidapi.com",
    },
  };
  
  // WAIT. The user provided SPECIFIC CODE. I should use THAT code.
  /*
  const options = {
    method: "POST",
    url: "https://instagram120.p.rapidapi.com/api/instagram/profile",
    headers: {
      "x-rapidapi-key": "763cf1c4b9msh06c005a3b61ac0ap1158e4jsn4a236ac9db52", // Ideally store in process.env.RAPIDAPI_KEY
      "x-rapidapi-host": "instagram120.p.rapidapi.com",
      "Content-Type": "application/json",
    },
    data: {
      username: username,
    },
  };
  */

  // Let me replace with user's specific implementation.
  const userOptions = {
    method: "POST",
    url: "https://instagram120.p.rapidapi.com/api/instagram/profile",
    headers: {
      "x-rapidapi-key": "763cf1c4b9msh06c005a3b61ac0ap1158e4jsn4a236ac9db52",
      "x-rapidapi-host": "instagram120.p.rapidapi.com",
      "Content-Type": "application/json",
    },
    data: {
      username: username,
    },
  };

  try {
    const response = await axios.request<any>(userOptions);
    // The user snippet says response.data?.result;
    // But axios returns the data in response.data.
    // So response.data is the body. The body has a result property.
    
    const data = response.data?.result;

    if (!data) {
      console.log("No data found in response", response.data);
      return { error: "Profile not found or API error" };
    }

    // 3. Map the raw API data to your clean structure
    const formattedProfile: FormattedProfile = {
      username: data.username,
      fullName: data.full_name,
      bio: data.biography,
      // Prefer HD image, fall back to standard if HD is missing
      profilePic: data.profile_pic_url_hd || data.profile_pic_url,
      stats: {
        followers: data.edge_followed_by?.count || 0,
        following: data.edge_follow?.count || 0,
        posts: data.edge_owner_to_timeline_media?.count || 0,
      },
      isPrivate: data.is_private,
    };

    return formattedProfile;
  } catch (error) {
    console.error("Instagram Profile API Error:", error);
    return { error: "Failed to fetch Instagram profile" };
  }
}
