import { Button } from '@/components/ui/button'
import { MediaImage } from '@/components/utils/MediaToImage'
import type { UserProfile } from '@/types/userProfile'
import { User, Wrench, MapPin } from 'lucide-react'
import type React from 'react'

type Props = {
    data: UserProfile,
    isOwner: boolean,
    handleEditUser: () => void
}

const ProfileHeader: React.FC<Props> = ({data, isOwner, handleEditUser}: Props) => {
    console.log(data)
    return (
    <div className='w-full'>
        {/* Profile Section */}
        <div className="flex flex-row justify-between">
        {/* Avatar - Centered */}
        <div className="flex items-center gap-4">
            {data.profileMediaId ? 
                (<MediaImage
                mediaId = {data.profileMediaId}
                className="w-28 h-28 rounded-full flex items-center justify-center shadow-md"
                />) :
                (
                <div className="w-28 h-28 rounded-full flex items-center justify-center shadow-md bg-gray-200">
                    <User size={64} className="text-gray-500" />
                </div>
                )
            }

            <div className = 'flex flex-col text-left'>
                <h1 className="text-2xl font-semibold tracking-tight">
                    {data.username}
                </h1>
                {
                    data.firstName ? 
                    (
                        <p className = 'font-semibold'>
                            {data.firstName} {data.lastName}
                        </p>
                    ) :
                    <></>
                }
                <p className="text-sm text-muted-foreground leading-relaxed">
                    {data.description}
                </p>
                { data.location ? 
                (<span className="text-sm text-muted-foreground/70 text-zinc-400 flex">
                    <MapPin size={16} className = 'mr-2'/>
                    {data.location}
                </span>) : 
                <></>
                }
            </div>
        </div>
        <div className="">
            {(isOwner) ? (
            <Button 
            className="bg-primary text-primary-foreground text-xs font-medium px-4 py-2 rounded-full hover:opacity-90 transition-all gap-2"
            variant="outline" 
            onClick = {handleEditUser}
            >
            <Wrench size={16} />
            Edit Profile
            </Button>) : 
            (<></>)
            }
        
        </div>
        </div>
    </div>
    ) 
}

export default ProfileHeader;