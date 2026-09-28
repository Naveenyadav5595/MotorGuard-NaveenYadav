
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Activity, ArrowLeft, Eye, EyeOff } from "lucide-react";

const API_URL = import.meta.env.VITE_API_URL;

function Login() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    if (!formData.email || !formData.password) {
      setError("Please enter email and password.");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(
        `${API_URL}/users/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Login failed.");
        return;
      }

      // Save authentication information
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      // Go to dashboard
      navigate("/");

    } catch (error) {
      console.error(error);
      setError("Unable to connect to the server.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">

      {/* Top navigation */}
      <div className="border-b border-slate-800">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">

          <Link
            to="/"
            className="flex items-center gap-3"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-700">
              <Activity size={22} />
            </div>

            <div>
              <h1 className="text-xl font-bold">
                MotorGuard
              </h1>

              <p className="text-[10px] uppercase tracking-widest text-slate-500">
                Industrial Monitoring
              </p>
            </div>
          </Link>

          <Link
            to="/"
            className="flex items-center gap-2 text-sm text-slate-400 transition hover:text-white"
          >
            <ArrowLeft size={16} />
            Back to Home
          </Link>

        </div>
      </div>


      {/* Login */}
      <div className="flex min-h-[calc(100vh-73px)] items-center justify-center px-6 py-12">

        <div className="w-full max-w-md">

          {/* Heading */}
          <div className="mb-8 text-center">

            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-xl bg-slate-900 text-blue-500 ring-1 ring-slate-800">
              <Activity size={28} />
            </div>

            <h2 className="mt-6 text-3xl font-bold text-white">
              Welcome Back
            </h2>

            <p className="mt-2 text-slate-400">
              Sign in to access your MotorGuard dashboard.
            </p>

          </div>


          {/* Form card */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-7 shadow-xl">

            {error && (
              <div className="mb-5 rounded-lg border border-red-900/50 bg-red-950/30 px-4 py-3 text-sm text-red-400">
                {error}
              </div>
            )}


            <form onSubmit={handleSubmit} className="space-y-5">

              {/* Email */}
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-300">
                  Email
                </label>

                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                  className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none placeholder:text-slate-600 focus:border-blue-600"
                />
              </div>


              {/* Password */}
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-300">
                  Password
                </label>

                <div className="relative">

                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Enter your password"
                    className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 pr-12 text-white outline-none placeholder:text-slate-600 focus:border-blue-600"
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowPassword(!showPassword)
                    }
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
                  >
                    {showPassword ? (
                      <EyeOff size={19} />
                    ) : (
                      <Eye size={19} />
                    )}
                  </button>

                </div>
              </div>


              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-lg bg-blue-700 py-3 font-semibold text-white transition hover:bg-blue-600 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? "Signing in..." : "Sign In"}
              </button>

            </form>


            {/* Register */}
            <div className="mt-6 border-t border-slate-800 pt-6 text-center">

              <p className="text-sm text-slate-500">
                Don't have an account?
              </p>

              <Link
                to="/register"
                className="mt-1 inline-block text-sm font-medium text-blue-500 hover:text-blue-400"
              >
                Create an account
              </Link>

            </div>

          </div>

        </div>
      </div>

    </div>
  );
}

export default Login;

