import React from "react";
import {
  MESH_DRIFT_FRAGMENT,
  MESH_DRIFT_VERTEX,
  PALETTES,
  type PaletteName,
} from "@/lib/meshDriftShader";

type Props = {
  /** Which colour ramp to feed the shader. Defaults to the brand orange. */
  palette?: PaletteName;
  className?: string;
};

/** devicePixelRatio above 2 costs fill rate and buys nothing visible here. */
const MAX_DPR = 2;

/**
 * Animated WebGL background, absolutely positioned to fill its parent.
 *
 * Mounted behind hero content. Everything about it is designed to fail quiet:
 * no WebGL, a shader that will not compile, or a lost context all end with the
 * component rendering nothing, leaving whatever background the parent already
 * has. This runs on the highest-value screen of a site that sells fast loads —
 * it is never allowed to be the reason the page looks broken.
 *
 * The loop stops when the tab is hidden AND when the parent scrolls out of
 * view. The second one is not decoration: without it the GPU keeps drawing a
 * hero nobody is looking at for the entire length of the page.
 */
const ShaderBackground: React.FC<Props> = ({ palette = "brand", className }) => {
  const canvasRef = React.useRef<HTMLCanvasElement>(null);

  React.useEffect(() => {
    const canvas = canvasRef.current;
    const parent = canvas?.parentElement;
    if (!canvas || !parent) return;

    const gl = (canvas.getContext("webgl", {
      alpha: true,
      antialias: false,
      depth: false,
      stencil: false,
      powerPreference: "low-power",
      premultipliedAlpha: false,
    }) ||
      canvas.getContext("experimental-webgl")) as WebGLRenderingContext | null;
    if (!gl) return;

    // ── Compile ──────────────────────────────────────────────────────────
    const compile = (type: number, src: string) => {
      const sh = gl.createShader(type);
      if (!sh) return null;
      gl.shaderSource(sh, src);
      gl.compileShader(sh);
      if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) {
        gl.deleteShader(sh);
        return null;
      }
      return sh;
    };

    const vs = compile(gl.VERTEX_SHADER, MESH_DRIFT_VERTEX);
    const fs = compile(gl.FRAGMENT_SHADER, MESH_DRIFT_FRAGMENT);
    const program = vs && fs ? gl.createProgram() : null;
    if (!vs || !fs || !program) return;

    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      gl.deleteProgram(program);
      gl.deleteShader(vs);
      gl.deleteShader(fs);
      return;
    }
    gl.useProgram(program);

    // ── Fullscreen triangle ──────────────────────────────────────────────
    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 3, -1, -1, 3]),
      gl.STATIC_DRAW
    );
    const aPos = gl.getAttribLocation(program, "a_pos");
    gl.enableVertexAttribArray(aPos);
    gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);

    const u = (name: string) => gl.getUniformLocation(program, name);
    const uColors = u("u_colors[0]");
    const uScene = u("u_scene");
    const uShape = u("u_shape");
    const uSurface = u("u_surface");
    const uFinish = u("u_finish");
    const uTransform = u("u_transform");
    const uSpace = u("u_space");
    const uCursor = u("u_cursor");

    // Eight colour slots; the recipe uses the first four.
    const ramp = PALETTES[palette];
    const colors = new Float32Array(8 * 3);
    ramp.forEach((c, i) => colors.set(c, i * 3));
    gl.uniform3fv(uColors, colors);

    // Constants from the recipe. Cursor presence is 0 — pointer input is off.
    gl.uniform4f(uShape, 1.16, 0.34, 0.5, 0.0);
    gl.uniform4f(uSurface, 2.4, 1.16, 0.0, 1.0);
    gl.uniform4f(uFinish, 0.0, 0.0, 0.0, 0.09);
    gl.uniform4f(uTransform, 1453.0, 0.0, 0.0, 0.0);
    gl.uniform4f(uSpace, 0.0, 0.0, 0.0, 0.0);
    gl.uniform4f(uCursor, 0.0, 2.0, 0.65, 0.46);

    // ── Size ─────────────────────────────────────────────────────────────
    let w = 0;
    let h = 0;
    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, MAX_DPR);
      const nw = Math.max(1, Math.round(parent.clientWidth * dpr));
      const nh = Math.max(1, Math.round(parent.clientHeight * dpr));
      if (nw === w && nh === h) return;
      w = nw;
      h = nh;
      canvas.width = w;
      canvas.height = h;
      gl.viewport(0, 0, w, h);
    };
    resize();

    // ── Draw ─────────────────────────────────────────────────────────────
    // Time accumulates only while running, so pausing and resuming does not
    // make the field jump forward by however long the reader was elsewhere.
    let elapsed = 0;
    let last = 0;
    let raf = 0;
    let visible = true;
    let contextLost = false;

    const draw = (seconds: number) => {
      gl.uniform4f(uScene, w, h, seconds * 0.73, 4.0);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    };

    const frame = (now: number) => {
      if (last) elapsed += (now - last) / 1000;
      last = now;
      resize();
      draw(elapsed);
      raf = requestAnimationFrame(frame);
    };

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");

    const stop = () => {
      if (raf) cancelAnimationFrame(raf);
      raf = 0;
      last = 0;
    };

    const start = () => {
      if (raf || contextLost) return;
      if (reduce.matches) {
        resize();
        draw(elapsed);
        return;
      }
      raf = requestAnimationFrame(frame);
    };

    const sync = () => {
      if (visible && !document.hidden) start();
      else stop();
    };

    // ── Pause when off-screen ────────────────────────────────────────────
    const io = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
        sync();
      },
      { threshold: 0 }
    );
    io.observe(parent);

    const onVisibility = () => sync();
    document.addEventListener("visibilitychange", onVisibility);

    const onLost = (e: Event) => {
      e.preventDefault();
      contextLost = true;
      stop();
    };
    canvas.addEventListener("webglcontextlost", onLost);

    const ro = new ResizeObserver(() => {
      resize();
      // A resize while paused would otherwise leave a stretched last frame.
      if (!raf) draw(elapsed);
    });
    ro.observe(parent);

    const onReduceChange = () => {
      stop();
      sync();
    };
    reduce.addEventListener("change", onReduceChange);

    sync();

    return () => {
      stop();
      io.disconnect();
      ro.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
      canvas.removeEventListener("webglcontextlost", onLost);
      reduce.removeEventListener("change", onReduceChange);
      gl.deleteBuffer(buffer);
      gl.deleteProgram(program);
      gl.deleteShader(vs);
      gl.deleteShader(fs);
    };
  }, [palette]);

  return <canvas ref={canvasRef} className={className} aria-hidden="true" />;
};

export default ShaderBackground;
