import { useState, useEffect } from "react";
import {
  SunIcon,
  MoonIcon,
  ArrowRightOnRectangleIcon,
  ArrowLeftOnRectangleIcon,
  HomeIcon,
  ClipboardDocumentCheckIcon,
  ChartBarIcon,
  Bars3Icon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { logoutUser } from "../services/api";

export const Navbar = ({ onLogin }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [darkMode, setDarkMode] = useState(false);
  const [userName, setUserName] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const theme = localStorage.getItem("theme") || "light";
    const isDark = theme === "dark";
    setDarkMode(isDark);
    document.documentElement.classList[isDark ? "add" : "remove"]("dark");

    const token = localStorage.getItem("token");
    const storedUser = localStorage.getItem("userName");
    if (token) {
      setIsLoggedIn(true);
      if (storedUser) setUserName(storedUser);
    }
  }, []);

  const toggleDark = () => {
    const newDark = !darkMode;
    setDarkMode(newDark);
    document.documentElement.classList[newDark ? "add" : "remove"]("dark");
    localStorage.setItem("theme", newDark ? "dark" : "light");
  };

  const handleLogout = async () => {
    try {
      await logoutUser();
      localStorage.removeItem("token");
      localStorage.removeItem("userName");
      setIsLoggedIn(false);
      setUserName("");
      navigate("/sign-in");
    } catch (err) {
      console.error(err);
    }
  };

  const menuItems = [
    { name: "Transactions", path: "/transactions", icon: HomeIcon },
    { name: "Check Status", path: "/status-check", icon: ClipboardDocumentCheckIcon },
    { name: "School Status", path: "/transactions/school", icon: ClipboardDocumentCheckIcon },
    { name: "Data Visuals", path: "/analytics", icon: ChartBarIcon },
  ];

  return (
    <nav
      className="bg-gradient-to-r from-white to-gray-50 dark:from-gray-900 dark:to-gray-800 shadow-md sticky top-0 z-50 transition-colors duration-500"
      role="navigation"
    >
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-4 flex justify-between items-center">
        {/* Logo / Brand */}
        <Link
          to="/"
          className="text-2xl md:text-3xl font-extrabold text-gray-900 dark:text-gray-50 tracking-tight select-none hover:opacity-90 transition"
        >
          REC-BOarD
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-6">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                to={item.path}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                  isActive
                    ? "bg-blue-600 text-white shadow-md scale-105"
                    : "text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 hover:scale-105"
                }`}
              >
                <Icon className="w-5 h-5" />
                <span>{item.name}</span>
              </Link>
            );
          })}

          {/* Dark Mode Toggle */}
          <button
            onClick={toggleDark}
            aria-label="Toggle dark mode"
            className="relative w-14 h-8 rounded-full flex items-center p-1 transition-all duration-500 shadow-inner bg-gray-300 dark:bg-gray-700"
          >
            <div
              className={`absolute w-6 h-6 bg-white rounded-full shadow-md flex items-center justify-center transform transition-transform duration-500 ${
                darkMode ? "translate-x-6" : "translate-x-0"
              }`}
            >
              {darkMode ? (
                <SunIcon className="w-4 h-4 text-yellow-400" />
              ) : (
                <MoonIcon className="w-4 h-4 text-gray-600" />
              )}
            </div>
          </button>

          {/* Auth Buttons */}
          {isLoggedIn ? (
            <div className="flex items-center gap-3">
              {userName && (
                <span className="px-3 py-1 bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 font-medium rounded-full text-sm shadow-sm">
                  {userName}
                </span>
              )}
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg shadow-md transition hover:scale-105"
              >
                <ArrowLeftOnRectangleIcon className="w-5 h-5" />
                Logout
              </button>
            </div>
          ) : (
            <button
              onClick={onLogin}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-md transition hover:scale-105"
            >
              <ArrowRightOnRectangleIcon className="w-5 h-5" />
              Login
            </button>
          )}
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden flex items-center gap-3">
          <button
            onClick={toggleDark}
            aria-label="Toggle dark mode"
            className="relative w-12 h-6 rounded-full flex items-center p-1 transition-all duration-500 shadow-inner bg-gray-300 dark:bg-gray-700"
          >
            <div
              className={`absolute w-5 h-5 bg-white rounded-full shadow-md flex items-center justify-center transform transition-transform duration-500 ${
                darkMode ? "translate-x-6" : "translate-x-0"
              }`}
            >
              {darkMode ? (
                <SunIcon className="w-3.5 h-3.5 text-yellow-400" />
              ) : (
                <MoonIcon className="w-3.5 h-3.5 text-gray-600" />
              )}
            </div>
          </button>

          <button
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
            className="text-gray-700 dark:text-gray-300 focus:outline-none transition-transform duration-300 hover:scale-110"
          >
            {menuOpen ? <XMarkIcon className="w-7 h-7" /> : <Bars3Icon className="w-7 h-7" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`md:hidden bg-white dark:bg-gray-900 shadow-lg transition-all duration-500 overflow-hidden ${
          menuOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <ul className="flex flex-col gap-2 px-6 py-4">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                to={item.path}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                  isActive
                    ? "bg-blue-600 text-white shadow-md scale-105"
                    : "text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 hover:scale-105"
                }`}
                onClick={() => setMenuOpen(false)}
              >
                <Icon className="w-5 h-5" />
                <span>{item.name}</span>
              </Link>
            );
          })}

          {isLoggedIn ? (
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 mt-2 bg-red-600 hover:bg-red-700 text-white rounded-lg shadow-md transition hover:scale-105"
            >
              <ArrowLeftOnRectangleIcon className="w-5 h-5" />
              Logout
            </button>
          ) : (
            <button
              onClick={onLogin}
              className="flex items-center gap-2 px-4 py-2 mt-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-md transition hover:scale-105"
            >
              <ArrowRightOnRectangleIcon className="w-5 h-5" />
              Login
            </button>
          )}
        </ul>
      </div>
    </nav>
  );
};
