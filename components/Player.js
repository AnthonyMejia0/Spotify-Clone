import { SwitchHorizontalIcon, FastForwardIcon, ReplyIcon, RewindIcon, PlayIcon, PauseIcon, VolumeUpIcon, VolumeOffIcon } from "@heroicons/react/solid";
import { debounce } from "lodash";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useCallback, useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import { currentTrackIdState, isPlayingState } from "../atoms/songAtom";
import useSongInfo from "../hooks/useSongInfo";
import useSpotify from "../hooks/useSpotify";


function Player() {
    const { data: session, status } = useSession();
    const spotifyApi = useSpotify();
    const [currentTrackId, setCurrentTrackId] = useRecoilState(currentTrackIdState);
    const [isPlaying, setIsPlaying] = useRecoilState(isPlayingState);
    const [volume, setVolume] = useState(100);
    const [isShuffle, setIsShuffle] = useState(false);
    const [isRepeat, setIsRepeat] = useState(false);
    const songInfo = useSongInfo();
    const router = useRouter();

    function delay(time) {
        return new Promise(resolve => setTimeout(resolve, time));
    }

    const fetchCurrentSong = () => {
        if (!songInfo) {
            spotifyApi.getMyCurrentPlayingTrack().then((data) => {
                console.log("Now Playing: ", data.body?.item);
                setCurrentTrackId(data.body?.item?.id);

                spotifyApi.getMyCurrentPlaybackState().then((data) => {
                    setIsPlaying(data.body?.is_playing);
                    setIsShuffle(data.body?.shuffle_state);
                    if (data.body?.repeat_state === "off") {
                        setIsRepeat(false);
                    }
                    else {
                        setIsRepeat(true);
                    }
                });
            });
        }
    };

    const handleShuffle = () => {
        spotifyApi.getMyCurrentPlaybackState().then((data) => {
            if (data.body.shuffle_state) {
                spotifyApi.setShuffle(false);
                setIsShuffle(false);
            }
            else {
                spotifyApi.setShuffle(true);
                setIsShuffle(true);
            }
        });
    };

    const handlePlayPause = () => {
        spotifyApi.getMyCurrentPlaybackState().then((data) => {
            if (data.body.is_playing) {
                spotifyApi.pause();
                setIsPlaying(false);
            }
            else {
                spotifyApi.play();
                setIsPlaying(true);
            }
        });
    };

    const handleRepeat = () => {
        spotifyApi.getMyCurrentPlaybackState().then((data) => {
            if (data.body.repeat_state === "track" || data.body.repeat_state === "context") {
                spotifyApi.setRepeat("off");
                setIsRepeat(false);
            }
            else {
                spotifyApi.setRepeat("context");
                setIsRepeat(true);
            }
        });
    };

    const getArtists = () => {
        var list = []; 
        songInfo?.artists?.map((artist) => {
            list.push(artist.name);
        });
        return list.join(", ");
    }

    useEffect(() => {
        if (spotifyApi.getAccessToken() && !currentTrackId) {
            fetchCurrentSong();
            setVolume(100);
        }
    }, [currentTrackIdState, spotifyApi, session]);
    
    useEffect(() => {
        if (volume > 0 && volume < 100) {
            debouncedAdjustVolume(volume);
        }
    }, [volume]);

    const debouncedAdjustVolume = useCallback(
        debounce((volume) => {
            spotifyApi.setVolume(volume).catch((err) => {});
        }, 500),
        []
    );

    return (
        <div className="h-24 bg-gradient-to-b from-black to-gray-900 text-white grid grid-cols-2 md:grid-cols-3 text-xs md:text-base px-2 md:px-8">
            {/* Left */}
            <div className="flex items-center space-x-4">
                <img 
                    className="hidden md:inline h-10 w-10"
                    src={songInfo?.album.images?.[0].url} 
                    alt="" 
                />
                <div className="overflow-x-hidden">
                    <h3 className="text-blue-500 truncate">{songInfo?.name}</h3>
                    <p className="text-gray-500 truncate">{getArtists()}</p>
                </div>
            </div>

            {/* Middle */}
            <div className="flex items-center justify-around md:justify-evenly text-gray-500">
                <SwitchHorizontalIcon onClick={handleShuffle} className={`bigButton md:button ${isShuffle ? 'text-[#1DB954]' : 'text-gray-500'}`} />
                <RewindIcon 
                    onClick={() => {
                        spotifyApi.skipToPrevious();
                        delay(3000).then(() => {
                            let nextTrack = spotifyApi.getMyCurrentPlayingTrack();
                            nextTrack.then((data) => {
                                setCurrentTrackId(data?.body?.item.id);
                            });
                        });
                    }} 
                    className="bigButton md:button" />
                
                {isPlaying ? (
                    <PauseIcon
                        onClick={handlePlayPause}
                        className="button w-10 h-10 text-white"
                    />
                ) : (
                    <PlayIcon
                        onClick={handlePlayPause}
                        className="button w-10 h-10 text-white"
                    />
                )}

                <FastForwardIcon onClick={() => {
                    spotifyApi.skipToNext();
                    delay(3000).then(() => {
                        let nextTrack = spotifyApi.getMyCurrentPlayingTrack();
                        nextTrack.then((data) => {
                            setCurrentTrackId(data?.body?.item.id);
                        });
                    });
                }} className="bigButton md:button" />
                <ReplyIcon onClick={handleRepeat} className={`button ${isRepeat ? 'text-[#1DB954]' : 'text-gray-500'}`} />
            </div>

            {/* Right */}
            <div className="hidden md:flex items-center space-x-3 md:space-x-4 justify-end pr-5">
                <VolumeUpIcon 
                    onClick={() => volume < 100 && setVolume(volume + 10)}
                    className="button h-5 w-5 hidden md:inline" 
                />
                <input
                    className="w-14 md:w-28" 
                    type="range" 
                    value={volume} 
                    onChange={e => setVolume(Number(e.target.value))}
                    min={0} 
                    max={100} 
                />
            </div>
        </div>
    );
}

export default Player