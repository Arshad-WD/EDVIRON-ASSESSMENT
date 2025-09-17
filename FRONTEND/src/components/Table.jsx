const Table = ({ data = [], columns = [] }) => {
  const getValue = (obj, key) =>
    key.split(".").reduce((acc, k) => acc?.[k], obj) ?? "";

  // Format status with strong, consistent colors
  const renderValue = (col, value) => {
    if (col.key === "status") {
      let color = "";
      let label = value?.toString().toUpperCase();

      switch (value?.toLowerCase()) {
        case "success":
          color =
            "bg-green-500/10 text-green-700 dark:text-green-300 border border-green-500/20";
          break;
        case "failed":
          color =
            "bg-red-500/10 text-red-700 dark:text-red-300 border border-red-500/20";
          break;
        case "pending":
          color =
            "bg-yellow-500/10 text-yellow-700 dark:text-yellow-300 border border-yellow-500/20";
          break;
        default:
          color =
            "bg-gray-500/10 text-gray-600 dark:text-gray-300 border border-gray-500/20";
          label = label || "UNKNOWN";
      }

      return (
        <span
          className={`px-2.5 py-1 text-xs font-semibold rounded-full inline-flex items-center justify-center ${color}`}
        >
          {label}
        </span>
      );
    }

    return value;
  };

  return (
    <div className="w-full">
      {/* Desktop / Tablet View */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full border border-gray-200 dark:border-gray-700 text-sm text-left rounded-lg overflow-hidden shadow">
          <thead className="bg-gray-100 dark:bg-gray-800">
            <tr>
              {columns.map((col) => (
                <th
                  key={col.key}
                  className="px-4 py-3 border-b border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 font-semibold text-xs uppercase tracking-wider"
                >
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {data.length ? (
              data.map((row, i) => (
                <tr
                  key={row.custom_order_id || i}
                  className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                >
                  {columns.map((col) => (
                    <td
                      key={col.key}
                      className="px-4 py-3 text-gray-700 dark:text-gray-300 whitespace-nowrap"
                    >
                      {renderValue(col, getValue(row, col.key))}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={columns.length}
                  className="text-center px-4 py-8 text-gray-500 dark:text-gray-400"
                >
                  No data available
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile View (Cards) */}
      <div className="md:hidden space-y-4">
        {data.length ? (
          data.map((row, i) => (
            <div
              key={row.custom_order_id || i}
              className="border border-gray-200 dark:border-gray-700 rounded-xl p-4 bg-white dark:bg-gray-900 shadow hover:shadow-md transition-shadow"
            >
              {columns.map((col, idx) => (
                <div
                  key={col.key}
                  className={`flex justify-between items-center py-2 ${
                    idx !== columns.length - 1
                      ? "border-b border-gray-100 dark:border-gray-800"
                      : ""
                  }`}
                >
                  <span className="text-gray-500 dark:text-gray-400 font-medium text-xs uppercase tracking-wide">
                    {col.label}
                  </span>
                  <span className="text-gray-800 dark:text-gray-200 text-sm font-semibold">
                    {renderValue(col, getValue(row, col.key))}
                  </span>
                </div>
              ))}
            </div>
          ))
        ) : (
          <div className="text-center py-6 text-gray-500 dark:text-gray-400 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 shadow">
            No data available
          </div>
        )}
      </div>
    </div>
  );
};

export default Table;
