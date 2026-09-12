'use client';

import { useRef, useMemo, useState, Suspense } from 'react';
import { useRouter } from 'next/navigation';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Float, Stars, Line, Html } from '@react-three/drei';
import * as THREE from 'three';

export type NodeData = {
  symbol: string;
  name: string;
  position: [number, number, number];
  color: string;
  size: number;
  score: number;
  price: number;
  change: number;
  sector: string;
};

export const ASSET_NODES: NodeData[] = [
  { symbol: 'NVDAx', name: 'NVIDIA', position: [3.2, 1.4, 0.4], color: '#3fb98a', size: 0.65, score: 84, price: 184.22, change: 3.82, sector: 'Tech' },
  { symbol: 'AAPLx', name: 'Apple', position: [-2.8, 2.2, 0.8], color: '#4cc9f0', size: 0.55, score: 78, price: 226.87, change: 1.24, sector: 'Tech' },
  { symbol: 'TSLAx', name: 'Tesla', position: [-3.2, -1.6, -0.8], color: '#f59e0b', size: 0.5, score: 61, price: 248.5, change: -2.14, sector: 'Auto' },
  { symbol: 'AMZNx', name: 'Amazon', position: [2.2, -2.2, 1.6], color: '#4cc9f0', size: 0.52, score: 81, price: 174.33, change: 0.87, sector: 'Consumer' },
  { symbol: 'GOOGLx', name: 'Alphabet', position: [-1.2, -2.8, 1.8], color: '#a78bfa', size: 0.5, score: 79, price: 163.12, change: 2.05, sector: 'Tech' },
  { symbol: 'SPYx', name: 'S&P 500', position: [0.2, 3.6, -1.8], color: '#3fb98a', size: 0.72, score: 92, price: 547.63, change: 0.42, sector: 'Index' },
  { symbol: 'QQQx', name: 'Nasdaq', position: [4.2, -0.6, -1.8], color: '#3fb98a', size: 0.68, score: 88, price: 472.18, change: 0.91, sector: 'Index' },
];

function SleekAssetNode({ data, index }: { data: NodeData; index: number }) {
  const router = useRouter();
  const groupRef = useRef<THREE.Group>(null);
  const outerMeshRef = useRef<THREE.Mesh>(null);
  const coreMeshRef = useRef<THREE.Mesh>(null);
  const ring1Ref = useRef<THREE.Mesh>(null);
  const ring2Ref = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);

  const nodeColor = useMemo(() => new THREE.Color(data.color), [data.color]);
  const glowColor = useMemo(() => new THREE.Color(data.color).multiplyScalar(1.4), [data.color]);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (groupRef.current) {
      groupRef.current.position.y = data.position[1] + Math.sin(t * 0.7 + index * 1.2) * 0.18;
    }
    if (outerMeshRef.current) {
      outerMeshRef.current.rotation.y = t * 0.25;
      const targetScale = hovered ? 1.2 : 1;
      outerMeshRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.1);
    }
    if (coreMeshRef.current) {
      coreMeshRef.current.rotation.x = -t * 0.5;
      coreMeshRef.current.rotation.z = t * 0.3;
    }
    if (ring1Ref.current) {
      ring1Ref.current.rotation.x = t * 0.4;
      ring1Ref.current.rotation.y = t * 0.6;
    }
    if (ring2Ref.current) {
      ring2Ref.current.rotation.x = -t * 0.3;
      ring2Ref.current.rotation.z = t * 0.5;
    }
  });

  return (
    <group
      ref={groupRef}
      position={data.position}
      onPointerOver={(e) => {
        e.stopPropagation();
        setHovered(true);
      }}
      onPointerOut={() => setHovered(false)}
      onClick={(e) => {
        e.stopPropagation();
        router.push(`/market/${data.symbol}`);
      }}
    >
      {/* Outer Sleek Glass Sphere */}
      <mesh ref={outerMeshRef}>
        <sphereGeometry args={[data.size, 32, 32]} />
        <meshPhysicalMaterial
          color={nodeColor}
          emissive={nodeColor}
          emissiveIntensity={hovered ? 0.8 : 0.35}
          roughness={0.15}
          metalness={0.2}
          clearcoat={1}
          clearcoatRoughness={0.1}
          transmission={0.4}
          thickness={0.8}
        />
      </mesh>

      {/* Internal Crystalline Core */}
      <mesh ref={coreMeshRef}>
        <icosahedronGeometry args={[data.size * 0.55, 1]} />
        <meshStandardMaterial
          color="#ffffff"
          emissive={glowColor}
          emissiveIntensity={hovered ? 1.2 : 0.6}
          roughness={0.2}
          metalness={0.8}
          wireframe={!hovered}
        />
      </mesh>

      {/* Primary Gyroscopic Data Ring */}
      <mesh ref={ring1Ref}>
        <torusGeometry args={[data.size * 1.45, 0.018, 12, 64]} />
        <meshBasicMaterial color={nodeColor} transparent opacity={hovered ? 0.8 : 0.45} />
      </mesh>

      {/* Secondary Counter-Ring */}
      <mesh ref={ring2Ref} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[data.size * 1.25, 0.012, 8, 48]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={hovered ? 0.5 : 0.2} />
      </mesh>

      {/* Atmospheric Soft Light Pulse */}
      <pointLight color={nodeColor} distance={3} intensity={hovered ? 2.5 : 1} />

      {/* Interactive Monie-Style HUD Chip */}
      <Html
        position={[0, -data.size * 1.6, 0]}
        center
        distanceFactor={10}
        style={{
          transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
          pointerEvents: 'none',
          opacity: hovered ? 1 : 0.85,
          transform: hovered ? 'scale(1.1)' : 'scale(1)',
        }}
      >
        <div className="flex flex-col items-center select-none">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full border border-white/10 bg-black/75 backdrop-blur-md shadow-xl text-[11px] font-sans">
            <span className="font-bold tracking-tight text-white">{data.symbol}</span>
            <span className="text-zinc-400 tabular-nums">${data.price.toFixed(2)}</span>
            <span className={data.change >= 0 ? 'text-emerald-400 font-semibold' : 'text-amber-400 font-semibold'}>
              {data.change >= 0 ? '+' : ''}{data.change.toFixed(1)}%
            </span>
            <span className="px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300 font-mono text-[9px]">
              {data.score}
            </span>
          </div>
        </div>
      </Html>
    </group>
  );
}

