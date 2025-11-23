import React from 'react'
import loadingImage from '../images/loading.gif'

const Loading: React.FC = () => {
  return (
    <div className = "h-[50hv] flex flex-col items-center justify-center">
        <img src ={loadingImage} alt = "Loading" />
        Loading...
    </div>
  )
}

export default Loading