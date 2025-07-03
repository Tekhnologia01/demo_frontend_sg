
import CommonPagination from "./Pagination.jsx";

const CommonTable = ({
  title,
  headers,
  bodyData,
  currentPage,
  totalPages,
  totalRecords,
  onPageChange,
  renderRow,
  minimumWidth,
  limitPerPage = 10,
}) => {
  return (
    <div className="border overflow-hidden border-gray-200 rounded-lg shadow-sm bg-white">
     

      <div className="overflow-x-auto">
        <table className="w-full border-collapse" style={{ minWidth: minimumWidth }}>
          <thead>
            <tr className="bg-gray-100 text-gray-600 text-sm font-medium">
              {headers?.map((header) => (
                <th
                  key={header.accessor}
                  className={`px-4 py-2 text-center ${header.class || ""}`}
                  style={header.width ? { width: header.width } : undefined}
                >
                  {header.name}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="text-gray-700">
            {bodyData?.length > 0 ? (
              bodyData.map((item, index) => renderRow(item, index))
            ) : (
              <tr>
                <td
                  colSpan={headers?.length}
                  className="px-4 py-3 text-center text-gray-500 text-sm border-t border-gray-200"
                >
                  No data available
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {totalRecords > limitPerPage && (
        <div className="border-0 border-t-[1px] border-t-gray-200">
          <CommonPagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalRecords={totalRecords}
            limitPerPage={limitPerPage}
            onPageChange={onPageChange}
          />
        </div>
      )}
    </div>
  );
};

export default CommonTable;