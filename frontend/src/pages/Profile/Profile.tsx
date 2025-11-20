// frontend/src/pages/Profile.tsx
import React, { useEffect} from 'react'
import SideBar from '@/components/utils/SideBar'
import { axiosInstance } from '@/lib/axios';
import type { Section } from '@/types/section';
import { useParams } from 'react-router-dom';
import { toast } from 'sonner';
import { Separator } from '@/components/ui/separator';
import { EditUserForm } from '@/components/Admin/User/components/User/Profile/EditUserForm';
import type { UserProfile } from '@/types/userProfile';
import NotFound from '../NotFound';
import ProfileHeader from '@/components/Admin/User/components/User/Profile/ProfileHeader';
import Loading from '../Loading';
import { CreateSectionForm } from '@/components/Section/components/Form/CreateSectionForm';
import { EditSectionForm } from '@/components/Section/components/Form/EditSectionForm';
import { SectionView } from '@/components/Section/SectionView';

const Profile: React.FC = () => {

  const [data, setData] = React.useState<UserProfile|null>(null);
  const [sectionData, setSectionData] = React.useState<Section[]>([]);
  const [ownerPageId, setOwnerPageId] = React.useState<string | null>(null);
  const [userId, setUserId] = React.useState<string | null>(null);
  const [isCreateSectionFormOpen, setIsCreateSectionFormOpen] = React.useState<boolean>(false);
  const [isEditSectionFormOpen, setIsEditSectionFormOpen] = React.useState<boolean>(false);
  const [sectionIdToEdit, setSectionIdToEdit] = React.useState<string>('');

  const [isLoading, setIsLoading] = React.useState<boolean>(true);
  
  const [openEditUserDialog,setOpenEditUserDialog] = React.useState(false)

  const {username} = useParams(); // username of owner profile page

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
          const res = await axiosInstance.get(`/section/username/${username}` )
          console.log('section ', res.data);
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
  
  const handleEditUser = async () => {
    setOpenEditUserDialog(true)
  }

  useEffect(() => {
    setIsLoading(true);
    fetchUserId();
    if (username) fetchProfile();
    if (username) fetchSection();
    setIsLoading(false);
  }, []);
  




    if(data === null) return(
    <NotFound />
  )

  else if (isLoading) return (
    <Loading />
  )
  else
  
  return (
    <div className="flex flex-row text-foreground min-h-screen" >
      {/* Sidebar */}
      <SideBar />
      <div className="flex flex-col items-start w-full overflow-y-auto">
        <ProfileHeader
          data = {data} 
          isOwner = {(ownerPageId === userId)}
          handleEditUser={handleEditUser}
        />
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
      <EditUserForm
        open = {openEditUserDialog}
        setOpen={setOpenEditUserDialog}
        data = {data}
        setData = {setData} />
    </div>
    
  )
}

export default Profile