function CentralShieldCore() {
  const shieldRef = useRef<THREE.Group>(null);
  const ringGroupRef = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (shieldRef.current) {
      shieldRef.current.rotation.y = t * 0.3;
      shieldRef.current.rotation.x = Math.sin(t * 0.4) * 0.12;
    }
    if (ringGroupRef.current) {
      ringGroupRef.current.rotation.z = -t * 0.2;
      ringGroupRef.current.rotation.x = t * 0.15;
    }
  });

  return (
    <group position={[0, 0, 0]}>
      {/* Faceted 3D Central Emblem */}
      <group
        ref={shieldRef}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        <mesh>
          <octahedronGeometry args={[0.75, 1]} />
          <meshPhysicalMaterial
            color="#3fb98a"
            emissive="#3fb98a"
            emissiveIntensity={hovered ? 0.9 : 0.5}
            roughness={0.1}
            metalness={0.7}
            clearcoat={1}
            wireframe
          />
        </mesh>
        <mesh scale={0.65}>
          <octahedronGeometry args={[0.75, 0]} />
          <meshStandardMaterial
            color="#ffffff"
            emissive="#4cc9f0"
            emissiveIntensity={0.6}
            metalness={0.9}
            roughness={0.2}
          />
        </mesh>
      </group>

      {/* Orbiting Orbital Coordinate Rings */}
      <group ref={ringGroupRef}>
        <mesh rotation={[Math.PI / 4, 0, 0]}>
          <torusGeometry args={[1.5, 0.02, 16, 96]} />
          <meshBasicMaterial color="#3fb98a" transparent opacity={0.35} />
        </mesh>
        <mesh rotation={[-Math.PI / 4, Math.PI / 3, 0]}>
          <torusGeometry args={[1.8, 0.015, 12, 96]} />
          <meshBasicMaterial color="#4cc9f0" transparent opacity={0.25} />
        </mesh>
      </group>

      {/* Soft Ambient Volumetric Light */}
      <pointLight color="#3fb98a" intensity={3} distance={5} />
      <pointLight color="#4cc9f0" intensity={1.5} distance={4} />

      {/* Center Label HUD */}
      <Html position={[0, -1.4, 0]} center distanceFactor={10}>
        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full border border-emerald-500/30 bg-black/80 backdrop-blur-md shadow-2xl text-[10px] font-mono text-emerald-300 uppercase tracking-widest pointer-events-none">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
          MITIGATOR CORE
        </div>
      </Html>
    </group>
  );
}

