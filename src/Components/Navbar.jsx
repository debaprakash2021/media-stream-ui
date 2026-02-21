import { useNavigate } from "react-router-dom";
import { useState } from "react";

function Navbar() {
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  function handleSubmit(e) {
    e.preventDefault();
    if (!search.trim()) return;
    navigate(`/search?q=${encodeURIComponent(search.trim())}`);
    setSearch("");
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex items-center gap-2 w-full max-w-xl"
    >
      {/* Input wrapper — dark pill with focus ring */}
      <div className="flex flex-1 items-center bg-zinc-900 border border-zinc-700 rounded-full overflow-hidden focus-within:border-blue-500 transition">

        {/* Search icon */}
        <span className="pl-4 text-gray-400 text-sm select-none">🔍</span>

        {/* Input field */}
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search videos..."
          className="flex-1 bg-transparent px-3 py-2 text-white text-sm outline-none placeholder-gray-500"
        />

        {/* Clear button — only visible when user has typed something */}
        {search && (
          <button
            type="button"
            onClick={() => setSearch("")}
            className="px-3 text-gray-400 hover:text-white transition text-lg leading-none"
          >
            ✕
          </button>
        )}
      </div>

      {/* Submit button */}
      <button
        type="submit"
        className="px-4 py-2 bg-zinc-700 hover:bg-zinc-600 text-white text-sm font-medium rounded-full border border-zinc-600 transition whitespace-nowrap"
      >
        Search
      </button>
    </form>
  );
}

export default Navbar;