import Home from './Pages/Home';
import Profile from './Pages/Profile';
import Watch from './Pages/Watch';
import Upload from './Pages/Upload';
import Trending from './Pages/Trending';
import { Routes, Route } from 'react-router-dom';
import Navbar from './Components/Navbar';
import Sidebar from './Components/Sidebar';
import { useState } from 'react';

const Layout = ({ children, search, setSearch, onSearch }) => (
  <div className="flex h-screen bg-black">
    <Sidebar />
    <div className="flex-1 flex flex-col">
      <Navbar search={search} setSearch={setSearch} onSearch={onSearch} />
      <main className="flex-1 overflow-y-auto">{children}</main>
    </div>
  </div>
);

function App() {
  const [search, setSearch] = useState('');
  const [searchQuery, setSearchQuery] = useState('music');
  const [pageToken, setPageToken] = useState('');
  const [nextPageToken, setNextPageToken] = useState('');
  const [prevPageToken, setPrevPageToken] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  const handleSearch = e => {
    e.preventDefault();
    setSearchQuery(search);
    setPageToken('');
    setCurrentPage(1);
  };

  const handlePageChange = (token, direction) => {
    setPageToken(token);
    setCurrentPage(prev => prev + direction);
  };

  const handleTokens = (next, prev) => {
    setNextPageToken(next || '');
    setPrevPageToken(prev || '');
  };

  return (
    <Layout search={search} setSearch={setSearch} onSearch={handleSearch}>
      <Routes>
        <Route
          path="/"
          element={
            <Home
              searchQuery={searchQuery}
              pageToken={pageToken}
              onTokens={handleTokens}
              onPageChange={handlePageChange}
              nextPageToken={nextPageToken}
              prevPageToken={prevPageToken}
              currentPage={currentPage}
              setCurrentPage={setCurrentPage}
            />
          }
        />
        <Route path="/watch" element={<Watch />} />
        <Route path="/upload" element={<Upload />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/trending" element={<Trending />} />
      </Routes>
    </Layout>
  );
}

export default App;