function ConnectionConstellations() {
  const lines = useMemo(() => {
    const pairs: [NodeData, NodeData][] = [];
    for (let i = 0; i < ASSET_NODES.length; i++) {
      for (let j = i + 1; j < ASSET_NODES.length; j++) {
        const dist = Math.hypot(
          ASSET_NODES[i].position[0] - ASSET_NODES[j].position[0],
          ASSET_NODES[i].position[1] - ASSET_NODES[j].position[1],
          ASSET_NODES[i].position[2] - ASSET_NODES[j].position[2]
        );
        if (dist < 5.8) pairs.push([ASSET_NODES[i], ASSET_NODES[j]]);
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
            color={pair[0].color === pair[1].color ? pair[0].color : '#4cc9f0'}
            lineWidth={0.8}
            transparent
            opacity={0.16}
          />
        );
      })}
    </>
  );
}

function FloatingDustField() {
  const pointsRef = useRef<THREE.Points>(null);

  const [positions, colors] = useMemo(() => {
    const count = 350;
    const pos = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);
    const colorA = new THREE.Color('#3fb98a');
    const colorB = new THREE.Color('#4cc9f0');

    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 22;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 22;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 22;

      const mixed = Math.random() > 0.5 ? colorA : colorB;
      col[i * 3] = mixed.r;
      col[i * 3 + 1] = mixed.g;
      col[i * 3 + 2] = mixed.b;
    }
    return [pos, col];
  }, []);

  useFrame((state) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y = state.clock.elapsedTime * 0.02;
    }
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={positions.length / 3} array={positions} itemSize={3} />
        <bufferAttribute attach="attributes-color" count={colors.length / 3} array={colors} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial
        size={0.035}
        vertexColors
        transparent
        opacity={0.5}
        sizeAttenuation
      />
    </points>
  );
}

function SceneContent({ interactive = true }: { interactive?: boolean }) {
  const { camera } = useThree();

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (interactive) {
      // Smooth Monie-style mouse parallax
      const targetX = (state.pointer.x * 0.8) + Math.sin(t * 0.1) * 0.4;
      const targetY = (state.pointer.y * 0.6) + Math.cos(t * 0.08) * 0.3;
      camera.position.x = THREE.MathUtils.lerp(camera.position.x, targetX, 0.05);
      camera.position.y = THREE.MathUtils.lerp(camera.position.y, targetY, 0.05);
      camera.lookAt(0, 0, 0);
    }
  });

  return (
    <>
      <ambientLight intensity={0.4} />
      <directionalLight position={[10, 15, 10]} intensity={1.2} color="#ffffff" />
      <pointLight position={[-10, -5, -8]} intensity={0.6} color="#4cc9f0" />
      <pointLight position={[8, 8, 8]} intensity={0.9} color="#3fb98a" />

      <Stars radius={45} depth={40} count={900} factor={3} fade speed={0.4} />
      <FloatingDustField />
      <CentralShieldCore />
      <ConnectionConstellations />

      {ASSET_NODES.map((node, i) => (
        <SleekAssetNode key={node.symbol} data={node} index={i} />
      ))}

      <OrbitControls
        enableZoom={false}
        enablePan={false}
        autoRotate
        autoRotateSpeed={0.25}
        minPolarAngle={Math.PI / 3.2}
        maxPolarAngle={Math.PI / 1.7}
      />
    </>
  );
}

export function MarketUniverse({
  className = '',
  interactive = true,
}: {
  className?: string;
  interactive?: boolean;
}) {
  return (
    <div className={`relative w-full h-full ${className}`}>
      <Canvas
        camera={{ position: [0, 0, 8.5], fov: 45 }}
        dpr={[1, 1.5]}
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
      >
        <Suspense fallback={null}>
          <SceneContent interactive={interactive} />
        </Suspense>
      </Canvas>
    </div>
  );
}
