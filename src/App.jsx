import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./Components/Layout";
import Home from "./Pages/Home";
import Trending from "./Pages/Trending";
import Watch from "./Pages/Watch";
import Upload from "./Pages/Upload";
import Profile from "./Pages/Profile";
import WatchHistory from "./Pages/WatchHistory";

function App() {
  return (
    <BrowserRouter>
      {/* ✅ CORRECTION: Removed global search state from App.
          App should only define routes.
          Business logic must live inside pages. */}

      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/trending" element={<Trending />} />
          <Route path="/watch" element={<Watch />} />
          <Route path="/upload" element={<Upload />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/history" element={<WatchHistory />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;
