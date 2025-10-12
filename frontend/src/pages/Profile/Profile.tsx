import { Button } from '@/components/ui/button'
import React from 'react'
import { toast } from 'sonner'
import { axiosInstance } from '@/lib/axios'


const Profile: React.FC = () => {

  //For testing purpose
  const handleSubmit = async () => {
    console.log('Test button clicked');
    try{
          const result = await axiosInstance.get('/auth/me');
          toast.success('Fetch profile successful!');
          console.log(result.data);
          
        }
        catch (error) {
          toast.error('An unexpected error occurred');
          
        } 
  }
  //

  return (
    <div>Profile
      <Button onClick={handleSubmit}>Test Button</Button>
    </div>
  )
}

export default Profile