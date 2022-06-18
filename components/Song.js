import { useEffect } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import useSpotify from "../hooks/useSpotify";
import { millisToMinutesAndSeconds } from "../lib/time";
import { currentTrackIdState, isPlayingState } from "../atoms/songAtom";

function Song({ order, track }) {
    const spotifyApi = useSpotify();
    const [currentTrackId, setCurrentTrackId] = useRecoilState(currentTrackIdState);  
    const [isPlaying, setIsPlaying] = useRecoilState(isPlayingState);

    function getArtists() {
        var list = []; 
        track.track.artists.map((artist) => {
            list.push(artist.name);
        });
        return list.join(", ");
    }
    
    const playSong = () => {
        setCurrentTrackId(track.track.id);
        setIsPlaying(true);

        spotifyApi.play({
            uris: [track.track.uri],
        })
    }
    
    return (
        <div className="grid grid-cols-2 text-gray-500 px-5 py-4 hover:bg-gray-900 rounded-lg cursor-pointer">
            <div className="flex items-center space-x-4" onClick={playSong}>
                <p>{order + 1}</p>
                <img 
                    className="h-10 w-10"
                    src={track?.track.album.images[0].url}
                    alt=""
                />
                <div>
                    <p className="w-52 md:w-36 lg:w-64 text-white truncate">{track.track.name}</p>
                    <p className="w-52 md:w-36 lg:w-64 truncate">{getArtists()}</p>
                </div>
            </div>

            <div className="flex items-center justify-between ml-auto md:ml-0">
                <p className="hidden md:inline">{track.track.album.name}</p>
                <p>{millisToMinutesAndSeconds(track.track.duration_ms)}</p>
            </div>
        </div>
    )
}

export default Song