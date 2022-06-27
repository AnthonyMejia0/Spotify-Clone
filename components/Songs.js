import { useRecoilValue } from "recoil";
import { playlistState } from "../atoms/playlistAtom";
import Song from "./Song";
import { ClockIcon } from '@heroicons/react/outline';

function Songs() {
  const playlist = useRecoilValue(playlistState);
  
  return (
    <div className="flex flex-col px-8 pb-[14.5rem] md:pb-[10rem] space-y-1 text-white">
      <div className="grid grid-cols-2 text-gray-500 px-5 py-4">
        <div className="flex space-x-4 w-1/2">
          <p>#</p>
          <p>Title</p>
        </div>
        <div className="flex justify-between">
          <p className="opacity-0 md:opacity-100">Album</p>
          <ClockIcon className="h-5 w-5" />
        </div>
      </div>

      <hr className='border-t-[0.1px] border-gray-900'/>

      {playlist?.tracks?.items?.map((track, i) => (
        <Song 
          key={i}
          order={i}
          track={track}
        />
      ))}
    </div>
  )
}

export default Songs