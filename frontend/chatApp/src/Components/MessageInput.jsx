import {useState, useRef } from 'react'
import { useChatStore } from '../Store/useChatStore.js'
import {X, Image, Send} from "lucide-react"


const MessageInput = () => {
  
  const [text, setText] = useState("")
  const [imagePreview, setImagePreview] = useState(false)
  const fileInputRef = useRef(null)
  const {sendMessages} = useChatStore()

  // console.log("imagePreview", imagePreview)

  //to check for the image
  const handleImageChange = (e) => {
    // console.log("Event in handleImageChange", e);
    const file = e.target.files[0] //selecting the file from the array like object
    if(!file.type.startsWith("image/")){  //file validation for image
      toast.error("Please select an image file")
      return
    }
    const reader = new FileReader() //instance of filereader to read the file

    reader.onloadend= () => { //FIRES when the filkes sends an error or is read
      setImagePreview(reader.result)
    }

    //changing the file to string format and read then file fires an onloaded event
    reader.readAsDataURL(file) 
  }

  const removeImage = () => {
    //set the image state to null and then the ref value to be null if that exists
    setImagePreview(null)
    if(fileInputRef.current) fileInputRef.current.value = ""
  }

  const handleSendMessage = async(e) => {
    e.preventDefault()
    if(!text.trim() && !imagePreview) return

    try{
      await sendMessages({
        text: text.trim(),
        image: imagePreview,
      })
      //clear form
      setText("")
      setImagePreview(null)  
      if(fileInputRef.current) fileInputRef.current.value= ""
    }catch(error){
      console.error("Failed to send message", error)
    }
  }

  return (
    <div className="p-4 w-full">
      {imagePreview && (
        <div className="mb-3 flex items-center gap-2">
          <div className="relative">
            <img
              src={imagePreview}
              alt="Preview"
              className="w-20 h-20 object-cover rounded-lg border border-zinc-700"
            />
            <button
              onClick={removeImage}
              className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-base-300
              flex items-center justify-center"
              type="button"
            >
              <X className="size-3" />
            </button>
          </div>
        </div>)}
        
        <form onSubmit={handleSendMessage} className='flex items-center gap-2'>
          <div className='flex flex-1 gap-2'>
            < input type="text" 
              className='w-full input input-bordered rounded-lg input-sm sm:input-md'
              placeholder='Type a message...'
              value={text}
              onChange={(e) => setText(e.target.value)}
            />
            <input type="file" accept='image/*' 
            className='hidden' 
            ref={fileInputRef}  onChange={(e)=>handleImageChange(e)} />
          </div>
          
        <button type="button"
        className={`hidden sm:flex btn btn-circle 
        ${imagePreview ? "text-emerald-500" : "text-zinc-400"}`} 
        onClick={() => fileInputRef.current?.click()}>
          <Image size={20}/>
        </button>
        <button type='submit' 
        className='btn btn-small btn-circle'
        disabled={ !text.trim() && !imagePreview}>
          <Send size={22}/>
        </button>
        </form>


    </div>  
  
  )      
}

export default MessageInput