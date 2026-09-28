import React, { useEffect, useState } from "react";
import { ArrowLeft, Power, RefreshCw } from "lucide-react";
import { useNavigate } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL;

const MotorControl = () => {
  const navigate = useNavigate();

  const [motors, setMotors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionLoading, setActionLoading] = useState(null);
  const [message, setMessage] = useState("");

  const token = localStorage.getItem("token");

  // Fetch all motors
  const fetchMotors = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(`${API_URL}/motors`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch motors");
      }

      setMotors(data.allMotors || []);
    } catch (err) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMotors();
  }, []);

  // Turn OFF
  const handleTurnOff = async (motorId) => {
    try {
      setActionLoading(motorId);
      setMessage("");
      setError("");

      const response = await fetch(
        `${API_URL}/motors/${motorId}/turnOff`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to turn OFF motor");
      }

      setMessage(data.message);

      // Update local motor state
      setMotors((prevMotors) =>
        prevMotors.map((motor) =>
          motor.motorId === motorId
            ? { ...motor, powerState: data.powerState }
            : motor
        )
      );
    } catch (err) {
      setError(err.message || "Failed to turn OFF motor");
    } finally {
      setActionLoading(null);
    }
  };

  // Turn ON
  const handleTurnOn = async (motorId) => {
    try {
      setActionLoading(motorId);
      setMessage("");
      setError("");

      const response = await fetch(
        `${API_URL}/motors/${motorId}/turnOn`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to turn ON motor");
      }

      setMessage(data.message);

      // Update local motor state
      setMotors((prevMotors) =>
        prevMotors.map((motor) =>
          motor.motorId === motorId
            ? { ...motor, powerState: data.powerState }
            : motor
        )
      );
    } catch (err) {
      setError(err.message || "Failed to turn ON motor");
    } finally {
      setActionLoading(null);
    }
  };

  // Status styling
  const getStatusStyle = (status) => {
    switch (status) {
      case "Healthy":
        return "border-emerald-500/30 bg-emerald-500/10 text-emerald-400";

      case "Warning":
        return "border-yellow-500/30 bg-yellow-500/10 text-yellow-400";

      case "Critical":
        return "border-red-500/30 bg-red-500/10 text-red-400";

      case "Offline":
        return "border-slate-500/30 bg-slate-500/10 text-slate-400";

      default:
        return "border-slate-700 bg-slate-900 text-slate-400";
    }
  };

  useEffect(() => {
     if (!message) return;
     const timer = setTimeout(() => { setMessage("");}, 3000);
     return () => clearTimeout(timer);
  c}, [message]);

  return (
    <div className="min-h-screen bg-slate-950 p-8 text-white">

      {/* Header */}
      <div className="mb-8 flex items-start gap-3">

        <button
          onClick={() => navigate("/dashboard")}
          className="mt-1 rounded-lg p-2 text-slate-400 transition hover:bg-slate-800 hover:text-white"
        >
          <ArrowLeft size={22} />
        </button>

        <div>
          <h1 className="text-2xl font-bold">
            Motor Control
          </h1>

          <p className="mt-1 text-sm text-slate-400">
            Manually control the power state of your motors
          </p>
        </div>
      </div>

      {/* Success message */}
      {message && (
        <div className="mb-6 rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-400">
          {message}
        </div>
      )}

      {/* Error message */}
      {error && (
        <div className="mb-6 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">
          {error}
        </div>
      )}

      {/* Refresh */}
      <div className="mb-6 flex justify-end">
        <button
          onClick={fetchMotors}
          disabled={loading}
          className="flex items-center gap-2 rounded-lg border border-slate-700 bg-slate-900 px-4 py-2 text-sm text-slate-300 transition hover:border-slate-600 hover:bg-slate-800 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
        >
          <RefreshCw
            size={16}
            className={loading ? "animate-spin" : ""}
          />
          Refresh
        </button>
      </div>

      {/* Loading */}
      {loading ? (
        <div className="flex min-h-[300px] items-center justify-center">
          <p className="text-slate-400">
            Loading motors...
          </p>
        </div>
      ) : motors.length === 0 ? (
        /* No motors */
        <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-10 text-center">
          <Power
            size={40}
            className="mx-auto mb-4 text-slate-600"
          />

          <h2 className="text-lg font-semibold text-white">
            No motors found
          </h2>

          <p className="mt-2 text-sm text-slate-400">
            There are no motors available for control.
          </p>
        </div>
      ) : (
        /* Motor cards */
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">

          {motors.map((motor) => (
            <div
              key={motor.motorId}
              className="rounded-xl border border-slate-800 bg-slate-900/70 p-6"
            >

              {/* Motor name + power state */}
              <div className="mb-5 flex items-start justify-between">

                <div>
                  <h2 className="text-lg font-semibold text-white">
                    {motor.motorName}
                  </h2>

                  <p className="mt-1 text-xs text-slate-500">
                    {motor.motorId}
                  </p>
                </div>

                <div
                  className={`flex items-center gap-2 rounded-full border px-3 py-1 text-xs ${
                    motor.powerState === "ON"
                      ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-400"
                      : "border-slate-700 bg-slate-950 text-slate-400"
                  }`}
                >
                  <span
                    className={`h-2 w-2 rounded-full ${
                      motor.powerState === "ON"
                        ? "bg-emerald-400"
                        : "bg-slate-500"
                    }`}
                  />

                  {motor.powerState}
                </div>
              </div>

              {/* Motor information */}
              <div className="space-y-3 border-y border-slate-800 py-4">

                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-500">
                    Status
                  </span>

                  <span
                    className={`rounded-full border px-3 py-1 text-xs ${getStatusStyle(
                      motor.status
                    )}`}
                  >
                    {motor.status}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-500">
                    Device
                  </span>

                  <span className="text-sm text-slate-300">
                    {motor.deviceId}
                  </span>
                </div>

              </div>

              {/* Control button */}
              <div className="mt-5">

                {motor.powerState === "ON" ? (
                  <button
                    onClick={() => handleTurnOff(motor.motorId)}
                    disabled={actionLoading === motor.motorId}
                    className="flex w-full items-center justify-center gap-2 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm font-medium text-red-400 transition hover:bg-red-500/20 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <Power size={17} />

                    {actionLoading === motor.motorId
                      ? "Turning OFF..."
                      : "Turn OFF"}
                  </button>
                ) : (
                  <button
                    onClick={() => handleTurnOn(motor.motorId)}
                    disabled={actionLoading === motor.motorId}
                    className="flex w-full items-center justify-center gap-2 rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm font-medium text-emerald-400 transition hover:bg-emerald-500/20 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <Power size={17} />

                    {actionLoading === motor.motorId
                      ? "Turning ON..."
                      : "Turn ON"}
                  </button>
                )}

              </div>

            </div>
          ))}

        </div>
      )}
    </div>
  );
};

export default MotorControl;