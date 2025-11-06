import React from "react";
import SideBar from "@/components/utils/SideBar";
import { ThemeToggle } from "@/components/utils/ThemeTogglebutton";
import ProfileSummaryCard from "@/components/Admin/User/components/User/Home/ProfileSummaryCard";
import TagPanel from "@/components/Admin/User/components/Tags/TagPanel";

const mockTags = [
  "SteelBallRun",
  "ArtificialIntelligence (AI)",
  "Cybersecurity",
  "Blockchain",
  "SoftwareEngineering",
  "WebDevelopment",
  "DevOps",
];

const Home: React.FC = () => {
  const [activeTag, setActiveTag] = React.useState<string | null>(null);

  const handleSelectTag = (t: string | null) => {
    setActiveTag(t);
  };

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
      {/* ซ้ายสุด: App Sidebar (fixed) */}
      <SideBar />

      {/* Main area: ใช้ margin-left ให้พ้น Sidebar ถ้า Sidebar เป็น fixed */}
      <main className="ml-[220px]"> 
        {/* Top bar */}
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-zinc-200 bg-white/80 px-4 py-2 backdrop-blur dark:border-zinc-800 dark:bg-zinc-900/80">
          <h1 className="text-sm font-medium text-zinc-800 dark:text-zinc-200">Home</h1>
          <ThemeToggle />
        </div>

        {/* Content grid */}
        <div className="mx-auto max-w-7xl px-4 py-6">
          <div className="grid grid-cols-12 gap-4">
            {/* Left column: sticky profile summary */}
            <div className="col-span-12 md:col-span-3">
              <div className="sticky top-16">
                <ProfileSummaryCard
                  name='Jonathan "Johnny" Joestar'
                  description="Former Champion Jockey | Steel Ball Run Competitor | Resilient Learner"
                  location="United States of America"
                />
              </div>
            </div>

            {/* Middle column: feed */}
            <div className="col-span-12 md:col-span-6">
              {/* Demo feed card */}
              <article className="rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
                <header className="mb-2 text-sm text-zinc-500 dark:text-zinc-400">
                  Feed{activeTag ? ` (แท็ก: ${activeTag})` : ""}
                </header>
                <div className="aspect-[16/9] w-full overflow-hidden rounded-xl bg-zinc-200 dark:bg-zinc-800" />
                <h2 className="mt-3 text-base font-semibold text-zinc-900 dark:text-zinc-100">
                  Steel Ball Run - Johnny Joestar
                </h2>
                <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
                  A visual journey inspired by the Steel Ball Run — a race across America...
                </p>
              </article>
            </div>

            {/* Right column: sticky tag panel */}
            <div className="col-span-12 md:col-span-3">
              <div className="sticky top-16">
                <TagPanel
                  title="Popular"
                  tags={mockTags}
                  activeTag={activeTag}
                  onSelectTag={handleSelectTag}
                />
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Home;
