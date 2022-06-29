import { ChevronDownIcon } from "@heroicons/react/outline";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import { pageState } from "../atoms/pageAtom";
import { playlistIdState } from "../atoms/playlistAtom";
import useSpotify from "../hooks/useSpotify";
import LibraryCover from "./LibraryCover";
import Profile from "./Profile";

function Library() {
  const {data: session} = useSession();
  const spotifyApi = useSpotify();
  const [playlists, setPlaylists] = useState([]);
  const [pageName, setPageName] = useRecoilState(pageState);

  useEffect(() => {
    if (spotifyApi.getAccessToken()) {
      spotifyApi.getUserPlaylists().then((data) => {
        setPlaylists(data.body.items);
      });
    }
  }, [session, spotifyApi]);

  return (
    <div className='flex-grow text-white h-screen w-full overflow-y-scroll scrollbar-hide pb-[10.5rem] md:pb-[6rem]'>
      <header className="relative top-5 right-[13.5rem] float-right">
        <Profile />
      </header>
      <section className="p-8 pt-20 pb-20">
        <h1 className="text-white font-bold text-[2rem] mb-5">Your Library</h1>
        <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-y-8 gap-x-4">
          {playlists.map((playlist, i) => (
            <LibraryCover
              key={i}
              image={playlist?.images?.[0].url}
              title={playlist?.name}
              owner={playlist?.owner?.display_name}
              songs={playlist?.tracks?.total}
              id={playlist?.id}
            />
          ))}
        </div>
      </section>
    </div>
  )
}

export default Library