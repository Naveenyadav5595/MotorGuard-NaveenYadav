
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/home";
import Register from "./pages/register";
import Login from "./pages/login";
import ProtectedRoute from "./components/protectedRoute";
import Dashboard from "./pages/dashboard";
import ViewDetails from "./components/viewdetails";
import Motormanagement from "./pages/motormanagement";
import Alert from "./pages/alert.jsx";
import Log from "./pages/log.jsx";
import MotorControl from "./pages/motorcontrol.jsx";




function App() {
  return (
    // enable routing
    <BrowserRouter> 
      <Routes>

        <Route path="/" element={<Home />} />

        <Route path="/login" element={<Login />} />

        <Route path="/register" element={<Register />} />

        <Route path="/dashboard" element={ <ProtectedRoute> <Dashboard /> </ProtectedRoute> } />
        <Route path="/dashboard/viewdetails/:motorId" element={<ViewDetails />} />
        <Route path="/motors/management" element={ <ProtectedRoute> <Motormanagement /> </ProtectedRoute> } />
        <Route path="/alerts" element={ <Alert /> } />
        <Route path="/motorcontrol" element={ <MotorControl /> } />
        <Route path="/dashboard/logs" element={<Log />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;


