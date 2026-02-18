import React from 'react';

import { NavLink } from 'react-router-dom';

const Sidebar = () => {
  const navItems = [
    { name: 'Home', path: '/' },
    { name: 'Profile', path: '/profile' },
    { name: 'Upload', path: '/upload' },
    { name: 'Watch', path: '/watch' },
    { name: 'Trending', path: '/trending' },
  ];

  return (
    <aside className="h-full w-48 bg-black shadow-md flex flex-col py-4 border-r border-zinc-800 min-w-\[3.5rem] sm:min-w-\[12rem]">
      {navItems.map(item => (
        <NavLink
          key={item.name}
          to={item.path}
          className={({ isActive }) =>
            `flex items-center gap-3 px-6 py-3 text-lg text-gray-300 hover:bg-zinc-900 hover:text-white transition ${isActive ? 'bg-zinc-900 text-white font-bold' : ''}`
          }
        >
          {item.name}
        </NavLink>
      ))}
    </aside>
  );
};

export default Sidebar;