import SideBar from '@/components/utils/SideBar'
import React from 'react'
import ItemMedia from '../Item/ItemFeed'

const Home : React.FC= () => {
  return (
    <div >
        <SideBar />
        <div className='flex flex-row items-center justify-around p-4'>
          <ItemMedia />
        </div >

    </div>
  )
}

export default Home