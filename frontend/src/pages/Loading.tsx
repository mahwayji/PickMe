import React from 'react'
import RacoonDance from '@/images/coolRacoon.gif'

const Loading: React.FC = () => {
  return (
    <div className = "h-[50hv] flex items-center justify-center">
        <img src ={RacoonDance}>Loading</img>
    </div>
  )
}

export default Loading