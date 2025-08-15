import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import logo from "../assets/phantom_physics_logo1.png";
import "bootstrap/dist/css/bootstrap.min.css";
import "../styles/navbar.css";

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav className={`navbar navbar-expand-lg sticky-top ${scrolled ? "scrolled-navbar" : ""}`}>
      <div className="container d-flex justify-content-between align-items-center">
        <Link className="navbar-brand d-flex align-items-center" to="/">
          <img src={logo} alt="Phantom Physics Logo" className="nav-logo" />
        </Link>

        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse justify-content-end" id="navbarNav">
          <ul className="navbar-nav">
            <li className="nav-item">
              <Link className="nav-link" to="/pendulum">Simple Pendulum</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/gravity">Gravitational Field</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/magnetic">Magnetic Field</Link>
            </li>
            <li className="nav-item">
    <Link className="nav-link" to="/test-yourself">Test Yourself</Link>
  </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
