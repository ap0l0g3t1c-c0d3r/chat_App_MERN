import { useAuthStore} from "../Store/useAuthStore.js"
import  {MessageSquare, Settings, User, LogOut}  from "lucide-react"
import { Link } from "react-router-dom"

const Navbar = () => {

  const { logout, authUser } = useAuthStore()

  return (
    <header className="bg-base-100 border-b border-base-300 fixed w-full top-0 z-40
    background-blur-lg bg-base-100/80">
      <div className="container mx-auto px-4 h-16">
        <div className="flex items-center justify-between h-full">
          <div className="flex items-center gap-8">
              {/*linking the logo to homepage*/}
            <Link to="/" className="flex items-center gap-2.5 hover:opacity-80 transition-all">
              <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center">
              <MessageSquare className="w-5 h-5 text-primary"/>
              </div>
              <h1 className="text-lg font-bold">Chatty</h1>
             </Link>
              <div className="flex items-center gap-2">
                <Link to="/settings" className={`btn btn-sm gap-2 transition-colors`}>
                  <Settings className="w-4 h-4"/>
                  <span className="hidden sm:inline" >Settings</span>
                </Link>
              </div>
              {/* to only show logout and Profile option when the user is logeed in */}
              { authUser && (
                <>
                  <Link to="/profile" className={`btn btn-small gap-2`}>
                    <User className="size-5"/>
                      <span className="hidden sm:inline" >Profile</span>
                  </Link>

                  <button className="flex gap-2 items-center" onClick={logout}> 
                    <LogOut className="size-5"/>
                    <span className="hidden sm:inline">Logout</span>
                  </button>
                </>
              )
              }
           </div>
        </div>
      </div>
    </header>
  )
}

export default Navbar