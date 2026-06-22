import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface OceanProps {
  stormy?: boolean;
}

export default function Ocean({ stormy = false }: OceanProps) {
  const meshRef = useRef<THREE.Mesh>(null);

  const { uniforms } = useMemo(() => ({
    uniforms: {
      uTime: { value: 0 },
      uColor1: { value: new THREE.Color(stormy ? '#708090' : '#40a4df') },
      uColor2: { value: new THREE.Color(stormy ? '#556b7a' : '#64c8ff') },
    },
  }), [stormy]);

  useFrame((state) => {
    if (meshRef.current) {
      const material = meshRef.current.material as THREE.ShaderMaterial;
      material.uniforms.uTime.value = state.clock.getElapsedTime();
    }
  });

  const shaderMaterial = useMemo(() => new THREE.ShaderMaterial({
    uniforms: {
      uTime: { value: 0 },
      uColor1: { value: new THREE.Color(stormy ? '#708090' : '#40a4df') },
      uColor2: { value: new THREE.Color(stormy ? '#556b7a' : '#64c8ff') },
    },
    vertexShader: `
      varying vec2 vUv;
      varying float vElevation;
      uniform float uTime;

      void main() {
        vec4 modelPosition = modelMatrix * vec4(position, 1.0);
        float elevation = sin(modelPosition.x * 2.0 + uTime) * 0.06
                        + sin(modelPosition.z * 1.5 + uTime * 1.3) * 0.05
                        + cos(modelPosition.x * 1.0 + uTime * 0.7) * 0.04;
        modelPosition.y += elevation;
        vElevation = elevation;
        vec4 viewPosition = viewMatrix * modelPosition;
        vec4 projectedPosition = projectionMatrix * viewPosition;
        gl_Position = projectedPosition;
        vUv = uv;
      }
    `,
    fragmentShader: `
      varying vec2 vUv;
      varying float vElevation;
      uniform vec3 uColor1;
      uniform vec3 uColor2;

      void main() {
        float mixStrength = vUv.y * 0.6 + (vElevation + 0.1) * 2.0;
        vec3 color = mix(uColor1, uColor2, mixStrength);
        // 高光
        float highlight = smoothstep(0.02, 0.06, abs(vElevation));
        color += highlight * 0.15;
        gl_FragColor = vec4(color, 0.85);
      }
    `,
    transparent: true,
    depthWrite: true,
  }), [stormy]);

  return (
    <mesh
      ref={meshRef}
      rotation={[-Math.PI / 2, 0, 0]}
      position={[0, -0.15, 0]}
      material={shaderMaterial}
    >
      <planeGeometry args={[12, 12, 128, 128]} />
    </mesh>
  );
}
