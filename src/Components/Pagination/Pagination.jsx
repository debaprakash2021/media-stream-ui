import { useSearchParams } from "react-router-dom";

function Pagination({ currentPage, hasNextPage }) {
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get("q");

  function goToPage(page) {
    // ✅ CORRECTION: URL-driven pagination
    setSearchParams({
      q: query,
      page: page.toString(),
    });
  }

  return (
    <div className="flex justify-center gap-4 mt-8">
      <button
        disabled={currentPage === 1}
        onClick={() => goToPage(currentPage - 1)}
        className="px-4 py-2 bg-zinc-700 rounded disabled:opacity-50"
      >
        Previous
      </button>

      <span className="px-4 py-2 font-semibold">
        Page {currentPage}
      </span>

      <button
        disabled={!hasNextPage}
        onClick={() => goToPage(currentPage + 1)}
        className="px-4 py-2 bg-zinc-700 rounded disabled:opacity-50"
      >
        Next
      </button>
    </div>
  );
}

export default Pagination;
