import { axiosInstance } from "@/lib/axios";
import type { UserProfile } from "@/types/userProfile";
import { User } from "lucide-react";
import React, { useEffect } from "react";
import { toast } from "sonner";
import { MediaImage } from '@/components/utils/MediaToImage'


type ProfileSummaryCardProps = {
  name: string;
  picture: string;
  description: string;
  location: string;
};

export const ProfileSummaryCard: React.FC<ProfileSummaryCardProps> = ({}) => {
  const [data, setData] = React.useState<UserProfile | null>(null);
  const [username, setUsername] = React.useState<string>('');

  useEffect(() => {
  const load = async () => {
    try {
      const userRes = await axiosInstance.get(`/auth/me`);
      const username = userRes.data.username;
      setUsername(username);

      const profileRes = await axiosInstance.get(`/profile/${username}`);
      setData(profileRes.data);
    } catch (error) {
      console.error(error);
      toast.error("Can't load user or profile!");
    }
  };

  load();
}, [username]);

  

  return (
    <div className="rounded-2xl border border-zinc-400 p-4 shadow-sm flex flex-col items-center text-center">
      {data?.profileMediaId ? 
        (<MediaImage
          mediaId = {data.profileMediaId}
          className="w-28 h-28 rounded-full flex items-center justify-center shadow-md"
        />) :
        (
          <div className="w-28 h-28 rounded-full flex items-center justify-center ring-background shadow-md bg-gray-200">
          <User size={64} className="text-gray-500" />
          </div>
        )
      }
      <h2 className="text-lg font-semibold ">
        {data?.username}
      </h2>
      <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
        {data?.description}
      </p>
      <p className="mt-2 text-xs text-zinc-500 dark:text-zinc-400">
        {data?.location}
      </p>
    </div>
  );
};
export default ProfileSummaryCard;