import { useState } from "react"
import { useAuthStore } from "../Store/useAuthStore.js"
import { Camera, User, Mail } from "lucide-react"

const ProfilePage = () => {

  const { isUpdatingProfile, updateProfileLogic, authUser } = useAuthStore() 
  const [selectedImage, setSelectedImage] = useState(null)

  const handleImage = async (e) => {
    const file = e.target.files[0]  //select the first file out of all the selected files
    console.log("Event target files: ,", e.target.files )

    if(!file) return; 

    //read the file and change into base 64
    const reader = new FileReader()
    reader.readAsDataURL(file)

    //onload event handler
    reader.onload = async() => {
      const base64Image = reader.result
      setSelectedImage(base64Image)
      await updateProfileLogic({ profilePic: base64Image })
    }
  }

  return (
    <div className="h-screen pt-20">
      <div className="max-w-2xl mx-auto p-4 py-8">
        <div className="bg-base-300 rounded-xl p-6 space-y-8">
          <div className="text-center">
            <h1 className="text-2xl font-semibold">Profile</h1>
            <p className="mt-2">Your profile information </p>
          </div>

          {/** Avatar upload Section */}

          <div className="flex flex-col items-center gap-4">
            <div className="relative">
              {/** Show the selected image if not selected show the image from the Db or show the default avatar image */}
              <img src={  selectedImage || authUser.profilePic || "/avatar.png"} alt="Profile" 
              className="size-32 rounded-full object-cover border-4" />
              <label htmlFor="avatarUpload"
              className={`absolute bottom-0 right-0 bg-base-content
                 hover:scale-105 p-2 rounded-full cursor-pointer 
                 transition-all duration-200 
                 ${isUpdatingProfile ? "animate-pulse pointer-events-none" : ""}`}
              >
              <Camera className="w-5 h-5 text-base-200"/>
              <input type="file"
                  id="avatarUpload" className="hidden"
                  accept="image/*" onChange={handleImage} 
                  disabled={isUpdatingProfile} />
              </label>
            </div>
                <p className="text-sm text-zinc-400">
                  {isUpdatingProfile ? "Uploading..." : "Click on the image icon to update your profile"}
                  </p>  
          </div>
           {/** User Info */}
           <div className="space-y-6">
                <div className="space-y-1.5">
                  <div className="text-sm text-zinc-400 flex items-center gap-2">
                    <User className="w-4 h-4"/>
                    Full Name
                  </div>
                  <p className="px-4 py-2.5 bg-base-200 rounded-lg border">{ authUser?.fullName}</p>
                </div>

                <div className="space-y-1.5">
                  <div className="text-sm text-zinc-400 flex items-center gap-2">
                    <Mail className="w-4 h-4"/>
                    Email
                  </div>
                  <p className="px-4 py-2.5 bg-base-200 rounded-lg border">{ authUser?.email}</p>
                </div>

                <div className="mt-6 bg-base-300 rounded-xl p-6">
                  <h2 className="text-lg font-medium mb-4"> Account Information</h2>
                  <div className="space-y-3 text-sm">
                    <div className="flex items-center justify-between py-2 border-b border-zinc-700">
                      <span>Member Since</span>
                      <span>{authUser.createdAt?.split("T")[0]}</span>
                    </div>
                    <div className="flex items-center justify-between py-2">
                      <span>Account Status</span>
                      <span className="text-green-500">Active</span>
                    </div>
                  </div>
                </div>
           </div>
        </div>
      </div>
    </div>
  )
}

export default ProfilePage