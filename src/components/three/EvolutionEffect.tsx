import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import Qingqing3D from './Qingqing3D';
import type { EvolutionState } from '../../types/evolution';

interface EvolutionEffectProps {
  evolution: EvolutionState;
}

function BurstParticles() {
  const count = 60;
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);

  const positions = useMemo(() => {
    const arr: { pos: THREE.Vector3; vel: THREE.Vector3; color: THREE.Color }[] = [];
    for (let i = 0; i < count; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.random() * Math.PI;
      const radius = 0.3 + Math.random() * 0.5;
      arr.push({
        pos: new THREE.Vector3(
          Math.sin(phi) * Math.cos(theta) * radius,
          Math.cos(phi) * radius,
          Math.sin(phi) * Math.sin(theta) * radius,
        ),
        vel: new THREE.Vector3(
          (Math.random() - 0.5) * 0.02,
          Math.random() * 0.03 + 0.01,
          (Math.random() - 0.5) * 0.02,
        ),
        color: new THREE.Color().setHSL(Math.random(), 0.8, 0.6 + Math.random() * 0.3),
      });
    }
    return arr;
  }, [count]);

  useFrame(() => {
    if (!meshRef.current) return;
    for (let i = 0; i < count; i++) {
      const p = positions[i];
      p.pos.add(p.vel);
      dummy.position.copy(p.pos);
      dummy.scale.setScalar(0.04);
      dummy.updateMatrix();
      meshRef.current.setMatrixAt(i, dummy.matrix);
      meshRef.current.setColorAt(i, p.color);
    }
    meshRef.current.instanceMatrix.needsUpdate = true;
    if (meshRef.current.instanceColor) meshRef.current.instanceColor.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, count]}>
      <sphereGeometry args={[0.04, 8, 8]} />
      <meshBasicMaterial toneMapped={false} />
    </instancedMesh>
  );
}

export default function EvolutionEffect({ evolution }: EvolutionEffectProps) {
  return (
    <group>
      {/* 粒子爆炸 */}
      <BurstParticles />

      {/* 中心精灵 */}
      <Qingqing3D evolution={evolution} isCelebrating mood="happy" />

      {/* 光柱 */}
      <mesh position={[0, 1.5, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.02, 0.8, 3, 16]} />
        <meshBasicMaterial
          color="#ffd700"
          transparent
          opacity={0.08}
          depthWrite={false}
        />
      </mesh>
    </group>
  );
}
