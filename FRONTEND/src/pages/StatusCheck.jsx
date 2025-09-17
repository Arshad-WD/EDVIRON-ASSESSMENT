import { useState } from "react";
import { checkTransactionsStatus } from "../services/api";
import {
  CheckCircleIcon,
  ClockIcon,
  XCircleIcon,
} from "@heroicons/react/24/outline";

const StatusCheck = () => {
  const [customOrderId, setCustomOrderId] = useState("");
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleCheck = async () => {
    if (!customOrderId) return;
    setLoading(true);
    setStatus(null);
    try {
      const res = await checkTransactionsStatus(customOrderId);
      setStatus(res.data);
    } catch (err) {
      console.error(err);
      setStatus({ error: "Failed to fetch status" });
    } finally {
      setLoading(false);
    }
  };

  const renderStatusBadge = () => {
    if (!status || status.error) return null;

    const mapping = {
      success: {
        label: "SUCCESS",
        color: "bg-green-100 text-green-800",
        icon: <CheckCircleIcon className="w-5 h-5 mr-1" />,
      },
      pending: {
        label: "PENDING",
        color: "bg-yellow-100 text-yellow-800",
        icon: <ClockIcon className="w-5 h-5 mr-1" />,
      },
      failed: {
        label: "FAILED",
        color: "bg-red-100 text-red-800",
        icon: <XCircleIcon className="w-5 h-5 mr-1" />,
      },
    };

    const badge = mapping[status.status] || {
      label: status.status?.toUpperCase() || "UNKNOWN",
      color: "bg-gray-100 text-gray-600",
      icon: null,
    };

    return (
      <span
        className={`inline-flex items-center px-3 py-1 rounded-full font-semibold text-sm ${badge.color}`}
      >
        {badge.icon}
        {badge.label}
      </span>
    );
  };

  return (
    <div className="max-w-2xl mx-auto mt-12 px-4">
      {/* Card Wrapper */}
      <div className="bg-white dark:bg-gray-900 rounded-xl shadow-md border border-gray-200 dark:border-gray-700 p-6">
        <h2 className="text-xl md:text-2xl font-bold mb-6 text-gray-800 dark:text-gray-100 text-center">
          Check Transaction Status
        </h2>

        {/* Input + Button */}
        <div className="flex flex-col md:flex-row gap-3 mb-6">
          <input
            type="text"
            placeholder="Enter Custom Order ID"
            value={customOrderId}
            onChange={(e) => setCustomOrderId(e.target.value)}
            className="flex-1 px-4 py-3 border rounded-lg dark:bg-gray-800 dark:text-gray-200 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
          />
          <button
            onClick={handleCheck}
            disabled={!customOrderId || loading}
            className={`px-6 py-3 rounded-lg text-white font-semibold transition-colors ${
              !customOrderId || loading
                ? "bg-blue-300 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {loading ? "Checking..." : "Check"}
          </button>
        </div>

        {/* Status Result */}
        {status && (
          <div className="mt-4">
            {status.error ? (
              <div className="p-5 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-lg text-center text-red-600 dark:text-red-400 font-semibold">
                {status.error}
              </div>
            ) : (
              <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
                {/* Desktop Table View */}
                <div className="hidden md:block">
                  <table className="w-full text-sm text-left">
                    <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                      <tr>
                        <td className="px-4 py-3 font-medium text-gray-600 dark:text-gray-400">
                          Status
                        </td>
                        <td className="px-4 py-3">{renderStatusBadge()}</td>
                      </tr>
                      {status.transaction_amount && (
                        <tr>
                          <td className="px-4 py-3 font-medium text-gray-600 dark:text-gray-400">
                            Transaction Amount
                          </td>
                          <td className="px-4 py-3 text-gray-800 dark:text-gray-200 font-semibold">
                            ₹{status.transaction_amount}
                          </td>
                        </tr>
                      )}
                      {status.order_amount && (
                        <tr>
                          <td className="px-4 py-3 font-medium text-gray-600 dark:text-gray-400">
                            Order Amount
                          </td>
                          <td className="px-4 py-3 text-gray-800 dark:text-gray-200 font-semibold">
                            ₹{status.order_amount}
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>

                {/* Mobile Card View */}
                <div className="md:hidden space-y-3 p-4 bg-gray-50 dark:bg-gray-800">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-500 dark:text-gray-400 text-sm font-medium">
                      Status
                    </span>
                    {renderStatusBadge()}
                  </div>
                  {status.transaction_amount && (
                    <div className="flex justify-between items-center">
                      <span className="text-gray-500 dark:text-gray-400 text-sm font-medium">
                        Transaction Amount
                      </span>
                      <span className="text-gray-800 dark:text-gray-200 font-semibold">
                        ₹{status.transaction_amount}
                      </span>
                    </div>
                  )}
                  {status.order_amount && (
                    <div className="flex justify-between items-center">
                      <span className="text-gray-500 dark:text-gray-400 text-sm font-medium">
                        Order Amount
                      </span>
                      <span className="text-gray-800 dark:text-gray-200 font-semibold">
                        ₹{status.order_amount}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default StatusCheck;
