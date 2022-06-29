import { ChevronDownIcon, MenuIcon } from "@heroicons/react/outline";
import { useSession } from "next-auth/react"
import { useEffect, useState } from "react";
import { set, shuffle } from "lodash";
import { useRecoilState, useRecoilValue } from "recoil";
import { playlistIdState, playlistState } from "../atoms/playlistAtom";
import useSpotify from "../hooks/useSpotify";
import Songs from "./Songs";
import { convertMsToHM } from "../lib/time";
import usePlaylist from "../hooks/usePlaylist";
import Profile from "./Profile";

const colors = [
    "from-indigo-500",
    "from-blue-500",
    "from-green-500",
    "from-red-500",
    "from-yellow-500",
    "from-pink-500",
    "from-purple-500",
    "from-orange-500"
];

function Center() {
    const { data: session } = useSession();
    const spotifyApi = useSpotify();
    const [color, setColor] = useState(null);
    const playlistId = useRecoilValue(playlistIdState);
    const [playlist, setPlaylist] = useRecoilState(playlistState);
    const playlistInfo = usePlaylist();

    useEffect(() => {
      setColor(shuffle(colors).pop());
    }, [playlistId])

    useEffect(() => {
      spotifyApi.getPlaylist(playlistId).then((data) => {
        setPlaylist(data.body);
      }).catch((err) => console.log("Something went wrong!", err));
    }, [playlistId]);
        
  return (
    <div className="flex-grow h-screen overflow-x-hidden overflow-y-scroll scrollbar-hide">
        <header className="relative top-5 right-[13.5rem] float-right">
            <Profile />
        </header>
        <section className={`flex items-end space-x-7 bg-gradient-to-b to-black ${color} h-80 text-white p-8`}>
            <img className="h-44 w-44 shadow-2xl shadow-black" src={playlist?.images?.[0]?.url} alt="" />
            <div>
                <p>PLAYLIST</p>
                <h1 className="text-2xl md:text-3xl xl:text-5xl font-bold">{playlist?.name}</h1>
                <p>{`${playlistInfo.owner} • ${playlistInfo.songs} songs, ${convertMsToHM(playlistInfo.playtime)}`}</p>
            </div>
        </section>
        <div>
            <Songs />
        </div>
    </div>
  )
}

export default Center