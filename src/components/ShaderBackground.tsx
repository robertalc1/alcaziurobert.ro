import React from "react";
import {
  MESH_DRIFT_FRAGMENT,
  MESH_DRIFT_VERTEX,
  RECIPES,
  type RecipeName,
} from "@/lib/meshDriftShader";

type Props = {
  /** Which tuning of the shader to run. See RECIPES in meshDriftShader.ts. */
  recipe?: RecipeName;
  className?: string;
};

/** devicePixelRatio above 2 costs fill rate and buys nothing visible here. */
const MAX_DPR = 2;

/**
 * Some recipes enable a five-tap blur, which multiplies the shading cost by
 * five. Cap the buffer by pixel count on those so a 4K monitor does not get a
 * hero that renders at eight frames a second.
 */
const MAX_PIXELS_BLURRED = 2_000_000;

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
 *
 * Pointer input is per-recipe and off by default. When a recipe asks for it the
 * cursor is followed with an exponential ease and the field settles back on its
 * own after the pointer leaves, so there is no snap. Under reduced-motion the
 * component paints one static frame and never attaches a pointer listener.
 */
const ShaderBackground: React.FC<Props> = ({ recipe = "cobalt", className }) => {
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

    const r = RECIPES[recipe];

    // Eight colour slots; the recipe uses the first four.
    const colors = new Float32Array(8 * 3);
    r.colors.forEach((c, i) => colors.set(c, i * 3));
    gl.uniform3fv(uColors, colors);

    gl.uniform4f(uShape, ...r.shape);
    gl.uniform4f(uSurface, ...r.surface);
    gl.uniform4f(uFinish, ...r.finish);
    gl.uniform4f(uTransform, ...r.transform);
    gl.uniform4f(uSpace, r.offset[0], r.offset[1], 0, 0);
    gl.uniform4f(uCursor, 0, ...(r.cursor ?? ([0, 0, 0] as const)));

    // ── Size ─────────────────────────────────────────────────────────────
    const blurred = r.finish[2] > 0;
    let w = 0;
    let h = 0;
    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, MAX_DPR);
      let nw = Math.max(1, Math.round(parent.clientWidth * dpr));
      let nh = Math.max(1, Math.round(parent.clientHeight * dpr));
      if (blurred && nw * nh > MAX_PIXELS_BLURRED) {
        const k = Math.sqrt(MAX_PIXELS_BLURRED / (nw * nh));
        nw = Math.max(1, Math.round(nw * k));
        nh = Math.max(1, Math.round(nh * k));
      }
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

    // Pointer state, in the -1..1 canvas space the shader expects. `target` is
    // where the cursor is, the unprefixed pair is where the field has eased to.
    let targetX = 0;
    let targetY = 0;
    let targetPresence = 0;
    let pointerX = 0;
    let pointerY = 0;
    let presence = 0;

    const draw = (seconds: number) => {
      gl.uniform4f(uScene, w, h, seconds * r.timeScale, 4.0);
      if (r.cursor) {
        gl.uniform4f(uSpace, r.offset[0], r.offset[1], pointerX, pointerY);
        gl.uniform4f(uCursor, presence, ...r.cursor);
      }
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    };

    const frame = (now: number) => {
      const dt = last ? Math.min((now - last) / 1000, 0.1) : 0;
      if (last) elapsed += dt;
      last = now;
      if (r.cursor) {
        // Exponential ease: frame-rate independent, and it never overshoots.
        const follow = 1 - Math.exp(-12 * dt);
        pointerX += (targetX - pointerX) * follow;
        pointerY += (targetY - pointerY) * follow;
        presence += (targetPresence - presence) * follow;
      }
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

    // ── Pointer ──────────────────────────────────────────────────────────
    // Listened for on window rather than the canvas: the canvas sits under the
    // hero copy and the contact card, so canvas-local events would die the
    // moment the cursor crossed a headline.
    const onPointerMove = (e: PointerEvent) => {
      const b = parent.getBoundingClientRect();
      if (b.width === 0 || b.height === 0) return;
      const inside =
        e.clientX >= b.left &&
        e.clientX <= b.right &&
        e.clientY >= b.top &&
        e.clientY <= b.bottom;
      if (!inside) {
        targetPresence = 0;
        return;
      }
      const nx = ((e.clientX - b.left) / b.width) * 2 - 1;
      const ny = -(((e.clientY - b.top) / b.height) * 2 - 1);
      // Entering from cold, jump rather than ease, or the effect visibly slides
      // in from wherever the pointer happened to leave last time.
      if (targetPresence === 0 && presence < 0.01) {
        pointerX = nx;
        pointerY = ny;
      }
      targetX = nx;
      targetY = ny;
      targetPresence = 1;
    };
    const onPointerOut = () => {
      targetPresence = 0;
    };

    const pointerOn = r.cursor !== null && !reduce.matches;
    if (pointerOn) {
      window.addEventListener("pointermove", onPointerMove, { passive: true });
      window.addEventListener("pointercancel", onPointerOut);
      window.addEventListener("blur", onPointerOut);
      document.documentElement.addEventListener("pointerleave", onPointerOut);
    }

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
      if (pointerOn) {
        window.removeEventListener("pointermove", onPointerMove);
        window.removeEventListener("pointercancel", onPointerOut);
        window.removeEventListener("blur", onPointerOut);
        document.documentElement.removeEventListener(
          "pointerleave",
          onPointerOut
        );
      }
      gl.deleteBuffer(buffer);
      gl.deleteProgram(program);
      gl.deleteShader(vs);
      gl.deleteShader(fs);
    };
  }, [recipe]);

  return <canvas ref={canvasRef} className={className} aria-hidden="true" />;
};

export default ShaderBackground;
