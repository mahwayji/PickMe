import React from "react";

type ProfileSummaryCardProps = {
  name: string;
  picture: string;
  description: string;
  location: string;
};

export const ProfileSummaryCard: React.FC<ProfileSummaryCardProps> = ({
  name,
  picture,
  description,
  location,
}) => {
  return (
    <div className="rounded-2xl border border-zinc-400 p-4 shadow-sm">
      <img
        src={picture}
        alt={`${name}'s profile`}
        className="h-20 w-20 rounded-full object-cover mx-auto"
      />
      <h2 className="text-lg font-semibold ">
        {name}
      </h2>
      <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
        {description}
      </p>
      <p className="mt-2 text-xs text-zinc-500 dark:text-zinc-400">
        {location}
      </p>
    </div>
  );
};
export default ProfileSummaryCard;