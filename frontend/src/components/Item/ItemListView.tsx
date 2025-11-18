import { Card,  CardContent} from '@/components/ui/card'
import { Plus } from 'lucide-react'
import section404noimage from '@/images/section404noimg.gif'
import type { Item } from '@/types/item'
import { Trash2 } from 'lucide-react';
import { toast } from 'sonner'
import { axiosInstance } from '@/lib/axios'
import { ConfirmDeleteDialogueItem } from './components/ConfirmDeleteDialogueItem'
import React from 'react'


type Props = {
    itemData: Item[]
    ownerPageId: string | null
    userId: string | null
    isLoading: boolean
    setLoading : (open: boolean) => void
}

export const ItemListView: React.FC<Props> = ({ itemData,ownerPageId,userId, isLoading, setLoading}: Props) => {

    const [isConfirmOpen, setIsConfirmOpen] = React.useState<boolean >(false);
    const [selectedItemId, setSelectedItemId] = React.useState<string|null >(null);

    const onDelete = async () => {
            toast.success('Deleting section...')
            setLoading(true);
            try {
                if (!userId) {
                    toast.error('Log in is required to delete a section')
                    return
                }
                await axiosInstance.delete(`/items/${selectedItemId}`)
                toast.success('Section deleted successfully')
                
            } catch (error) {
                toast.error('Failed to update section')
            }
            setLoading(false);
        }
    
    return (
        
        (isLoading) ? <div> Loading... </div> :
        
        <div className="w-full flex my-[10px]">
        <ConfirmDeleteDialogueItem open={isConfirmOpen} setOpen={setIsConfirmOpen} onConfirm={()=>onDelete()}/>
        <div className="grid grid-cols-5 gap-x-36 gap-y-0.5  w-[900px] justify-center ">
            {itemData.map((item) => (
                
                <Card key={item.id} className="w-[206px] h-[206px] relative rounded-none border-none hover:shadow-md transition-shadow cursor-pointer group" >
                    
                    {(ownerPageId == userId) &&(
                    <div className="top-1 left-42 w-[35px] bg-red-500 rounded-full absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity aspect-square">
                        <Trash2 size={24} className="text-white" onClick={()=>{
                                setSelectedItemId(item.id)
                                setIsConfirmOpen(true)
                            }}
                        />
                    </div>   )}
                    <img
                            src={ section404noimage} 
                            className="w-full h-full object-cover"
                        />   
                        

                    <CardContent>
                        
                    </CardContent>

                </Card>
                
            ))}
            {ownerPageId === userId && (
            <Card className="w-[206px] h-[206px] flex items-center justify-center rounded-none border-none cursor-pointer" style={{ backgroundColor: '#D9D9D9' }} >  
                <Plus size={64} className="text-gray-400" strokeWidth={0.75} />
            </Card> 
            )}
        </div>
        </div>
    )
}