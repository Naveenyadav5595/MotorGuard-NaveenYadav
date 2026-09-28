import {
  Activity,
  Bell,
  BarChart3,
  ShieldCheck,
  Settings,
  Wrench,
  ArrowRight,
  Cpu,
  Gauge,
  Thermometer,
  Zap,
  Database,
  Monitor,
  ChevronRight,
  Menu,
  X
} from "lucide-react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import {useState} from "react";

import motorImage from "../assets/motor-hero.jpg";
import naveenImage from "../assets/naveenImage.jpeg";
import projectImage from "../assets/projectImage.jpeg";
import SauravImage from "../assets/SauravImage.jpeg";
import raushanImage from "../assets/raushanImage.jpeg";
import pahujaSirImage from "../assets/pahujaSirImage.jpeg";


function Home() {
  const navigate= useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleDashboardClick = () => {
      const token = localStorage.getItem("token");
      navigate(token ? "/dashboard" : "/login");
  };
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">

      {/* ================= NAVBAR ================= */}
      <nav className="sticky top-0 z-50 border-b border-slate-800 bg-slate-950/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">

          {/* Logo */}
          <a href="#home" className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-700">
              <Activity size={22} />
            </div>

            <div>
              <h1 className="text-xl font-bold tracking-tight">
                MotorGuard
              </h1>
              <p className="text-[10px] uppercase tracking-widest text-slate-500">
                Industrial Monitoring
              </p>
            </div>
          </a>

          {/* Navigation */}
          <div className="hidden items-center gap-7 md:flex">
            <a
              href="#home"
              className="text-sm text-slate-300 transition hover:text-white"
            >
              Home
            </a>

            <a
              href="#about"
              className="text-sm text-slate-300 transition hover:text-white"
            >
              About
            </a>

            <a
              href="#features"
              className="text-sm text-slate-300 transition hover:text-white"
            >
              Features
            </a>

            <a
              href="#how-it-works"
              className="text-sm text-slate-300 transition hover:text-white"
            >
              How It Works
            </a>

            <a
              href="#supervisor"
              className="text-sm text-slate-300 transition hover:text-white"
            >
              Supervisor
            </a>

            <a
              href="#team"
              className="text-sm text-slate-300 transition hover:text-white"
            >
              Team
            </a>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="rounded-lg p-2 text-slate-300 hover:bg-slate-800 md:hidden"
          >
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
          
          {/* Auth */}
            <div className="hidden flex items-center gap-3 md:flex">
               {localStorage.getItem("token") ? (
                  <button
                    onClick={() => {
                       localStorage.removeItem("token");
                       navigate("/login");
                    }}
                    className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-blue-700"
                  >
                    Logout
                  </button>
                ) : (
                  <>
                   <Link
                     to="/login"
                     className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-blue-700"
                   >
                     Login
                   </Link>

                   <Link
                    to="/register"
                    className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-blue-700"
                   >
                   Register
                   </Link>
                  </>
                )
              }
            </div>
        </div>

            {/* Mobile Navigation */}
            
        {menuOpen && (
          <div className="border-t border-slate-800 bg-slate-950 md:hidden">
            <div className="flex flex-col px-6 py-4">

              <a
                href="#home"
                onClick={() => setMenuOpen(false)}
                className="rounded-lg px-3 py-3 text-sm text-slate-300 hover:bg-slate-800 hover:text-white"
              >
                Home
              </a>

              <a
                href="#about"
                onClick={() => setMenuOpen(false)}
                className="rounded-lg px-3 py-3 text-sm text-slate-300 hover:bg-slate-800 hover:text-white"
              >
                About
              </a>

              <a
                href="#features"
                onClick={() => setMenuOpen(false)}
                className="rounded-lg px-3 py-3 text-sm text-slate-300 hover:bg-slate-800 hover:text-white"
              >
                Features
              </a>

              <a
                href="#how-it-works"
                onClick={() => setMenuOpen(false)}
                className="rounded-lg px-3 py-3 text-sm text-slate-300 hover:bg-slate-800 hover:text-white"
              >
                How It Works
              </a>

              <a
                href="#supervisor"
                onClick={() => setMenuOpen(false)}
                className="rounded-lg px-3 py-3 text-sm text-slate-300 hover:bg-slate-800 hover:text-white"
              >
                Supervisor
              </a>

              <a
                href="#team"
                onClick={() => setMenuOpen(false)}
                className="rounded-lg px-3 py-3 text-sm text-slate-300 hover:bg-slate-800 hover:text-white"
              >
                Team
              </a>
              
               {/* Mobile Auth */}
              <div className="mt-2 border-t border-slate-800 pt-3">
                {localStorage.getItem("token") ? (
                  <button
                    onClick={() => {
                      localStorage.removeItem("token");
                      navigate("/login");
                      setMenuOpen(false);
                    }}
                    className="w-full rounded-lg px-3 py-3 text-left text-sm text-slate-300 hover:bg-slate-800 hover:text-white"
                  >
                   Logout
                  </button>
                ) : (
                  <>

                    <Link
                      to="/login"
                      onClick={() => setMenuOpen(false)}
                      className="block rounded-lg px-3 py-3 text-sm text-slate-300 hover:bg-slate-800 hover:text-white"
                    >
                     Login
                    </Link>

                    <Link
                      to="/register"
                      onClick={() => setMenuOpen(false)}
                      className="block rounded-lg px-3 py-3 text-sm text-slate-300 hover:bg-slate-800 hover:text-white"
                    >
                      Register
                    </Link>
                 </>
                )}
             </div>

            </div>
          </div>
        )}
      </nav>


      {/* ================= HERO ================= */}
      <section id="home" className="border-b border-slate-800">
        <div className="mx-auto grid max-w-7xl items-center gap-14 px-6 py-20 lg:grid-cols-2 lg:py-28">

          {/* Left */}
          <div>

            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-slate-700 bg-slate-900 px-3 py-1.5 text-xs font-medium text-slate-300">
              <span className="h-2 w-2 rounded-full bg-green-500"></span>
              INDUSTRIAL MOTOR MONITORING SYSTEM
            </div>

            <h1 className="max-w-3xl text-5xl font-bold leading-tight tracking-tight text-white md:text-6xl">
              Smart Monitoring.
              <br />
              <span className="text-blue-500">
                Reliable Protection.
              </span>
            </h1>

            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-400">
              MotorGuard is an industrial motor monitoring and protection
              system designed to continuously monitor motor health,
              identify abnormal conditions, and provide timely alerts
              for safer and more reliable operation.
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <button  onClick={() => navigate("/dashboard")} className="group flex items-center gap-2 rounded-lg bg-blue-700 px-6 py-3 font-medium text-white transition hover:bg-blue-600">
                Explore Dashboard
                <ArrowRight
                  size={18}
                  className="transition group-hover:translate-x-1"
                />
              </button>

              <a
                href="#about"
                className="flex items-center gap-2 rounded-lg border border-slate-700 px-6 py-3 font-medium text-slate-200 transition hover:bg-slate-900"
              >
                Learn More
              </a>
            </div>

            {/* Stats */}
            <div className="mt-12 grid max-w-xl grid-cols-3 divide-x divide-slate-800 border-y border-slate-800 py-6">

              <div className="px-4 first:pl-0">
                <p className="text-2xl font-bold text-white">24/7</p>
                <p className="mt-1 text-xs text-slate-500">
                  Monitoring
                </p>
              </div>

              <div className="px-4">
                <p className="text-2xl font-bold text-white">Real-Time</p>
                <p className="mt-1 text-xs text-slate-500">
                  Data Tracking
                </p>
              </div>

              <div className="px-4">
                <p className="text-2xl font-bold text-white">Early</p>
                <p className="mt-1 text-xs text-slate-500">
                  Fault Detection
                </p>
              </div>

            </div>
          </div>


          {/* Right — Motor image / monitoring panel */}
          <div className="relative">

            <div className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900 shadow-2xl">

              <div className="flex items-center justify-between border-b border-slate-800 px-5 py-4">
                <div>
                  <p className="text-sm font-semibold text-white">
                    Motor Overview
                  </p>
                  <p className="text-xs text-slate-500">
                    Motor MTR-001
                  </p>
                </div>

                <div className="flex items-center gap-2 text-xs text-green-400">
                  <span className="h-2 w-2 rounded-full bg-green-500"></span>
                  Running
                </div>
              </div>

              {/* Replace this with your actual motor image */}
              <div className="flex h-80 items-center justify-center bg-slate-900 p-8">
                <img
                  src={motorImage} 
                  alt="Industrial Motor"
                  className="h-full w-full object-contain"
                />
              </div>

              <div className="grid grid-cols-3 border-t border-slate-800">

                <div className="border-r border-slate-800 p-4">
                  <div className="flex items-center gap-2 text-slate-500">
                    <Thermometer size={15} />
                    <span className="text-xs">Temperature</span>
                  </div>

                  <p className="mt-2 text-xl font-semibold text-white">
                    57.8°C
                  </p>
                </div>

                <div className="border-r border-slate-800 p-4">
                  <div className="flex items-center gap-2 text-slate-500">
                    <Gauge size={15} />
                    <span className="text-xs">Vibration</span>
                  </div>

                  <p className="mt-2 text-xl font-semibold text-white">
                    2.1 mm/s
                  </p>
                </div>

                <div className="p-4">
                  <div className="flex items-center gap-2 text-slate-500">
                    <Zap size={15} />
                    <span className="text-xs">rpm</span>
                  </div>

                  <p className="mt-2 text-xl font-semibold text-white">
                    1400
                  </p>
                </div>

              </div>
            </div>

          </div>
        </div>
      </section>


      {/* ================= ABOUT ================= */}
      <section id="about" className="border-b border-slate-800">
        <div className="mx-auto max-w-7xl px-6 py-20">

          <div className="mb-12 max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-wider text-blue-500">
              About the Project
            </p>

            <h2 className="mt-3 text-3xl font-bold text-white md:text-4xl">
              What is MotorGuard?
            </h2>

            <p className="mt-4 leading-7 text-slate-400">
              MotorGuard combines industrial sensors, embedded control,
              backend services, and a web dashboard to provide a
              centralized system for monitoring and protecting electric
              motors.
            </p>
          </div>


          <div className="grid items-center gap-12 lg:grid-cols-2">

            {/* Image */}
            <div className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900">
              <img
                src={projectImage}
                alt="MotorGuard Project"
                className="h-[380px] w-full object-cover"
              />
            </div>


            {/* Content */}
            <div>

              <h3 className="text-2xl font-semibold text-white">
                Built for Industrial Reliability
              </h3>

              <p className="mt-5 leading-7 text-slate-400">
                Industrial motors can experience problems such as
                overheating, excessive vibration, abnormal rpm.
                If these conditions remain unnoticed, they can lead to
                equipment damage and unexpected downtime.
              </p>

              <p className="mt-4 leading-7 text-slate-400">
                MotorGuard continuously collects motor parameters and
                presents them through a centralized dashboard. The system
                helps operators understand motor health and allows
                authorized users to take appropriate action.
              </p>


              <div className="mt-8 grid gap-4 sm:grid-cols-2">

                <div className="rounded-xl border border-slate-800 bg-slate-900 p-5">
                  <ShieldCheck className="text-green-500" size={24} />

                  <h4 className="mt-3 font-semibold text-white">
                    Protection
                  </h4>

                  <p className="mt-2 text-sm leading-6 text-slate-500">
                    Identify abnormal operating conditions and protect
                    equipment.
                  </p>
                </div>

                <div className="rounded-xl border border-slate-800 bg-slate-900 p-5">
                  <Monitor className="text-blue-500" size={24} />

                  <h4 className="mt-3 font-semibold text-white">
                    Monitoring
                  </h4>

                  <p className="mt-2 text-sm leading-6 text-slate-500">
                    View important motor parameters from a centralized
                    dashboard.
                  </p>
                </div>

              </div>

            </div>
          </div>
        </div>
      </section>


      {/* ================= HOW IT WORKS ================= */}
      <section id="how-it-works" className="border-b border-slate-800 bg-slate-900/30">
        <div className="mx-auto max-w-7xl px-6 py-20">

          <div className="mx-auto mb-14 max-w-2xl text-center">
            <p className="text-sm font-semibold uppercase tracking-wider text-blue-500">
              System Architecture
            </p>

            <h2 className="mt-3 text-3xl font-bold text-white md:text-4xl">
              How MotorGuard Works
            </h2>

            <p className="mt-4 text-slate-400">
              From physical motor parameters to real-time monitoring
              and protection.
            </p>
          </div>


          <div className="grid gap-6 md:grid-cols-5">

            {[
              {
                icon: Thermometer,
                number: "01",
                title: "Sensors",
                text: "Motor parameters are measured using sensors.",
              },
              {
                icon: Cpu,
                number: "02",
                title: "Controller",
                text: "Sensor data is collected and processed.",
              },
              {
                icon: Database,
                number: "03",
                title: "Backend",
                text: "Data is stored and managed through APIs.",
              },
              {
                icon: Monitor,
                number: "04",
                title: "Dashboard",
                text: "Users monitor motor health in real time.",
              },
              {
                icon: ShieldCheck,
                number: "05",
                title: "Protection",
                text: "Alerts and control actions help prevent damage.",
              },
            ].map((step) => {
              const Icon = step.icon;

              return (
                <div
                  key={step.number}
                  className="relative rounded-xl border border-slate-800 bg-slate-950 p-6"
                >
                  <div className="flex items-center justify-between">
                    <Icon size={25} className="text-blue-500" />

                    <span className="text-xs font-bold text-slate-600">
                      {step.number}
                    </span>
                  </div>

                  <h3 className="mt-5 font-semibold text-white">
                    {step.title}
                  </h3>

                  <p className="mt-2 text-sm leading-6 text-slate-500">
                    {step.text}
                  </p>
                </div>
              );
            })}

          </div>
        </div>
      </section>


      {/* ================= FEATURES ================= */}
      <section id="features" className="border-b border-slate-800">
        <div className="mx-auto max-w-7xl px-6 py-20">

          <div className="mb-12">
            <p className="text-sm font-semibold uppercase tracking-wider text-blue-500">
              Core Capabilities
            </p>

            <h2 className="mt-3 text-3xl font-bold text-white md:text-4xl">
              Built for Complete Motor Management
            </h2>

            <p className="mt-4 max-w-2xl text-slate-400">
              MotorGuard provides the tools required to monitor,
              manage, maintain, and analyze industrial motors.
            </p>
          </div>


          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">

            {[
              {
                icon: Activity,
                title: "Health Dashboard",
                text: "Monitor overall motor health and important operating parameters.",
              },
              {
                icon: Settings,
                title: "Motor Management",
                text: "Authorized managers can add, update, and remove motors.",
              },
              {
                icon: Bell,
                title: "Alerts & Notifications",
                text: "Receive alerts when motor parameters cross defined limits.",
              },
              {
                icon: Zap,
                title: "Motor Control",
                text: "Provide controlled motor start, stop, and protection actions.",
              },
              {
                icon: Wrench,
                title: "Audit Logs",
                text: "Track history of actions performed by operator and manager",
              },
            ].map((feature) => {
              const Icon = feature.icon;

              return (
                <div
                  key={feature.title}
                  className="group rounded-xl border border-slate-800 bg-slate-900 p-6 transition hover:border-slate-700 hover:bg-slate-900/80"
                >
                  <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-slate-800 text-blue-500">
                    <Icon size={22} />
                  </div>

                  <h3 className="mt-5 text-lg font-semibold text-white">
                    {feature.title}
                  </h3>

                  <p className="mt-2 text-sm leading-6 text-slate-500">
                    {feature.text}
                  </p>
                  
                </div>
              );
            })}

          </div>
        </div>
      </section>


      {/* ================= SUPERVISOR ================= */}
      <section id="supervisor" className="border-b border-slate-800 bg-slate-900/30">
        <div className="mx-auto max-w-5xl px-6 py-20">

          <div className="mb-12 text-center">
            <p className="text-sm font-semibold uppercase tracking-wider text-blue-500">
              Project Guidance
            </p>

            <h2 className="mt-3 text-3xl font-bold text-white md:text-4xl">
              Project Supervisor
            </h2>
          </div>


          <div className="grid items-center gap-10 rounded-2xl border border-slate-800 bg-slate-950 p-7 md:grid-cols-[220px_1fr] md:p-10">

            <div className="mx-auto h-52 w-52 overflow-hidden rounded-xl border border-slate-800 bg-slate-900">
              <img
                src={pahujaSirImage}
                alt="Project Supervisor"
                className="h-full w-full object-cover"
              />
            </div>

            <div>
              <p className="text-sm font-medium text-blue-500">
                PROJECT SUPERVISOR
              </p>

              <h3 className="mt-2 text-2xl font-bold text-white">
                Mr SK Pahuja Sir
              </h3>

              <p className="mt-2 text-slate-400">
                Professor 
              </p>

              <p className="text-sm text-slate-500">
                Department of Instrumentation & Control Engineering
              </p>

              <p className="mt-6 leading-7 text-slate-400">
                This project was developed under the guidance and
                supervision of SK Pahuja Sir, whose technical
                guidance helped us understand industrial monitoring,
                instrumentation, embedded systems, and software
                integration.
              </p>
            </div>

          </div>
        </div>
      </section>


      {/* ================= TEAM ================= */}
      <section id="team" className="border-b border-slate-800">
        <div className="mx-auto max-w-7xl px-6 py-20">

          <div className="mb-12 text-center">
            <p className="text-sm font-semibold uppercase tracking-wider text-blue-500">
              Our Team
            </p>

            <h2 className="mt-3 text-3xl font-bold text-white md:text-4xl">
              The People Behind MotorGuard
            </h2>

            <p className="mx-auto mt-4 max-w-2xl text-slate-400">
              A collaborative project combining instrumentation,
              embedded systems, backend development, and frontend
              engineering.
            </p>
          </div>


          <div className="mx-auto grid max-w-5xl gap-6 sm:grid-cols-2 lg:grid-cols-3">

            {[
              {
                image: naveenImage,
                name: "Naveen Kumar Yadav",
                role: "Hardware, Sensors & Backend developer ",
                text: ["Developed the complete MERN stack application, including frontend, backend, APIs, and database.",
                    "Contributed to the overall development, testing, and deployment of the complete Motorguard solution."]
              },
              {
                image: raushanImage,
                name: "Raushan Raj",
                role: "Hardware, sensor & Frontend",
                text: ["Handled and integrated hardware sensors including temperature, vibration, and RPM sensors.", 
                    "Supported team members in debugging and resolving software code and integration issues across the MERN stack."]
              },
              {
                image: SauravImage,
                name: "Saurav Yadav",
                role: "Hardware & Sensor",
                text: ["Researched and evaluated suitable temperature, vibration, and RPM sensors based on system requirements.",
                    "Studied sensor specifications, working principles, and integration methods with ESP32."]
              },
            ].map((member) => (
              <div
                key={member.role}
                className="overflow-hidden rounded-xl border border-slate-800 bg-slate-900"
              >
                <div className="h-64 bg-slate-800">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="h-full w-full object-cover"
                  />
                </div>

                <div className="p-5">
                  <h3 className="font-semibold text-white">
                    {member.name}
                  </h3>

                  <p className="mt-1 text-sm font-medium text-blue-500">
                    {member.role}
                  </p>

                  <p className="mt-3 text-sm leading-6 text-slate-500">
                      {member.text.map((paragraph, index) => (
                          <p key={index} className={index > 0 ? "mt-2" : ""}>
                            {paragraph}
                           </p>
                        ))}
                  </p>
                </div>
              </div>
            ))}

          </div>
        </div>
      </section>


      {/* ================= CTA ================= */}
      <section>
        <div className="mx-auto max-w-5xl px-6 py-20">

          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-10 text-center md:p-14">

            <p className="text-sm font-semibold uppercase tracking-wider text-blue-500">
              MotorGuard Platform
            </p>

            <h2 className="mt-3 text-3xl font-bold text-white md:text-4xl">
              Ready to Monitor Your Motors?
            </h2>

            <p className="mx-auto mt-4 max-w-xl leading-7 text-slate-400">
              Access the MotorGuard dashboard to monitor motor health,
              review alerts, manage equipment, and analyze performance.
            </p>
    
            <button className="mt-8 inline-flex items-center gap-2 rounded-lg bg-blue-700 px-7 py-3 font-medium text-white transition hover:bg-blue-600" onClick={handleDashboardClick}>
               Go to Dashboard
               <ArrowRight size={18} />
            </button>

          </div>
        </div>
      </section>


      {/* ================= FOOTER ================= */}
      <footer className="border-t border-slate-800 bg-slate-950">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-6 py-8 text-sm md:flex-row md:items-center md:justify-between">

          <div>
            <p className="font-semibold text-white">
              MotorGuard
            </p>

            <p className="mt-1 text-xs text-slate-600">
              Industrial Motor Monitoring and Protection System
            </p>
          </div>

          <p className="text-xs text-slate-600">
            © 2026 MotorGuard. All rights reserved.
          </p>

        </div>
      </footer>

    </div>
  );
}

export default Home;



