import { useRecoilState } from "recoil"
import { pageState } from "../atoms/pageAtom";
import { playlistIdState } from "../atoms/playlistAtom"

function LibraryCover({ image, title, owner, songs, id, }) {
  const [playlistId, setPlaylistId] = useRecoilState(playlistIdState);
  const [pageName, setPageName] = useRecoilState(pageState);

  return (
      <div 
        onClick={() => {
          setPlaylistId(id);
          setPageName("Center");
        }}
        className="max-w-[10rem] md:max-w-[13rem] bg-[#181818] hover:bg-zinc-800 p-4 rounded-md text-sm cursor-pointer"
      >
        <img className="h-32 min-w-[8rem] md:h-44 md:min-w-[11rem] mb-2 shadow-2xl shadow-black" src={image} alt={`${title}`} />
        <p className="font-bold truncate">{title}</p>
        <p>{`By ${owner}`}</p>
      </div>
  )
}

export default LibraryCover