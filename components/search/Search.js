import useSpotify from "../../hooks/useSpotify";
import { SearchIcon } from "@heroicons/react/outline";
import { useState } from "react";
import Artist from "./Artist";
import PlaylistCover from "../covers/PlaylistCover";
import SongCover from "../covers/SongCover";

function Search() {
  const spotifyApi = useSpotify();
  const [artists, setArtists] = useState([]);
  const [playlists, setPlaylists] = useState([]);
  const [songs, setSongs] = useState([]);
  const [search, setSearch] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();

    spotifyApi.searchTracks(search, { limit: 10 }).then((data) => {
      setSongs(data.body.tracks.items);
    }).catch((err) => console.log("Error searching tracks.", err));

    spotifyApi.searchArtists(search).then((data) => {
      setArtists(data.body.artists.items);
    }).catch((err) => console.log("Error searching artists.", err));

    spotifyApi.searchPlaylists(search).then((data) => {
      setPlaylists(data.body.playlists.items);
    }).catch((err) => console.log("Error searching playlists.", err));

    setSearch("");
  }

  return (
    <div className="flex-grow h-screen text-white overflow-x-hidden overflow-y-scroll scrollbar-hide pb-[10.5rem] md:pb-[6rem]">
      <div className="flex w-full items-center justify-center mt-8">
        <form onSubmit={handleSubmit} className="flex w-80 md:w-[30rem] h-10 pl-1 pr-4 bg-white items-center rounded-full">
          <SearchIcon className="h-8 w-8 text-black" />
          <input 
            className="flex-grow h-full text-black text-md px-2 outline-none rounded-full" 
            type="search" 
            placeholder="Artists, Songs, or Playlists"
            maxLength={35}
            onChange={(event) => setSearch(event.target.value)}
            value={search}
          />
        </form>
      </div>
      
      <section className="bg-black text-white pt-20 pl-8">
        <div className="mb-8">
          <h1 className="text-white font-bold text-[2rem] mb-5">Artists</h1>
          <div className="flex overflow-x-scroll scrollbar-hide md:scrollbar-default space-x-1 md:space-x-4 after:mr-8">
            {artists?.map((artist, i) => (
                <Artist 
                  key={i}
                  name={artist?.name}
                  img={artist?.images?.[0]?.url}
                  id={artist?.id}
                />
            ))}
          </div>
        </div>

        <div className="mb-8">
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

        <div className="mb-8">
          <h1 className="text-white font-bold text-[2rem] mb-5">Songs</h1>
          <div className="flex flex-col mr-8">
            {songs.map((song, i) => (
              <SongCover 
                key={i}
                order={i+1}
                track={song}
              />
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}

export default Search