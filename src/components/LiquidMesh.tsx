"use client";

import React, { useEffect, useRef, useState, RefObject } from "react";
import { MeshGradient } from "@paper-design/shaders-react";

const COLORS = ["#ED5C1B", "#FF8A3D", "#F0A172", "#F6D8B9", "#DC5418"];

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));

type Props = {
  className?: string;
  containerRef?: RefObject<HTMLElement>;
};

/**
 * Mesh gradient that responds to cursor like a finger dragged through sand:
 * - Position offset trails the cursor with viscous lerp (the "trail")
 * - Cursor velocity temporarily pumps distortion + swirl (the "force pushing
 *   matter aside")
 * - When cursor stops, intensity decays — the mesh settles back to its calm
 *   autonomous flow.
 */
const LiquidMesh: React.FC<Props> = ({ className, containerRef }) => {
  const [shader, setShader] = useState({ x: 0.5, y: 0.5, intensity: 0 });

  const targetMouse = useRef({ x: 0.5, y: 0.5 });
  const currentMouse = useRef({ x: 0.5, y: 0.5 });
  const targetIntensity = useRef(0);
  const currentIntensity = useRef(0);
  const lastPointer = useRef({ x: 0, y: 0, t: 0 });

  useEffect(() => {
    let raf = 0;

    const onPointer = (e: PointerEvent) => {
      const rect = containerRef?.current?.getBoundingClientRect();
      if (!rect) return;

      targetMouse.current.x = clamp01((e.clientX - rect.left) / rect.width);
      targetMouse.current.y = clamp01((e.clientY - rect.top) / rect.height);

      // Cursor speed → "force" used to displace the mesh
      const now = performance.now();
      const dx = e.clientX - lastPointer.current.x;
      const dy = e.clientY - lastPointer.current.y;
      const dt = Math.max(1, now - lastPointer.current.t);
      const speed = Math.sqrt(dx * dx + dy * dy) / dt; // px/ms
      targetIntensity.current = Math.min(1, speed * 0.05);

      lastPointer.current = { x: e.clientX, y: e.clientY, t: now };
    };

    const animate = () => {
      // Viscous trail — slow lerp = "sand being pushed, with lag"
      currentMouse.current.x +=
        (targetMouse.current.x - currentMouse.current.x) * 0.06;
      currentMouse.current.y +=
        (targetMouse.current.y - currentMouse.current.y) * 0.06;

      // Intensity rises fast, falls slow — matches the "punch then settle" feel
      const t = targetIntensity.current;
      const c = currentIntensity.current;
      currentIntensity.current += t > c ? (t - c) * 0.18 : (t - c) * 0.05;

      // Target intensity decays once cursor stops moving
      targetIntensity.current *= 0.9;

      setShader({
        x: currentMouse.current.x,
        y: currentMouse.current.y,
        intensity: currentIntensity.current,
      });

      raf = requestAnimationFrame(animate);
    };

    if (containerRef) {
      window.addEventListener("pointermove", onPointer, { passive: true });
    }
    raf = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("pointermove", onPointer);
      cancelAnimationFrame(raf);
    };
  }, [containerRef]);

  return (
    <MeshGradient
      className={className}
      colors={COLORS}
      distortion={0.7 + shader.intensity * 0.55}
      swirl={0.22 + shader.intensity * 0.35}
      speed={0.4}
      offsetX={(shader.x - 0.5) * 0.7}
      offsetY={(shader.y - 0.5) * 0.7}
    />
  );
};

export default LiquidMesh;
