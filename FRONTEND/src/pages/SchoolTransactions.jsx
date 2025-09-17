import { useEffect, useState } from "react";
import { fetchTransactionsBySchool } from "../services/api";
import Table from "../components/Table.jsx";

const SchoolTransactions = () => {
  const [schoolInput, setSchoolInput] = useState("");
  const [schoolId, setSchoolId] = useState("");
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);

  // Define columns in desired order
  const columns = [
    { key: "srNo", label: "Sr No" },
    { key: "school_id", label: "School ID" },
    { key: "custom_order_id", label: "Order ID" },
    { key: "order_amount", label: "Order Amount" },
    { key: "transaction_amount", label: "Transaction Amount" },
    { key: "gateway_name", label: "Payment Method" },
    { key: "status", label: "Status" },
  ];

  // Debounce input
  useEffect(() => {
    const handler = setTimeout(() => setSchoolId(schoolInput.trim()), 500);
    return () => clearTimeout(handler);
  }, [schoolInput]);

  // Fetch transactions
  useEffect(() => {
    if (!schoolId) {
      setTransactions([]);
      return;
    }

    const loadData = async () => {
      setLoading(true);
      try {
        const res = await fetchTransactionsBySchool(schoolId);
        // Add Sr No dynamically
        const dataWithSrNo = (res.data || []).map((tx, idx) => ({
          srNo: idx + 1,
          ...tx,
        }));
        setTransactions(dataWithSrNo);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [schoolId]);

  return (
    <div className="max-w-7xl mx-auto mt-10 p-6 bg-white dark:bg-gray-900 rounded-2xl shadow-xl transition-colors">
      {/* Header + Input */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
        Search Transactions by School ID
        </h2>

        <div className="w-full md:w-1/3">
          <input
            type="text"
            placeholder="Enter School ID"
            value={schoolInput}
            onChange={(e) => setSchoolInput(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl dark:bg-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400 dark:placeholder-gray-400 transition-shadow shadow-sm hover:shadow-md"
          />
        </div>
      </div>

      {/* Loader */}
      {loading ? (
        <div className="text-center py-12 text-gray-500 dark:text-gray-300 animate-pulse">
          Loading transactions...
        </div>
      ) : transactions.length > 0 ? (
        <div className="overflow-x-auto rounded-xl border border-gray-200 dark:border-gray-700 shadow-md">
          <Table
            data={transactions}
            columns={columns.filter((col) =>
              transactions[0]?.hasOwnProperty(col.key)
            )}
            rowClassName="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
          />
        </div>
      ) : schoolId ? (
        <div className="text-center py-10 text-gray-500 dark:text-gray-400">
          No transactions found for school{" "}
          <span className="font-semibold text-gray-700 dark:text-gray-200">
            {schoolId}
          </span>
          .
        </div>
      ) : (
        <div className="text-center py-10 text-gray-500 dark:text-gray-400">
          Enter a <span className="font-semibold">School ID</span> to see
          transactions.
        </div>
      )}
    </div>
  );
};

export default SchoolTransactions;
