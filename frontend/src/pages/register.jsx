
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Activity, ArrowLeft, Eye, EyeOff } from "lucide-react";
const API_URL = import.meta.env.VITE_API_URL;

function Register() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
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
    setSuccess("");

    if (
      !formData.username ||
      !formData.email ||
      !formData.password ||
      !formData.confirmPassword
    ) {
      setError("Please fill in all fields.");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(
        `${API_URL}/users/register`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username: formData.username,
            email: formData.email,
            password: formData.password,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Registration failed.");
        return;
      }

      setSuccess("Registration successful! Redirecting to login...");

      setTimeout(() => {
        navigate("/login");
      }, 1200);

    } catch (error) {
      console.error(error);
      setError("Unable to connect to the server.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">

      {/* Navbar */}
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


      {/* Register */}
      <div className="flex min-h-[calc(100vh-73px)] items-center justify-center px-6 py-12">

        <div className="w-full max-w-md">

          <div className="mb-8 text-center">

            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-xl bg-slate-900 text-blue-500 ring-1 ring-slate-800">
              <Activity size={28} />
            </div>

            <h2 className="mt-6 text-3xl font-bold text-white">
              Create Account
            </h2>

            <p className="mt-2 text-slate-400">
              Create your MotorGuard account to get started.
            </p>

          </div>


          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-7 shadow-xl">

            {error && (
              <div className="mb-5 rounded-lg border border-red-900/50 bg-red-950/30 px-4 py-3 text-sm text-red-400">
                {error}
              </div>
            )}

            {success && (
              <div className="mb-5 rounded-lg border border-green-900/50 bg-green-950/30 px-4 py-3 text-sm text-green-400">
                {success}
              </div>
            )}


            <form onSubmit={handleSubmit} className="space-y-5">

              {/* Username */}
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-300">
                  Username
                </label>

                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  placeholder="Enter your username"
                  className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none placeholder:text-slate-600 focus:border-blue-600"
                />
              </div>


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
                    placeholder="Create a password"
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


              {/* Confirm Password */}
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-300">
                  Confirm Password
                </label>

                <div className="relative">

                  <input
                    type={
                      showConfirmPassword
                        ? "text"
                        : "password"
                    }
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="Confirm your password"
                    className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 pr-12 text-white outline-none placeholder:text-slate-600 focus:border-blue-600"
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowConfirmPassword(
                        !showConfirmPassword
                      )
                    }
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
                  >
                    {showConfirmPassword ? (
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
                {loading ? "Creating Account..." : "Create Account"}
              </button>

            </form>


            <div className="mt-6 border-t border-slate-800 pt-6 text-center">

              <p className="text-sm text-slate-500">
                Already have an account?
              </p>

              <Link
                to="/login"
                className="mt-1 inline-block text-sm font-medium text-blue-500 hover:text-blue-400"
              >
                Sign in
              </Link>

            </div>

          </div>

        </div>
      </div>

    </div>
  );
}

export default Register;

