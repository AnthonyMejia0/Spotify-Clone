import { useRecoilValue } from "recoil";
import { playlistState } from "../atoms/playlistAtom";
import Song from "./Song";

function Songs() {
  const playlist = useRecoilValue(playlistState);
  
  return (
    <div className="flex flex-col px-8 pb-28 space-y-1 text-white">
      {playlist?.tracks?.items.map((track, i) => (
        <Song 
          key={track.track.id}
          order={i}
          track={track}
        />
      ))}
    </div>
  )
}

export default Songs