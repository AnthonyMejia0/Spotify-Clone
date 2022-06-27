import { useRecoilState } from "recoil"
import { pageState } from "../atoms/pageAtom";
import { playlistIdState } from "../atoms/playlistAtom"

function PlaylistCover({ image, title, owner, songs, id, }) {
  const [playlistId, setPlaylistId] = useRecoilState(playlistIdState);
  const [pageName, setPageName] = useRecoilState(pageState);

  return (
      <div 
        onClick={() => {
          setPlaylistId(id);
          setPageName("Center");
        }}
        className="max-w-[8rem] md:max-w-[10rem] bg-[#181818] hover:bg-zinc-800 p-4 rounded-md text-sm cursor-pointer"
      >
        <img className="h-24 min-w-[6rem] md:h-32 md:min-w-[8rem] mb-2 shadow-2xl shadow-black" src={image} alt="" />
        <p className="font-bold truncate">{title}</p>
        <p>{owner}</p>
        <p>{songs > 1 ? `${songs} Songs` : `${songs} Song`}</p>
      </div>
  )
}

export default PlaylistCover