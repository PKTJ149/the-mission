"use client";

import { ContactShadows, Environment, Lightformer, RoundedBox, Sparkles, useCursor } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import { useMemo, useRef, useState } from "react";
import * as THREE from "three";

// A gold-ribboned mystery box built from simple shapes (no 3D model file).
// Tap it → it trembles → the lid pops open → light and gold coins burst out.
// Everything moves inside one useFrame loop, which runs once per screen refresh.

export type BoxStatus = "closed" | "opening" | "open";

export type MysteryBoxSceneProps = {
  status: BoxStatus;
  reducedMotion: boolean;
  onTap: () => void;
  onRevealed: () => void;
};

// Sizes in three.js units. The camera decides how big they look on screen.
const BODY = { width: 1.4, height: 1.05 };
const LID = { width: 1.52, height: 0.3 };
const RIBBON = 0.24;
const LID_OPEN_ANGLE = 1.95; // radians (~112°): the lid swings past upright

// Timeline, in seconds after the tap
const SHAKE_TIME = 0.7; // the box trembles and squashes, building anticipation
const LID_TIME = 0.55; // the lid swings open
const REVEAL_AT = SHAKE_TIME + 0.45; // the reward card shows up
// With reduced motion: no trembling, no coins, a gentle lid and an earlier reveal
const CALM = { lid: 0.35, reveal: 0.25 };

const COIN_COUNT = 48;
const COIN = { radius: 0.075, thickness: 0.016 };
const GRAVITY = -9;
const FLOOR_Y = COIN.thickness / 2;

const GOLD = "#ecc56f";
const BOX_DARK = "#241c15";
const GLOW = "#ffe2a0";

const clamp01 = (value: number) => Math.min(1, Math.max(0, value));
const easeOutCubic = (p: number) => 1 - (1 - p) ** 3;
// Goes a little past the end, then settles back — gives the lid its "pop"
const easeOutBack = (p: number) => 1 + 2.70158 * (p - 1) ** 3 + 1.70158 * (p - 1) ** 2;

type Coin = {
  x: number;
  y: number;
  z: number;
  vx: number;
  vy: number;
  vz: number;
  rx: number;
  rz: number;
  spinX: number;
  spinZ: number;
  delay: number; // small random start delay so the coins don't all leave at once
  resting: boolean;
};

function createCoins(): Coin[] {
  return Array.from({ length: COIN_COUNT }, () => {
    const direction = Math.random() * Math.PI * 2;
    const speed = 0.9 + Math.random() * 1.1;
    return {
      x: (Math.random() - 0.5) * 0.8,
      y: BODY.height + 0.05,
      z: (Math.random() - 0.5) * 0.8,
      vx: Math.cos(direction) * speed,
      vy: 3.4 + Math.random() * 1.8,
      vz: Math.sin(direction) * speed,
      rx: Math.random() * Math.PI,
      rz: Math.random() * Math.PI,
      spinX: 6 + Math.random() * 8,
      spinZ: 4 + Math.random() * 6,
      delay: Math.random() * 0.15,
      resting: false,
    };
  });
}

// One reusable helper object for writing each coin's position into the instanced mesh
const helper = new THREE.Object3D();

// Simple physics: gravity, a couple of small bounces, then the coin settles flat on the floor
function updateCoins(mesh: THREE.InstancedMesh, coins: Coin[], sinceLaunch: number, delta: number) {
  coins.forEach((coin, i) => {
    const launched = sinceLaunch >= coin.delay;
    if (launched && !coin.resting) {
      coin.vy += GRAVITY * delta;
      coin.x += coin.vx * delta;
      coin.y += coin.vy * delta;
      coin.z += coin.vz * delta;
      coin.rx += coin.spinX * delta;
      coin.rz += coin.spinZ * delta;
      if (coin.y <= FLOOR_Y && coin.vy < 0) {
        coin.y = FLOOR_Y;
        coin.vy *= -0.3;
        coin.vx *= 0.5;
        coin.vz *= 0.5;
        coin.spinX *= 0.4;
        coin.spinZ *= 0.4;
        if (coin.vy < 0.5) coin.resting = true;
      }
    }
    if (coin.resting) {
      // Ease the tilt towards lying flat
      const settle = Math.min(1, delta * 12);
      coin.rx -= (coin.rx - Math.round(coin.rx / Math.PI) * Math.PI) * settle;
      coin.rz -= (coin.rz - Math.round(coin.rz / Math.PI) * Math.PI) * settle;
    }
    helper.position.set(coin.x, coin.y, coin.z);
    helper.rotation.set(coin.rx, 0, coin.rz);
    helper.scale.setScalar(launched ? 1 : 0);
    helper.updateMatrix();
    mesh.setMatrixAt(i, helper.matrix);
  });
  mesh.instanceMatrix.needsUpdate = true;
}

