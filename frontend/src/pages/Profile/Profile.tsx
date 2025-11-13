// frontend/src/pages/Profile.tsx
import React, { useEffect, useRef } from 'react'
import SideBar from '@/components/utils/SideBar'
import { User, Send } from 'lucide-react'
import { axiosInstance } from '@/lib/axios';
import type { Section } from '@/types/section';
import { useParams } from 'react-router-dom';
import { toast } from 'sonner';

const Profile: React.FC = () => {
  // Fake data for section creation
  const fakeData = {title: 'Sample Section', description: 'This is a sample section description.', coverMediaId: ''};

  const [sectionData, setSectionData] = React.useState<Section[]>([]);
  const [ownerPageId, setOwnerPageId] = React.useState<string | null>(null);
  const [userId, setUserId] = React.useState<string | null>(null);
  const [isCreateSectionFormOpen, setIsCreateSectionFormOpen] = React.useState<boolean>(false);
  const [isEditSectionFormOpen, setIsEditSectionFormOpen] = React.useState<boolean>(false);
  const [sectionIdToEdit, setSectionIdToEdit] = React.useState<string>('');
  const [isLoading, setIsLoading] = React.useState<boolean>(true);

  const {username} = useParams(); // username of owner profile page

  const containerRef = useRef<HTMLDivElement>(null);

  // Example section ID for deletion test
  const sectionId = sectionData.length > 0 ? sectionData[0].id : ''; 

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
  
 
  const handleSubmit = async () => {
    console.log('Test button clicked');
    try{
          const result = await axiosInstance.get('/auth/me');
          toast.success('Fetch profile successful!');
          console.log(result.data);
          console.log(username);
          
        }
        catch (error) {
          toast.error('An unexpected error occurred');
          
        } 
  }
  const handleFetchSection = async () => {
    console.log('Test button clicked');
    try{
          const res = await axiosInstance.get(`/section/user/${ownerPageId}` )
          console.log(res.data);
          toast.success('Fetch section successful!');
          
        }
        catch (error) {
          toast.error('An unexpected error occurred');
          
        } 
  
  }
  const handleCreateSection = async () => {
    const body = {
      ownerId: userId,
      title: fakeData.title,
      description: fakeData.description,
      coverMediaId: fakeData.coverMediaId,
    };
    console.log(body);
    try{
          const res = await axiosInstance.post(`/section/create`, body )
          toast.success('Section create!')
          console.log(res.data);
        }
        catch (error) {
          toast.error('An unexpected error occurred');
          
        } 
  
  }
  const handleDeleteSection = async () => {
    console.log('Test button clicked');
    try{
          const res = await axiosInstance.delete(`/section/delete/${sectionId}` )
          toast.success(res.data.message);
          
        }
        catch (error) {
          toast.error('An unexpected error occurred');
          
        } 
  
  }

  const handleOpenCreateForm = async () => {
    if (ownerPageId!== userId) {
      toast.error('Youa re not owner of this profile page');
      return;
    }
    console.log('Test button clicked');
    setIsCreateSectionFormOpen(true);
    
  }
  const handleOpenEditForm = async () => {
    console.log('Test button clicked');
    if (ownerPageId!== userId) {
      toast.error('Youa re not owner of this profile page');
      return;
    }
    setSectionIdToEdit(sectionId);
    setIsEditSectionFormOpen(true);
  }

  const handleUpdateSection = async () => {
    console.log('Test button clicked');
    const updateData = {
      title: 'Updated Section Title',
      description: 'Updated description for the section.',
    };
    try{
          const res = await axiosInstance.patch(`/section/update/${sectionId}`, updateData )
          toast.success(res.data.message);
      }
    catch (error) {
      toast.error('An unexpected error occurred');
    }
  }

  return (
    <div className="flex flex-row bg-background text-foreground min-h-screen">
      {/* Sidebar */}
      <SideBar />

      {/* Main Content */}
      <div className="flex flex-col items-center w-full overflow-y-auto">
        {/* Cover Banner - Gray Box */}
        <div className="w-full max-w-5xl h-40 rounded-b-2xl shadow-sm bg-gray-200 mt-6" />

        {/* Profile Section */}
      <div className="w-full max-w-3xl flex flex-col sm:flex-row items-center sm:items-end gap-6 px-6 mt-6">
        {/* Avatar - Centered */}
        <div className="flex w-full sm:w-auto justify-center sm:justify-start">
          <div className="w-28 h-28 rounded-full flex items-center justify-center ring-4 ring-background shadow-md bg-gray-200">
            <User size={64} className="text-gray-500" />
          </div>
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
            <span className="text-sm text-muted-foreground/70">United States</span>

            <div className="flex items-center gap-3 pt-2">
              <button className="bg-primary text-primary-foreground text-xs font-medium px-4 py-2 rounded-full hover:opacity-90 transition-all flex items-center gap-2">
                <Send size={16} />
                Edit Profile
              </button>
              <button className="bg-secondary text-secondary-foreground hover:bg-accent hover:text-accent-foreground rounded-full w-9 h-9 flex items-center justify-center transition">
                <Send size={16} />
              </button>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="w-full max-w-5xl border-t border-border mt-8" />

        {/* Gallery Section - Gray Boxes */}
        <div className="w-full max-w-5xl grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 px-6 py-10">
          {[1, 2, 3, 4, 5, 6].map((n) => (
            <div
              key={n}
              className="bg-gray-200 aspect-square rounded-lg flex items-center justify-center text-gray-400 text-3xl hover:bg-accent hover:text-accent-foreground transition"
            >
              {n === 6 ? '+' : ''}
            </div>
          ))}
        </div>
      </div>
    </div>
    
  );
}

export default Profile
