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
        className="max-w-[12rem] md:max-w-[13rem] p-4 rounded-md cursor-pointer hover:bg-slate-800"
      >
        <img className="h-40 min-w-[10rem] md:h-44 md:min-w-[11rem] mb-2" src={image} alt="" />
        <p className="text-md font-bold truncate text-center">{title}</p>
        <p className="text-sm text-center truncate">{owner}</p>
      </div>
  )
}

export default PlaylistCover