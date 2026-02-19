import { useNavigate } from "react-router-dom";
import { useState } from "react";

function Navbar() {
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  function handleSubmit(e) {
    e.preventDefault();

    if (!search.trim()) return;

    // ✅ CORRECTION: navigation via URL, not state
    navigate(`/search?q=${encodeURIComponent(search)}`);
    setSearch("");
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <input
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search"
        className="px-3 py-1 rounded"
      />
      <button type="submit">Search</button>
    </form>
  );
}

export default Navbar;
