import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import {
  AlertTriangle,
  AlertCircle,
  Search,
  RefreshCw,
  Bell,
  CheckCircle,
  Clock,
  ArrowLeft
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL;


function Alerts() {

  const navigate = useNavigate();
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [severityFilter, setSeverityFilter] = useState("All");
  const [acknowledgedFilter, setAcknowledgedFilter] = useState("All");

  // ================================
  // FETCH ALERTS
  // ================================

  const fetchAlerts = async () => {
    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("token");

      const response = await fetch(
        `${API_URL}/alerts`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      console.log("ALERT DATA FROM BACKEND:", data);

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to fetch alerts"
        );
      }

      setAlerts(data.allAlerts || []);
    } catch (error) {
      console.error("Fetch alerts error:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  // ================================
  // FETCH WHEN PAGE LOADS
  // ================================

  useEffect(() => {
    fetchAlerts();
  }, []);

  // ================================
  // SEVERITY STYLE
  // ================================

  const getSeverityStyle = (severity) => {
    if (severity === "Critical") {
      return {
        badge:
          "bg-red-500/10 text-red-400 border-red-500/20",
        border: "border-red-500/30",
        icon: <AlertCircle size={18} />,
      };
    }

    return {
      badge:
        "bg-amber-500/10 text-amber-400 border-amber-500/20",
      border: "border-amber-500/30",
      icon: <AlertTriangle size={18} />,
    };
  };

  useEffect(() => {

    const socket = io("http://localhost:8000");

    socket.on("newAlert", (newAlert) => {
        setAlerts((prevAlerts) => [
          newAlert,
           ...prevAlerts
       ]);
    });

    socket.on("alertAcknowledged", ({ alertId }) => {

        setAlerts((prevAlerts) =>
            prevAlerts.map((alert) =>
                alert._id === alertId
                    ? { ...alert, acknowledged: true }
                    : alert
            )
        );

    });

    socket.on("alertDeleted", ({ alertId }) => {

        setAlerts((prevAlerts) =>
            prevAlerts.filter(
                (alert) => alert._id !== alertId
            )
        );

    });

    return () => {
        socket.disconnect();
    };
  }, []);


  // ================================
  // FILTER ALERTS
  // ================================

  const filteredAlerts = alerts.filter((alert) => {
    const searchText = search.toLowerCase();

    const matchesSearch =
      alert.motorId
        ?.toLowerCase()
        .includes(searchText) ||
      alert.deviceId
        ?.toLowerCase()
        .includes(searchText) ||
      alert.message?.some((msg) =>
        msg.toLowerCase().includes(searchText)
      );

    const matchesSeverity =
      severityFilter === "All" ||
      alert.severity === severityFilter;

    const matchesAcknowledged =
      acknowledgedFilter === "All" ||
      (acknowledgedFilter === "Acknowledged" &&
        alert.acknowledged === true) ||
      (acknowledgedFilter === "Unacknowledged" &&
        alert.acknowledged === false);

    return (
      matchesSearch &&
      matchesSeverity &&
      matchesAcknowledged
    );
  });

  // ================================
  // SUMMARY COUNTS
  // ================================

  const totalAlerts = alerts.length;

  const criticalAlerts = alerts.filter(
    (alert) => alert.severity === "Critical"
  ).length;

  const warningAlerts = alerts.filter(
    (alert) => alert.severity === "Warning"
  ).length;

  const unacknowledgedAlerts = alerts.filter(
    (alert) => alert.acknowledged === false
  ).length;

  // ================================
  // JSX
  // ================================

  //for changing acknowledge status of alert

  const handleAcknowledge = async (alertId) => {
    try {
        console.log("Acknowledge clicked:", alertId);
       const token = localStorage.getItem("token");

       const response = await fetch(
        `${API_URL}/${alertId}/acknowledge`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
       );
        const data = await response.json();
            console.log("Acknowledge response:", data);
        if (!response.ok) {
          throw new Error(data.message || "Failed to acknowledge alert");
        }

        // update frontend
        setAlerts((prevAlerts) =>
            prevAlerts.map((alert) =>
                alert._id === alertId
                    ? { ...alert, acknowledged: true }
                    : alert
            )
        );

    } catch (error) {
        console.error("Error acknowledging alert:", error);
    }
  };

  const handleDelete = async (alertId) => {
   try {
    const token = localStorage.getItem("token");

    const response = await fetch(
      `${API_URL}/${alertId}/delete`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to delete alert");
    }

    // Remove deleted alert from frontend
    setAlerts((prevAlerts) =>
      prevAlerts.filter((alert) => alert._id !== alertId)
    );

   } catch (error) {
    console.error("Error deleting alert:", error);
   }
  };

  return (
    <div className="min-h-screen bg-slate-950 p-6 lg:p-8">

      {/* ================================= */}
      {/* HEADER */}
      {/* ================================= */}

      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        
        <div className="flex items-start gap-3">
         {/* for going back to dashboard*/}
         <button onClick={() => navigate("/dashboard")} className="mt-1 rounded-lg p-2 text-slate-400 transition hover:bg-slate-800 hover:text-white" >
          <ArrowLeft size={22} />
         </button>

         <div>
          <h1 className="text-2xl font-bold text-white">
            Alerts & Notifications
          </h1>

          <p className="mt-1 text-sm text-slate-400">
            Monitor alerts generated by your motors
          </p>
         </div>
        </div>

        <button
          onClick={fetchAlerts}
          disabled={loading}
          className="flex w-fit items-center gap-2 rounded-lg border border-slate-700 bg-slate-900 px-4 py-2.5 text-sm font-medium text-slate-300 transition hover:bg-slate-800 hover:text-white disabled:opacity-50"
        >
          <RefreshCw
            size={17}
            className={loading ? "animate-spin" : ""}
          />

          Refresh
        </button>

      </div>


      {/* ================================= */}
      {/* SUMMARY CARDS */}
      {/* ================================= */}

      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">

        {/* Total */}
        <div className="rounded-xl border border-slate-700 bg-slate-900 p-5">

          <div className="flex items-center justify-between">

            <div>
              <p className="text-sm text-slate-400">
                Total Alerts
              </p>

              <p className="mt-2 text-3xl font-bold text-white">
                {totalAlerts}
              </p>
            </div>

            <div className="rounded-lg bg-blue-500/10 p-3">
              <Bell
                size={22}
                className="text-blue-400"
              />
            </div>

          </div>

        </div>


        {/* Critical */}
        <div className="rounded-xl border border-red-500/20 bg-slate-900 p-5">

          <div className="flex items-center justify-between">

            <div>
              <p className="text-sm text-slate-400">
                Critical
              </p>

              <p className="mt-2 text-3xl font-bold text-red-400">
                {criticalAlerts}
              </p>
            </div>

            <div className="rounded-lg bg-red-500/10 p-3">
              <AlertCircle
                size={22}
                className="text-red-400"
              />
            </div>

          </div>

        </div>


        {/* Warning */}
        <div className="rounded-xl border border-amber-500/20 bg-slate-900 p-5">

          <div className="flex items-center justify-between">

            <div>
              <p className="text-sm text-slate-400">
                Warning
              </p>

              <p className="mt-2 text-3xl font-bold text-amber-400">
                {warningAlerts}
              </p>
            </div>

            <div className="rounded-lg bg-amber-500/10 p-3">
              <AlertTriangle
                size={22}
                className="text-amber-400"
              />
            </div>

          </div>

        </div>


        {/* Unacknowledged */}
        <div className="rounded-xl border border-slate-700 bg-slate-900 p-5">

          <div className="flex items-center justify-between">

            <div>
              <p className="text-sm text-slate-400">
                Unacknowledged
              </p>

              <p className="mt-2 text-3xl font-bold text-white">
                {unacknowledgedAlerts}
              </p>
            </div>

            <div className="rounded-lg bg-slate-800 p-3">
              <Clock
                size={22}
                className="text-slate-300"
              />
            </div>

          </div>

        </div>

      </div>


      {/* ================================= */}
      {/* FILTER SECTION */}
      {/* ================================= */}

      <div className="mt-8 rounded-xl border border-slate-700 bg-slate-900 p-5">

        <div className="flex flex-col gap-4 lg:flex-row lg:items-center">

          {/* Search */}

          <div className="relative flex-1">

            <Search
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"
            />

            <input
              type="text"
              placeholder="Search by motor, device or alert message..."
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
              className="w-full rounded-lg border border-slate-700 bg-slate-950 py-2.5 pl-10 pr-4 text-sm text-white outline-none placeholder:text-slate-600 focus:border-slate-500"
            />

          </div>


          {/* Severity */}

          <select
            value={severityFilter}
            onChange={(e) =>
              setSeverityFilter(e.target.value)
            }
            className="rounded-lg border border-slate-700 bg-slate-950 px-4 py-2.5 text-sm text-slate-300 outline-none"
          >
            <option value="All">
              All Severities
            </option>

            <option value="Critical">
              Critical
            </option>

            <option value="Warning">
              Warning
            </option>
          </select>


          {/* Acknowledged */}

          <select
            value={acknowledgedFilter}
            onChange={(e) =>
              setAcknowledgedFilter(e.target.value)
            }
            className="rounded-lg border border-slate-700 bg-slate-950 px-4 py-2.5 text-sm text-slate-300 outline-none"
          >
            <option value="All">
              All Alerts
            </option>

            <option value="Unacknowledged">
              Unacknowledged
            </option>

            <option value="Acknowledged">
              Acknowledged
            </option>
          </select>

        </div>

      </div>


      {/* ================================= */}
      {/* LOADING */}
      {/* ================================= */}

      {loading && (
        <div className="mt-8 rounded-xl border border-slate-700 bg-slate-900 p-10 text-center">

          <RefreshCw
            size={24}
            className="mx-auto animate-spin text-slate-400"
          />

          <p className="mt-3 text-sm text-slate-400">
            Loading alerts...
          </p>

        </div>
      )}


      {/* ================================= */}
      {/* ERROR */}
      {/* ================================= */}

      {!loading && error && (
        <div className="mt-8 rounded-xl border border-red-500/30 bg-red-500/10 p-6">

          <div className="flex items-center gap-3">

            <AlertCircle
              size={22}
              className="text-red-400"
            />

            <div>
              <p className="font-medium text-red-400">
                Failed to load alerts
              </p>

              <p className="mt-1 text-sm text-red-300/70">
                {error}
              </p>
            </div>

          </div>

          <button
            onClick={fetchAlerts}
            className="mt-4 rounded-lg bg-red-500/10 px-4 py-2 text-sm text-red-400 hover:bg-red-500/20"
          >
            Try Again
          </button>

        </div>
      )}


      {/* ================================= */}
      {/* NO ALERTS */}
      {/* ================================= */}

      {!loading &&
        !error &&
        filteredAlerts.length === 0 && (
          <div className="mt-8 rounded-xl border border-slate-700 bg-slate-900 p-10 text-center">

            <CheckCircle
              size={40}
              className="mx-auto text-emerald-400"
            />

            <h2 className="mt-4 text-lg font-semibold text-white">
              No alerts found
            </h2>

            <p className="mt-2 text-sm text-slate-500">
              No alerts match your current filters.
            </p>

          </div>
        )}


      {/* ================================= */}
      {/* ALERT LIST */}
      {/* ================================= */}

      {!loading &&
        !error &&
        filteredAlerts.length > 0 && (

          <div className="mt-8 space-y-4">

            {filteredAlerts.map((alert) => {

              const severityStyle =
                getSeverityStyle(alert.severity);

              return (
                <div
                  key={alert._id}
                  className={`rounded-xl border bg-slate-900 p-5 ${severityStyle.border}`}
                >

                  {/* Alert Header */}

                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

                    <div className="flex items-center gap-3">

                      <div
                        className={`rounded-lg border p-2 ${severityStyle.badge}`}
                      >
                        {severityStyle.icon}
                      </div>

                      <div>

                        <h2 className="font-semibold text-white">
                          {alert.motorId}
                        </h2>

                        <p className="mt-1 text-xs text-slate-500">
                          Device: {alert.deviceId}
                        </p>

                      </div>

                    </div>


                    {/* Severity Badge */}

                    <span
                      className={`flex w-fit items-center gap-2 rounded-full border px-3 py-1 text-sm font-medium ${severityStyle.badge}`}
                    >
                      {alert.severity}
                    </span>

                  </div>


                  {/* Alert Messages */}

                  <div className="mt-5 rounded-lg border border-slate-800 bg-slate-950 p-4">

                    <p className="mb-3 text-xs font-medium uppercase tracking-wider text-slate-500">
                      Alert Details
                    </p>

                    <div className="space-y-2">

                      {alert.message?.map(
                        (msg, index) => (
                          <p
                            key={index}
                            className="text-sm leading-6 text-slate-300"
                          >
                            <span className="mr-2 text-slate-500">
                              •
                            </span>

                            {msg}
                          </p>
                        )
                      )}

                    </div>

                  </div>


                  {/* Footer */}

                  <div className="mt-4 flex flex-col gap-3 border-t border-slate-800 pt-4 sm:flex-row sm:items-center sm:justify-between">

                    <div className="flex items-center gap-2 text-xs text-slate-500">

                      <Clock size={14} />

                      {new Date(
                        alert.timestamp
                      ).toLocaleString()}

                    </div>


                    {/* Acknowledged Status */}

                    {alert.acknowledged ? (
                           <div className="flex items-center gap-2">
                              <span className="flex w-fit items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-xs text-emerald-400">
                                <CheckCircle size={14} />
                                Acknowledged
                              </span>
                              <button onClick={() => handleDelete(alert._id)}
                                className="flex w-fit items-center gap-2 rounded-full border border-red-500/20 bg-red-500/10 px-3 py-1 text-xs text-red-400 transition hover:border-red-500/40 hover:bg-red-500/20"
                              >
                                Delete
                              </button>
                            </div>
                    ) : (
                        <button onClick={() => handleAcknowledge(alert._id)}
                           className="flex w-fit items-center gap-2 rounded-full border border-slate-700 bg-slate-950 px-3 py-1 text-xs text-slate-400 hover:border-emerald-500/40 hover:text-emerald-400 transition">
                           <Clock size={14} />
                           Acknowledge
                        </button>
                    )}

                  </div>

                </div>
              );
            })}

          </div>
        )}

    </div>
  );
}

export default Alerts;