import { HeartIcon, HomeIcon, LibraryIcon, LogoutIcon, PlusCircleIcon, RssIcon, SearchIcon } from '@heroicons/react/outline';
import LibraryMusicIcon from '@mui/icons-material/LibraryMusic';
import { signOut, useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { useRecoilState } from 'recoil';
import { pageState } from '../atoms/pageAtom';
import { playlistIdState } from '../atoms/playlistAtom';
import useSpotify from "../hooks/useSpotify";

function Sidebar() {
  const { data: session, status } = useSession();
  const spotifyApi = useSpotify();
  const [playlists, setPlaylists] = useState([]);
  const [playlistId, setPlaylistId] = useRecoilState(playlistIdState);
  const [pageName, setPageName] = useRecoilState(pageState);

  useEffect(() => {
    if (spotifyApi.getAccessToken()) {
      spotifyApi.getUserPlaylists().then((data) => {
        setPlaylists(data.body.items);
      });
    }
  }, [session, spotifyApi]);

  return (
    <div>
      <div className='text-gray-500 p-5 text-xs lg:text-sm border-r-gray-900 border-r h-[calc(100vh-4.5rem)] w-[12rem] lg:w-[15rem] hidden md:inline-flex'>
        <div className='space-y-4 overflow-y-scroll scrollbar-hide pb-8'>
          <button className='flex items-center space-x-2 hover:text-white'
          onClick={() => signOut()}>
            <LogoutIcon className='h-5 w-5'/>
            <p className=''>Log Out</p>
          </button>
          <button
            onClick={() => setPageName("Home")}
            className='flex items-center space-x-2 hover:text-white'
          >
            <HomeIcon className='h-5 w-5'/>
            <p className=''>Home</p>
          </button>
          <button 
            onClick={() => setPageName("Search")}
            className='flex items-center space-x-2 hover:text-white'
          >
            <SearchIcon className='h-5 w-5'/>
            <p className=''>Search</p>
          </button>
          <button
            onClick={() => setPageName("Library")} 
            className='flex items-center space-x-2 hover:text-white'
          >
            <LibraryIcon className='h-5 w-5'/>
            <p className=''>Your Library</p>
          </button>

          <hr className='border-t-[0.1px] border-gray-900' />

          <button className='flex items-center space-x-2 hover:text-white'>
            <PlusCircleIcon className='h-5 w-5'/>
            <p className=''>Create Playlist</p>
          </button>
          <button className='flex items-center space-x-2 hover:text-white'>
            <HeartIcon className='h-5 w-5'/>
            <p className=''>Liked Songs</p>
          </button>
          <button className='flex items-center space-x-2 hover:text-white'>
            <RssIcon className='h-5 w-5'/>
            <p className=''>Your Episodes</p>
          </button>

          <hr className='border-t-[0.1px] border-gray-900'/>

          {playlists.map((playlist) => (
            <p
              key={playlist.id} 
              onClick={() => {
                setPlaylistId(playlist.id);
                setPageName("Center");
              }}
              className='cursor-pointer hover:text-white'
            >
              {playlist.name}
            </p>
          ))}
        </div>
      </div>
      <div className='flex items-center justify-around fixed bottom-0 h-[4.5rem] w-full px-1 overflow-hidden bg-black opacity-90 md:hidden'>
        <button
          onClick={() => setPageName("Home")} 
          className='mobile-menu'
        >
          <div className='flex flex-col items-center'>
            <HomeIcon className='h-8 w-10 text-white' />
            <p className='text-white'>Home</p>
          </div>
        </button>
        <button 
          onClick={() => setPageName("Search")}
          className='mobile-menu'
        >   
          <div className='flex flex-col items-center'>
            <SearchIcon className='h-8 w-10 text-white' />
            <p className='text-white'>Search</p>
          </div>
        </button>
        <button
          onClick={() => setPageName("Library")}  
          className='mobile-menu'
        >
          <div className='flex flex-col items-center'>
            <LibraryMusicIcon className='h-8 w-10 text-white' />
            <p className='text-white'>Library</p>
          </div>
        </button>
      </div>
    </div>
  )
}

export default Sidebar