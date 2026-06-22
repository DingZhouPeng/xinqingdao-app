import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Float } from '@react-three/drei';
import * as THREE from 'three';
import type { EvolutionState, EvolutionTrait } from '../../types/evolution';
import { getStageDef, getHighestRarity } from '../../services/evolution';

interface Qingqing3DProps {
  evolution?: EvolutionState;
  mood?: 'happy' | 'sad' | 'neutral' | 'hungry' | 'tired';
  isCelebrating?: boolean;
  onClick?: () => void;
}

// 进化阶段颜色
const STAGE_COLORS: Record<number, string> = {
  1: '#ffdd99',
  2: '#ffe4b5',
  3: '#ffccaa',
  4: '#ffd700',
  5: '#ffffff',
};

// 突变颜色映射
const TRAIT_COLORS: Record<string, string> = {
  'evo-color-sakura': '#ffb7c5',
  'evo-color-ocean': '#87ceeb',
  'evo-color-sunset': '#ffaa66',
  'evo-color-mint': '#98fb98',
  'evo-color-lavender': '#dda0dd',
  'evo-color-gold': '#ffd700',
  'evo-color-rainbow': '#ff69b4',
  'evo-color-nebula': '#6a5acd',
};

export default function Qingqing3D({ evolution, mood = 'neutral', isCelebrating, onClick }: Qingqing3DProps) {
  const groupRef = useRef<THREE.Group>(null);
  const bodyRef = useRef<THREE.Mesh>(null);
  const eyeLRef = useRef<THREE.Mesh>(null);
  const eyeRRef = useRef<THREE.Mesh>(null);

  const stage = evolution?.stage || 1;
  const stageDef = getStageDef(stage);
  const traits = evolution?.traits || [];
  const colorTrait = traits.find(t => t.type === 'color');
  const hasWings = traits.some(t => t.id === 'acc-wings');
  const hasCrown = traits.some(t => t.id === 'acc-crown');
  const hasHalo = traits.some(t => t.id === 'acc-halo');
  const auraTrait = traits.find(t => t.type === 'aura');
  const particleTrait = traits.find(t => t.type === 'particle');

  const scale = 0.7 + stage * 0.14;
  const bodyColor = colorTrait ? TRAIT_COLORS[colorTrait.cssClass] || STAGE_COLORS[stage] : STAGE_COLORS[stage];
  const rarity = evolution ? getHighestRarity(traits) : 'common';
  const emissiveIntensity = stage >= 4 ? 0.6 : stage >= 3 ? 0.3 : 0.1;
  const roughness = stage >= 4 ? 0.2 : 0.5;

  // 表情
  const isHappy = mood === 'happy';
  const isSad = mood === 'sad' || mood === 'hungry' || mood === 'tired';
  const mouthRotation = isHappy ? 0.2 : isSad ? -0.2 : 0;

  useFrame((state) => {
    if (!groupRef.current) return;
    const t = state.clock.getElapsedTime();

    if (isCelebrating) {
      groupRef.current.rotation.y += 0.05;
      groupRef.current.position.y = Math.sin(t * 3) * 0.3;
    } else {
      // 轻微漂浮
      groupRef.current.position.y = Math.sin(t * 1.5) * 0.08;
      groupRef.current.rotation.y += 0.002;
    }
  });

  // 粒子几何体用于进化阶段的环绕效果
  const ringParticles = useMemo(() => {
    if (stage < 3) return null;
    const count = stage >= 5 ? 20 : 12;
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2;
      const radius = 0.9 + stage * 0.06;
      positions[i * 3] = Math.cos(angle) * radius;
      positions[i * 3 + 1] = Math.sin(i * 0.5) * 0.3;
      positions[i * 3 + 2] = Math.sin(angle) * radius;
    }
    return positions;
  }, [stage]);

  return (
    <group ref={groupRef} scale={scale} onClick={onClick}>
      {/* 光环 */}
      {auraTrait && (
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.65, 0.03, 16, 64]} />
          <meshBasicMaterial
            color={auraTrait.cssClass.includes('rainbow') ? '#ff69b4' : auraTrait.cssClass.includes('golden') ? '#ffd700' : '#fff'}
            transparent
            opacity={0.4}
          />
        </mesh>
      )}

      {/* 环绕粒子环 (Stage 3+) */}
      {ringParticles && (
        <points>
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              count={ringParticles.length / 3}
              array={ringParticles}
              itemSize={3}
            />
          </bufferGeometry>
          <pointsMaterial
            size={0.04}
            color={rarity === 'legendary' ? '#ffd700' : '#fff'}
            transparent
            opacity={0.8}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
          />
        </points>
      )}

      {/* 身体 */}
      <mesh ref={bodyRef} castShadow>
        <sphereGeometry args={[0.5, 64, 64]} />
        <meshStandardMaterial
          color={bodyColor}
          roughness={roughness}
          metalness={0.1}
          emissive={bodyColor}
          emissiveIntensity={emissiveIntensity}
        />
      </mesh>

      {/* 高光层 */}
      <mesh>
        <sphereGeometry args={[0.48, 48, 48]} />
        <meshBasicMaterial
          color="#ffffff"
          transparent
          opacity={0.08}
          depthWrite={false}
        />
      </mesh>

      {/* 左眼白 */}
      <mesh position={[-0.16, 0.08, 0.42]}>
        <sphereGeometry args={[0.1, 32, 32]} />
        <meshStandardMaterial color="#ffffff" roughness={0.1} />
      </mesh>
      {/* 左瞳孔 */}
      <mesh position={[-0.16, 0.08, 0.52]}>
        <sphereGeometry args={[0.06, 32, 32]} />
        <meshStandardMaterial color="#1a1a2e" roughness={0.1} />
      </mesh>
      {/* 左眼高光 */}
      <mesh position={[-0.14, 0.1, 0.54]}>
        <sphereGeometry args={[0.025, 16, 16]} />
        <meshBasicMaterial color="#ffffff" />
      </mesh>

      {/* 右眼白 */}
      <mesh position={[0.16, 0.08, 0.42]}>
        <sphereGeometry args={[0.1, 32, 32]} />
        <meshStandardMaterial color="#ffffff" roughness={0.1} />
      </mesh>
      {/* 右瞳孔 */}
      <mesh position={[0.16, 0.08, 0.52]}>
        <sphereGeometry args={[0.06, 32, 32]} />
        <meshStandardMaterial color="#1a1a2e" roughness={0.1} />
      </mesh>
      {/* 右眼高光 */}
      <mesh position={[0.18, 0.1, 0.54]}>
        <sphereGeometry args={[0.025, 16, 16]} />
        <meshBasicMaterial color="#ffffff" />
      </mesh>

      {/* 左腮红 */}
      <mesh position={[-0.28, -0.06, 0.38]}>
        <sphereGeometry args={[0.08, 16, 16]} />
        <meshBasicMaterial color="#ff9999" transparent opacity={0.35} depthWrite={false} />
      </mesh>

      {/* 右腮红 */}
      <mesh position={[0.28, -0.06, 0.38]}>
        <sphereGeometry args={[0.08, 16, 16]} />
        <meshBasicMaterial color="#ff9999" transparent opacity={0.35} depthWrite={false} />
      </mesh>

      {/* 嘴巴 */}
      <mesh position={[0, -0.08, 0.45]} rotation={[0, 0, mouthRotation]}>
        <torusGeometry args={[0.06, 0.018, 8, 16, Math.PI]} />
        <meshStandardMaterial color="#cc8866" roughness={0.3} />
      </mesh>

      {/* 蝴蝶结配饰 */}
      {traits.some(t => t.id === 'acc-bow') && (
        <group position={[0, 0.48, 0.15]}>
          <mesh position={[-0.12, 0.02, 0]}>
            <sphereGeometry args={[0.1, 8, 8]} />
            <meshStandardMaterial color="#ff6b8a" roughness={0.3} />
          </mesh>
          <mesh position={[0.12, 0.02, 0]}>
            <sphereGeometry args={[0.1, 8, 8]} />
            <meshStandardMaterial color="#ff6b8a" roughness={0.3} />
          </mesh>
          <mesh position={[0, -0.02, 0.05]}>
            <sphereGeometry args={[0.06, 8, 8]} />
            <meshStandardMaterial color="#ff4477" roughness={0.3} />
          </mesh>
        </group>
      )}

      {/* 小翅膀 */}
      {hasWings && (
        <>
          <mesh position={[-0.45, 0.05, 0]} rotation={[0, 0, 0.3]}>
            <sphereGeometry args={[0.25, 8, 8]} />
            <meshStandardMaterial color="#fff" roughness={0.3} transparent opacity={0.7} />
          </mesh>
          <mesh position={[0.45, 0.05, 0]} rotation={[0, 0, -0.3]}>
            <sphereGeometry args={[0.25, 8, 8]} />
            <meshStandardMaterial color="#fff" roughness={0.3} transparent opacity={0.7} />
          </mesh>
        </>
      )}

      {/* 皇冠 (Stage 5+ 或有 crown 突变) */}
      {(stage >= 5 || hasCrown) && (
        <group position={[0, 0.55, 0]}>
          <mesh position={[0, 0.08, 0]}>
            <cylinderGeometry args={[0.1, 0.14, 0.15, 8]} />
            <meshStandardMaterial color="#ffd700" roughness={0.2} metalness={0.8} />
          </mesh>
          <mesh position={[-0.08, 0.12, 0]}>
            <coneGeometry args={[0.04, 0.1, 4]} />
            <meshStandardMaterial color="#ffd700" roughness={0.2} metalness={0.8} />
          </mesh>
          <mesh position={[0, 0.16, 0]}>
            <coneGeometry args={[0.04, 0.12, 4]} />
            <meshStandardMaterial color="#ffd700" roughness={0.2} metalness={0.8} />
          </mesh>
          <mesh position={[0.08, 0.12, 0]}>
            <coneGeometry args={[0.04, 0.1, 4]} />
            <meshStandardMaterial color="#ffd700" roughness={0.2} metalness={0.8} />
          </mesh>
        </group>
      )}

      {/* 天使光环 */}
      {hasHalo && (
        <mesh position={[0, 0.5, 0]} rotation={[Math.PI / 2.2, 0, 0]}>
          <torusGeometry args={[0.22, 0.03, 16, 32]} />
          <meshStandardMaterial
            color="#ffd700"
            roughness={0.1}
            emissive="#ffd700"
            emissiveIntensity={0.8}
          />
        </mesh>
      )}
    </group>
  );
}
