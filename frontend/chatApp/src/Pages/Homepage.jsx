import { useChatStore } from "../Store/useChatStore.js"
import Sidebar from "../Components/Sidebar.jsx"
import NoChatComponent from "../Components/NoChatComponent.jsx"
import ChatContainer from "../Components/ChatContainer.jsx"

const Homepage = () => {

  const { selectedUser } = useChatStore()

  return (
    <div className="h-screen bg-base-200">
      <div className="flex items-center justify-center px-4 pt-20">
        <div className="bg-base-100 rounded-lg shadow-cl w-full max-w-6xl h-[calc(100vh-8rem)]">
          <div className=" flex h-full rounded-lg overflow-hidden">
              <Sidebar/>
              {!selectedUser ? <NoChatComponent/> : <ChatContainer/>}
          </div>
        </div>
      </div>

    </div>
  )
}

export default Homepage