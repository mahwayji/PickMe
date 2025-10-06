import React from 'react'
import RacoonDance from '../images/coolRacoon.gif'

const Loading: React.FC = () => {
  return (
    <div className = "h-[50hv] flex flex-col items-center justify-center">
        <img src ={RacoonDance} alt = "Loading" />
        Loading...
    </div>
  )
}

export default Loading