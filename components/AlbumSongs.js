import { useRecoilValue } from "recoil";
import { ClockIcon } from '@heroicons/react/outline';
import AlbumSong from "./AlbumSong";
import { albumState } from "../atoms/albumAtom";

function AlbumSongs() {
  const album = useRecoilValue(albumState);
  
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

      {album?.tracks.items.map((track, i) => (
        <AlbumSong 
          key={track.id}
          order={i}
          track={track}
        />
      ))}
    </div>
  )
}

export default AlbumSongs