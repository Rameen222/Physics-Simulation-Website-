import React, { useEffect, useState, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Trail, Float } from '@react-three/drei';
import { Physics, RigidBody } from '@react-three/rapier';
import { motion } from 'framer-motion';
import { Vector3 } from 'three';

const AnimatedBall = ({ onComplete }) => {
  const ballRef = useRef();
  const [position] = useState([7, 8, 0]);
  const [firstBounce, setFirstBounce] = useState(false);
  const [ballDone, setBallDone] = useState(false);

  useFrame(() => {
    if (ballRef.current) {
      const time = performance.now() / 1000;
      ballRef.current.material.emissiveIntensity = Math.sin(time * 2) * 0.2 + 0.3;

      const pos = ballRef.current.getWorldPosition(new Vector3());
      const vel = ballRef.current.parent?.rigidBody?.linvel();

      if (
        firstBounce &&
        pos.x < -15 && // ⬅ left side escape
        Math.abs(vel?.x || 0) < 0.01 &&
        Math.abs(vel?.y || 0) < 0.01 &&
        Math.abs(vel?.z || 0) < 0.01 &&
        !ballDone
      ) {
        setBallDone(true);
        onComplete();
      }
    }
  });

  return (
    <RigidBody
      position={position}
      restitution={1.3}
      friction={0.03}
      linearDamping={0}
      angularDamping={0.05}
      onCollisionEnter={() => {
        if (!firstBounce) {
          setFirstBounce(true);
          ballRef.current?.applyImpulse({ x: -8, y: 2, z: 0 }, true); // ⬅ more powerful bounce left
        }
      }}
    >
      <Trail width={0.8} length={8} color="#34d399" attenuation={(t) => t * t}>
        <mesh ref={ballRef} castShadow>
          <sphereGeometry args={[0.5, 32, 32]} />
          <meshPhysicalMaterial
            color="#34d399"
            metalness={0.6}
            roughness={0.1}
            emissive="#22c55e"
            emissiveIntensity={0.4}
            clearcoat={1}
            clearcoatRoughness={0.1}
          />
        </mesh>
      </Trail>
    </RigidBody>
  );
};

const FloatingParticles = () => {
  const particles = useRef([]);
  const count = 20;

  useEffect(() => {
    particles.current = Array.from({ length: count }, () => ({
      position: new Vector3(
        (Math.random() - 0.5) * 15,
        Math.random() * 10,
        (Math.random() - 0.5) * 5
      ),
      scale: Math.random() * 0.2 + 0.05,
      color: Math.random() > 0.5 ? "#8b5cf6" : "#f43f5e"
    }));
  }, []);

  return particles.current.map((particle, i) => (
    <Float
      key={i}
      speed={2}
      rotationIntensity={1.5}
      floatIntensity={2}
      position={particle.position.toArray()}
    >
      <mesh scale={particle.scale}>
        <sphereGeometry args={[1, 16, 16]} />
        <meshPhysicalMaterial
          color={particle.color}
          transmission={0.8}
          opacity={0.6}
          metalness={0.3}
          roughness={0.1}
          transparent
        />
      </mesh>
    </Float>
  ));
};

const Ground = () => (
  <RigidBody type="fixed" position={[0, -2, 0]} rotation={[0, 0, 0.3]}>
    {/* ⬆ Steeper slope */}
    <mesh receiveShadow>
      <boxGeometry args={[30, 0.5, 4]} />
      <meshPhysicalMaterial
        color="#1f2937"
        metalness={0.2}
        roughness={0.3}
        transmission={0.5}
        transparent
        opacity={0.4}
      />
    </mesh>
  </RigidBody>
);

const LoadingScreen = ({ onComplete }) => {
  const [animationDone, setAnimationDone] = useState(false);

  return (
    <motion.div
      className="loading-container"
      initial={{ opacity: 1 }}
      animate={{ opacity: animationDone ? 0 : 1 }}
      transition={{ duration: 1.2 }}
      onAnimationComplete={animationDone ? onComplete : null}
    >
      <h1 className="loading-title text-gradient">Phantom Physics</h1>

      <Canvas
        shadows
        camera={{ position: [0, 5, 10], fov: 45 }}
        className="canvas"
      >
        {/* 🟡 Removed: color attach="background" — now handled in CSS */}
        <fog attach="fog" args={['#111827', 8, 25]} />

        <ambientLight intensity={0.4} />
        <directionalLight
          position={[5, 5, 5]}
          intensity={0.8}
          castShadow
          color="#ffffff"
        />
        <spotLight
          position={[0, 8, 0]}
          intensity={0.6}
          color="#34d399"
          distance={20}
          angle={0.5}
          penumbra={1}
        />

        <Physics gravity={[0, -9.81, 0]}>
          <AnimatedBall onComplete={() => setAnimationDone(true)} />
          <Ground />
          <FloatingParticles />
        </Physics>

        <OrbitControls
          enableZoom={false}
          enablePan={false}
          enableRotate={false}
        />
      </Canvas>
    </motion.div>
  );
};

export default LoadingScreen;
