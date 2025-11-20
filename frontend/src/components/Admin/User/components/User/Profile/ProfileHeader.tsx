import { Button } from '@/components/ui/button'
import { MediaImage } from '@/components/utils/MediaToImage'
import type { UserProfile } from '@/types/userProfile'
import { User, Send, Wrench } from 'lucide-react'
import type React from 'react'

type Props = {
    data: UserProfile,
    isOwner: boolean,
    handleEditUser: () => void
}

const ProfileHeader: React.FC<Props> = ({data, isOwner, handleEditUser}: Props) => {
    return (
    <div>
        {/* Profile Section */}
        <div className="w-full max-w-3xl flex flex-col sm:flex-row items-center sm:items-end gap-6 px-6 mt-6">
        {/* Avatar - Centered */}
        <div className="flex w-full sm:w-auto justify-center sm:justify-start">
            {data.profileMediaId ? 
                (<MediaImage
                mediaId = {data.profileMediaId}
                className="w-28 h-28 rounded-full flex items-center justify-center shadow-md"
                />) :
                (
                <div className="w-28 h-28 rounded-full flex items-center justify-center ring-background shadow-md bg-gray-200">
                    <User size={64} className="text-gray-500" />
                </div>
                )
            }
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
                {(isOwner) ? (
                <Button 
                className="bg-primary text-primary-foreground text-xs font-medium px-4 py-2 rounded-full hover:opacity-90 transition-all flex items-center gap-2"
                variant="outline" 
                onClick = {handleEditUser}
                >
                <Wrench size={16} />
                Edit Profile
                </Button>) : 
                (<></>)
                }
                <button className="bg-secondary text-secondary-foreground hover:bg-accent hover:text-accent-foreground rounded-full w-9 h-9 flex items-center justify-center transition">
                <Send size={16} />
                </button>
            </div>
            </div>
        </div>
    </div>
    ) 
}

export default ProfileHeader;