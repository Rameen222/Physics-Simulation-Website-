import React, { useState } from "react";
import { ChevronDown, Magnet, Globe, Clock, ArrowRight } from "lucide-react";
import "bootstrap/dist/css/bootstrap.min.css";
import "../styles/homepage.css";
import { Link } from "react-router-dom";

const HomePage = () => {
  const simulations = [
    {
      id: "pendulum",
      title: "Simple Pendulum",
      icon: Clock,
      colorClass: "bg-success",
      glowClass: "simulation-green",
      description: "Watch how a pendulum swings.",
    },
    {
      id: "gravity",
      title: "Gravitational Field",
      icon: Globe,
      colorClass: "bg-primary",
      glowClass: "simulation-blue",
      description: "Explore the invisible force that keeps planets in orbit.",
    },
    {
      id: "magnetic",
      title: "Magnetic Field",
      icon: Magnet,
      colorClass: "bg-danger",
      glowClass: "simulation-red",
      description: "Discover the fascinating world of magnetism.",
    },
  ];

  return (
    <div className="bg-dark text-white">
      <section className="hero-section text-center position-relative d-flex align-items-center justify-content-center">
        <div className="hero-overlay"></div>
        <div className="z-1 text-center">
          <h1 className="display-1 fw-bold text-gradient">Phantom Physics</h1>
          <p className="lead text-light">
            Experience the beauty of physics through immersive simulations
          </p>
          <button
            className="btn btn-success btn-lg mt-3"
            onClick={() =>
              document
                .getElementById("simulations")
                .scrollIntoView({ behavior: "smooth" })
            }
          >
            Explore Simulations
          </button>

          {/* Matching style Test Yourself button */}
          <div className="mt-3">
            <Link to="/test-yourself" className="btn btn-success btn-lg">
              Test Yourself
            </Link>
          </div>
        </div>

        <div className="position-absolute bottom-0 start-50 translate-middle-x bounce">
          <ChevronDown size={32} className="text-light" />
        </div>
      </section>

      <section id="simulations" className="container py-5">
        <h2 className="text-center mb-4">Interactive Physics Lab</h2>
        <div className="row g-4">
          {simulations.map((sim) => (
            <div className="col-md-4" key={sim.id}>
              <Link to={`/${sim.id}`} className="text-decoration-none">
                <div
                  className={`card text-white p-3 text-center border-0 rounded-4 shadow-lg ${sim.glowClass}`}
                  style={{
                    backgroundColor: "#121212",
                    border: "1px solid rgba(21, 27, 90, 0.34)",
                  }}
                >
                  <div
                    className={`p-4 ${sim.colorClass} rounded-circle mx-auto d-flex align-items-center justify-content-center`}
                    style={{ width: "100px", height: "100px" }}
                  >
                    <sim.icon size={48} className="text-white" />
                  </div>
                  <h3 className="mt-3">{sim.title}</h3>
                  <p className="text-light">{sim.description}</p>
                  <button className="btn btn-outline-light mt-2">
                    Launch Simulation <ArrowRight size={16} />
                  </button>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default HomePage;
