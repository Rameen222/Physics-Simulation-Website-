import { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from "react-router-dom";
import LoadingScreen from "./components/LoadingScreen";
import HomePage from "./components/HomePage";
import Navbar from "./components/Navbar";
import PendulumSimulation from "./components/PendulumSimulation";
import MagneticFieldSimulation from "./components/MagneticFieldSimulation";
import GravitationalFieldSimulation from "./components/GravitationalFieldSimulation";
import TestYourself from "./components/TestYourself";

import "./styles/loading.css";
import "bootstrap/dist/css/bootstrap.min.css";

function AppWrapper() {
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const handleLoadingComplete = () => {
    setLoading(false);
    navigate("/"); // Automatically go to homepage after loading animation
  };

  return loading ? (
    <LoadingScreen onComplete={handleLoadingComplete} />
  ) : (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/pendulum" element={<PendulumSimulation />} />
        <Route path="/magnetic" element={<MagneticFieldSimulation />} />
        <Route path="/gravity" element={<GravitationalFieldSimulation />} />
        <Route path="/test-yourself" element={<TestYourself />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </>
  );
}

export default function App() {
  return (
    <Router>
      <AppWrapper />
    </Router>
  );
}
