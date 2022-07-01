import { useRecoilState } from "recoil";
import useSpotify from "../../hooks/useSpotify";
import { millisToMinutesAndSeconds } from "../../lib/time";
import { currentTrackIdState, isPlayingState } from "../../atoms/songAtom";
import ExplicitIcon from '@mui/icons-material/Explicit';

function SongCover({ order, track }) {
    const spotifyApi = useSpotify();
    const [currentTrackId, setCurrentTrackId] = useRecoilState(currentTrackIdState);  
    const [isPlaying, setIsPlaying] = useRecoilState(isPlayingState);

    function getArtists() {
        var list = []; 
        track?.artists.map((artist) => {
            list.push(artist.name);
        });
        return list.join(", ");
    }
    
    const playSong = () => {
        setCurrentTrackId(track?.id);
        setIsPlaying(true);

        spotifyApi.play({
            uris: [track?.uri],
        });
    }
    
    return (
        <div className="grid grid-cols-2 text-gray-500 px-5 py-4 hover:bg-gray-900 rounded-lg cursor-pointer">
            <div className="flex items-center space-x-4" onClick={playSong}>
                <p className="text-white">{order}</p>
                <img 
                    className="h-10 w-10"
                    src={track?.album?.images?.[0].url}
                    alt=""
                />
                <div className="w-44 md:w-36 lg:w-64 xl:w-4/6 2xl:w-5/6">
                    <p className="text-white truncate">{track?.name}</p>
                    {
                    track?.explicit ? 
                        <div className="flex items-center space-x-1">
                            <ExplicitIcon className="h-5 w-5 text-gray-500" />
                            <p className="truncate">{getArtists()}</p>
                        </div> :
                        <p className="truncate">{getArtists()}</p>
                    }
                </div>
            </div>

            <div className="flex items-center justify-between ml-auto md:ml-0">
                <p className="hidden md:inline pr-2">{track?.album?.name}</p>
                <p className="text-white">{millisToMinutesAndSeconds(track?.duration_ms)}</p>
            </div>
        </div>
    )
}

export default SongCover