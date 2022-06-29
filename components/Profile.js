import { ChevronDownIcon } from "@heroicons/react/outline"
import { useSession } from "next-auth/react"

function Profile() {
    const { data: session } = useSession();
  return (
    <div className="w-[12.5rem] absolute flex items-center bg-black space-x-3 opacity-90 hover:opacity-80 cursor-pointer rounded-full p-1 pr-2">
        <img 
            className="rounded-full w-10 h-10" 
            src={session?.user.image} 
            alt="" 
        />
        <h2 className="text-white">{session?.user.name}</h2>
        <ChevronDownIcon className="text-white h-5 w-5"/>
    </div>
  )
}

export default Profile