// Vertical fade (solid at the bottom, clear at the top) for the light beam
function createFadeTexture() {
  const canvas = document.createElement("canvas");
  canvas.width = 1;
  canvas.height = 64;
  const context = canvas.getContext("2d");
  if (context) {
    const gradient = context.createLinearGradient(0, 0, 0, 64);
    gradient.addColorStop(0, "black");
    gradient.addColorStop(1, "white");
    context.fillStyle = gradient;
    context.fillRect(0, 0, 1, 64);
  }
  return new THREE.CanvasTexture(canvas);
}

function GoldMaterial() {
  return <meshStandardMaterial color={GOLD} metalness={1} roughness={0.25} />;
}

function DarkMaterial() {
  return <meshStandardMaterial color={BOX_DARK} metalness={0.35} roughness={0.45} />;
}

function MysteryBox({ status, reducedMotion, onTap, onRevealed }: MysteryBoxSceneProps) {
  const float = useRef<THREE.Group>(null); // whole box: idle bobbing
  const body = useRef<THREE.Group>(null); // trembles and squashes
  const lid = useRef<THREE.Group>(null); // hinged at the back edge
  const glow = useRef<THREE.MeshBasicMaterial>(null);
  const beam = useRef<THREE.MeshBasicMaterial>(null);
  const light = useRef<THREE.PointLight>(null);
  const coinMesh = useRef<THREE.InstancedMesh>(null);

  const startedAt = useRef<number | null>(null);
  const coins = useRef<Coin[] | null>(null);
  const revealed = useRef(false);

  const [hovered, setHovered] = useState(false);
  useCursor(hovered && status === "closed");
  const fadeTexture = useMemo(() => createFadeTexture(), []);

  useFrame(({ clock }, frameDelta) => {
    if (!float.current || !body.current || !lid.current || !glow.current || !beam.current || !light.current) return;
    const now = clock.elapsedTime;
    const delta = Math.min(frameDelta, 1 / 30); // avoid a big jump after the tab was in the background

    // Start or reset the timeline
    if (status === "closed") {
      startedAt.current = null;
      coins.current = null;
      revealed.current = false;
    } else if (startedAt.current === null) {
      startedAt.current = now;
    }
    const t = startedAt.current === null ? -1 : now - startedAt.current; // -1 = not opened

    const shakeTime = reducedMotion ? 0 : SHAKE_TIME;
    const lidTime = reducedMotion ? CALM.lid : LID_TIME;
    const revealAt = reducedMotion ? CALM.reveal : REVEAL_AT;
    const released = t >= shakeTime; // the moment the lid lets go

    // 1. Idle: the box bobs and sways slightly so it feels alive
    float.current.position.y = reducedMotion ? 0 : Math.sin(now * 1.6) * 0.04;
    float.current.rotation.y = -0.55 + (reducedMotion ? 0 : Math.sin(now * 0.5) * 0.12);

    // 2. Tremble and squash before opening, then spring back with a small wobble
    const shaking = t >= 0 && !released;
    const k = shaking ? t / shakeTime : 0; // grows 0 → 1 while shaking
    if (shaking) {
      body.current.rotation.set(Math.sin(t * 37) * 0.035 * k, 0, Math.sin(t * 46) * 0.07 * k);
      body.current.scale.set(1 + 0.04 * k, 1 - 0.08 * k, 1 + 0.04 * k);
    } else if (released && !reducedMotion) {
      const wobble = Math.exp(-7 * (t - shakeTime)) * Math.cos((t - shakeTime) * 22);
      body.current.rotation.set(0, 0, 0);
      body.current.scale.set(1 + 0.04 * wobble, 1 - 0.08 * wobble, 1 + 0.04 * wobble);
    } else {
      body.current.rotation.set(0, 0, 0);
      body.current.scale.set(1, 1, 1);
    }

    // 3. Lid: rattles while shaking, then swings open on its back hinge
    const lidProgress = released ? clamp01((t - shakeTime) / lidTime) : 0;
    const rattle = shaking ? Math.abs(Math.sin(t * 28)) * 0.06 * k : 0;
    const opened = (reducedMotion ? easeOutCubic(lidProgress) : easeOutBack(lidProgress)) * LID_OPEN_ANGLE;
    lid.current.rotation.x = -(opened + rattle);

    // 4. Light pouring out of the box
    const lightLevel = released ? clamp01((t - shakeTime) / 0.3) : 0;
    const pulse = reducedMotion ? 0 : Math.sin(now * 3) * 0.08;
    glow.current.opacity = lightLevel * 0.95;
    beam.current.opacity = lightLevel * (0.5 + pulse);
    light.current.intensity = lightLevel * 14;

    // 5. Gold coins burst out when the lid lets go
    const coinsOn = released && !reducedMotion;
    if (coinsOn && !coins.current) coins.current = createCoins();
    if (coinMesh.current) {
      coinMesh.current.visible = coinsOn;
      if (coinsOn && coins.current) updateCoins(coinMesh.current, coins.current, t - shakeTime, delta);
    }

    // 6. Tell the page to show the reward card (once)
    if (status === "opening" && t >= revealAt && !revealed.current) {
      revealed.current = true;
      onRevealed();
    }
  });

  return (
    <>
      <group ref={float}>
        <group
          ref={body}
          onClick={(event) => {
            event.stopPropagation();
            if (status === "closed") onTap();
          }}
          onPointerOver={() => setHovered(true)}
          onPointerOut={() => setHovered(false)}
        >
          {/* Box body with a ribbon crossing each side */}
          <RoundedBox args={[BODY.width, BODY.height, BODY.width]} radius={0.05} smoothness={4} position={[0, BODY.height / 2, 0]}>
            <DarkMaterial />
          </RoundedBox>
          <mesh position={[0, BODY.height / 2, 0]}>
            <boxGeometry args={[RIBBON, BODY.height, BODY.width + 0.02]} />
            <GoldMaterial />
          </mesh>
          <mesh position={[0, BODY.height / 2, 0]}>
            <boxGeometry args={[BODY.width + 0.02, BODY.height, RIBBON]} />
            <GoldMaterial />
          </mesh>

          {/* Glowing opening, hidden under the lid until it opens */}
          <mesh position={[0, BODY.height + 0.004, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <planeGeometry args={[BODY.width - 0.12, BODY.width - 0.12]} />
            <meshBasicMaterial ref={glow} color={GLOW} transparent opacity={0} toneMapped={false} />
          </mesh>

          {/* Soft light beam rising from the box */}
          <mesh position={[0, BODY.height + 1.3, 0]}>
            <cylinderGeometry args={[1, 0.62, 2.6, 40, 1, true]} />
            <meshBasicMaterial
              ref={beam}
              color={GLOW}
              alphaMap={fadeTexture}
              transparent
              opacity={0}
              blending={THREE.AdditiveBlending}
              depthWrite={false}
              side={THREE.DoubleSide}
              toneMapped={false}
            />
          </mesh>
          <pointLight ref={light} position={[0, BODY.height + 0.5, 0]} color="#ffcf70" intensity={0} distance={6} decay={2} />

          {/* Lid: the outer group is the hinge on the back edge, the inner group is the lid itself */}
          <group ref={lid} position={[0, BODY.height, -LID.width / 2]}>
            <group position={[0, 0, LID.width / 2]}>
              <RoundedBox args={[LID.width, LID.height, LID.width]} radius={0.05} smoothness={4} position={[0, LID.height / 2, 0]}>
                <DarkMaterial />
              </RoundedBox>
              <mesh position={[0, LID.height / 2, 0]}>
                <boxGeometry args={[RIBBON + 0.02, LID.height + 0.02, LID.width + 0.02]} />
                <GoldMaterial />
              </mesh>
              <mesh position={[0, LID.height / 2, 0]}>
                <boxGeometry args={[LID.width + 0.02, LID.height + 0.02, RIBBON + 0.02]} />
                <GoldMaterial />
              </mesh>

              {/* Bow: two loops and a knot */}
              <mesh position={[-0.15, LID.height + 0.13, 0]} rotation={[0, 0, 0.55]} scale={[1, 0.72, 1]}>
                <torusGeometry args={[0.19, 0.055, 16, 48]} />
                <GoldMaterial />
              </mesh>
              <mesh position={[0.15, LID.height + 0.13, 0]} rotation={[0, 0, -0.55]} scale={[1, 0.72, 1]}>
                <torusGeometry args={[0.19, 0.055, 16, 48]} />
                <GoldMaterial />
              </mesh>
              <mesh position={[0, LID.height + 0.06, 0]} scale={[1.2, 0.8, 1]}>
                <sphereGeometry args={[0.085, 24, 16]} />
                <GoldMaterial />
              </mesh>
            </group>
          </group>
        </group>
      </group>

      {/* All 48 coins are drawn as one "instanced" mesh — much cheaper than 48 separate meshes */}
      <instancedMesh ref={coinMesh} args={[undefined, undefined, COIN_COUNT]} visible={false} frustumCulled={false}>
        <cylinderGeometry args={[COIN.radius, COIN.radius, COIN.thickness, 24]} />
        <GoldMaterial />
      </instancedMesh>
    </>
  );
}

export default function MysteryBoxScene(props: MysteryBoxSceneProps) {
  return (
    <Canvas camera={{ position: [0, 1.9, 5.6], fov: 36 }} dpr={[1, 1.75]} gl={{ antialias: true }}>
      <ambientLight intensity={0.25} />
      <directionalLight position={[3, 5, 4]} intensity={1.6} color="#fff3dd" />
      <directionalLight position={[-4, 2, -3]} intensity={1.2} color="#f5c77a" />

      {/* Gold only looks like gold when it has something to reflect. These soft panels are
          rendered once into a reflection map — no image file needs to be downloaded. */}
      <Environment resolution={128}>
        <Lightformer form="rect" intensity={5} color="#fff1d6" position={[0, 4, 2]} scale={[6, 2, 1]} />
        <Lightformer form="rect" intensity={2} color="#fff6e8" position={[0, 0.5, 5]} scale={[4, 2, 1]} />
        <Lightformer form="rect" intensity={3} color="#f5c77a" position={[-4, 1, 1]} scale={[3, 4, 1]} />
        <Lightformer form="rect" intensity={3} color="#ffffff" position={[4, 1, -2]} scale={[3, 4, 1]} />
        <Lightformer form="ring" intensity={0.8} color="#c4ab8c" position={[0, 1, -5]} scale={3} />
      </Environment>

      {/* Shift everything down so the open lid and the light beam have room above the box */}
      <group position={[0, -1.15, 0]}>
        <Sparkles
          count={36}
          scale={[4, 3, 3]}
          position={[0, 1.4, 0]}
          size={2.5}
          speed={props.reducedMotion ? 0 : 0.35}
          opacity={0.8}
          color="#f5e386"
        />
        <MysteryBox {...props} />
        <ContactShadows opacity={0.65} scale={5} blur={2.4} far={2} resolution={256} color="#000000" />
      </group>
    </Canvas>
  );
}
