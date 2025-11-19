import React from "react";
import SideBar from "@/components/utils/SideBar";
import { ThemeToggle } from "@/components/utils/ThemeTogglebutton";
import ProfileSummaryCard from "@/components/Admin/User/components/Home/ProfileSummaryCard";
import TagPanel from "@/components/Admin/User/components/Tags/TagPanel";
//import { Button } from "@/components/ui/button";
import { axiosInstance } from "@/lib/axios";
//import axios from "axios";

// แท็กทั้งหมดที่อยากโชว์ใน TagPanel
/*const popularTags = [
  "SteelBallRun",
  "ArtificialIntelligence (AI)",
  "Cybersecurity",
  "Blockchain",
];*/

/*const newTags = [
  "SoftwareEngineering",
  "WebDevelopment",
  "DevOps",
];*/


// mock feed data (เดี๋ยวอนาคตค่อยเปลี่ยนเป็นดึงจาก backend)
type FeedItem = {
  id: number;
  title: string;
  description: string;
  cover?: string;
  tags: string[];
};

const mockFeed: FeedItem[] = [
  {
    id: 1,
    title: "Steel Ball Run - Johnny Joestar",
    description:
      "A visual journey inspired by the Steel Ball Run — a race across America...",
    cover: "",
    tags: ["SteelBallRun", "devops"],
  },
  {
    id: 2,
    title: "Getting started with DevOps pipelines",
    description:
      "Basic CI/CD concepts and how to ship faster without breaking everything.",
    cover: "",
    tags: ["DevOps", "SoftwareEngineering"],
  },
  {
    id: 3,
    title: "Intro to AI for creatives",
    description:
      "Using Artificial Intelligence (AI) to boost your creative workflows.",
    cover: "",
    tags: ["ArtificialIntelligence (AI)", "WebDevelopment"],
  },
];

const Home: React.FC = () => {
  const [activeTag, setActiveTag] = React.useState<string | null>(null);
  const [tags, setTags] = React.useState<string[]>([]);

  const handleSelectTag = (t: string | null) => {
    setActiveTag(t);
  };

  /*const handleCreateTag = () => {
    console.log("Create Tag clicked");
    const newTag = { name: "ML" };
            const createTag = async () => {
          try {
            const response = await axiosInstance.post('/tag/create', newTag);
            console.log('Tag created successfully:', response.data);
          } catch (error) {
            if (axios.isAxiosError(error)) { // Type guard to ensure 'error' is an AxiosError
              console.error('Error creating tag:', error.message);
              if (error.response) {
                // The request was made and the server responded with a status code
                // that falls out of the range of 2xx
                console.error('Server responded with:', error.response.data);
                console.error('Status code:', error.response.status);
              } else if (error.request) {
                // The request was made but no response was received
                console.error('No response received:', error.request);
              } else {
                // Something happened in setting up the request that triggered an Error
                console.error('Axios setup error:', error.message);
              }
            } else {
              // Non-Axios error
              console.error('An unexpected error occurred:', error);
            }
          }
        };
        

    createTag();
  };*/

  const fetchTags = async () => {
    try {
      const response = await axiosInstance.get('/tag');
      console.log('Fetched tags:', response.data);
      setTags(response.data.map((tag: { name: string }) => tag.name));
    } catch (error) {
      console.error('Error fetching tags:', error);
    }
  };
  React.useEffect(() => {
    fetchTags();
  }, []);

  // ถ้าเลือก tag -> filter feed ตาม tag
  const visibleFeed = React.useMemo(() => {
    if (!activeTag) return mockFeed;
    return mockFeed.filter((item) => item.tags.includes(activeTag));
  }, [activeTag]);

  return (
    <div className="min-h-screen">
      {/* ซ้ายสุด: App Sidebar (fixed) */}
      <SideBar />

      {/* Main area: ใช้ margin-left ให้พ้น Sidebar ถ้า Sidebar เป็น fixed */}
      <main className="ml-[220px]">
        {/* Top bar */}
        <div className="sticky top-0 z-10 flex items-center justify-between border- px-4 py-2 backdrop-blur">
          <h1 className="text-sm font-medium text-zinc-400">Home</h1>
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
                  picture="https://s.isanook.com/ga/0/ud/229/1146729/jojo(1).jpg?ip/crop/w670h402/q80/jpg"
                  description="Former Champion Jockey | Steel Ball Run Competitor | Resilient Learner"
                  location="United States of America"
                />
              </div>
            </div>

            {/* Middle column: feed */}
            <div className="col-span-12 md:col-span-6 space-y-4">
              <header className="mb-2 text-sm text-zinc-500 dark:text-zinc-400">
                Feed{activeTag ? ` (แท็ก: ${activeTag})` : ""}
              </header>

              {visibleFeed.length === 0 ? (
                <p className="text-sm text-zinc-500 dark:text-zinc-400">
                  ยังไม่มีโพสต์ที่ใช้แท็กนี้
                </p>
              ) : (
                visibleFeed.map((item) => (
                  <article
                    key={item.id}
                    className="rounded-2xl border border-zinc-400 p-4 shadow-sm"
                  >
                    {/* cover (ตอนนี้เป็นกล่องเทาๆ demo ไปก่อน) */}
                    <div className="aspect-[16/9] w-full overflow-hidden rounded-xl bg-zinc-400" />
                    <h2 className="mt-3 text-base font-semibold">
                      {item.title}
                    </h2>
                    <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
                      {item.description}
                    </p>

                    {/* แสดงแท็กใต้โพสต์ */}
                    <div className="mt-3 flex flex-wrap gap-2">
                      {item.tags.map((t) => (
                        <span
                          key={t}
                          className="rounded-full border border-zinc-400 px-2 py-0.5 text-[10px] uppercase tracking-wide text-zinc-500"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  </article>
                ))
              )}
            </div>

            {/* Right column: sticky tag panel */}
            <div className="col-span-12 md:col-span-3">
              <div className="sticky top-16">
                <TagPanel
                  title="Tags"
                  popularTags={tags}
                  newTags={tags}
                  activeTag={activeTag}
                  onSelectTag={handleSelectTag}
                />
                {/* <Button className="mt-4 w-full" onClick={handleCreateTag}>
                  Create Tag
                </Button> */}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Home;
