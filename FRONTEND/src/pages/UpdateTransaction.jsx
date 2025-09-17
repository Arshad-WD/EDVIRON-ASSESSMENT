import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { fetchTransactionById, updateTransactionById } from "../services/api";

const UpdateTransaction = () => {
  const { id } = useParams(); // orderId or collectId
  const navigate = useNavigate();
  const [transaction, setTransaction] = useState(null);
  const [status, setStatus] = useState("");
  const [amount, setAmount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadTransaction = async () => {
      try {
        const res = await fetchTransactionById(id);
        setTransaction(res.data);
        setStatus(res.data.status);
        setAmount(res.data.transaction_amount);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadTransaction();
  }, [id]);

  const handleUpdate = async () => {
    try {
      await updateTransactionById(id, { status, transaction_amount: amount });
      alert("Transaction updated successfully");
      navigate("/transactions");
    } catch (err) {
      console.error(err);
      alert("Update failed");
    }
  };

  if (loading) return <div className="p-6">Loading...</div>;
  if (!transaction) return <div className="p-6">Transaction not found</div>;

  return (
    <div className="max-w-md mx-auto mt-6 p-6 bg-gray-50 dark:bg-gray-900 rounded-xl shadow-xl">
      <h2 className="text-xl font-bold mb-4">Update Transaction</h2>
      <div className="mb-4">
        <label className="block mb-1">Status</label>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:text-gray-200"
        >
          <option value="success">Success</option>
          <option value="pending">Pending</option>
          <option value="failed">Failed</option>
        </select>
      </div>

      <div className="mb-4">
        <label className="block mb-1">Transaction Amount</label>
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:text-gray-200"
        />
      </div>

      <button
        onClick={handleUpdate}
        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow"
      >
        Update
      </button>
    </div>
  );
};

export default UpdateTransaction;
