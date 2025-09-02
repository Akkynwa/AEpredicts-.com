// App.js
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import HomePage from "./pages/HomePage/HomePage";
import Footer from "./components/Footer";
import { CartProvider } from "./pages/HomePage/CartContext";
import BetSlip from "./components/BetSlip";
import WinningPredictions from "./pages/HomePage/WinningPredictions";
import Admin from "./admin/Admin";
import AdminLogin from "./admin/AdminLogin";
import AdminDashboard from "./admin/AdminDashboard";
import BundesligaAdmin from "./admin/bundesligaAdmin/BundesligaAdmin";
import EpleagueAdmin from "./admin/eplpagesadmin/EplAdmin";
import LaligaAdmin from "./admin/laligapagesadmin/LaligaAdmin";
import SerieAAdmin from "./admin/seriaaadmin/SeriaAAdmin";
import League1Admin from "./admin/league1/League1Admin";
import OthersAdmin from "./admin/others/othersAdmin";


const App = () => {
  return (
    <CartProvider>
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<HomePage/>} />
        <Route path="/cart" element={<BetSlip />} />
        <Route path="/admin" element={<Admin />} />
        {/* show all matches */}

        {/* show add form */}
        <Route path="/admin/bundesliga" element={<BundesligaAdmin />} />
        <Route path="/admin/epl" element={<EpleagueAdmin />} />
        <Route path="/admin/laliga" element={<LaligaAdmin />} />
        <Route path="/admin/seriaA" element={<SerieAAdmin />} />
        <Route path="/admin/league1" element={<League1Admin />} />
        <Route path="/admin/others" element={<OthersAdmin />} />

         {/* Public routes */}
        <Route path="/" element={<WinningPredictions />} />

        {/* Admin routes */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />

        {/* Future pages can be added here */}
        {/* <Route path="/" element={<AuthForm />} /> */}
      </Routes>
      <Footer />
    </Router>
    </CartProvider>
  );
};

export default App;
