import React from 'react';
import { useNavigate } from 'react-router-dom';

import '../index.css';

const Navbar = ({ search, setSearch, onSearch }) => {
  const navigate = useNavigate();
  return (
    <nav className="flex flex-col sm:flex-row items-center justify-between px-4 py-2 bg-black shadow-md w-full border-b border-zinc-800">
      {/* Left: Logo */}
      <div className="flex items-center gap-2 mb-2 sm:mb-0">
        <span className="font-bold text-xl text-white">CloneTube</span>
      </div>

      {/* Middle: Search Bar */}
      <form
        onSubmit={onSearch}
        className="flex-1 flex justify-center w-full max-w-xl mb-2 sm:mb-0"
      >
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search"
          className="border border-gray-700 bg-zinc-900 text-white rounded-l-full px-4 py-1 w-full focus:outline-none"
        />
        <button
          type="submit"
          className="bg-gray-800 border border-gray-700 border-l-0 rounded-r-full px-4 flex items-center"
        >
          <span className="text-white">Search</span>
        </button>
      </form>

      {/* Right: Upload & Profile */}
      <div className="flex items-center gap-4">
        <button
          className="hover:bg-gray-800 p-2 rounded-full text-white"
          onClick={() => navigate('/profile')}
        >
          Profile
        </button>
      </div>
    </nav>
  );
};

export default Navbar;