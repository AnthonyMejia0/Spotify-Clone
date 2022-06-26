import { useEffect, useState } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import { albumIdState, albumState } from "../atoms/albumAtom";
import spotifyApi from "../lib/spotify";

function useAlbum() {
    const [numSongs, setNumSongs] = useState(Number(0));
    const [playtime, setPlaytime] = useState(Number(0));
    const [owner, setOwner] = useState(null);
    const albumId = useRecoilValue(albumIdState);
    const [album, setAlbum] = useRecoilState(albumState);

    useEffect(() => {
        const fetchAlbumInfo = () => {
            let songCount = 0;
            let runtime = 0;

            setOwner(album?.artists?.[0].name);

            album?.tracks.items.map((track) => {
                songCount += 1;
                runtime += track.duration_ms;
            });

            setNumSongs(songCount);
            setPlaytime(runtime);
        }

        fetchAlbumInfo();
    }, [album]);

    return { owner: owner, songs: numSongs, playtime: playtime };
}

export default useAlbum