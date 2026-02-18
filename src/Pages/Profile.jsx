import React from 'react';

const Profile = () => {
  return (
    <div className="p-4 max-w-xl mx-auto bg-black min-h-screen">
      <h1 className="text-2xl font-bold mb-4 text-white">Profile</h1>
      <div className="bg-zinc-900 rounded-lg shadow p-6 border border-zinc-800">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-16 h-16 rounded-full bg-gray-700 flex items-center justify-center text-3xl text-white">
            U
          </div>
          <div>
            <div className="font-semibold text-lg text-white">User Name</div>
            <div className="text-gray-400">user@email.com</div>
          </div>
        </div>
        <div className="text-gray-300">
          This is your profile page. You can add more user info here.
        </div>
      </div>
    </div>
  );
};

export default Profile;