import React, { useState } from 'react';

const Upload = () => {
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = e => {
    e.preventDefault();
    setMessage('Upload simulated! (API integration needed)');
  };

  return (
    <div className="p-4 max-w-lg mx-auto bg-black min-h-screen">
      <h1 className="text-2xl font-bold mb-4 text-white">Upload Video</h1>
      <form
        onSubmit={handleSubmit}
        className="bg-zinc-900 rounded-lg shadow p-6 flex flex-col gap-4 border border-zinc-800"
      >
        <input
          type="file"
          accept="video/*"
          className="border border-zinc-700 bg-black text-white p-2 rounded"
        />
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={e => setTitle(e.target.value)}
          className="border border-zinc-700 bg-black text-white p-2 rounded"
        />
        <textarea
          placeholder="Description"
          value={desc}
          onChange={e => setDesc(e.target.value)}
          className="border border-zinc-700 bg-black text-white p-2 rounded"
        />
        <button
          type="submit"
          className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
        >
          Upload
        </button>
        {message && <div className="text-green-400">{message}</div>}
      </form>
    </div>
  );
};

export default Upload;