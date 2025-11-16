// frontend/src/pages/Profile.tsx
import React, { useEffect, useRef } from 'react'
import SideBar from '@/components/utils/SideBar'
import { axiosInstance } from '@/lib/axios';
import type { Section } from '@/types/section';
import { useParams } from 'react-router-dom';
import { toast } from 'sonner';
import { SectionView } from '@/components/Section/SectionView';
import { Separator } from '@/components/ui/separator';
import { EditUserForm } from '@/components/Admin/User/components/User/Profile/EditUserForm';
import type { userProfile } from '@/types/userProfile';
import NotFound from '../NotFound';
import ProfileHeader from '@/components/Admin/User/components/User/Profile/ProfileHeader';

const Profile: React.FC = () => {
  // Fake data for section creation
  const fakeData = {title: 'Sample Section', description: 'This is a sample section description.', coverMediaId: ''};

  const [data, setData] = React.useState<userProfile|null>(null);
  const [sectionData, setSectionData] = React.useState<Section[]>([]);
  const [ownerPageId, setOwnerPageId] = React.useState<string | null>(null);
  const [userId, setUserId] = React.useState<string | null>(null);

  const [isLoading, setIsLoading] = React.useState<boolean>(true);
  
  const [openEditUserDialog,setOpenEditUserDialog] = React.useState(false)

  const {username} = useParams(); // username of owner profile page

  const containerRef = useRef<HTMLDivElement>(null);

  // Example section ID for deletion test
  const sectionId = sectionData.length > 0 ? sectionData[0].id : ''; 

  const fetchUserId = async () => {
    try {
      const res = await axiosInstance.get(`/auth/me`);
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
        }
        catch (error) {
          toast.error('An unexpected error occurred');
        }
  }

  const fetchProfile = async () => {
    try { 
      const res = await axiosInstance.get(`/profile/${username}`)
      setData(res.data);
      console.log('data', res.data);  
      setOwnerPageId(res.data.id)
    }
    catch(error){
      toast.error("Can't get this user profile!")
    }
  }
  
  useEffect(() => {
    setIsLoading(true);
    fetchUserId();
    if (username) fetchProfile();
    if (ownerPageId) fetchSection();
    setIsLoading(false);
  }, []);
  
  const handleEditUser = async () => {
      setOpenEditUserDialog(true)
    }

  if(data === null) return(
    <NotFound />
  )

  else

  return (
    <div className="flex flex-row text-foreground min-h-screen">
      {/* Sidebar */}
      <SideBar />
      <div className="flex flex-col items-start w-full overflow-y-auto">
        <ProfileHeader
          data = {data} 
          isOwner = {(ownerPageId === userId)}
          handleEditUser={handleEditUser}
        />
        <Separator className='py-2'/>

        {/* <SectionView 
          sectionData={sectionData} 
          isLoading={isLoading} 
          ownerPageId={ownerPageId} 
          userId={userId} 
          setOpenCreateSectionForm={setIsCreateSectionFormOpen} 
          setOpenEditSectionForm={setIsEditSectionFormOpen} 
          setSectionIdToEdit={setSectionIdToEdit}/> */}

      </div>
      <EditUserForm
        open = {openEditUserDialog}
        setOpen={setOpenEditUserDialog}
        data = {data}
        setData = {setData} />
    </div>
    
  )
}

export default Profile
