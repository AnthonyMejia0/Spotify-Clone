import { useEffect, useState } from "react";
import { useRecoilValue } from "recoil";
import useSpotify from "../hooks/useSpotify";
import { artistIdState, artistState } from "../atoms/artistAtom";
import SongCover from "./covers/SongCover";
import AlbumCover from "./covers/AlbumCover";
import PlaylistCover from "./covers/PlaylistCover";
import Artist from "./search/Artist";

function ArtistCenter() {
    const spotifyApi = useSpotify();
    const artistId = useRecoilValue(artistIdState);
    const artistName = useRecoilValue(artistState);
    const [artist, setArtist] = useState(null);
    const [albums, setAlbums] = useState([]);
    const [playlists, setPlaylists] = useState([]);
    const [songs, setSongs] = useState([]);
    const [related, setRelated] = useState([]);

    useEffect(() => {
        if (spotifyApi) {
            spotifyApi.getArtist(artistId).then((data) => {
                setArtist(data.body);
            }).catch((err) => console.log("Error fetching artist.", err));

            spotifyApi.getArtistTopTracks(artistId, "US").then((data) => {
                setSongs(data.body.tracks);
            }).catch((err) => console.log("Error fetching artist tracks.", err));

            spotifyApi.getArtistAlbums(artistId).then((data) => {
                setAlbums(data.body.items);
            }).catch((err) => console.log("Error fetching artist albums.", err));

            spotifyApi.getArtistRelatedArtists(artistId).then((data) => {
                setRelated(data.body.artists);
              }).catch((err) => console.log("Error getting related artists.", err));

            spotifyApi.searchPlaylists(artistName).then((data) => {
                setPlaylists(data.body.playlists.items);
              }).catch((err) => console.log("Error searching playlists.", err));
        }
    }, [artistId]);
        
  return (
    <div className="flex-grow text-white h-screen overflow-x-hidden overflow-y-scroll scrollbar-hide pb-[10.5rem] md:pb-[6rem]">
        <section className="text-white w-full">
            <h1 className="text-[3rem] md:text-[5rem] font-extrabold p-8">{artist?.name}</h1>
            <div className="mb-8 bg-black">
                <h1 className="text-white font-bold text-[2rem] mb-5 pt-8 pl-8">Popular</h1>
                <div className="flex flex-col px-4">
                    {songs.map((song, i) => (
                        <SongCover 
                            key={i}
                            order={i+1}
                            track={song}
                        />
                    ))}
                </div>
            </div>

            <div className="mb-8 pl-8">
                <h1 className="text-white font-bold text-[2rem] mb-5">Albums</h1>
                <div className="flex overflow-x-scroll scrollbar-hide md:scrollbar-default space-x-1 md:space-x-4 after:mr-8">
                    {albums.map((album, i) => (
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

            <div className="mb-8 pl-8">
                <h1 className="text-white font-bold text-[2rem] mb-5">Playlists</h1>
                <div className="flex overflow-x-scroll scrollbar-hide md:scrollbar-default space-x-1 md:space-x-4 after:mr-8">
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

            <div className="mb-8 pl-8">
                <h1 className="text-white font-bold text-[2rem] mb-5">Fans also like</h1>
                <div className="flex overflow-x-scroll scrollbar-hide md:scrollbar-default space-x-1 md:space-x-4 after:mr-8">
                    {related?.map((artist, i) => (
                        <Artist 
                        key={i}
                        name={artist?.name}
                        img={artist?.images?.[0]?.url}
                        id={artist?.id}
                        />
                    ))}
                </div>
            </div>
        </section>
    </div>
  )
}

export default ArtistCenter