import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Plus,
  Search,
  Eye,
  Pencil,
  Trash2,
  Activity,
  X
} from "lucide-react";

const API_URL = import.meta.env.VITE_API_URL;

function MotorManagement() {
  const navigate = useNavigate();

  const [motors, setMotors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [locationFilter, setLocationFilter] = useState("All");

  const [showAddModal, setShowAddModal] = useState(false);

  const [formData, setFormData] = useState({
    motorId: "",
    motorName: "",
    location: "",
    deviceId: "",

    temperatureWarning: "",
    temperatureCritical: "",
    rpmMin: "",
    rpmMax: "",
    vibrationWarning: "",
    vibrationCritical: "",
    autoShutdownEnabled: true,
    powerState: "OFF"
  });

  const [formError, setFormError] = useState("");
  const [formLoading, setFormLoading] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingMotor, setEditingMotor] = useState(null);
  const [editFormData, setEditFormData] = useState({
     motorName: "",
     location: "",
     deviceId: "",
     temperatureWarning: "",
     temperatureCritical: "",
     rpmMin: "",
     rpmMax: "",
     vibrationWarning: "",
     vibrationCritical: "",
     autoShutdownEnabled: true,
     powerState: "OFF"
  });
  const [editError, setEditError] = useState("");
  const [editLoading, setEditLoading] = useState(false);

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletingMotor, setDeletingMotor] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteError, setDeleteError] = useState("");

  const fetchMotors = async () => {
    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("token");

      const response = await fetch(
        `${API_URL}/motors`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch motors");
      }

      setMotors(data.allMotors);
    } catch (error) {
      console.error("Fetch motors error:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const filteredMotors = motors.filter((motor) => {
  const searchValue = search.toLowerCase();

  const matchesSearch =
    motor.motorId.toLowerCase().includes(searchValue) ||
    motor.motorName.toLowerCase().includes(searchValue) ||
    motor.deviceId.toLowerCase().includes(searchValue);

  const matchesStatus =
    statusFilter === "All" ||
    motor.status === statusFilter;

  const matchesLocation =
    locationFilter === "All" ||
    motor.location === locationFilter;
 
  return matchesSearch && matchesStatus && matchesLocation;
  });

  useEffect(() => {
    fetchMotors();
  }, []);

  const getStatusStyle = (status) => {
    switch (status) {
      case "Healthy":
        return "bg-green-500/10 text-green-400";

      case "Warning":
        return "bg-amber-500/10 text-amber-400";

      case "Critical":
        return "bg-red-500/10 text-red-400";

      case "Offline":
        return "bg-slate-500/10 text-slate-400";

      default:
        return "bg-slate-500/10 text-slate-400";
    }
  };

  const handleFormChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value}));
  };
  
  const handleEditFormChange = (e) => {
     const { name, value, type, checked } = e.target;
     setEditFormData((prev) => ({...prev,[name]: type === "checkbox" ? checked : value}));
  };

  const handleAddMotor = async (e) => {
    e.preventDefault();
    try {
      setFormLoading(true);
      setFormError("");
      const token = localStorage.getItem("token");
      const payload = {
         motorId: formData.motorId,
         motorName: formData.motorName,
         location: formData.location,
         deviceId: formData.deviceId,
         temperatureThreshold: {
            warning: Number(formData.temperatureWarning),
            critical: Number(formData.temperatureCritical)
        },
        rpmThreshold: {
           min: Number(formData.rpmMin),
           max: Number(formData.rpmMax)
        },
        vibrationThreshold: {
          warning: Number(formData.vibrationWarning),
          critical: Number(formData.vibrationCritical)
        },
        autoShutdownEnabled: formData.autoShutdownEnabled,
        powerState: formData.powerState
      };

      const response = await fetch( `${API_URL}/motors`,
        { method: "POST",headers: {"Content-Type": "application/json",Authorization: `Bearer ${token}`},body: JSON.stringify(payload) } );
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to create motor");
      }

      setShowAddModal(false);
 
      setFormData({
         motorId: "",
         motorName: "",
         location: "",
         deviceId: "",
         temperatureWarning: "",
         temperatureCritical: "",
         rpmMin: "",
         rpmMax: "",
         vibrationWarning: "",
         vibrationCritical: "",
         autoShutdownEnabled: true,
         powerState: "OFF"
       });
      fetchMotors();
    } catch (error) {
       console.error("Add motor error:", error);
       setFormError(error.message);
    } finally {
       setFormLoading(false);
    }
  };
  const handleEditClick = (motor) => {
     setEditingMotor(motor);
     setEditFormData({
       motorName: motor.motorName,
       location: motor.location,
       deviceId: motor.deviceId,
       temperatureWarning: motor.temperatureThreshold.warning,
       temperatureCritical: motor.temperatureThreshold.critical,

       rpmMin: motor.rpmThreshold.min,
       rpmMax: motor.rpmThreshold.max,

       vibrationWarning: motor.vibrationThreshold.warning,
       vibrationCritical: motor.vibrationThreshold.critical,

       autoShutdownEnabled: motor.autoShutdownEnabled,
       powerState: motor.powerState
     });
     setEditError("");
     setShowEditModal(true);
   };
   const handleUpdateMotor = async (e) => {
      e.preventDefault();
      try {
        setEditLoading(true);
        setEditError("");
        const token = localStorage.getItem("token");
        const payload = {
         motorName: editFormData.motorName,
         location: editFormData.location,
         deviceId: editFormData.deviceId,
         temperatureThreshold: {
            warning: Number(editFormData.temperatureWarning),
            critical: Number(editFormData.temperatureCritical)
          },

         rpmThreshold: {
           min: Number(editFormData.rpmMin),
           max: Number(editFormData.rpmMax)
          },

         vibrationThreshold: {
           warning: Number(editFormData.vibrationWarning),
           critical: Number(editFormData.vibrationCritical)
         },

         autoShutdownEnabled: editFormData.autoShutdownEnabled,
         powerState: editFormData.powerState
        };

        const response = await fetch(`${API_URL}/motors/${editingMotor.motorId}`,
          { method: "PUT", headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },body: JSON.stringify(payload) }
        );

        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.message || "Failed to update motor");
        }
       setShowEditModal(false);
       setEditingMotor(null);
       fetchMotors();
     } catch (error) {
       console.error("Update motor error:", error);
       setEditError(error.message);
     } finally {
       setEditLoading(false);
     }
   };
  const handleDeleteClick = (motor) => {
     setDeletingMotor(motor);
     setDeleteError("");
     setShowDeleteModal(true);
   };

   const handleDeleteMotor = async () => {
     try {
       setDeleteLoading(true);
       setDeleteError("");
       const token = localStorage.getItem("token");

       const response = await fetch(
        `${API_URL}/motors/${deletingMotor.motorId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
       );
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Failed to delete motor");
      }
      setShowDeleteModal(false);
      setDeletingMotor(null);
      fetchMotors();

     } catch (error) {
      console.error("Delete motor error:", error);
      setDeleteError(error.message);
     } finally {
      setDeleteLoading(false);
     }
  };


  return (
    <div className="min-h-screen bg-slate-950 text-white">

      {/* Header */}
      <header className="border-b border-slate-800 bg-slate-900">
        <div className="flex items-center justify-between px-6 py-4">

          <div className="flex items-center gap-4">

            <button
              onClick={() => navigate("/dashboard")}
              className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-800 hover:text-white"
            >
              <ArrowLeft size={20} />
            </button>

            <div>
              <h1 className="text-xl font-semibold">
                Motor Management
              </h1>

              <p className="text-sm text-slate-400">
                Manage and configure industrial motors
              </p>
            </div>

          </div>

          <button   onClick={() => {setFormError(""); setShowAddModal(true);}}
            className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium transition hover:bg-blue-500"
          >
            <Plus size={18} />
            Add New Motor
          </button>

        </div>
      </header>


      {/* Main Content */}
      <main className="p-6">

        {/* Search and filters */}
        <div className="mb-6 flex flex-col gap-4 md:flex-row">

          <div className="relative flex-1">

            <Search
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"
            />

            <input
               type="text"
               placeholder="Search by motor ID, name or device ID..."
               value={search}
               onChange={(e) => setSearch(e.target.value)}
               className="w-full rounded-lg border border-slate-700 bg-slate-900 py-3 pl-10 pr-4 text-sm text-white outline-none placeholder:text-slate-500 focus:border-blue-500"
            />

          </div>

           <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="rounded-lg border border-slate-700 bg-slate-900 px-4 py-3 text-sm text-slate-300 outline-none"
            >
              <option value="All">All Status</option>
              <option value="Healthy">Healthy</option>
              <option value="Warning">Warning</option>
              <option value="Critical">Critical</option>
              <option value="Offline">Offline</option>
            </select>
            
            <select
               value={locationFilter}
               onChange={(e) => setLocationFilter(e.target.value)}
               className="rounded-lg border border-slate-700 bg-slate-900 px-4 py-3 text-sm text-slate-300 outline-none"
            >
              <option value="All">All Locations</option>
               {[...new Set(motors.map((motor) => motor.location))].map(
                   (location) => (
                       <option key={location} value={location}>
                            {location}
                       </option>
                    )
               )}
           </select>

        </div>


        {/* Loading */}
        {loading && (
          <div className="flex min-h-60 items-center justify-center rounded-xl border border-slate-800 bg-slate-900">
            <div className="flex items-center gap-3 text-slate-400">
              <Activity className="animate-pulse" size={22} />
              Loading motors...
            </div>
          </div>
        )}


        {/* Error */}
        {!loading && error && (
          <div className="rounded-xl border border-red-500/20 bg-red-500/10 p-5 text-red-400">
            {error}
          </div>
        )}


        {/* Motor table */}
        {!loading && !error && (
          <div className="overflow-hidden rounded-xl border border-slate-800 bg-slate-900">

            <div className="overflow-x-auto">

              <table className="w-full min-w-[900px] text-left">

                <thead className="border-b border-slate-800 bg-slate-950">

                  <tr className="text-xs uppercase tracking-wide text-slate-500">

                    <th className="px-6 py-4">
                      Motor
                    </th>

                    <th className="px-6 py-4">
                      Location
                    </th>

                    <th className="px-6 py-4">
                      Device ID
                    </th>

                    <th className="px-6 py-4">
                      Status
                    </th>

                    <th className="px-6 py-4">
                      Power
                    </th>

                    <th className="px-6 py-4 text-right">
                      Actions
                    </th>

                  </tr>

                </thead>


                <tbody className="divide-y divide-slate-800">

                  {filteredMotors.map((motor) => (

                    <tr
                      key={motor._id}
                      className="transition hover:bg-slate-800/40"
                    >

                      {/* Motor */}
                      <td className="px-6 py-5">

                        <div>
                          <p className="font-medium text-white">
                            {motor.motorName}
                          </p>

                          <p className="mt-1 text-xs text-slate-500">
                            {motor.motorId}
                          </p>
                        </div>

                      </td>


                      {/* Location */}
                      <td className="px-6 py-5 text-sm text-slate-300">
                        {motor.location}
                      </td>


                      {/* Device */}
                      <td className="px-6 py-5">

                        <span className="rounded-md bg-slate-800 px-2 py-1 font-mono text-xs text-slate-400">
                          {motor.deviceId}
                        </span>

                      </td>


                      {/* Status */}
                      <td className="px-6 py-5">

                        <span
                          className={`rounded-full px-3 py-1 text-xs font-medium ${getStatusStyle(
                            motor.status
                          )}`}
                        >
                          {motor.status}
                        </span>

                      </td>


                      {/* Power */}
                      <td className="px-6 py-5">

                        <span
                          className={
                            motor.powerState === "ON"
                              ? "text-green-400"
                              : "text-slate-500"
                          }
                        >
                          ● {motor.powerState}
                        </span>

                      </td>


                      {/* Actions */}
                      <td className="px-6 py-5">

                        <div className="flex justify-end gap-2">

                          <button
                            title="View Motor"
                            onClick={() =>
                              navigate(
                                `/dashboard/viewdetails/${motor.motorId}`
                              )
                            }
                            className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-800 hover:text-white"
                          >
                            <Eye size={18} />
                          </button>

                          <button
                            onClick={() => handleEditClick(motor)}
                            title="Edit Motor"
                            className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-800 hover:text-blue-400"
                          >
                            <Pencil size={18} />
                          </button>

                          <button
                            onClick={() => handleDeleteClick(motor)}
                            title="Delete Motor"
                            className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-800 hover:text-red-400"
                          >
                            <Trash2 size={18} />
                          </button>

                        </div>

                      </td>

                    </tr>

                  ))}

                </tbody>

              </table>

            </div>


            {/* No motors */}
            {fetchMotors.length === 0 && (
              <div className="p-10 text-center text-slate-500">
                No motors found.
              </div>
            )}

          </div>
        )}

      </main>
      {showAddModal && (
     <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
       <div className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-xl border border-slate-700 bg-slate-900 shadow-2xl">

         {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-slate-700 px-6 py-4">
          <div>
            <h2 className="text-xl font-semibold text-white">
              Add New Motor
            </h2>
            <p className="mt-1 text-sm text-slate-400">
              Configure motor details and operating thresholds
            </p>
          </div>
          <button
            onClick={() => setShowAddModal(false)}
            className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-800 hover:text-white"
          >
            <X size={20} />
          </button>

        </div>

         {/* Form */}
        <form
          onSubmit={handleAddMotor}
          className="space-y-6 p-6"
        >
        {/* Basic Information */}
        <div>
          <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-slate-300">
            Motor Information
          </h3>

          <div className="grid gap-4 md:grid-cols-2">

            {/* Motor ID */}
            <div>
              <label className="mb-2 block text-sm text-slate-400">
                Motor ID
              </label>

              <input
                type="text"
                name="motorId"
                value={formData.motorId}
                onChange={handleFormChange}
                placeholder="e.g. MTR006"
                required
                className="w-full rounded-lg border border-slate-700 bg-slate-800 px-4 py-2.5 text-sm text-white outline-none focus:border-blue-500"
              />
            </div>


            {/* Motor Name */}
            <div>
              <label className="mb-2 block text-sm text-slate-400">
                Motor Name
              </label>

              <input
                type="text"
                name="motorName"
                value={formData.motorName}
                onChange={handleFormChange}
                placeholder="e.g. Cooling Pump Motor"
                required
                className="w-full rounded-lg border border-slate-700 bg-slate-800 px-4 py-2.5 text-sm text-white outline-none focus:border-blue-500"
              />
            </div>


            {/* Location */}
            <div>
              <label className="mb-2 block text-sm text-slate-400">
                Location
              </label>

              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleFormChange}
                placeholder="e.g. Production Line A"
                required
                className="w-full rounded-lg border border-slate-700 bg-slate-800 px-4 py-2.5 text-sm text-white outline-none focus:border-blue-500"
              />
            </div>


            {/* Device ID */}
            <div>
              <label className="mb-2 block text-sm text-slate-400">
                Device ID
              </label>

              <input
                type="text"
                name="deviceId"
                value={formData.deviceId}
                onChange={handleFormChange}
                placeholder="e.g. ESP32_006"
                required
                className="w-full rounded-lg border border-slate-700 bg-slate-800 px-4 py-2.5 text-sm text-white outline-none focus:border-blue-500"
              />
            </div>

          </div>

        </div>


        {/* Temperature */}
        <div>

          <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-slate-300">
            Temperature Thresholds
          </h3>

          <div className="grid gap-4 md:grid-cols-2">

            <div>
              <label className="mb-2 block text-sm text-slate-400">
                Warning (°C)
              </label>

              <input
                type="number"
                name="temperatureWarning"
                value={formData.temperatureWarning}
                onChange={handleFormChange}
                placeholder="60"
                required
                className="w-full rounded-lg border border-slate-700 bg-slate-800 px-4 py-2.5 text-white outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm text-slate-400">
                Critical (°C)
              </label>

              <input
                type="number"
                name="temperatureCritical"
                value={formData.temperatureCritical}
                onChange={handleFormChange}
                placeholder="75"
                required
                className="w-full rounded-lg border border-slate-700 bg-slate-800 px-4 py-2.5 text-white outline-none focus:border-blue-500"
              />
            </div>

          </div>

        </div>


        {/* RPM */}
        <div>

          <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-slate-300">
            RPM Limits
          </h3>

          <div className="grid gap-4 md:grid-cols-2">

            <div>
              <label className="mb-2 block text-sm text-slate-400">
                Minimum RPM
              </label>

              <input
                type="number"
                name="rpmMin"
                value={formData.rpmMin}
                onChange={handleFormChange}
                placeholder="1200"
                required
                className="w-full rounded-lg border border-slate-700 bg-slate-800 px-4 py-2.5 text-white outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm text-slate-400">
                Maximum RPM
              </label>

              <input
                type="number"
                name="rpmMax"
                value={formData.rpmMax}
                onChange={handleFormChange}
                placeholder="1800"
                required
                className="w-full rounded-lg border border-slate-700 bg-slate-800 px-4 py-2.5 text-white outline-none focus:border-blue-500"
              />
            </div>

          </div>

        </div>


        {/* Vibration */}
        <div>

          <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-slate-300">
            Vibration Thresholds
          </h3>

          <div className="grid gap-4 md:grid-cols-2">

            <div>
              <label className="mb-2 block text-sm text-slate-400">
                Warning
              </label>

              <input
                type="number"
                step="0.1"
                name="vibrationWarning"
                value={formData.vibrationWarning}
                onChange={handleFormChange}
                placeholder="4"
                required
                className="w-full rounded-lg border border-slate-700 bg-slate-800 px-4 py-2.5 text-white outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm text-slate-400">
                Critical
              </label>

              <input
                type="number"
                step="0.1"
                name="vibrationCritical"
                value={formData.vibrationCritical}
                onChange={handleFormChange}
                placeholder="6"
                required
                className="w-full rounded-lg border border-slate-700 bg-slate-800 px-4 py-2.5 text-white outline-none focus:border-blue-500"
              />
            </div>

          </div>

        </div>


        {/* Motor Settings */}
        <div>

          <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-slate-300">
            Motor Settings
          </h3>

          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

            {/* Auto Shutdown */}
            <label className="flex cursor-pointer items-center gap-3">

              <input
                type="checkbox"
                name="autoShutdownEnabled"
                checked={formData.autoShutdownEnabled}
                onChange={handleFormChange}
                className="h-4 w-4 accent-blue-600"
              />

              <span className="text-sm text-slate-300">
                Enable automatic shutdown
              </span>

            </label>


            {/* Power State */}
            <div className="flex items-center gap-3">

              <label className="text-sm text-slate-400">
                Initial Power
              </label>

              <select
                name="powerState"
                value={formData.powerState}
                onChange={handleFormChange}
                className="rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-white outline-none focus:border-blue-500"
              >
                <option value="OFF">OFF</option>
                <option value="ON">ON</option>
              </select>

            </div>

          </div>

        </div>


        {/* Error */}
        {formError && (
          <div className="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">
            {formError}
          </div>
        )}


        {/* Buttons */}
        <div className="flex justify-end gap-3 border-t border-slate-700 pt-5">

          <button
            type="button"
            onClick={() => setShowAddModal(false)}
            className="rounded-lg border border-slate-700 px-5 py-2.5 text-sm font-medium text-slate-300 transition hover:bg-slate-800"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={formLoading}
            className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {formLoading ? "Creating..." : "Create Motor"}
          </button>

        </div>

      </form>

    </div>

  </div>
)}
     {showEditModal && editingMotor && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">

    <div className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-xl border border-slate-700 bg-slate-900 shadow-2xl">

      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-700 px-6 py-4">

        <div>
          <h2 className="text-xl font-semibold text-white">
            Edit Motor
          </h2>

          <p className="mt-1 text-sm text-slate-400">
            Update motor configuration and operating thresholds
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowEditModal(false)}
          className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-800 hover:text-white"
        >
          <X size={20} />
        </button>

      </div>


      <form
        onSubmit={handleUpdateMotor}
        className="space-y-6 p-6"
      >

        {/* Motor Information */}
        <div>

          <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-slate-300">
            Motor Information
          </h3>

          <div className="grid gap-4 md:grid-cols-2">

            {/* Motor ID */}
            <div>
              <label className="mb-2 block text-sm text-slate-400">
                Motor ID
              </label>

              <input
                type="text"
                value={editingMotor.motorId}
                disabled
                className="w-full cursor-not-allowed rounded-lg border border-slate-700 bg-slate-950 px-4 py-2.5 text-sm text-slate-500"
              />
            </div>


            {/* Motor Name */}
            <div>
              <label className="mb-2 block text-sm text-slate-400">
                Motor Name
              </label>

              <input
                type="text"
                name="motorName"
                value={editFormData.motorName}
                onChange={handleEditFormChange}
                required
                className="w-full rounded-lg border border-slate-700 bg-slate-800 px-4 py-2.5 text-sm text-white outline-none focus:border-blue-500"
              />
            </div>


            {/* Location */}
            <div>
              <label className="mb-2 block text-sm text-slate-400">
                Location
              </label>

              <input
                type="text"
                name="location"
                value={editFormData.location}
                onChange={handleEditFormChange}
                required
                className="w-full rounded-lg border border-slate-700 bg-slate-800 px-4 py-2.5 text-sm text-white outline-none focus:border-blue-500"
              />
            </div>


            {/* Device ID */}
            <div>
              <label className="mb-2 block text-sm text-slate-400">
                Device ID
              </label>

              <input
                type="text"
                name="deviceId"
                value={editFormData.deviceId}
                onChange={handleEditFormChange}
                required
                className="w-full rounded-lg border border-slate-700 bg-slate-800 px-4 py-2.5 text-sm text-white outline-none focus:border-blue-500"
              />
            </div>

          </div>

        </div>


        {/* Temperature */}
        <div>

          <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-slate-300">
            Temperature Thresholds
          </h3>

          <div className="grid gap-4 md:grid-cols-2">

            <div>
              <label className="mb-2 block text-sm text-slate-400">
                Warning (°C)
              </label>

              <input
                type="number"
                name="temperatureWarning"
                value={editFormData.temperatureWarning}
                onChange={handleEditFormChange}
                required
                className="w-full rounded-lg border border-slate-700 bg-slate-800 px-4 py-2.5 text-white outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm text-slate-400">
                Critical (°C)
              </label>

              <input
                type="number"
                name="temperatureCritical"
                value={editFormData.temperatureCritical}
                onChange={handleEditFormChange}
                required
                className="w-full rounded-lg border border-slate-700 bg-slate-800 px-4 py-2.5 text-white outline-none focus:border-blue-500"
              />
            </div>

          </div>

        </div>


        {/* RPM */}
        <div>

          <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-slate-300">
            RPM Limits
          </h3>

          <div className="grid gap-4 md:grid-cols-2">

            <div>
              <label className="mb-2 block text-sm text-slate-400">
                Minimum RPM
              </label>

              <input
                type="number"
                name="rpmMin"
                value={editFormData.rpmMin}
                onChange={handleEditFormChange}
                required
                className="w-full rounded-lg border border-slate-700 bg-slate-800 px-4 py-2.5 text-white outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm text-slate-400">
                Maximum RPM
              </label>

              <input
                type="number"
                name="rpmMax"
                value={editFormData.rpmMax}
                onChange={handleEditFormChange}
                required
                className="w-full rounded-lg border border-slate-700 bg-slate-800 px-4 py-2.5 text-white outline-none focus:border-blue-500"
              />
            </div>

          </div>

        </div>


        {/* Vibration */}
        <div>

          <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-slate-300">
            Vibration Thresholds
          </h3>

          <div className="grid gap-4 md:grid-cols-2">

            <div>
              <label className="mb-2 block text-sm text-slate-400">
                Warning
              </label>

              <input
                type="number"
                step="0.1"
                name="vibrationWarning"
                value={editFormData.vibrationWarning}
                onChange={handleEditFormChange}
                required
                className="w-full rounded-lg border border-slate-700 bg-slate-800 px-4 py-2.5 text-white outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm text-slate-400">
                Critical
              </label>

              <input
                type="number"
                step="0.1"
                name="vibrationCritical"
                value={editFormData.vibrationCritical}
                onChange={handleEditFormChange}
                required
                className="w-full rounded-lg border border-slate-700 bg-slate-800 px-4 py-2.5 text-white outline-none focus:border-blue-500"
              />
            </div>

          </div>

        </div>


        {/* Settings */}
        <div>

          <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-slate-300">
            Motor Settings
          </h3>

          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

            <label className="flex cursor-pointer items-center gap-3">

              <input
                type="checkbox"
                name="autoShutdownEnabled"
                checked={editFormData.autoShutdownEnabled}
                onChange={handleEditFormChange}
                className="h-4 w-4 accent-blue-600"
              />

              <span className="text-sm text-slate-300">
                Enable automatic shutdown
              </span>

            </label>


            <div className="flex items-center gap-3">

              <label className="text-sm text-slate-400">
                Power
              </label>

              <select
                name="powerState"
                value={editFormData.powerState}
                onChange={handleEditFormChange}
                className="rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-white outline-none focus:border-blue-500"
              >
                <option value="OFF">OFF</option>
                <option value="ON">ON</option>
              </select>

            </div>

          </div>

        </div>


        {/* Error */}
        {editError && (
          <div className="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">
            {editError}
          </div>
        )}


        {/* Buttons */}
        <div className="flex justify-end gap-3 border-t border-slate-700 pt-5">

          <button
            type="button"
            onClick={() => setShowEditModal(false)}
            className="rounded-lg border border-slate-700 px-5 py-2.5 text-sm font-medium text-slate-300 transition hover:bg-slate-800"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={editLoading}
            className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {editLoading ? "Updating..." : "Update Motor"}
          </button>

        </div>

      </form>

    </div>

  </div>
)}


   {showDeleteModal && deletingMotor && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">

    <div className="w-full max-w-md rounded-xl border border-slate-700 bg-slate-900 p-6 shadow-2xl">

      <h2 className="text-lg font-semibold text-white">
        Delete Motor
      </h2>

      <p className="mt-3 text-sm leading-6 text-slate-400">
        Are you sure you want to delete{" "}
        <span className="font-medium text-white">
          {deletingMotor.motorName}
        </span>{" "}
        ({deletingMotor.motorId})?
      </p>

      <p className="mt-2 text-xs text-red-400">
        This action cannot be undone.
      </p>

      {deleteError && (
        <div className="mt-4 rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-400">
          {deleteError}
        </div>
      )}

      <div className="mt-6 flex justify-end gap-3">

        <button
          type="button"
          onClick={() => {
            setShowDeleteModal(false);
            setDeletingMotor(null);
          }}
          className="rounded-lg border border-slate-700 px-4 py-2.5 text-sm font-medium text-slate-300 transition hover:bg-slate-800"
        >
          Cancel
        </button>

        <button
          type="button"
          onClick={handleDeleteMotor}
          disabled={deleteLoading}
          className="rounded-lg bg-red-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {deleteLoading ? "Deleting..." : "Delete Motor"}
        </button>

      </div>

    </div>

  </div>
)}
    </div>
  );
}

export default MotorManagement;