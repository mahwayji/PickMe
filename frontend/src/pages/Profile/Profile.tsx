// frontend/src/pages/Profile.tsx
import React, { useEffect} from 'react'
import SideBar from '@/components/utils/SideBar'
import { Send } from 'lucide-react'
import { axiosInstance } from '@/lib/axios';
import type { Section } from '@/types/section';
import { useParams } from 'react-router-dom';
import { toast } from 'sonner';
import { SectionView } from '@/components/Section/SectionView';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { CreateSectionForm } from '@/components/Section/components/Form/CreateSectionForm';
import { EditSectionForm } from '@/components/Section/components/Form/EditSectionForm';

const Profile: React.FC = () => {

  const [sectionData, setSectionData] = React.useState<Section[]>([]);
  const [ownerPageId, setOwnerPageId] = React.useState<string | null>(null);
  const [userId, setUserId] = React.useState<string | null>(null);
  const [isCreateSectionFormOpen, setIsCreateSectionFormOpen] = React.useState<boolean>(false);
  const [isEditSectionFormOpen, setIsEditSectionFormOpen] = React.useState<boolean>(false);
  const [sectionIdToEdit, setSectionIdToEdit] = React.useState<string>('');
  const [isLoading, setIsLoading] = React.useState<boolean>(true);

  const {username} = useParams(); // username of owner profile page

  const fetchOwnerPageId = async () => {
      try {
        const res = await axiosInstance.get(`/user/${username}`);
        console.log(res.data);
        const ownerPageId = res.data.id;
        setOwnerPageId(ownerPageId);
      } catch (error) {
        console.error('Error fetching owner page ID:', error);
      }
    };

    const fetchUserId = async () => {
      try {
        const res = await axiosInstance.get(`/auth/me`);
        console.log('Fetch user id', res.data.id);
        setUserId(res.data.id);
      } catch (error) {
        console.error('Error fetching user ID:', error);
      }
    };

    const fetchSection = async () => {
      try{
            const res = await axiosInstance.get(`/section/user/${ownerPageId}` )
            console.log(res.data);
            setSectionData(res.data);
            toast.success('Fetch section successful!');
          }
          catch (error) {
            toast.error('An unexpected error occurred');
          }
    }

  useEffect(() => {
    setIsLoading(true);
    fetchUserId();
    if (username) fetchOwnerPageId();
    if (ownerPageId) fetchSection();
    setIsLoading(false);
  }, [username, ownerPageId, isLoading]);

  return (
    <div className="flex flex-row text-foreground min-h-screen" >
      {/* Sidebar */}
      <SideBar />

      {/* Main Content */}
      <div className="flex flex-col items-start w-full overflow-y-auto">
        {/* Profile Section */}
      <div className="w-full max-w-3xl flex flex-col sm:flex-row items-center sm:items-end gap-6 px-6 mt-6">
        {/* Avatar - Centered */}
        <div className="flex w-full sm:w-auto justify-center sm:justify-start">
            <img
              src = 'https://nest-library-api-mahwayji.s3.ap-southeast-2.amazonaws.com/images/doog'
              className="w-28 h-28 rounded-full flex items-center justify-center ring-2 shadow-md"
            />
        </div>


          {/* Info */}
          <div className="flex-1 flex flex-col items-center sm:items-start text-center sm:text-left space-y-2">
            <h1 className="text-2xl font-semibold tracking-tight">
              Jonathan “Johnny” Joestar
            </h1>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Former Champion Jockey • Steel Ball Run Competitor • Resilient
              Learner <br />
              Professional nail spinner 💅 • Infinite Rotation Enthusiast • 1st
              Joestar to ride across America 🇺🇸🐎
            </p>
            <span className="text-sm text-muted-foreground/70 text-zinc-400">United States</span>
            <div className="flex items-center gap-3 pt-2">
              <Button className="bg-primary text-primary-foreground text-xs font-medium px-4 py-2 rounded-full hover:opacity-90 transition-all flex items-center gap-2">
                <Send size={16} />
                Edit Profile
              </Button>
              <button className="bg-secondary text-secondary-foreground hover:bg-accent hover:text-accent-foreground rounded-full w-9 h-9 flex items-center justify-center transition">
                <Send size={16} />
              </button>
            </div>
          </div>
        </div>

        <Separator className='py-2'/>

        {isCreateSectionFormOpen && userId &&(
        <CreateSectionForm 
          open= {isCreateSectionFormOpen} 
          setOpen= {setIsCreateSectionFormOpen}
          data= {sectionData}
          setData= {setSectionData}
          userId = {userId}
        />)}

        {isEditSectionFormOpen && userId &&(
        <EditSectionForm 
          open= {isEditSectionFormOpen} 
          setOpen= {setIsEditSectionFormOpen}
          data= {sectionData}
          setData= {setSectionData}
          setLoading={setIsLoading}
          userId= {userId}
          sectionId={sectionIdToEdit}
        />)}

        <SectionView 
          sectionData={sectionData} 
          isLoading={isLoading} 
          ownerPageId={ownerPageId} 
          userId={userId} 
          setOpenCreateSectionForm={setIsCreateSectionFormOpen} 
          setOpenEditSectionForm={setIsEditSectionFormOpen} 
          setSectionIdToEdit={setSectionIdToEdit}/>

      </div>
    </div>
    
  );
}

export default Profile
