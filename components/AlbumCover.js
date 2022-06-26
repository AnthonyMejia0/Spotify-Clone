import { useRecoilState } from "recoil"
import { pageState } from "../atoms/pageAtom";
import { albumIdState } from "../atoms/albumAtom";

function AlbumCover({ image, title, owner, songs, id }) {
  const [albumId, setAlbumId] = useRecoilState(albumIdState);
  const [pageName, setPageName] = useRecoilState(pageState);

  return (
      <div 
        onClick={() => {
          setAlbumId(id);
          setPageName("Album Center");
        }}
        className="max-w-[8rem] md:max-w-[10rem] bg-[#181818] hover:bg-zinc-800 p-4 rounded-md text-sm cursor-pointer"
      >
        <img className="h-24 min-w-[6rem] md:h-32 md:min-w-[8rem] mb-2" src={image} alt="" />
        <p className="font-bold truncate">{title}</p>
        <p>{owner}</p>
        <p>{songs > 1 ? `${songs} Songs` : `${songs} Song`}</p>
      </div>
  )
}

export default AlbumCover