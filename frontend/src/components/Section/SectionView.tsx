import { Card,  CardContent} from '@/components/ui/card'
import { Wrench } from 'lucide-react'
import { Plus } from 'lucide-react'
import section404noimage from '@/images/section404noimg.gif'
import type { Section } from '@/types/section'
import { toast } from 'sonner'
import { MediaImage } from '../utils/MediaToImage'

type Props = {
    sectionData: Section[]
    isLoading: boolean
    ownerPageId: string | null
    userId: string | null
    setOpenCreateSectionForm: (open: boolean) => void
    setOpenEditSectionForm: (open: boolean) => void
    setSectionIdToEdit: (sectionId: string) => void
}

export const SectionView: React.FC<Props> = ({ sectionData, isLoading,ownerPageId,userId, setOpenCreateSectionForm,setOpenEditSectionForm,setSectionIdToEdit }: Props) => {

    const handleCreateSection = async () => {
        if (ownerPageId!=userId) {
            toast.error('You are not owner of this profile page')
            return;
        }
        
        setOpenCreateSectionForm(true);
    }

    console.log(sectionData)
    return (
        (isLoading) ? <div> Loading... </div> :
        <div className="w-full flex justify-center">
        <div className="grid grid-cols-3 gap-0.5 w-[900px] justify-center ">
            {sectionData.map((section) => (
                <Card key={section.id} className="w-[300px] h-[400px] relative rounded-none border-none hover:shadow-md transition-shadow cursor-pointer group">  
                    {(ownerPageId === userId) &&
                    <div className="top-2 left-63 w-[40px] bg-white rounded-full absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity aspect-square"
                    onClick={(e) => {
                        setOpenEditSectionForm(true);
                        setSectionIdToEdit(section.id);
                        e.stopPropagation();
                    }} >
                        <Wrench size={24} className="text-gray-600" />
                    </div>}

                    {section.coverMediaId ? 
                    (<MediaImage mediaId= {section.coverMediaId} 
                        className="w-full h-full object-cover"/>)
                    :
                    (<img
                        src= {section404noimage} 
                        className="w-full h-full object-cover"
                    />   )

                    }
                    <CardContent>
                        
                    </CardContent>

                </Card>
                
            ))}
            {ownerPageId === userId && (
            <Card className="w-[300px] h-[400px] flex items-center justify-center rounded-none border-none cursor-pointer" style={{ backgroundColor: '#D9D9D9' }} onClick={handleCreateSection}>  
                <Plus size={64} className="text-gray-400" strokeWidth={0.75} />
            </Card> 
            )}
        </div>
        </div>
    )
}