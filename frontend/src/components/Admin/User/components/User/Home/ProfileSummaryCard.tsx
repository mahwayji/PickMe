import React from "react";

type ProfileSummaryCardProps = {
  name: string;
  description: string;
  location: string;
};

export const ProfileSummaryCard: React.FC<ProfileSummaryCardProps> = ({
  name,
  description,
  location,
}) => {
  return (
    <div className="rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
      <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
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