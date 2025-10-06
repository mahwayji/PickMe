import SideBar from '@/components/utils/SideBar'
import { ThemeToggle } from '@/components/utils/ThemeTogglebutton'
import React from 'react'

const Home : React.FC= () => {
  return (
    <div>
      <div>
        <SideBar />
        Home
        <ThemeToggle />
      </div>
    </div>
  )
}

export default Home