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
        className="max-w-[11.5rem] md:max-w-[14rem] p-3 md:p-4 rounded-md cursor-pointer hover:bg-slate-800"
      >
        <img className="h-40 min-w-[10rem] md:h-48 md:min-w-[12rem] mb-2" src={image} alt={`${title}`} />
        <p className="text-lg font-bold truncate text-center">{title}</p>
        <p className="text-center truncate">{`By ${owner}`}</p>
      </div>
  )
}

export default LibraryCover