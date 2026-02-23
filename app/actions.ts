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

  const o = {
    method: "POST",
    url: "https://instagram120.p.rapidapi.com/api/instagram/profile",
    headers: {
      "x-rapidapi-key": "2a97b8c83cmsh83aa6c742f04660p14dd91jsn674d51427a4b",
      "x-rapidapi-host": "instagram120.p.rapidapi.com",
      "Content-Type": "application/json",
    },
    data: {
      username,
    },
  };

  try {
    console.log("PPPP");
    const response = await axios.request(o);
    console.log(response);
    const data = response.data.result;
    if (!data) {
      console.log("No data found in response", response.data);
      return { error: "Profile not found or API error" };
    }
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
    console.log(error)
    return { error: "ERROR" };
  }
}
