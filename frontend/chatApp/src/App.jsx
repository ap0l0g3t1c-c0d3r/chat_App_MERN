import Navbar from "./Components/Navbar.jsx"
import { Routes, Route, Navigate } from "react-router-dom"
import SignupPage from "./Pages/SignupPage.jsx"
import Homepage from "./Pages/Homepage.jsx"
import LoginPage from "./Pages/LoginPage.jsx"
import SettingPage from "./Pages/SettingPage.jsx"
import ProfilePage from "./Pages/Profilepage.jsx"

import { Loader } from "lucide-react"
import { Toaster } from "react-hot-toast"

import { useThemeStore } from "./Store/useThemeStore.js"
import { useAuthStore } from "./Store/useAuthStore.js"
import { useEffect } from "react"


const App = () => {
  
  const { authUser, checkAuth, isCheckingAuth } = useAuthStore()
  const { theme } = useThemeStore()

  //when component loads run this
  useEffect(()=>{
    checkAuth()
  }, [checkAuth])
  
  useEffect(() => {
    if (theme) {
      document.documentElement.setAttribute("data-theme", theme);
    }
  }, [theme])

  console.log({authUser})

  if(isCheckingAuth && !authUser){
    return (<div className="flex items-center justify-center h-screen">
      <Loader className="size-10 animate-spin" />
    </div>)
  }

  //if user is authenticated take them to homepage else to login page
  // if user is logged in they shouldnt be abl;e to see signup or login page and should go to home page
  return (
    <div data-theme={theme}>
      <Navbar/>
      
      <Routes> 
        <Route path="/" element={ authUser ? <Homepage/> : <Navigate to="/login" />} />  
        <Route path="/signup" element={ !authUser ? <SignupPage/>: <Navigate to="/"/> } />
        <Route path="/login" element={ !authUser ? <LoginPage/>: <Navigate to="/"/> } />
        <Route path="/settings" element={<SettingPage/>} />
        <Route path="/profile"  element={ authUser ? <ProfilePage/> : <Navigate to="/login" />}/>
      </Routes>

      <Toaster/>
    </div>
  )
}

export default App