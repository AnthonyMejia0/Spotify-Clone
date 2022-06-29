import Profile from "./Profile"
import useSpotify from "../hooks/useSpotify";
import { SearchIcon } from "@heroicons/react/outline";
import { useState } from "react";

function Search() {
  const spotifyApi = useSpotify();
  const [artists, setArtists] = useState([]);
  const [playlists, setPlaylists] = useState([]);
  const [songs, setSongs] = useState([]);

  function testing() {
    console.log("It Worked!");
  }

  return (
    <div className="flex-grow h-screen text-white">
      <div className="flex w-full items-center justify-center mt-8">
        <form className="flex w-80 md:w-[30rem] h-10 pl-1 pr-4 bg-white items-center rounded-full">
          <SearchIcon className="h-8 w-8 text-black" />
          <input 
            className="flex-grow h-full text-black text-md px-2 outline-none rounded-full" 
            type="search" 
            placeholder="Artists, Songs, or Playlists"
            maxLength={35}
          />
        </form>
      </div>
      <section className="overflow-x-hidden bg-black text-white pt-20 pl-8">
        {artists?.map((artist) => (
          <div className="text-white">
            TESTING
          </div>
        ))}
      </section>
    </div>
  )
}

export default Search