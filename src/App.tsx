import { Route, Routes } from "react-router";
import useSWR from "swr";

import ArtPieceList from "./components/ArtPieceList";
import Spotlight from "./components/Spotlight";
import { fetcher } from "./fetcher";
import "./styles.css";

export const ART_PIECES_URL = "https://example-apis.vercel.app/api/art";

export default function App() {
  // fetched once here and passed down, so every page can use the art pieces
  const { data: artPieces, error } = useSWR(ART_PIECES_URL, fetcher);

  if (error) {
    return (
      <main>
        <p role="alert">Failed to load the art pieces. Please try again.</p>
      </main>
    );
  }

  if (!artPieces) {
    return (
      <main>
        <p>Loading art pieces…</p>
      </main>
    );
  }

  return (
    <main>
      <h1>Art Gallery</h1>
      <Routes>
        <Route path="/" element={<Spotlight artPieces={artPieces} />} />
        <Route
          path="/art-pieces"
          element={<ArtPieceList artPieces={artPieces} />}
        />
      </Routes>
    </main>
  );
}
