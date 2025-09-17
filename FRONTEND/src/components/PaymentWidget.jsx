import { useState } from "react";
import { createPayment } from "../services/api";
import { Toaster, toast } from "sonner";

export default function PaymentWidget() {
  const [open, setOpen] = useState(false);
  const [paymentUrl, setPaymentUrl] = useState(null);
  const [loading, setLoading] = useState(false);

  const [schoolId, setSchoolId] = useState("");
  const [studentName, setStudentName] = useState("");
  const [studentRoll, setStudentRoll] = useState("");
  const [studentEmail, setStudentEmail] = useState("");
  const [orderAmount, setOrderAmount] = useState("");
  const [gatewayName, setGatewayName] = useState("PhonePe");

  const handlePayment = async () => {
    if (!schoolId || !studentName || !studentRoll || !orderAmount || !gatewayName) {
      toast.error("Please fill all required fields");
      return;
    }

    try {
      setLoading(true);
      const res = await createPayment({
        school_id: schoolId,
        student_info: { name: studentName, id: studentRoll, email: studentEmail },
        order_amount: Number(orderAmount),
        gateway_name: gatewayName,
      });
      setPaymentUrl(res.payment_url);
      toast.success("Redirecting to payment gateway...");
    } catch (err) {
      console.error("Payment error:", err.message);
      toast.error("Payment failed: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setOpen(false);
    setPaymentUrl(null);
    setSchoolId("");
    setStudentName("");
    setStudentRoll("");
    setStudentEmail("");
    setOrderAmount("");
    setGatewayName("PhonePe");
  };

  return (
    <>
      {/* Toast */}
      <Toaster richColors position="top-right" />

      {/* Floating Button */}
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-6 right-6 w-14 h-14 bg-gradient-to-br from-indigo-500 to-blue-600 rounded-full shadow-lg flex items-center justify-center text-white text-xl z-50 hover:scale-105 transition-transform duration-200"
        aria-label="Make a payment"
      >
        ₹
      </button>

      {/* Popup Modal */}
      {open && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-[60] animate-fadeIn px-4">
          <div className="bg-white dark:bg-gray-900 p-6 rounded-xl shadow-2xl w-full max-w-md relative border border-gray-200 dark:border-gray-700 animate-scaleIn">
            {/* Close Button */}
            <button
              onClick={resetForm}
              className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 text-lg"
            >
              ✖
            </button>

            <h2 className="text-xl font-semibold mb-5 text-gray-900 dark:text-white text-center">
              Complete Your Payment
            </h2>

            {!paymentUrl ? (
              <form
                className="space-y-4"
                onSubmit={(e) => {
                  e.preventDefault();
                  handlePayment();
                }}
              >
                {[
                  { label: "School ID", value: schoolId, setter: setSchoolId },
                  { label: "Student Name", value: studentName, setter: setStudentName },
                  { label: "Student Roll", value: studentRoll, setter: setStudentRoll },
                  { label: "Student Email", value: studentEmail, setter: setStudentEmail, type: "email" },
                  { label: "Order Amount", value: orderAmount, setter: setOrderAmount, type: "number" },
                  { label: "Payment Gateway", value: gatewayName, setter: setGatewayName },
                ].map((field, idx) => (
                  <div key={idx} className="flex flex-col">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      {field.label}
                    </label>
                    <input
                      type={field.type || "text"}
                      value={field.value}
                      onChange={(e) => field.setter(e.target.value)}
                      required
                      className="px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 dark:bg-gray-800 dark:border-gray-600 dark:text-white transition-shadow"
                    />
                  </div>
                ))}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-indigo-500 to-blue-600 text-white px-4 py-2 rounded-lg font-medium disabled:opacity-50 transition-all duration-200 hover:shadow-md"
                >
                  {loading ? "Processing..." : "Pay Now"}
                </button>
              </form>
            ) : (
              <iframe
                src={paymentUrl}
                title="Payment"
                className="w-full h-72 border rounded-lg mt-3"
              />
            )}
          </div>
        </div>
      )}

      {/* Animations */}
      <style>{`
        @keyframes fadeIn { from { opacity: 0 } to { opacity: 1 } }
        @keyframes scaleIn { from { transform: scale(0.95); opacity: 0 } to { transform: scale(1); opacity: 1 } }
        .animate-fadeIn { animation: fadeIn 0.2s ease-out forwards; }
        .animate-scaleIn { animation: scaleIn 0.25s ease-out forwards; }
      `}</style>
    </>
  );
}
