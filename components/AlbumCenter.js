import { useSession } from "next-auth/react"
import { useEffect, useState } from "react";
import { shuffle } from "lodash";
import { useRecoilState, useRecoilValue } from "recoil";
import useSpotify from "../hooks/useSpotify";
import { convertMsToHM, millisToMinutesAndSecondsFormatted } from "../lib/time";
import { albumIdState, albumState } from "../atoms/albumAtom";
import useAlbum from "../hooks/useAlbum";
import AlbumSongs from "./AlbumSongs";
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

function AlbumCenter() {
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
                setAlbum(data.body);
            }).catch((err) => console.log("Something went wrong!", err));
        }
    }, [albumId]);
        
  return (
    <div className="flex-grow h-screen overflow-x-hidden overflow-y-scroll scrollbar-hide">
        <header className="relative top-5 right-[13.5rem] float-right">
            <Profile />
        </header>
        <section className={`flex items-end space-x-7 bg-gradient-to-b to-black ${color} h-80 text-white p-8`}>
            <img className="h-44 w-44 shadow-2xl shadow-black" src={album?.images?.[0]?.url} alt="" />
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