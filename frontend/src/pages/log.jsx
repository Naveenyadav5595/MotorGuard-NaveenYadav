import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  RefreshCw,
  FileText,
  Clock,
  User,
  Activity,
} from "lucide-react";

const API_URL = import.meta.env.VITE_API_URL;

const Log = () => {
  const navigate = useNavigate();

  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch all logs
  const fetchLogs = async () => {
    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("token");

      const response = await fetch(`${API_URL}/logs`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch logs");
      }

      setLogs(data.alllog || []);
    } catch (err) {
      console.error("Error fetching logs:", err);
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  // Format action name
  const formatAction = (action) => {
    return action
      ?.replaceAll("_", " ")
      .replace(/\b\w/g, (char) => char.toUpperCase());
  };

  // Action badge styling
  const getActionStyle = (action) => {
    switch (action) {
      case "Motor_Created":
        return "bg-green-500/10 text-green-400 border border-green-500/20";

      case "Motor_Updated":
        return "bg-blue-500/10 text-blue-400 border border-blue-500/20";

      case "Motor_Deleted":
        return "bg-red-500/10 text-red-400 border border-red-500/20";

      case "Motor_TurnedOn":
        return "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20";

      case "Motor_TurnedOff":
        return "bg-orange-500/10 text-orange-400 border border-orange-500/20";

      case "Alert_Acknowledged":
        return "bg-yellow-500/10 text-yellow-400 border border-yellow-500/20";

      case "Alert_Deleted":
        return "bg-red-500/10 text-red-400 border border-red-500/20";

      default:
        return "bg-slate-500/10 text-slate-400 border border-slate-500/20";
    }
  };

  // Format date and time
  const formatDate = (date) => {
    if (!date) return "N/A";

    return new Date(date).toLocaleString("en-IN", {
      dateStyle: "medium",
      timeStyle: "short",
    });
  };

  return (
    <div className="min-h-screen bg-slate-950 p-8">

      {/* Header */}
      <div className="mb-8 flex items-start justify-between">

        <div className="flex items-start gap-3">

          <button
            onClick={() => navigate("/dashboard")}
            className="mt-1 rounded-lg p-2 text-slate-400 transition hover:bg-slate-800 hover:text-white"
          >
            <ArrowLeft size={22} />
          </button>

          <div>
            <h1 className="text-2xl font-bold text-white">
              Audit Logs
            </h1>

            <p className="mt-1 text-sm text-slate-400">
              Track important actions performed in the MotorGuard system
            </p>
          </div>

        </div>

        {/* Refresh button */}
        <button
          onClick={fetchLogs}
          disabled={loading}
          className="flex items-center gap-2 rounded-lg border border-slate-700 bg-slate-900 px-4 py-2 text-sm font-medium text-slate-300 transition hover:bg-slate-800 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
        >
          <RefreshCw
            size={16}
            className={loading ? "animate-spin" : ""}
          />

          Refresh
        </button>

      </div>

      {/* Summary */}
      <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-3">

        <div className="rounded-xl border border-slate-800 bg-slate-900 p-5">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-blue-500/10 p-3">
              <FileText size={20} className="text-blue-400" />
            </div>

            <div>
              <p className="text-sm text-slate-400">
                Total Logs
              </p>

              <p className="text-2xl font-bold text-white">
                {logs.length}
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-900 p-5">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-purple-500/10 p-3">
              <User size={20} className="text-purple-400" />
            </div>

            <div>
              <p className="text-sm text-slate-400">
                Users Involved
              </p>

              <p className="text-2xl font-bold text-white">
                {
                  new Set(
                    logs.map((log) => log.userId)
                  ).size
                }
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-900 p-5">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-green-500/10 p-3">
              <Activity size={20} className="text-green-400" />
            </div>

            <div>
              <p className="text-sm text-slate-400">
                Motors Involved
              </p>

              <p className="text-2xl font-bold text-white">
                {
                  new Set(
                    logs.map((log) => log.motorId)
                  ).size
                }
              </p>
            </div>
          </div>
        </div>

      </div>

      {/* Loading */}
      {loading && (
        <div className="rounded-xl border border-slate-800 bg-slate-900 p-10 text-center">
          <RefreshCw
            size={28}
            className="mx-auto mb-3 animate-spin text-blue-400"
          />

          <p className="text-sm text-slate-400">
            Loading audit logs...
          </p>
        </div>
      )}

      {/* Error */}
      {!loading && error && (
        <div className="rounded-xl border border-red-500/20 bg-red-500/10 p-6 text-center">
          <p className="text-sm text-red-400">
            {error}
          </p>

          <button
            onClick={fetchLogs}
            className="mt-4 rounded-lg bg-red-500/10 px-4 py-2 text-sm font-medium text-red-400 transition hover:bg-red-500/20"
          >
            Try Again
          </button>
        </div>
      )}

      {/* Empty */}
      {!loading && !error && logs.length === 0 && (
        <div className="rounded-xl border border-slate-800 bg-slate-900 p-12 text-center">

          <FileText
            size={40}
            className="mx-auto mb-4 text-slate-600"
          />

          <h2 className="text-lg font-semibold text-white">
            No Audit Logs
          </h2>

          <p className="mt-2 text-sm text-slate-400">
            No actions have been recorded yet.
          </p>

        </div>
      )}

      {/* Logs */}
      {!loading && !error && logs.length > 0 && (
        <div className="overflow-hidden rounded-xl border border-slate-800 bg-slate-900">

          {/* Table Header */}
          <div className="hidden grid-cols-12 gap-4 border-b border-slate-800 bg-slate-950 px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500 md:grid">

            <div className="col-span-2">
              User
            </div>

            <div className="col-span-2">
              Action
            </div>

            <div className="col-span-2">
              Motor ID
            </div>

            <div className="col-span-4">
              Description
            </div>

            <div className="col-span-2">
              Time
            </div>

          </div>

          {/* Log Rows */}
          <div className="divide-y divide-slate-800">

            {logs.map((log) => (

              <div
                key={log._id}
                className="grid grid-cols-1 gap-4 px-6 py-5 transition hover:bg-slate-800/40 md:grid-cols-12 md:items-center"
              >

                {/* User */}
                <div className="md:col-span-2">

                  <div className="flex items-center gap-2">

                    <div className="rounded-lg bg-slate-800 p-2">
                      <User
                        size={15}
                        className="text-slate-400"
                      />
                    </div>

                    <div>
                      <p className="text-sm font-medium text-white">
                        {log.userName}
                      </p>

                      <p className="text-xs text-slate-500">
                        User ID: {log.userId}
                      </p>
                    </div>

                  </div>

                </div>

                {/* Action */}
                <div className="md:col-span-2">

                  <span
                    className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${getActionStyle(
                      log.action
                    )}`}
                  >
                    {formatAction(log.action)}
                  </span>

                </div>

                {/* Motor */}
                <div className="md:col-span-2">

                  <p className="text-sm font-medium text-slate-200">
                    {log.motorId}
                  </p>

                </div>

                {/* Description */}
                <div className="md:col-span-4">

                  <p className="text-sm text-slate-300">
                    {log.description}
                  </p>

                </div>

                {/* Time */}
                <div className="md:col-span-2">

                  <div className="flex items-center gap-2 text-xs text-slate-500">

                    <Clock size={14} />

                    <span>
                      {formatDate(log.createdAt)}
                    </span>

                  </div>

                </div>

              </div>

            ))}

          </div>

        </div>
      )}

    </div>
  );
};

export default Log;