import { create } from "zustand";
import toast from "react-hot-toast";
import { axiosInstance } from "../lib/axios.js";
import { useAuthStore } from "./useAuthStore.js";

export const useChatStore = create((set, get)=> ({
    messages: [],
    users: [],
    selectedUser: null,
    isUsersLoading: false,
    isMessagesLoading: false,

    getUsers: async () => {
        set({isUsersLoading: true})
        try {
            const res = await axiosInstance.get("/message/users")
            // console.log("responce data in getUsers: ", res.data)
            set({users: res.data})  
        } catch (error) {
            console.log("error in useChatStore getUsers:", error)
            toast.error(error.response.data.messages)
        }finally{
            set({isUsersLoading: false})
        }
    },

    getMessages: async (userId) => {
        set({isMessagesLoading: true})
        try {
            const res = await axiosInstance.get(`/message/${userId}`)
            set({messages: res.data})
        } catch (error) {
            console.log("error in useChatStore getMessage:", error)
            toast.error(error.response.data.messages)    
        }finally{
            set({isMessagesLoading: false})
        }
    },

    sendMessages: async (messageData) => {
        const {selectedUser, messages} = get()
        try {
            // console.log("UseChat Store", selectedUser)
            // console.log(messageData)
            const res = await axiosInstance.post(`/message/send/${selectedUser._id}`, messageData)
            set({messages: [...messages, res.data] })
        } catch (error) {
            console.log("error in UseChatStore Sending Message:", error)
            toast.error(error.response.data.messages)
        }

    },

    subscribeToMessage: () => {
        //we want to take the message emitted from the backend and store it in front end
        const { selectedUser } = get()
        if(!selectedUser) return
        //get the messages emitted from backend
        const socket = useAuthStore.getState().socket

        socket.on("newMessage", (newMessage)=> {
            set({ messages: [...messages, newMessage]})
        })

    },

    unSubscribeToMessage: () => {
        const socket = useAuthStore.getState().socket
        socket.off("newMessage")
    },

    setSelectedUser: (selectedUser) => {
        set({selectedUser})
    }
})) 