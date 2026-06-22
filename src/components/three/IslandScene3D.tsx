import { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { Float, Environment } from '@react-three/drei';
import * as THREE from 'three';
import type { MoodType, PetState } from '../../types';
import Qingqing3D from './Qingqing3D';
import Ocean from './Ocean';
import ParticleField from './ParticleField';

interface IslandScene3DProps {
  mood?: MoodType;
  sunlight: number;
  waterDrops: number;
  lamps: number;
  petState?: PetState;
}

function IslandScene({ mood, sunlight, waterDrops, lamps, petState }: IslandScene3DProps) {
  const stormy = mood === 'angry' || mood === 'nervous' || mood === 'sad' || mood === 'stressed';
  const isClear = mood === 'happy' || mood === 'calm' || !mood;
  const hasProgress = sunlight > 0 || waterDrops > 0 || lamps > 0;

  const sunlightGlow = 1 + sunlight * 0.05;
  const treeScale = waterDrops > 3 ? 1.3 : 1;
  const lampGlow = lamps > 0 ? 1 + lamps * 0.2 : 0;

  return (
    <>
      {/* 环境光 */}
      <ambientLight intensity={stormy ? 0.25 : 0.45} color={stormy ? '#8899bb' : '#fff8e7'} />

      {/* 主光源（太阳） */}
      <directionalLight
        position={[5, 8, 3]}
        intensity={stormy ? 0.3 : sunlightGlow * 1.2}
        color={stormy ? '#aabbcc' : '#fff8dc'}
        castShadow
      />

      {/* 补光 */}
      <pointLight position={[-2, 1, 3]} intensity={0.3} color="#ffe4b5" />

      {/* 灯塔光 */}
      {lampGlow > 0 && (
        <pointLight
          position={[1.2, 0.5, 0.6]}
          intensity={lampGlow * 1.5}
          color="#ffd080"
          distance={4}
        />
      )}

      {/* 云层 */}
      {[0, 1, 2].map(i => (
        <Float
          key={i}
          speed={1 + i * 0.5}
          floatIntensity={0.3 + i * 0.1}
          position={[-2 + i * 2.5, 1.8 + i * 0.2, -1 - i * 0.3]}
        >
          <Cloud stormy={stormy} />
        </Float>
      ))}

      {/* 海面 */}
      <Ocean stormy={stormy} />

      {/* 岛屿底座 */}
      <Float speed={1.2} floatIntensity={0.04}>
        <group position={[0, -0.08, 0]}>
          {/* 岛体 */}
          <mesh position={[0, -0.15, 0]} castShadow receiveShadow>
            <cylinderGeometry args={[1.0, 1.3, 0.35, 32]} />
            <meshStandardMaterial
              color={stormy ? '#8b7355' : '#c4a265'}
              roughness={0.8}
            />
          </mesh>

          {/* 岛顶草皮 */}
          <mesh position={[0, 0.05, 0]} castShadow receiveShadow>
            <cylinderGeometry args={[0.95, 1.0, 0.08, 32]} />
            <meshStandardMaterial
              color={stormy ? '#6b8e6b' : '#7ec87e'}
              roughness={0.9}
            />
          </mesh>

          {/* 地面小隆起 */}
          <mesh position={[0.1, 0.1, 0.2]}>
            <sphereGeometry args={[0.25, 16, 8, 0, Math.PI * 2, 0, Math.PI / 2]} />
            <meshStandardMaterial
              color={stormy ? '#7a9a6a' : '#8ed48e'}
              roughness={0.9}
            />
          </mesh>
        </group>
      </Float>

      {/* 树 */}
      <group position={[-0.6, 0.08, 0.2]} scale={treeScale}>
        {/* 树干 */}
        <mesh position={[0, 0.15, 0]} castShadow>
          <cylinderGeometry args={[0.04, 0.06, 0.3, 12]} />
          <meshStandardMaterial color="#8b6914" roughness={0.8} />
        </mesh>
        {/* 树冠 - 3层 */}
        {[0, 0.1, 0.2].map((y, i) => (
          <mesh key={i} position={[0, 0.27 + y, 0]} castShadow>
            <coneGeometry args={[0.14 - i * 0.03, 0.12, 12]} />
            <meshStandardMaterial
              color={waterDrops > 3 ? '#3cb043' : stormy ? '#5a7a4a' : '#4a8c3f'}
              roughness={0.8}
            />
          </mesh>
        ))}
      </group>

      {/* 灯塔 */}
      <group position={[0.7, -0.02, -0.2]}>
        <mesh position={[0, 0.2, 0]} castShadow>
          <cylinderGeometry args={[0.06, 0.08, 0.4, 16]} />
          <meshStandardMaterial color="#e8e8e8" roughness={0.5} />
        </mesh>
        {/* 灯塔顶 */}
        <mesh position={[0, 0.42, 0]}>
          <cylinderGeometry args={[0.07, 0.04, 0.08, 16]} />
          <meshStandardMaterial color="#dd4444" roughness={0.4} />
        </mesh>
        {/* 发光球 */}
        {lamps > 0 && (
          <mesh position={[0, 0.35, 0]}>
            <sphereGeometry args={[0.06, 16, 16]} />
            <meshBasicMaterial color="#ffd700" transparent opacity={0.9} />
          </mesh>
        )}
      </group>

      {/* 3D 晴晴精灵 */}
      <group position={[0.05, 0.15, 0.35]}>
        <Qingqing3D
          evolution={petState?.evolution}
          mood={stormy ? 'sad' : 'happy'}
        />
      </group>

      {/* 粒子场 */}
      <ParticleField
        count={stormy ? 40 : hasProgress ? 150 : 80}
        color={stormy ? '#8899cc' : isClear ? '#ffd700' : '#aaccff'}
        spread={3.5}
        stormy={stormy}
      />

      {/* 迷雾（柔和环境） */}
      <fog attach="fog" args={[stormy ? '#556688' : '#d4e8ff', 0.2, 8]} />
    </>
  );
}

// 云朵子组件
function Cloud({ stormy }: { stormy: boolean }) {
  const groups = [
    { pos: [0, 0, 0], scale: 0.35 },
    { pos: [0.2, 0.05, 0.05], scale: 0.25 },
    { pos: [-0.15, 0.02, -0.03], scale: 0.22 },
    { pos: [0.1, -0.05, 0.02], scale: 0.2 },
  ];

  return (
    <group>
      {groups.map((g, i) => (
        <mesh key={i} position={g.pos as [number, number, number]} scale={g.scale}>
          <sphereGeometry args={[0.5, 16, 16]} />
          <meshStandardMaterial
            color={stormy ? '#8899aa' : '#ffffff'}
            roughness={0.85}
            transparent
            opacity={stormy ? 0.5 : 0.75}
            depthWrite={false}
          />
        </mesh>
      ))}
    </group>
  );
}

// 导出 Canvas 包装
export default function IslandScene3D(props: IslandScene3DProps) {
  return (
    <div style={{ width: '100%', height: '100%', borderRadius: '24px', overflow: 'hidden', background: 'linear-gradient(180deg, #bceaff 0%, #d4f2ff 40%, #effbff 60%, #b7f2e2 100%)' }}>
      <Canvas
        camera={{ position: [0, 1.2, 3.5], fov: 45, near: 0.1, far: 20 }}
        shadows
        dpr={[1, 1.5]}
        gl={{
          antialias: true,
          alpha: false,
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.1,
        }}
        style={{ width: '100%', height: '100%' }}
      >
        <Suspense fallback={null}>
          <IslandScene {...props} />
        </Suspense>
      </Canvas>
    </div>
  );
}
