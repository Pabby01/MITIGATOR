'use client';

import { useRef, useMemo, Suspense } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Text, Float, Stars, Line } from '@react-three/drei';
import * as THREE from 'three';

type NodeData = {
  symbol: string;
  name: string;
  position: [number, number, number];
  color: string;
  size: number;
  score: number;
  change: number;
};

const ASSET_NODES: NodeData[] = [
  { symbol: 'NVDAx', name: 'NVIDIA', position: [3, 1.5, 0], color: '#3fb98a', size: 0.6, score: 84, change: 3.82 },
  { symbol: 'AAPLx', name: 'Apple', position: [-2.5, 2, 1], color: '#4cc9f0', size: 0.5, score: 78, change: 1.24 },
  { symbol: 'TSLAx', name: 'Tesla', position: [-3, -1.5, -1], color: '#f59e0b', size: 0.45, score: 61, change: -2.14 },
  { symbol: 'AMZNx', name: 'Amazon', position: [2, -2, 2], color: '#4cc9f0', size: 0.5, score: 81, change: 0.87 },
  { symbol: 'GOOGLx', name: 'Alphabet', position: [-1, -2.5, 2], color: '#a78bfa', size: 0.48, score: 79, change: 2.05 },
  { symbol: 'SPYx', name: 'S&P 500', position: [0, 3.5, -2], color: '#3fb98a', size: 0.7, score: 92, change: 0.42 },
  { symbol: 'QQQx', name: 'Nasdaq 100', position: [4, -0.5, -2], color: '#3fb98a', size: 0.65, score: 88, change: 0.91 },
];

function MarketNode({ data, index }: { data: NodeData; index: number }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const ringRef = useRef<THREE.Mesh>(null);
  const glowRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (meshRef.current) {
      meshRef.current.position.y = data.position[1] + Math.sin(t * 0.5 + index) * 0.15;
      meshRef.current.rotation.y = t * 0.2;
    }
    if (ringRef.current) {
      ringRef.current.rotation.x = t * 0.3;
      ringRef.current.rotation.y = t * 0.4;
    }
    if (glowRef.current) {
      const pulse = 1 + Math.sin(t * 1.5 + index) * 0.1;
      glowRef.current.scale.setScalar(pulse);
    }
  });

  const nodeColor = useMemo(() => new THREE.Color(data.color), [data.color]);

  return (
    <group position={data.position}>
      {/* Glow halo */}
      <mesh ref={glowRef}>
        <sphereGeometry args={[data.size * 1.8, 16, 16]} />
        <meshBasicMaterial color={nodeColor} transparent opacity={0.08} />
      </mesh>

      {/* Main node */}
      <mesh ref={meshRef}>
        <sphereGeometry args={[data.size, 32, 32]} />
        <meshStandardMaterial
          color={nodeColor}
          emissive={nodeColor}
          emissiveIntensity={0.4}
          metalness={0.6}
          roughness={0.3}
        />
      </mesh>

      {/* Orbiting ring */}
      <mesh ref={ringRef} rotation={[Math.PI / 3, 0, 0]}>
        <torusGeometry args={[data.size * 1.4, 0.015, 8, 64]} />
        <meshBasicMaterial color={nodeColor} transparent opacity={0.4} />
      </mesh>

      {/* Label */}
      <Text
        position={[0, -data.size * 2.2, 0]}
        fontSize={0.22}
        color="#ffffff"
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.01}
        outlineColor="#000000"
        outlineOpacity={0.5}
      >
        {data.symbol}
      </Text>
    </group>
  );
}

