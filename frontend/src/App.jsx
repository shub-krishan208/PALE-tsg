import Home from "./pages/Home.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import Layout from "./components/Admin/Layout.jsx";
import LogsHistory from "./pages/LogHistory.jsx";
import { Navigate } from "react-router-dom";
import QrCodeGen from "./pages/QrCode.jsx";

import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";
import Checkin from "./pages/Checkin.jsx";

function App() {
  return (
    <BrowserRouter>
      <div className="bg-[#0E2864]/5 min-h-screen">
        <Routes>
          {/* Public Route */}
          <Route path="/" element={<Home />} />

          <Route path="/qrcode" element={<QrCodeGen />} />
          <Route path="/checkin" element={<Checkin />} />
          {/* Admin Layout Routes */}
          <Route path="/dashboard" element={<Layout />}>
            {/* Default route for /dashboard */}
            <Route index element={<Dashboard />} />

            {/* /dashboard/logs */}
            <Route path="logs" element={<LogsHistory />} />
          </Route>
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
