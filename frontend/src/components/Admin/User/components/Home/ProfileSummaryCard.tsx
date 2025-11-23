import { axiosInstance } from "@/lib/axios";
import type { UserProfile } from "@/types/userProfile";
import React, { useEffect } from "react";
import { toast } from "sonner";


type ProfileSummaryCardProps = {
  name: string;
  picture: string;
  description: string;
  location: string;
};

export const ProfileSummaryCard: React.FC<ProfileSummaryCardProps> = ({
  picture,
}) => {
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
    <div className="rounded-2xl border border-zinc-400 p-4 shadow-sm">
      <img
        src={picture}
        alt={`${data?.username}'s profile`}
        className="h-20 w-20 rounded-full object-cover mx-auto"
      />
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