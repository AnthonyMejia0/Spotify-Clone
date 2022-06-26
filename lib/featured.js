import { useSession } from "next-auth/react";
import { useEffect } from "react";
import useSpotify from "../hooks/useSpotify";

function getFeatured() {
    const { data: session } = useSession();
    const spotifyApi = useSpotify();

    useEffect(() => {
      if (session) {
          let featuredPlaylists = spotifyApi.getFeaturedPlaylists({ limit: 6, offset: 1, country: "US" }).then((data) => (
              data.body.playlists.items
            ));
      }

      return featuredPlaylists;
    }, [session])
}

export default getFeatured
