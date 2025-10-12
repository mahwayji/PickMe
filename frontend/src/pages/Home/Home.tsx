import SideBar from '@/components/utils/SideBar'
import { ThemeToggle } from '@/components/utils/ThemeTogglebutton'
import React from 'react'

const Home : React.FC= () => {

  return (
    <div>
        <SideBar />
        Home
        <ThemeToggle />
    </div>
  )
}

export default Home