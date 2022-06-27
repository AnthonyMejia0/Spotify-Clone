import { ChevronDownIcon } from "@heroicons/react/outline";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import useSpotify from "../hooks/useSpotify";
import AlbumCover from "./AlbumCover";
import PlaylistCover from "./PlaylistCover";

function HomePage() {
  const { data: session } = useSession();
  const spotifyApi = useSpotify();
  const [playlists, setPlaylists] = useState([]);
  const [newReleases, setNewReleases] = useState([]);

  useEffect(() => {
    spotifyApi.getFeaturedPlaylists({ limit: 10, country: "US" }).then((data) => {
      setPlaylists(data.body.playlists.items);
    }).catch(err => (err));

    spotifyApi.getNewReleases({ limit: 10, country: "US" }).then((data) => {
      setNewReleases(data.body.albums.items);
    }).catch(err => (err));
  }, [session])

  return (
    <div className="flex-grow h-[calc(100vh-10.5rem)] md:h-[calc(100vh-4.5rem)] overflow-x-hidden overflow-y-scroll scrollbar-hide">
      <header className="relative top-5 right-[13.5rem] float-right">
            <div className="w-[12.5rem] absolute flex items-center bg-black space-x-3 opacity-90 hover:opacity-80 cursor-pointer rounded-full p-1 pr-2">
                <img 
                    className="rounded-full w-10 h-10" 
                    src={session?.user.image} 
                    alt="" 
                />
                <h2 className="text-white">{session?.user.name}</h2>
                <ChevronDownIcon className="text-white h-5 w-5"/>
            </div>
        </header>
        <section className={"overflow-x-hidden bg-black text-white pt-20 pl-8"}>
          <div className="mb-8">
            <h1 className="text-white font-bold text-[2rem] mb-5">Featured Playlists</h1>
            <div className="flex overflow-x-scroll scrollbar-hide space-x-4 after:mr-8">
                {playlists.map((playlist, i) => (
                  <PlaylistCover 
                    key={i}
                    image={playlist?.images?.[0].url}
                    title={playlist?.name}
                    owner={playlist?.owner?.display_name}
                    songs={playlist?.tracks?.total}
                    id={playlist?.id}
                  />
                ))}
            </div>
          </div>

          <div className="pb-20">
            <h1 className="text-white font-bold text-[2rem] mb-5">New Releases</h1>
            <div className="flex overflow-x-scroll scrollbar-hide space-x-4 after:mr-8">
                {newReleases.map((album, i) => (
                  <AlbumCover 
                    key={i}
                    image={album?.images?.[0].url}
                    title={album?.name}
                    owner={album?.artists?.[0].name}
                    songs={album?.total_tracks}
                    id={album?.id}
                  />
                ))}
            </div>
          </div>
        </section>
    </div>
  )
}

export default HomePage