import { useState } from "react";
import { loginUser } from "../services/api";
import { useNavigate } from "react-router-dom";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";

const Login = () => {
  const [form, setForm] = useState({ username: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await loginUser(form);
      if (!res.token) throw new Error("Login failed: No token returned");

      localStorage.setItem("token", res.token);
      if (res.user?.username) localStorage.setItem("userName", res.user.username);

      navigate("/transactions");
    } catch (err) {
      setError(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-blue-50 to-blue-200 dark:from-gray-900 dark:to-gray-800">
      <form
        onSubmit={handleSubmit}
        className="bg-white dark:bg-gray-900 p-10 rounded-3xl shadow-2xl w-full max-w-md border border-gray-200 dark:border-gray-700"
      >
        <h2 className="text-4xl font-extrabold mb-2 text-center text-gray-900 dark:text-gray-50">
          Welcome Back
        </h2>
        <p className="text-center text-gray-500 dark:text-gray-300 mb-8">
          Sign in to access your dashboard
        </p>

        {error && <p className="text-red-500 text-center font-medium mb-4">{error}</p>}

        {/* Username */}
        <div className="relative mb-6">
          <input
            type="text"
            name="username"
            value={form.username}
            onChange={handleChange}
            className="peer w-full px-4 pt-5 pb-2 rounded-xl border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 transition shadow-sm"
            required
          />
          <label className="absolute left-4 top-2.5 text-gray-400 dark:text-gray-300 text-sm transition-all
            peer-focus:top-1 peer-focus:text-xs peer-focus:text-blue-500
            peer-valid:top-1 peer-valid:text-xs peer-valid:text-blue-500">
            Username
          </label>
        </div>

        {/* Password */}
        <div className="relative mb-6">
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            value={form.password}
            onChange={handleChange}
            className="peer w-full px-4 pt-5 pb-2 rounded-xl border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 transition shadow-sm"
            required
          />
          <label className="absolute left-4 top-2.5 text-gray-400 dark:text-gray-300 text-sm transition-all
            peer-focus:top-1 peer-focus:text-xs peer-focus:text-blue-500
            peer-valid:top-1 peer-valid:text-xs peer-valid:text-blue-500">
            Password
          </label>
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-3 w-5 h-5 text-gray-400 dark:text-gray-300"
          >
            {showPassword ? <EyeSlashIcon /> : <EyeIcon />}
          </button>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-900 text-white font-semibold text-lg transition-all shadow-lg disabled:opacity-50"
        >
          {loading ? "Logging in..." : "Sign In"}
        </button>

        <p className="mt-6 text-center text-gray-600 dark:text-gray-300 text-sm">
          Don’t have an account?{" "}
          <a href="/sign-up" className="text-blue-600 hover:underline font-medium">
            Sign Up
          </a>
        </p>
      </form>
    </div>
  );
};

export default Login;
