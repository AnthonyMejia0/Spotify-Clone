import Head from 'next/head';
import Sidebar from '../components/Sidebar';
import HomePage from '../components/HomePage';
import Search from '../components/Search';
import Library from '../components/Library';
import Center from '../components/Center';
import { getSession } from 'next-auth/react'
import Player from '../components/Player';
import { useRecoilValue } from 'recoil';
import { pageState } from '../atoms/pageAtom';
import AlbumCenter from '../components/AlbumCenter';

export default function Home() {
  const pageName = useRecoilValue(pageState);
  console.log(pageName);

  return (
    <div className='bg-black h-screen overflow-hidden'>
      <Head>
        <title>Spotify 2.0</title>
        {/**<link rel="icon" href="/favicon.ico" />*/}
      </Head>

      <main className='flex'>
        <Sidebar />
        {
          pageName === "Home" ? <HomePage /> :
          pageName === "Center" ? <Center /> : 
          pageName === "Album Center" ? <AlbumCenter /> :
          pageName === "Search" ? <Search /> :
          pageName === "Library" ? <Library /> :
          <h1 className='text-white'>This is not an existing page</h1>
        }
      </main>

      <div className=''>
        <Player />
      </div>
    </div>
  );
}

export async function getServerSideProps(context) {
  return {
    props: {
      session: await getSession(context),
    }, // will be passed to the page component as props
  };
}