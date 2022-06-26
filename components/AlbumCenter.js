import { ChevronDownIcon, MenuIcon } from "@heroicons/react/outline";
import { useSession } from "next-auth/react"
import { useEffect, useState } from "react";
import { shuffle } from "lodash";
import { useRecoilState, useRecoilValue } from "recoil";
import useSpotify from "../hooks/useSpotify";
import { convertMsToHM, millisToMinutesAndSeconds, millisToMinutesAndSecondsFormatted } from "../lib/time";
import { albumIdState, albumState } from "../atoms/albumAtom";
import useAlbum from "../hooks/useAlbum";
import AlbumSongs from "./AlbumSongs";

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

function AlbumCenter() {
    const { data: session } = useSession();
    const spotifyApi = useSpotify();
    const albumId = useRecoilValue(albumIdState);
    const albumInfo = useAlbum();
    const [album, setAlbum] = useRecoilState(albumState);
    const [color, setColor] = useState(null);

    useEffect(() => {
      setColor(shuffle(colors).pop());
    }, [albumId])

    useEffect(() => {
        if (spotifyApi) {
            spotifyApi.getAlbum(albumId).then((data) => {
                console.log("DATA >>>", data.body);
                setAlbum(data.body);
            }).catch((err) => console.log("Something went wrong!", err));
        }
    }, [albumId]);
        
  return (
    <div className="flex-grow h-screen overflow-x-hidden overflow-y-scroll scrollbar-hide">
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
        <section className={`flex items-end space-x-7 bg-gradient-to-b to-black ${color} h-80 text-white p-8`}>
            <img className="h-44 w-44 shadow-2xl" src={album?.images?.[0]?.url} alt="" />
            <div>
                <p>ALBUM</p>
                <h1 className="text-2xl md:text-3xl xl:text-5xl font-bold">{album?.name}</h1>
                <p>{`${albumInfo.owner} • ${albumInfo.songs} ${albumInfo.songs > 1 ? `Songs` : `Song`}, ${albumInfo.playtime >= 3600000 ? convertMsToHM(albumInfo.playtime) : millisToMinutesAndSecondsFormatted(albumInfo.playtime)}`}</p>
            </div>
        </section>
        <div>
            <AlbumSongs />
        </div>
    </div>
  )
}

export default AlbumCenter