import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { io } from "socket.io-client";

import {
  ArrowLeft,
  Activity,
  Thermometer,
  Gauge,
  Waves
} from "lucide-react";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from "recharts";

const API_URL = import.meta.env.VITE_API_URL;


function MotorDetails({motorId}) {
  const navigate = useNavigate();

  const [readings, setReadings] = useState([]);
  const [motor, setMotor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");


  // Fetch sensor readings
  useEffect(() => {

    const fetchReadings = async () => {

      try {

        const token = localStorage.getItem("token");

        const response = await fetch(
          `${API_URL}/sensors/readings/${motorId}/all`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );
        const data = await response.json();
        if (!response.ok) {
          throw new Error(
            data.message || "Failed to fetch sensor readings"
          );
        }
        setReadings(data.allReading);

      } catch (error) {

        console.error("Fetch readings error:", error);

        setError(error.message);

      } finally {

        setLoading(false);

      }
    };

    fetchReadings();

  }, [motorId]);

  useEffect(() => {
  const socket = io(`${API_URL}`);

  socket.on("connect", () => {
    console.log("Socket connected:", socket.id);
  });

  socket.on("sensorUpdate", (newReading) => {
    console.log("New sensor reading:", newReading);

    // Only accept readings for the motor currently being viewed
    if (newReading.motorId === motorId) {
      setReadings((prevReadings) => [
        ...prevReadings,
        newReading
      ]);
    }
  });

  socket.on("disconnect", () => {
    console.log("Socket disconnected");
  });

  return () => {
    socket.disconnect();
  };
 }, [motorId]);

// for motor configuration

 useEffect(() => {
  const fetchMotor = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await fetch(
        `${API_URL}/motors/${motorId}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to fetch motor details"
        );
      }

      setMotor(data.motor);

    } catch (error) {
      console.error("Fetch motor error:", error);
      setError(error.message);
    }
  };
  fetchMotor();
 }, [motorId]);


  // Latest reading
  const latestReading =
    readings.length > 0
      ? readings[readings.length - 1]
      : null;


  // Data for charts
  const chartData = readings.map((reading) => ({
    time: new Date(reading.timestamp).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit"
    }),

    temperature: reading.temperature,

    rpm: reading.rpm,

    vibration: reading.vibration
  }));


  return (

    <div className="min-h-screen bg-slate-950 text-slate-100">

      {/* Header */}

      <header className="border-b border-slate-800 bg-slate-900">

        <div className="flex items-center gap-4 px-6 py-5">

          <button
            onClick={() => navigate("/dashboard")}
            className="rounded-lg border border-slate-700 p-2 text-slate-400 transition hover:bg-slate-800 hover:text-white" >
            <ArrowLeft size={20} />
          </button>

          <div>
            <h1 className="text-xl font-semibold text-white">
              Motor Details
            </h1>
            <p className="text-sm text-slate-500">
              Monitoring and sensor history
            </p>
          </div>

        </div>

      </header>


      {/* Main */}

      <main className="p-6">


        {/* Motor title */}

        <div className="mb-8">

          <div className="flex items-center gap-3">

            <div className="rounded-lg bg-blue-500/10 p-3">

              <Activity
                size={24}
                className="text-blue-400"
              />

            </div>


            <div>

              <h2 className="text-2xl font-semibold text-white">
                {motorId}
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Motor sensor monitoring
              </p>

            </div>

          </div>

        </div>


        {/* Loading */}

        {loading && (

          <div className="rounded-xl border border-slate-800 bg-slate-900 p-6">

            <p className="text-sm text-slate-400">
              Loading sensor readings...
            </p>

          </div>

        )}


        {/* Error */}

        {!loading && error && (

          <div className="rounded-xl border border-red-900/50 bg-red-950/20 p-6">

            <p className="text-sm text-red-400">
              {error}
            </p>

          </div>

        )}


        {!loading && !error && latestReading && (

          <>

            {/* Latest Reading */}

            <div className="mb-8">

              <div className="mb-4">

                <h2 className="text-lg font-semibold text-white">
                  Latest Reading
                </h2>

                <p className="text-sm text-slate-500">
                  Most recent sensor values received from the motor
                </p>

              </div>


              <div className="grid grid-cols-1 gap-4 md:grid-cols-3">


                {/* Temperature */}

                <div className="rounded-xl border border-slate-800 bg-slate-900 p-5">

                  <div className="flex items-center justify-between">

                    <div>

                      <p className="text-sm text-slate-500">
                        Temperature
                      </p>

                      <p className="mt-2 text-3xl font-bold text-white">
                        {latestReading.temperature}°C
                      </p>

                    </div>


                    <div className="rounded-lg bg-orange-500/10 p-3">

                      <Thermometer
                        size={24}
                        className="text-orange-400"
                      />

                    </div>

                  </div>

                </div>


                {/* RPM */}

                <div className="rounded-xl border border-slate-800 bg-slate-900 p-5">

                  <div className="flex items-center justify-between">

                    <div>

                      <p className="text-sm text-slate-500">
                        RPM
                      </p>

                      <p className="mt-2 text-3xl font-bold text-white">
                        {latestReading.rpm}
                      </p>

                    </div>


                    <div className="rounded-lg bg-blue-500/10 p-3">

                      <Gauge
                        size={24}
                        className="text-blue-400"
                      />

                    </div>

                  </div>

                </div>


                {/* Vibration */}

                <div className="rounded-xl border border-slate-800 bg-slate-900 p-5">

                  <div className="flex items-center justify-between">

                    <div>

                      <p className="text-sm text-slate-500">
                        Vibration
                      </p>

                      <p className="mt-2 text-3xl font-bold text-white">
                        {latestReading.vibration}
                      </p>

                    </div>


                    <div className="rounded-lg bg-purple-500/10 p-3">

                      <Waves
                        size={24}
                        className="text-purple-400"
                      />

                    </div>

                  </div>

                </div>

              </div>


              {/* Timestamp */}

              <p className="mt-3 text-xs text-slate-500">

                Last updated:{" "}

                {new Date(
                  latestReading.timestamp
                ).toLocaleString()}

              </p>

            </div>


            {/* Charts */}

            <div className="space-y-6">


              {/* Temperature Graph */}

              <div className="rounded-xl border border-slate-800 bg-slate-900 p-6">

                <div className="mb-6">

                  <h3 className="text-lg font-semibold text-white">
                    Temperature
                  </h3>

                  <p className="text-sm text-slate-500">
                    Temperature history
                  </p>

                </div>


                <div className="h-80">

                  <ResponsiveContainer
                    width="100%"
                    height="100%"
                  >

                    <LineChart data={chartData}>

                      <CartesianGrid
                        strokeDasharray="3 3"
                        stroke="#334155"
                      />

                      <XAxis
                        dataKey="time"
                        stroke="#64748b"
                      />

                      <YAxis
                        stroke="#64748b"
                      />

                      <Tooltip />

                      <Line
                        type="monotone"
                        dataKey="temperature"
                        stroke="#fb923c"
                        strokeWidth={2}
                        dot={false}
                      />

                    </LineChart>

                  </ResponsiveContainer>

                </div>

              </div>


              {/* RPM Graph */}

              <div className="rounded-xl border border-slate-800 bg-slate-900 p-6">

                <div className="mb-6">

                  <h3 className="text-lg font-semibold text-white">
                    RPM
                  </h3>

                  <p className="text-sm text-slate-500">
                    Motor speed history
                  </p>

                </div>


                <div className="h-80">

                  <ResponsiveContainer
                    width="100%"
                    height="100%"
                  >

                    <LineChart data={chartData}>

                      <CartesianGrid
                        strokeDasharray="3 3"
                        stroke="#334155"
                      />

                      <XAxis
                        dataKey="time"
                        stroke="#64748b"
                      />

                      <YAxis
                        stroke="#64748b"
                      />

                      <Tooltip />

                      <Line
                        type="monotone"
                        dataKey="rpm"
                        stroke="#60a5fa"
                        strokeWidth={2}
                        dot={false}
                      />

                    </LineChart>

                  </ResponsiveContainer>

                </div>

              </div>


              {/* Vibration Graph */}

              <div className="rounded-xl border border-slate-800 bg-slate-900 p-6">

                <div className="mb-6">

                  <h3 className="text-lg font-semibold text-white">
                    Vibration
                  </h3>

                  <p className="text-sm text-slate-500">
                    Vibration history
                  </p>

                </div>


                <div className="h-80">

                  <ResponsiveContainer
                    width="100%"
                    height="100%"
                  >

                    <LineChart data={chartData}>

                      <CartesianGrid
                        strokeDasharray="3 3"
                        stroke="#334155"
                      />

                      <XAxis
                        dataKey="time"
                        stroke="#64748b"
                      />

                      <YAxis
                        stroke="#64748b"
                      />

                      <Tooltip />

                      <Line
                        type="monotone"
                        dataKey="vibration"
                        stroke="#a78bfa"
                        strokeWidth={2}
                        dot={false}
                      />

                    </LineChart>

                  </ResponsiveContainer>

                </div>

              </div>


            </div>

          </>

        )}

      </main>

      {/* Motor Configuration */}
      {motor && (
        <div className="mt-8 rounded-xl border border-slate-800 bg-slate-900 p-6">

          <div className="mb-6">
            <h2 className="text-lg font-semibold text-white">
              Motor Configuration
            </h2>
            <p className="text-sm text-slate-500">
               Configured thresholds for {motor.motorId}
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
             {/* Temperature */}
            <div className="rounded-xl border border-slate-800 bg-slate-950 p-5">

              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-500">
                    Temperature
                  </p>
                  <p className="mt-2 text-2xl font-bold text-white">
                    {motor.temperatureThreshold.warning}°C
                  </p>
                </div>
                <Thermometer
                  size={24}
                  className="text-orange-400"
                />
              </div>

              <div className="mt-4 border-t border-slate-800 pt-3">
                <p className="text-xs text-slate-500">
                  Warning
                </p>
                <p className="text-sm text-orange-400">
                  {motor.temperatureThreshold.warning}°C
                </p>
                <p className="mt-2 text-xs text-slate-500">
                  Critical
                </p>
                <p className="text-sm text-red-400">
                  {motor.temperatureThreshold.critical}°C
                </p>
              </div>
            </div>

             {/* RPM */}
            <div className="rounded-xl border border-slate-800 bg-slate-950 p-5">

              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-500">
                   RPM
                  </p>
                  <p className="mt-2 text-2xl font-bold text-white">
                    {motor.rpmThreshold.min} - {motor.rpmThreshold.max}
                  </p>
               </div>
                <Gauge
                 size={24}
                 className="text-blue-400"
                />
              </div>

              <div className="mt-4 border-t border-slate-800 pt-3">
                <p className="text-xs text-slate-500">
                   Minimum RPM
                </p>
                <p className="text-sm text-blue-400">
                  {motor.rpmThreshold.min} RPM
                </p>
                <p className="mt-2 text-xs text-slate-500">
                  Maximum RPM
                </p>
                <p className="text-sm text-blue-400">
                   {motor.rpmThreshold.max} RPM
                </p>
              </div>
            </div>
                {/* Vibration */}
            <div className="rounded-xl border border-slate-800 bg-slate-950 p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-500">
                    Vibration
                  </p>
                  <p className="mt-2 text-2xl font-bold text-white">
                    {motor.vibrationThreshold.warning}
                  </p>
                </div>
                <Waves
                 size={24}
                 className="text-purple-400"
                />
              </div>
              <div className="mt-4 border-t border-slate-800 pt-3">
                <p className="text-xs text-slate-500">
                  Warning
                </p>
                <p className="text-sm text-purple-400">
                  {motor.vibrationThreshold.warning}
                </p>
                <p className="mt-2 text-xs text-slate-500">
                 Critical
                </p>
                <p className="text-sm text-red-400">
                  {motor.vibrationThreshold.critical}
                </p>
              </div>
            </div>
          </div>
       </div>
     )}
    </div>
  );
}

export default MotorDetails;