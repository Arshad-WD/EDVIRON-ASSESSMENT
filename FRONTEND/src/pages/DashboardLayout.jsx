import { Navbar } from "../components/Navbar";
import PaymentWidget from "../components/PaymentWidget";

export const DashboardLayout = ({ children }) => {
  return (
    <div className="flex min-h-screen bg-gray-100 dark:bg-gray-900">
      {/* Main Content Area */}
      <div className="flex-1 flex flex-col">
        <Navbar />
        <main className="flex-1 p-6">{children}</main>
      </div>

      {/* Floating Payment Widget */}
      <PaymentWidget />
    </div>
  );
};
