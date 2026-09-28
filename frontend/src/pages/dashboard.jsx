import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import MotorDetails from "./motordetails";
import {
  Activity,
  LayoutDashboard,
  Settings,
  Bell,
  Gauge,
  Wrench,
  FileText,
  BarChart3,
  LogOut,
  PlayCircle,
  AlertTriangle,
  AlertCircle,
  Home,
  Search,
  Menu,
  X
} from "lucide-react";

const API_URL = import.meta.env.VITE_API_URL;


function Dashboard() {
  const navigate = useNavigate();
  const [motors, setMotors] = useState([]);
  const [loadingMotors, setLoadingMotors] = useState(true);
  const [motorError, setMotorError] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [locationFilter, setLocationFilter] = useState("All");

  useEffect(() => {
    const fetchMotors = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(`${API_URL}/motors`, {method: "GET",headers: {Authorization: `Bearer ${token}`, }, });
        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.message || "Failed to fetch motors");
        }
        setMotors(data.allMotors);
      } catch (error) {
        console.error("Fetch motors error:", error);
        setMotorError(error.message);
      } finally {
        setLoadingMotors(false);
      }
    };
  fetchMotors(); }, []);
  const totalMotors = motors.length;
  const healthyMotors = motors.filter( (motor) => motor.status === "Healthy").length;
  const warningMotors = motors.filter( (motor) => motor.status === "Warning").length;
  const criticalMotors =motors.filter( (motor) => motor.status === "Critical").length;
  const offlineMotors = motors.filter( (motor) => motor.status === "Offline").length;


  

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/login");
  };

  const user = JSON.parse(localStorage.getItem("user"));
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

  
  // for searching
  const filteredMotors = motors.filter((motor) => {

   const matchesSearch =
     motor.motorId?.toLowerCase().includes(search.toLowerCase()) ||
     motor.motorName?.toLowerCase().includes(search.toLowerCase()) ||
     motor.deviceId?.toLowerCase().includes(search.toLowerCase());

   const matchesStatus =
     statusFilter === "All" ||
     motor.status === statusFilter;

   const matchesLocation =
     locationFilter === "All" ||
     motor.location === locationFilter;

    return matchesSearch && matchesStatus && matchesLocation;
  });


  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">

      {/* Sidebar */}
      <aside  className={`fixed left-0 top-0 z-50 flex h-screen w-64 flex-col border-r border-slate-800 bg-slate-900 transition-transform duration-300
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0`}
      >

        {/* Logo */}
        <div className="flex h-20 items-center  justify-between border-b border-slate-800 px-6">
         <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-700">
            <Activity size={22} />
          </div>

          <div>
            <h1 className="font-bold text-white">
              MotorGuard
            </h1>

            <p className="text-[10px] uppercase tracking-widest text-slate-500">
              Industrial Monitoring
            </p>
          </div>
         </div>

           {/* Close Sidebar - Mobile */}
          <button
            onClick={() => setSidebarOpen(false)}
            className="rounded-lg p-2 text-slate-400 hover:bg-slate-800 hover:text-white md:hidden"
          >
            <X size={20} />
          </button>

        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1 p-4">
          
          <button  onClick={() => navigate("/")}  className="flex w-full items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium text-slate-400 transition hover:bg-slate-800 hover:text-white">
            <Home size={20} />
            <span>Home</span>
          </button>

          <button className="flex w-full items-center gap-3 rounded-lg bg-blue-700/10 px-4 py-3 text-sm font-medium text-blue-400">
            <LayoutDashboard size={18} />
            Dashboard
          </button>

          <button onClick={() => navigate("/motors/management")} className="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-sm text-slate-400 transition hover:bg-slate-800 hover:text-white">
            <Gauge size={18} />
            Motor Management
          </button>

          <button onClick={() => navigate("/alerts")}className="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-sm text-slate-400 transition hover:bg-slate-800 hover:text-white">
            <Bell size={18} />
            Alerts
          </button>

          <button onClick={() => navigate("/motorcontrol")} className="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-sm text-slate-400 transition hover:bg-slate-800 hover:text-white">
            <Settings size={18} />
            Motor Control
          </button>

          <button onClick={() => navigate("/dashboard/logs")} className="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-sm text-slate-400 transition hover:bg-slate-800 hover:text-white">
            <FileText size={18} />
            Audit Logs
          </button>

        </nav>

        {/* Logout */}
        <div className="border-t border-slate-800 p-4">

          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-sm text-slate-400 transition hover:bg-red-950/40 hover:text-red-400"
          >
            <LogOut size={18} />
            Logout
          </button>

        </div>

      </aside>


      {/* Main area */}
      <div className="ml-0 md:ml-64">

        {/* Top Navbar */}
        <header className="flex h-20 items-center justify-between border-b border-slate-800 bg-slate-950 px-4 md:px-8">

         <div  className="flex items-center">

          <button
            onClick={() => setSidebarOpen(true)}
            className="mr-3 rounded-lg p-2 text-slate-400 hover:bg-slate-800 hover:text-white md:hidden"
          >
           <Menu size={24} />
          </button>

          <div>
            <h2 className="text-xl font-semibold text-white">
              Dashboard
            </h2>

            <p className="text-sm text-slate-500">
              Industrial motor monitoring system
            </p>
          </div>

         </div>

          {/* User */}
          <div className="flex items-center gap-4">

            <div className="text-right">
              <p className="text-sm font-medium text-white">
                {user?.username || "User"}
              </p>

              <p className="text-xs capitalize text-slate-500">
                {user?.role || "operator"}
              </p>
            </div>

            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-800 text-sm font-semibold text-blue-400">
              {user?.username?.charAt(0).toUpperCase() || "U"}
            </div>

          </div>

        </header>


        {/* Dashboard Content */}
        <main className="p-8">

          <div className="mb-8 rounded-xl border border-slate-800 bg-slate-900 p-8">
            <h3 className="text-2xl font-semibold text-white">
              Welcome to MotorGuard
            </h3>
          </div>

             {/* Motor Health Summary */}
         <div className="mb-8">
            <h2 className="mb-4 text-lg font-semibold text-white">
              Motor Health Summary
            </h2>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">

                  {/* Total Motors */}
              <div className="rounded-xl border border-slate-700 bg-slate-900 p-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-slate-400">
                        Total Motors
                      </p>
                      <h3 className="mt-2 text-3xl font-bold text-white"> {totalMotors} </h3>
                      <p className="mt-1 text-xs text-slate-500"> Motors monitored</p>
                    </div>
                    <div className="rounded-lg bg-slate-800 p-3">
                      <Activity className="text-slate-300" size={24} />
                    </div>
                  </div>
              </div>

                {/* Healthy Motors */}
              <div className="rounded-xl border border-slate-700 bg-slate-900 p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-400">
                      Healthy
                    </p>
                    <h3 className="mt-2 text-3xl font-bold text-green-400"> {healthyMotors}  </h3>
                    <p className="mt-1 text-xs text-slate-500">  Motors operating normally</p>
                  </div>
                  <div className="rounded-lg bg-green-500/10 p-3">
                    <PlayCircle className="text-green-400" size={24} />
                  </div>
                </div>
              </div>

                  {/* Warning Motors */}
             <div className="rounded-xl border border-slate-700 bg-slate-900 p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-400">
                      Warning
                    </p>
                    <h3 className="mt-2 text-3xl font-bold text-amber-400"> {warningMotors}</h3>
                    <p className="mt-1 text-xs text-slate-500">
                         Requires attention
                    </p>
                  </div>
                  <div className="rounded-lg bg-amber-500/10 p-3">
                    <AlertTriangle className="text-amber-400" size={24} />
                  </div>
                </div>
              </div>

                 {/* Critical Motors */}
              <div className="rounded-xl border border-slate-700 bg-slate-900 p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-400">
                      Critical
                    </p>
                    <h3 className="mt-2 text-3xl font-bold text-amber-400">{criticalMotors}</h3>
                    <p className="mt-1 text-xs text-slate-500">
                        Immediate attention required
                    </p>
                  </div>
                  <div className="rounded-lg bg-red-500/10 p-3">
                    <AlertCircle className="text-red-400" size={24} />
                  </div>
                </div>
              </div>

              {/*Offline motor*/}
              <div className="rounded-xl border border-slate-700 bg-slate-900 p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-400">
                      Offline
                    </p>
                    <h3 className="mt-2 text-3xl font-bold text-amber-400"> {offlineMotors}</h3>
                    <p className="mt-1 text-xs text-slate-500">
                         motors not communicating
                    </p>
                  </div>
                  <div className="rounded-lg bg-red-500/10 p-3">
                    <AlertCircle className="text-yellow-400" size={24} />
                  </div>
                </div>
              </div>

            </div>
          </div>

          {/* Search and Filters */}
          <div className="mb-6 flex flex-col gap-4 md:flex-row">

            {/* Search */}
            <div className="relative flex-1">
              <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"/>

              <input
                type="text"
                placeholder="Search by motor ID, name or device ID..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full rounded-lg border border-slate-700 bg-slate-900 py-3 pl-10 pr-4 text-sm text-white outline-none placeholder:text-slate-500 focus:border-blue-500"
              />
            </div>

            {/* Status */}
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

            {/* Location */}
            <select
             value={locationFilter}
             onChange={(e) => setLocationFilter(e.target.value)}
             className="rounded-lg border border-slate-700 bg-slate-900 px-4 py-3 text-sm text-slate-300 outline-none"
            >
              <option value="All">All Locations</option>
              {[...new Set(filteredMotors.map((motor) => motor.location))].map(
                (location) => (
                  <option key={location} value={location}>
                    {location}
                  </option>
                )
              )}
            </select>
          </div>

             {/* Individual Motors */}
         <div className="mb-8">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-white"> Motors </h2>
                <p className="text-sm text-slate-500"> Current motor status and operating information  </p>
              </div>
            </div>
    
            {loadingMotors ? (
              <div className="rounded-xl border border-slate-800 bg-slate-900 p-6">
                <p className="text-sm text-slate-400">  Loading motors...    </p>
              </div>
            ) : motorError ? (
              <div className="rounded-xl border border-red-900/50 bg-red-950/20 p-6">
                <p className="text-sm text-red-400">
                  {motorError}
                </p>
              </div>
            ) : filteredMotors.length === 0 ? (
              <div className="rounded-xl border border-slate-800 bg-slate-900 p-6">
                <p className="text-sm text-slate-400">  No motors found.  </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
                {filteredMotors.map((motor) => (
                  <div key={motor._id} className="rounded-xl border border-slate-700 bg-slate-900 p-5 transition hover:border-slate-600" >

                     {/* Card Header */}
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="text-lg font-semibold text-white">
                          {motor.motorName}
                        </h3>
                        <p className="mt-1 text-sm text-slate-500">
                          {motor.motorId}
                         </p>
                      </div>

                      {/* Status */}
                      <span className={`rounded-full px-3 py-1 text-xs font-medium ${getStatusStyle(motor.status)}`}>
                        {motor.status}
                      </span>
                    </div>

                    {/* Motor Information */}
                    <div className="mt-6 space-y-4">
                      <div>
                        <p className="text-xs text-slate-500">  Location  </p>
                        <p className="mt-1 text-sm text-slate-300">
                          {motor.location}
                        </p>
                      </div>

                      <div>
                        <p className="text-xs text-slate-500">
                          Device ID
                        </p>
                        <p className="mt-1 text-sm text-slate-300">
                          {motor.deviceId}
                        </p>
                      </div>
              
                      <div className="flex items-center justify-between border-t border-slate-800 pt-4">
                        <div>
                          <p className="text-xs text-slate-500">
                            Power State
                          </p>
                          <p className="mt-1 text-sm font-medium text-white">
                            {motor.powerState}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-slate-500">
                            Auto Shutdown
                          </p>
                          <p className="mt-1 text-sm font-medium text-white">
                            {motor.autoShutdownEnabled ? "Enabled" : "Disabled"}
                          </p>
                        </div>
                      </div>
                    </div>

                     {/* View Details */}
                    <div class="mt-6 flex justify-center">
                      <button onClick={() => navigate(`/dashboard/viewdetails/${motor.motorId}`)} class="rounded-lg border border-slate-700 px-6 py-2 text-sm font-medium text-slate-300 transition hover:bg-slate-800 hover:text-white">
                        View Details
                      </button>
                    </div>
                  </div>
                ))}
             </div>
           )}
          </div>
        </main>
      </div>
    </div>
  );
}
export default Dashboard;


     

        
      

      
    
                
                 

         
       
  

        
    

  

    



    


     

    


