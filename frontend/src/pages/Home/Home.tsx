import SideBar from '@/components/utils/SideBar'
import { ThemeToggle } from '@/components/utils/ThemeTogglebutton'
import React from 'react'
import { Cookies } from 'react-cookie'
import { ACCESS_TOKEN } from '@/constants/cookie'
import { Accessibility } from 'lucide-react'


const Home : React.FC= () => {

  /* //Test token expiration
  const cookie = new Cookies();
  const token = cookie.get(ACCESS_TOKEN);

  if (token) {
  const [, payloadBase64] = token.split(".");
  const decoded = JSON.parse(atob(payloadBase64));
  const exp = decoded.exp * 1000; // convert to ms
  const now = Date.now();

  console.log("Token expires at:", new Date(exp).toLocaleString());
  console.log("Expired?", now > exp);
  }
  */
 
  return (
    <div>
        <SideBar />
        Home
        <ThemeToggle />
    </div>
  )
}

export default Home