import { HeartIcon, HomeIcon, LibraryIcon, LogoutIcon, PlusCircleIcon, RssIcon, SearchIcon } from '@heroicons/react/outline'
import { signOut, useSession } from 'next-auth/react'
import { useEffect, useState } from 'react';
import useSpotify from "../hooks/useSpotify";

function Sidebar() {
  const spotifyApi = useSpotify();
  const { data: session, status } = useSession();
  const [playlists, setPlaylists] = useState([]);
  const [playlistId, setPlaylistId] = useState(null);

  console.log("You clicked >>>", playlistId);

  useEffect(() => {
    if (spotifyApi.getAccessToken()) {
      spotifyApi.getUserPlaylists().then((data) => {
        setPlaylists(data.body.items);
      });
    }
  }, [session, spotifyApi]);

  return (
    <div className='text-gray-500 p-5 text-sm border-r-gray-900 overflow-y-scroll scrollbar-hide h-screen'>
      <div className='space-y-4'>
      <button className='flex items-center space-x-2 hover:text-white'
      onClick={() => signOut()}>
          <LogoutIcon className='h-5 w-5'/>
          <p className=''>Log Out</p>
        </button>
        <button className='flex items-center space-x-2 hover:text-white'>
          <HomeIcon className='h-5 w-5'/>
          <p className=''>Home</p>
        </button>
        <button className='flex items-center space-x-2 hover:text-white'>
          <SearchIcon className='h-5 w-5'/>
          <p className=''>Search</p>
        </button>
        <button className='flex items-center space-x-2 hover:text-white'>
          <LibraryIcon className='h-5 w-5'/>
          <p className=''>Your Library</p>
        </button>

        <hr className='border-t-[0.1px] border-gray-900'/>

        <button className='flex items-center space-x-2 hover:text-white'>
          <PlusCircleIcon className='h-5 w-5'/>
          <p className=''>Create Playlist</p>
        </button>
        <button className='flex items-center space-x-2 hover:text-white'>
          <HeartIcon className='h-5 w-5'/>
          <p className=''>Your Library</p>
        </button>
        <button className='flex items-center space-x-2 hover:text-white'>
          <RssIcon className='h-5 w-5'/>
          <p className=''>Your Episodes</p>
        </button>

        <hr className='border-t-[0.1px] border-gray-900'/>

        {/*<Playlists />*/}

        {playlists.map((playlist) => (
          <p
            key={playlist.id} 
            onClick={() => setPlaylistId(playlist.name)}
            className='cursor-pointer hover:text-white'
          >
            {playlist.name}
          </p>
        ))}
      </div>
    </div>
  )
}

export default Sidebar