function ConnectionLines() {
  const lines = useMemo(() => {
    const pairs: [NodeData, NodeData][] = [];
    for (let i = 0; i < ASSET_NODES.length; i++) {
      for (let j = i + 1; j < ASSET_NODES.length; j++) {
        const dist = Math.sqrt(
          Math.pow(ASSET_NODES[i].position[0] - ASSET_NODES[j].position[0], 2) +
          Math.pow(ASSET_NODES[i].position[1] - ASSET_NODES[j].position[1], 2) +
          Math.pow(ASSET_NODES[i].position[2] - ASSET_NODES[j].position[2], 2)
        );
        if (dist < 5) pairs.push([ASSET_NODES[i], ASSET_NODES[j]]);
      }
    }
    return pairs;
  }, []);

  return (
    <>
      {lines.map((pair, i) => {
        const points = [
          new THREE.Vector3(...pair[0].position),
          new THREE.Vector3(...pair[1].position),
        ];
        return (
          <Line
            key={i}
            points={points}
            color="#3fb98a"
            lineWidth={0.5}
            transparent
            opacity={0.12}
          />
        );
      })}
    </>
  );
}

function CentralScore() {
  const ref = useRef<THREE.Mesh>(null);
  const ringRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (ref.current) {
      ref.current.rotation.y = t * 0.15;
    }
    if (ringRef.current) {
      ringRef.current.rotation.z = t * 0.1;
      ringRef.current.rotation.x = t * 0.08;
    }
  });

  return (
    <group position={[0, 0, 0]}>
      <mesh ref={ref}>
        <icosahedronGeometry args={[0.35, 1]} />
        <meshStandardMaterial
          color="#3fb98a"
          emissive="#3fb98a"
          emissiveIntensity={0.6}
          metalness={0.8}
          roughness={0.2}
          wireframe
        />
      </mesh>
      <mesh ref={ringRef}>
        <torusGeometry args={[0.8, 0.02, 8, 64]} />
        <meshBasicMaterial color="#3fb98a" transparent opacity={0.3} />
      </mesh>
      <mesh>
        <sphereGeometry args={[1.2, 16, 16]} />
        <meshBasicMaterial color="#3fb98a" transparent opacity={0.04} />
      </mesh>
    </group>
  );
}

function ParticleField() {
  const ref = useRef<THREE.Points>(null);

  const positions = useMemo(() => {
    const count = 200;
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      arr[i * 3] = (Math.random() - 0.5) * 20;
      arr[i * 3 + 1] = (Math.random() - 0.5) * 20;
      arr[i * 3 + 2] = (Math.random() - 0.5) * 20;
    }
    return arr;
  }, []);

  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.y = state.clock.elapsedTime * 0.03;
    }
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={positions.length / 3}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.03}
        color="#4cc9f0"
        transparent
        opacity={0.4}
        sizeAttenuation
      />
    </points>
  );
}

function Scene() {
  const { camera } = useThree();

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    camera.position.x = Math.sin(t * 0.08) * 0.5;
    camera.position.y = Math.cos(t * 0.06) * 0.3;
    camera.lookAt(0, 0, 0);
  });

  return (
    <>
      <ambientLight intensity={0.3} />
      <pointLight position={[10, 10, 10]} intensity={0.8} color="#3fb98a" />
      <pointLight position={[-10, -5, -10]} intensity={0.4} color="#4cc9f0" />
      <pointLight position={[0, 0, 5]} intensity={0.3} color="#a78bfa" />

      <Stars radius={50} depth={50} count={1000} factor={4} fade speed={0.5} />

      <ParticleField />
      <CentralScore />
      <ConnectionLines />

      {ASSET_NODES.map((node, i) => (
        <MarketNode key={node.symbol} data={node} index={i} />
      ))}

      <OrbitControls
        enableZoom={false}
        enablePan={false}
        autoRotate
        autoRotateSpeed={0.3}
        minPolarAngle={Math.PI / 3}
        maxPolarAngle={Math.PI / 1.8}
      />
    </>
  );
}

export function MarketUniverse({ className }: { className?: string }) {
  return (
    <div className={className}>
      <Canvas
        dpr={[1, 1.5]}
        camera={{ position: [0, 0, 10], fov: 50 }}
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
      >
        <Suspense fallback={null}>
          <Scene />
        </Suspense>
      </Canvas>
    </div>
  );
}
