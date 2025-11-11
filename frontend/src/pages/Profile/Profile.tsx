import { Button } from '@/components/ui/button'
import React from 'react'
import { toast } from 'sonner'
import { axiosInstance } from '@/lib/axios'
import { useParams } from 'react-router-dom'
import { useEffect, } from 'react'
import { CreateSectionForm } from '@/components/Section/components/Form/CreateSectionForm'
import { EditSectionForm } from '@/components/Section/components/Form/EditSectionForm'
import type { Section } from '@/types/section'

const Profile: React.FC = () => {
  // Fake data for section creation
  const fakeData = {title: 'Sample Section', description: 'This is a sample section description.', coverMediaId: ''};

  // Example section ID for deletion test
  const sectionId = 'cmhs6whc1000nvtawabcwfajq'; 

  const [sectionData, setSectionData] = React.useState<Section[]>([]);
  const [ownerPageId, setOwnerPageId] = React.useState<string | null>(null);
  const [userId, setUserId] = React.useState<string | null>(null);
  const [isCreateSectionFormOpen, setIsCreateSectionFormOpen] = React.useState<boolean>(false);
  const [isEditSectionFormOpen, setIsEditSectionFormOpen] = React.useState<boolean>(false);
  const [sectionIdToEdit, setSectionIdToEdit] = React.useState<string>('');

  const {username} = useParams(); // username of owner profile page

  const fetchOwnerPageId = async () => {
      try {
        console.log('Fetching owner page ID for username:', username);
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
        console.log(res.data.id);
        setUserId(res.data.id);
      } catch (error) {
        console.error('Error fetching user ID:', error);
      }
    };

    const fetchSection = async () => {
      try{
            const res = await axiosInstance.get(`/section/${ownerPageId}` )
            console.log(res.data);
            setSectionData(res.data);
            toast.success('Fetch section successful!');
          }
          catch (error) {
            toast.error('An unexpected error occurred');
          }
    }

  useEffect(() => {
    fetchUserId();
    if (username) fetchOwnerPageId();
    if (ownerPageId) fetchSection();
  }, [username, ownerPageId]);
  
 
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
          const res = await axiosInstance.get(`/section/${ownerPageId}` )
          console.log(res.data);
          toast.success('Fetch section successful!');
          
        }
        catch (error) {
          toast.error('An unexpected error occurred');
          
        } 
  
  }
  const handleCreateSection = async () => {
    console.log('Test button clicked');
    if (ownerPageId!== userId) {
      toast.error('Youa re not owner of this profile page');
      return;
    }
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
    console.log('Test button clicked');
    setIsCreateSectionFormOpen(true);
    
  }
  const handleOpenEditForm = async () => {
    console.log('Test button clicked');
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
    <div>
      <div>Profile
        <Button onClick={handleSubmit}>Test Profile fetch</Button>
        <Button onClick={handleFetchSection}>Test Section fetch</Button>
        <Button onClick={handleCreateSection}>Test Section create</Button>
        <Button onClick={handleDeleteSection}>Test Section delete</Button>
        <Button onClick={handleOpenCreateForm}>Create Section</Button>
        <Button onClick={handleOpenEditForm}>Edit Section</Button>
        <Button onClick={handleUpdateSection}>Update Section</Button>
      </div>

      {/* Create Section Form */}
    
      {isCreateSectionFormOpen && (
        <CreateSectionForm
          open={isCreateSectionFormOpen}
          setOpen={setIsCreateSectionFormOpen}
          data={sectionData}
          setData={setSectionData}
          userId={userId ? userId.toString() : ''}
        />
      )}
      {isEditSectionFormOpen && (
        <EditSectionForm
          open={isEditSectionFormOpen}
          setOpen={setIsEditSectionFormOpen}
          data={sectionData}
          setData={setSectionData}
          userId={userId ? userId: ''}
          sectionId={sectionIdToEdit ?sectionIdToEdit : ''}
        />
      )}

    </div>
  );
}

export default Profile