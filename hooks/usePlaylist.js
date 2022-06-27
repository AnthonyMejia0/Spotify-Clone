import { useEffect, useState } from "react";
import { useRecoilValue } from "recoil";
import { playlistState } from "../atoms/playlistAtom";

function usePlaylist() {
    const [numSongs, setNumSongs] = useState(Number(0));
    const [playtime, setPlaytime] = useState(Number(0));
    const [owner, setOwner] = useState(null);
    const playlist = useRecoilValue(playlistState);

    useEffect(() => {
        const fetchPlaylistInfo = () => {
            let songCount = 0;
            let runtime = 0;
            setOwner(playlist?.owner?.display_name);
            playlist?.tracks?.items?.map((track) => {
                if (track) {
                    songCount += 1;
                    runtime += track?.track?.duration_ms;
                }
            });
            setNumSongs(songCount);
            setPlaytime(runtime);
        }

        fetchPlaylistInfo();
    }, [playlist]);

    return { owner: owner, songs: numSongs, playtime: playtime };
}

export default usePlaylist