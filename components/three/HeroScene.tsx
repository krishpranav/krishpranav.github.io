"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useRef, useMemo, Suspense } from "react";
import * as THREE from "three";

const ACCENT = new THREE.Color("#ffffff");

/* Central reasoning core — a wireframe icosahedron that slowly breathes. */
function Core() {
  const outer = useRef<THREE.Mesh>(null);
  const inner = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (outer.current) {
      outer.current.rotation.y = t * 0.14;
      outer.current.rotation.x = Math.sin(t * 0.2) * 0.12;
      const s = 1 + Math.sin(t * 0.9) * 0.015;
      outer.current.scale.setScalar(s);
    }
    if (inner.current) {
      inner.current.rotation.y = -t * 0.22;
      inner.current.rotation.z = t * 0.1;
    }
  });

  return (
    <group>
      <mesh ref={outer}>
        <icosahedronGeometry args={[1.35, 1]} />
        <meshBasicMaterial wireframe color="#ededed" transparent opacity={0.14} />
      </mesh>
      <mesh ref={inner}>
        <icosahedronGeometry args={[0.72, 0]} />
        <meshBasicMaterial wireframe color={ACCENT} transparent opacity={0.5} />
      </mesh>
      <mesh>
        <icosahedronGeometry args={[0.28, 1]} />
        <meshBasicMaterial color={ACCENT} transparent opacity={0.9} />
      </mesh>
      <pointLight position={[0, 0, 0]} intensity={3} color={ACCENT} distance={6} />
    </group>
  );
}

/* Tokens streaming along orbital rings — represents LLM tool-calls in flight. */
function TokenStreams() {
  const group = useRef<THREE.Group>(null);
  const COUNT = 3;
  const rings = useMemo(
    () =>
      Array.from({ length: COUNT }, (_, i) => ({
        radius: 2.1 + i * 0.55,
        tilt: (i - 1) * 0.5,
        speed: 0.5 - i * 0.1,
        n: 26 + i * 8,
      })),
    []
  );

  useFrame((state) => {
    if (group.current) group.current.rotation.y = state.clock.elapsedTime * 0.05;
  });

  return (
    <group ref={group}>
      {rings.map((ring, ri) => (
        <Ring key={ri} {...ring} />
      ))}
    </group>
  );
}

function Ring({
  radius,
  tilt,
  speed,
  n,
}: {
  radius: number;
  tilt: number;
  speed: number;
  n: number;
}) {
  const ref = useRef<THREE.Points>(null);
  const geo = useMemo(() => {
    const positions = new Float32Array(n * 3);
    for (let i = 0; i < n; i++) {
      const a = (i / n) * Math.PI * 2;
      positions[i * 3] = Math.cos(a) * radius;
      positions[i * 3 + 1] = 0;
      positions[i * 3 + 2] = Math.sin(a) * radius;
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    return g;
  }, [n, radius]);

  useFrame((state) => {
    if (ref.current) ref.current.rotation.y = state.clock.elapsedTime * speed;
  });

  return (
    <group rotation={[tilt, 0, tilt * 0.3]}>
      <points ref={ref} geometry={geo}>
        <pointsMaterial
          size={0.045}
          color="#ededed"
          transparent
          opacity={0.55}
          sizeAttenuation
        />
      </points>
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[radius - 0.004, radius + 0.004, 128]} />
        <meshBasicMaterial
          color="#ededed"
          transparent
          opacity={0.06}
          side={THREE.DoubleSide}
        />
      </mesh>
    </group>
  );
}

/* Vector-embedding cluster — points condensing in a latent space. */
function VectorCluster() {
  const ref = useRef<THREE.Points>(null);
  const N = 320;
  const geo = useMemo(() => {
    const positions = new Float32Array(N * 3);
    for (let i = 0; i < N; i++) {
      // Gaussian-ish cluster offset to the side of the core.
      const r = Math.pow(Math.random(), 0.6) * 1.6;
      const th = Math.random() * Math.PI * 2;
      const ph = Math.acos(2 * Math.random() - 1);
      positions[i * 3] = 3.4 + r * Math.sin(ph) * Math.cos(th);
      positions[i * 3 + 1] = r * Math.sin(ph) * Math.sin(th) * 0.8;
      positions[i * 3 + 2] = r * Math.cos(ph);
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    return g;
  }, []);

  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.y = state.clock.elapsedTime * 0.08;
      const m = ref.current.material as THREE.PointsMaterial;
      m.opacity = 0.4 + Math.sin(state.clock.elapsedTime * 0.7) * 0.12;
    }
  });

  return (
    <points ref={ref} geometry={geo}>
      <pointsMaterial size={0.03} color={ACCENT} transparent opacity={0.45} sizeAttenuation />
    </points>
  );
}

/* Camera parallax driven by pointer + scroll-linked dolly. */
function Rig({ scrollRef }: { scrollRef: React.MutableRefObject<number> }) {
  const { camera, pointer } = useThree();
  const target = useMemo(() => new THREE.Vector3(), []);
  useFrame(() => {
    const s = scrollRef.current;
    target.set(pointer.x * 0.9, pointer.y * 0.6 + 0.2, 7 - s * 3.2);
    camera.position.lerp(target, 0.045);
    camera.lookAt(0, 0, 0);
  });
  return null;
}

export default function HeroScene() {
  const scrollRef = useRef(0);

  if (typeof window !== "undefined") {
    // Feed hero-local scroll progress (0..1 over first viewport) to the rig.
    window.requestAnimationFrame(() => {});
  }

  return (
    <Canvas
      className="!absolute inset-0"
      dpr={[1, 1.8]}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      camera={{ position: [0, 0.2, 7], fov: 42 }}
      onCreated={({ gl }) => {
        gl.setClearColor(0x000000, 0);
      }}
    >
      <Suspense fallback={null}>
        <ScrollFeeder scrollRef={scrollRef} />
        <Core />
        <TokenStreams />
        <VectorCluster />
        <Rig scrollRef={scrollRef} />
      </Suspense>
    </Canvas>
  );
}

/* Reads window scroll and normalizes to hero progress. */
function ScrollFeeder({ scrollRef }: { scrollRef: React.MutableRefObject<number> }) {
  useFrame(() => {
    const vh = window.innerHeight || 1;
    scrollRef.current = Math.min(1, Math.max(0, window.scrollY / vh));
  });
  return null;
}
