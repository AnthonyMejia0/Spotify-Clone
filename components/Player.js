import { SwitchHorizontalIcon, FastForwardIcon, ReplyIcon, RewindIcon, PlayIcon, PauseIcon, VolumeUpIcon, VolumeOffIcon } from "@heroicons/react/solid";
import RepeatIcon from '@mui/icons-material/Repeat';
import RepeatOneIcon from '@mui/icons-material/RepeatOne';
import Slider from '@mui/material/Slider';
import { debounce, max, set } from "lodash";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useCallback, useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import { currentTrackIdState, isPlayingState } from "../atoms/songAtom";
import useSongInfo from "../hooks/useSongInfo";
import useSpotify from "../hooks/useSpotify";
import { millisToMinutesAndSeconds } from "../lib/time";


function Player() {
    const { data: session, status } = useSession();
    const spotifyApi = useSpotify();
    const [currentTrackId, setCurrentTrackId] = useRecoilState(currentTrackIdState);
    const [isPlaying, setIsPlaying] = useRecoilState(isPlayingState);
    const [volume, setVolume] = useState(100);
    const [seek, setSeek] = useState(Number(0));
    const [timer, setTimer] = useState(Number(0));
    const [isDragging, setIsDragging] = useState(false);
    const [isShuffle, setIsShuffle] = useState(false);
    const [isRepeat, setIsRepeat] = useState("off");
    const songInfo = useSongInfo();

    function delay(time) {
        return new Promise(resolve => setTimeout(resolve, time));
    }

    function add1() {
        if (isPlaying) {
            setTimer(timer + 1);
        }
    }

    const fetchCurrentSong = () => {
        if (!songInfo) {
            spotifyApi.getMyCurrentPlayingTrack().then((data) => {
                setCurrentTrackId(data.body?.item?.id);

                spotifyApi.getMyCurrentPlaybackState().then((data) => {
                    setIsPlaying(data.body?.is_playing);
                    setIsShuffle(data.body?.shuffle_state);
                    if (data.body?.repeat_state === "off") {
                        setIsRepeat("off");
                    }
                    else if (data.body?.repeat_state === "context") {
                        setIsRepeat("context");
                    }
                    else {
                        setIsRepeat("track");
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
            if (data.body.repeat_state === "track") {
                spotifyApi.setRepeat("off");
                setIsRepeat("off");
            }
            else if (data.body.repeat_state === "context") {
                spotifyApi.setRepeat("track");
                setIsRepeat("track");
            }
            else {
                spotifyApi.setRepeat("context");
                setIsRepeat("context");
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
        setTimeout(() => {
            spotifyApi.getMyCurrentPlayingTrack().then((data) => {
                if (!isDragging) {
                    setSeek(data.body.progress_ms);
                    add1();
                    if (data.body.item.name && data.body.item.name != songInfo.name) {
                        setCurrentTrackId(data?.body?.item.id);
                    }
                }
            }).catch((err) => {err});
        }, 1000);
    }, [timer, isPlaying])
    
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

    const debouncedSeek = useCallback(
        debounce((seek) => {
            spotifyApi.seek(seek).catch((err) => {});
        }, 500),
        []
    );

    return (
        <div className="absolute bottom-[4.5rem] md:bottom-0 h-24 w-full bg-gradient-to-b from-black to-gray-900 text-white grid grid-cols-2 md:grid-cols-3 text-xs md:text-base px-2 md:px-8">
            {/* Left */}
            <div className="flex items-center space-x-4">
                <img 
                    className="hidden md:inline h-10 w-10"
                    src={songInfo?.album?.images?.[0].url} 
                    alt="" 
                />
                <div className="overflow-x-hidden">
                    <h3 className="text-blue-500 truncate">{songInfo?.name}</h3>
                    <p className="text-gray-500 truncate pr-2">{getArtists()}</p>
                </div>
            </div>

            {/* Middle */}
            <div className="flex flex-col justify-center">
                <div className="flex items-center justify-around md:justify-evenly text-gray-500">
                    <SwitchHorizontalIcon onClick={handleShuffle} className={`bigButton md:button ${isShuffle ? 'text-[#1DB954]' : 'text-gray-500'}`} />
                    <RewindIcon 
                        onClick={() => {
                            spotifyApi.skipToPrevious();
                            delay(2500).then(() => {
                                let nextTrack = spotifyApi.getMyCurrentPlayingTrack();
                                nextTrack.then((data) => {
                                    setCurrentTrackId(data?.body?.item.id);
                                });
                            });
                        }} 
                        className="bigButton md:button" 
                    />
                    
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

                    <FastForwardIcon 
                        onClick={() => {
                            spotifyApi.skipToNext();
                            delay(2500).then(() => {
                                let nextTrack = spotifyApi.getMyCurrentPlayingTrack();
                                nextTrack.then((data) => {
                                    setCurrentTrackId(data?.body?.item.id);
                                });
                            });
                        }} 
                        className="bigButton md:button"
                    />

                    {isRepeat === "off" ? (
                        <RepeatIcon onClick={handleRepeat} className="button text-gray-500"/>
                    ) : (
                        isRepeat === "context" ? (
                            <RepeatIcon onClick={handleRepeat} className="button text-[#1DB954]" />
                        ) : (
                            <RepeatOneIcon onClick={handleRepeat} className="button text-[#1DB954]" />
                        )
                    )}
                </div>
                <div className="flex space-x-2 items-center">
                    <p className="text-white">{millisToMinutesAndSeconds(seek)}</p>
                    <Slider 
                        aria-label="time-indicator"
                        size="small"
                        value={seek}
                        min={0}
                        step={1}
                        max={songInfo?.duration_ms}
                        onChange={(_, value) => {
                            setIsDragging(true);
                            setSeek(Number(value));
                        }}
                        onChangeCommitted={(_, value) => {
                            spotifyApi.seek(seek).catch((err) => {});
                            setIsDragging(false);
                            setTimer(timer+1);
                        }}
                        sx={{
                            color:'white',
                            height: 4,
                            '&:hover': {
                                color: '#1DB954',
                            },
                            '& .MuiSlider-thumb': {
                              width: 0,
                              height: 0,
                              transition: '0.3s cubic-bezier(.47,1.64,.41,.8)',
                              '&:hover, &.Mui-focusVisible': {
                                width: 15,
                                height: 15,
                                color: 'white',
                              },
                            },
                            '& .MuiSlider-rail': {
                              color: 'white',
                              opacity: 0.28,
                            },
                          }}
                    />
                    <p className="text-white">{millisToMinutesAndSeconds(songInfo?.duration_ms)}</p>
                </div>
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