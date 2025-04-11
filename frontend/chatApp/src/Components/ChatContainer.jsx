import { useChatStore } from "../Store/useChatStore.js"
import { useEffect,useRef } from "react"
import MessageInput from "./MessageInput.jsx"
import ChatHeader from "./ChatHeader.jsx"
import MessageSkeleton from "./Skeletons/MessageSkeleton.jsx"
import { useAuthStore } from "../Store/useAuthStore.js"
import { formatMessageTime } from "../lib/util.js"

const ChatContainer = () => {
  
  const { messages, selectedUser, isMessagesLoading, getMessages, subscribeToMessage, unSubscribeToMessage } = useChatStore()
  const { authUser } = useAuthStore()
  const messageEndRef = useRef(null)

  useEffect(() => {
    getMessages(selectedUser._id)
    subscribeToMessage() 
    
    //cleanup
    return () => unSubscribeToMessage()

  }, [selectedUser._id, getMessages])

  useEffect(()=> {
    if( messageEndRef.current && messages){
      //for new messages scroll below
      messageEndRef.current.scrollIntoView({ behavior: "smooth"})
    }
  }, [messages])

  // console.log( "Messages", messages)

  if(isMessagesLoading) {
    return (
    <div className="flex-1 flex flex-col overflow-auto">
      <ChatHeader/>
      <MessageSkeleton/>
      <MessageInput/>
    </div>
  )
  }

  return (
    <div className="flex-1 flex flex-col overflow-auto">
      <ChatHeader/>
      <div className="flex-1 overflow-y-auto p-4 space-y-4" >
        {messages.map((message) => (
          <div key={message._id} 
          ref={messageEndRef}
          className={`chat ${message.senderId === selectedUser._id ? "chat-start": "chat-end" }`}>
            <div className="chat-image avatar">
              <div className="size-10 rounded-full border">
                <img 
                src={`${message.senderId === selectedUser._id 
                  ? selectedUser.profilePic || "/avatar.png" 
                  : authUser.profilePic || "/avatar.png" }`} 
                alt="profile pic" />
              </div>
            </div>
              <div className="chat-header mb-1">
                <time className="text-xs opacity-50 ml-1">
                  {formatMessageTime(message.createdAt)}
                </time>
              </div>
              <div className="chat-bubble flex flex-col">
                {message.image && (
                  <img src={message.image} 
                  alt="attachment"
                  className="sm:max-w-[200px] rounded-md mb-2" />
                )}
                {message.text && (<p> {message.text}</p>)}
                </div>    
          </div>
        ))}
      </div>
      
      <MessageInput/>
    </div>
  )
}

export default ChatContainer