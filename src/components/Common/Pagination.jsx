import { GrPrevious, GrNext } from "react-icons/gr";

const Pagination = ({
  currentPage,
  totalRecords,
  limitPerPage,
  onPageChange,
}) => {
  const totalPages = Math.ceil(totalRecords / limitPerPage);

  let startPage = Math.max(currentPage - Math.floor(limitPerPage / 2), 1);
  let endPage = Math.min(startPage + limitPerPage - 1, totalPages);

  if (endPage - startPage < limitPerPage - 1) {
    startPage = Math.max(endPage - limitPerPage + 1, 1);
  }

  const pages = [];
  for (let i = startPage; i <= endPage; i++) {
    pages.push(i);
  }

  return (
    <div className="p-4 flex items-center justify-center">
      <div className="flex gap-2">
        <button
          disabled={currentPage <= 1}
          onClick={() => onPageChange(Math.max(currentPage - 1, 1))}
          className={`py-1 px-3 flex items-center gap-1 border-0 rounded cursor-pointer ${currentPage <= 1 ? "text-gray-400" : "text-black"
            }`}
        >
          <GrPrevious size={20} />
        </button>

        {startPage > 1 && (
          <>
            <button
              onClick={() => onPageChange(1)}
              className="bg-white px-2 rounded-sm border-0 hover:bg-purple-200 cursor-pointer"
            >
              1
            </button>
            {startPage > 2 && <span className="px-2">...</span>}
          </>
        )}

        {pages.map((page) => (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            className={`px-3 rounded-sm border-0 transition cursor-pointer ${page === currentPage
              ? "bg-purple-400 text-white hover:bg-purple-500"
              : "bg-white hover:bg-purple-200"
              }`}
          >
            {page}
          </button>
        ))}

        {endPage < totalPages && (
          <>
            {endPage < totalPages - 1 && <span className="px-2">...</span>}
            <button
              onClick={() => onPageChange(totalPages)}
              className="px-3 rounded-sm border-0 bg-white hover:bg-purple-200 cursor-pointer"
            >
              {totalPages}
            </button>
          </>
        )}

        <button
          disabled={currentPage >= totalPages}
          onClick={() => onPageChange(Math.min(currentPage + 1, totalPages))}
          className={`py-1 px-3 flex items-center gap-1 border-0 rounded cursor-pointer ${currentPage >= totalPages ? "text-gray-400" : "text-black"
            }`}
        >
          <GrNext size={20} />
        </button>
      </div>
    </div>
  );
};

export default Pagination;