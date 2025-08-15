import React, { useState, useEffect, useCallback } from "react";
import { Play, Pause, Clock, Ruler, RotateCcw } from "lucide-react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Container, Row, Col, Form, Button, Card } from "react-bootstrap";

const PendulumSimulation = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [time, setTime] = useState(0);
  const [selectedLength, setSelectedLength] = useState("1.5");
  const [selectedAngle, setSelectedAngle] = useState("0.5");

  const lengthOptions = [1.0, 1.5, 2.0, 2.5, 3.0];
  const angleOptions = [0.3, 0.5, 0.7, 1.0, 1.2, 1.5];

  const [pendulumData, setPendulumData] = useState({
    length: parseFloat(selectedLength),
    angle: parseFloat(selectedAngle),
  });

  const g = 9.81;
  const dampingFactor = 0.03;

  const calculateOmega = useCallback((length) => Math.sqrt(g / length), []);
  const calculatePeriod = useCallback((length) => 2 * Math.PI * Math.sqrt(length / g), []);

  const calculateDampedAngle = useCallback(
    (initialAngle, omega, t) => initialAngle * Math.exp(-dampingFactor * t) * Math.cos(omega * t),
    []
  );

  const resetSimulation = () => {
    setIsRunning(false);
    setTime(0);
  };

  useEffect(() => {
    setPendulumData({
      length: parseFloat(selectedLength),
      angle: parseFloat(selectedAngle),
    });
    resetSimulation();
  }, [selectedLength, selectedAngle]);

  useEffect(() => {
    let animationFrame;
    let startTime;

    const animate = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const elapsed = (timestamp - startTime) / 1000;
      setTime(elapsed);
      animationFrame = requestAnimationFrame(animate);
    };

    if (isRunning) {
      animationFrame = requestAnimationFrame(animate);
    }

    return () => {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
      }
    };
  }, [isRunning]);

  if (!pendulumData) return null;

  const period = calculatePeriod(pendulumData.length);
  const omega = calculateOmega(pendulumData.length);
  const currentAngle = calculateDampedAngle(pendulumData.angle, omega, time);
  const angleDegrees = (currentAngle * 180) / Math.PI;

  return (
    <Container className="py-5">
      <Row className="justify-content-center">
        <Col lg={10}>
          <Card bg="dark" text="white" className="border-secondary shadow">
            <Card.Body>

              {/* Control Panel */}
              <Row className="mb-4 gy-3">
                <Col md={4}>
                  <Card bg="secondary" text="white" className="h-100">
                    <Card.Body>
                      <div className="d-flex align-items-center mb-2">
                        <Ruler size={18} className="me-2 text-success" />
                        <span className="small">Pendulum Length</span>
                      </div>
                      <Form.Select 
                        value={selectedLength}
                        onChange={(e) => setSelectedLength(e.target.value)}
                        className="bg-dark text-white border-secondary"
                      >
                        {lengthOptions.map((l) => (
                          <option key={l} value={l}>{`${l} meters`}</option>
                        ))}
                      </Form.Select>
                    </Card.Body>
                  </Card>
                </Col>

                <Col md={4}>
                  <Card bg="secondary" text="white" className="h-100">
                    <Card.Body>
                      <div className="d-flex align-items-center mb-2">
                        <Clock size={18} className="me-2 text-primary" />
                        <span className="small">Initial Angle</span>
                      </div>
                      <Form.Select
                        value={selectedAngle}
                        onChange={(e) => setSelectedAngle(e.target.value)}
                        className="bg-dark text-white border-secondary"
                      >
                        {angleOptions.map((a) => (
                          <option key={a} value={a}>{`${(a * 180 / Math.PI).toFixed(1)}°`}</option>
                        ))}
                      </Form.Select>
                    </Card.Body>
                  </Card>
                </Col>

                <Col md={4}>
                  <Card bg="secondary" text="white" className="h-100">
                    <Card.Body>
                      <div className="d-flex align-items-center mb-2">
                        <span className="small">Simulation Controls</span>
                      </div>
                      <div className="d-flex gap-2">
                        <Button
                          variant={isRunning ? "danger" : "success"}
                          className="flex-grow-1"
                          onClick={() => setIsRunning(!isRunning)}
                        >
                          {isRunning ? <Pause size={16} className="me-2" /> : <Play size={16} className="me-2" />}
                          {isRunning ? "Stop" : "Start"}
                        </Button>
                        <Button
                          variant="secondary"
                          className="flex-grow-1"
                          onClick={resetSimulation}
                        >
                          <RotateCcw size={16} className="me-2" />
                          Reset
                        </Button>
                      </div>
                    </Card.Body>
                  </Card>
                </Col>
              </Row>

              {/* Pendulum Simulation */}
              <Card bg="secondary" className="mb-4 position-relative">
                <Card.Body style={{ height: "450px", display: "block" }} className="position-relative">
                  
                  {/* Equilibrium Line */}
                  <div className="position-absolute" style={{
                    top: "40px",
                    bottom: "40px", // Moved up to prevent interception
                    left: "50%",
                    width: "2px",
                    backgroundColor: "#ffffff",
                    transform: "translateX(-50%)",
                    opacity: 0.6
                  }}></div>
                  
                  {/* Equilibrium Label */}
                  <span style={{
                    position: "absolute",
                    bottom: "10px",
                    left: "50%",
                    transform: "translateX(-50%)",
                    color: "#ffffff",
                    fontSize: "14px",
                    fontWeight: "bold"
                  }}>
                    Equilibrium
                  </span>

                  {/* Pendulum Rod & Bob */}
                  <div className="position-absolute" 
                    style={{
                      height: `${pendulumData.length * 80}px`,
                      width: "4px",
                      background: "linear-gradient(to bottom, #10b981, #3b82f6)",
                      transformOrigin: "top",
                      transform: `rotate(${isRunning ? angleDegrees : (pendulumData.angle * 180) / Math.PI}deg)`,
                      transition: isRunning ? "none" : "transform 0.3s ease-out",
                      top: "40px",
                      left: "50%",
                      transform: `translateX(-50%) rotate(${angleDegrees}deg)`
                    }}>
                    
                    {/* Pendulum Bob */}
                    <div className="position-absolute rounded-circle" 
                      style={{
                        width: "35px",
                        height: "35px",
                        bottom: 0,
                        left: "50%",
                        transform: "translate(-50%, 50%)",
                        background: "linear-gradient(135deg, #3b82f6, #8b5cf6)",
                        boxShadow: "0 0 10px rgba(59, 130, 246, 0.5)",
                      }}>
                    </div>
                  </div>
                </Card.Body>
              </Card>

              {/* Bottom Details */}
              <p className="text-center text-white-50">
                Length: {pendulumData.length}m | Initial Angle: {(pendulumData.angle * 180 / Math.PI).toFixed(1)}° | Period: {period.toFixed(2)}s
              </p>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default PendulumSimulation;
