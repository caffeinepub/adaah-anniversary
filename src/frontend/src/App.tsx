import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";

type Screen = "password" | "landing" | "message" | "fireworks" | "final";

// Pre-built static decoration data (no index as key)
const FLOWER_ITEMS = [
  { id: "f1", e: "🌸", l: 3, d: 8, dl: 0, s: 1 },
  { id: "f2", e: "🌺", l: 10, d: 10, dl: 0.8, s: 1.4 },
  { id: "f3", e: "🌷", l: 17, d: 12, dl: 1.6, s: 1 },
  { id: "f4", e: "🌹", l: 24, d: 8, dl: 2.4, s: 1.4 },
  { id: "f5", e: "💐", l: 31, d: 10, dl: 3.2, s: 1.8 },
  { id: "f6", e: "🌼", l: 38, d: 12, dl: 4.0, s: 1 },
  { id: "f7", e: "🌸", l: 45, d: 14, dl: 4.8, s: 1.4 },
  { id: "f8", e: "💕", l: 52, d: 8, dl: 5.6, s: 1.8 },
  { id: "f9", e: "🌺", l: 59, d: 10, dl: 0.4, s: 1 },
  { id: "f10", e: "🌷", l: 66, d: 12, dl: 1.2, s: 1.4 },
  { id: "f11", e: "🌹", l: 73, d: 14, dl: 2.0, s: 1.8 },
  { id: "f12", e: "🌸", l: 80, d: 8, dl: 2.8, s: 1 },
  { id: "f13", e: "🌺", l: 87, d: 10, dl: 3.6, s: 1.4 },
  { id: "f14", e: "🌷", l: 94, d: 12, dl: 4.4, s: 1.8 },
  { id: "f15", e: "💐", l: 6, d: 14, dl: 5.2, s: 1 },
  { id: "f16", e: "🌼", l: 14, d: 8, dl: 5.8, s: 1.4 },
  { id: "f17", e: "🌸", l: 21, d: 10, dl: 0.2, s: 1.8 },
  { id: "f18", e: "🌹", l: 35, d: 12, dl: 1.0, s: 1 },
  { id: "f19", e: "🌺", l: 49, d: 14, dl: 1.8, s: 1.4 },
  { id: "f20", e: "🌷", l: 71, d: 8, dl: 2.6, s: 1.8 },
];

const PETAL_ITEMS = [
  { id: "p1", e: "🌸", l: 2, d: 5, dl: 0, s: 1 },
  { id: "p2", e: "🌺", l: 7, d: 6.5, dl: 0.5, s: 1.3 },
  { id: "p3", e: "🌹", l: 13, d: 8, dl: 1.0, s: 1.6 },
  { id: "p4", e: "🌷", l: 19, d: 9.5, dl: 1.5, s: 1.9 },
  { id: "p5", e: "💐", l: 25, d: 5, dl: 2.0, s: 1 },
  { id: "p6", e: "🌸", l: 31, d: 6.5, dl: 2.5, s: 1.3 },
  { id: "p7", e: "🌺", l: 37, d: 8, dl: 3.0, s: 1.6 },
  { id: "p8", e: "🌹", l: 43, d: 9.5, dl: 3.5, s: 1.9 },
  { id: "p9", e: "🌷", l: 49, d: 5, dl: 4.0, s: 1 },
  { id: "p10", e: "💐", l: 55, d: 6.5, dl: 4.5, s: 1.3 },
  { id: "p11", e: "🌸", l: 61, d: 8, dl: 5.0, s: 1.6 },
  { id: "p12", e: "🌺", l: 67, d: 9.5, dl: 5.5, s: 1.9 },
  { id: "p13", e: "🌹", l: 73, d: 5, dl: 6.0, s: 1 },
  { id: "p14", e: "🌷", l: 79, d: 6.5, dl: 6.5, s: 1.3 },
  { id: "p15", e: "💐", l: 85, d: 8, dl: 7.0, s: 1.6 },
  { id: "p16", e: "🌸", l: 91, d: 9.5, dl: 7.5, s: 1.9 },
  { id: "p17", e: "🌺", l: 4, d: 5, dl: 0.3, s: 1 },
  { id: "p18", e: "🌹", l: 16, d: 6.5, dl: 1.3, s: 1.3 },
  { id: "p19", e: "🌷", l: 58, d: 8, dl: 3.8, s: 1.6 },
  { id: "p20", e: "💐", l: 96, d: 9.5, dl: 2.3, s: 1.9 },
  { id: "p21", e: "🌸", l: 40, d: 5, dl: 4.8, s: 1 },
  { id: "p22", e: "🌺", l: 52, d: 6.5, dl: 5.8, s: 1.3 },
  { id: "p23", e: "🌹", l: 22, d: 8, dl: 0.8, s: 1.6 },
  { id: "p24", e: "🌷", l: 70, d: 9.5, dl: 6.8, s: 1.9 },
  { id: "p25", e: "💐", l: 34, d: 5, dl: 2.8, s: 1 },
];

const STAR_ITEMS = [
  { id: "s1", l: 1, t: 5, op: 0.3, ad: 2, dd: 0 },
  { id: "s2", l: 4.4, t: 8.1, op: 0.5, ad: 2, dd: 0.2 },
  { id: "s3", l: 11.2, t: 14.3, op: 0.7, ad: 2, dd: 0.4 },
  { id: "s4", l: 14.6, t: 17.4, op: 0.3, ad: 3, dd: 0.6 },
  { id: "s5", l: 18, t: 20.5, op: 0.5, ad: 3, dd: 0.8 },
  { id: "s6", l: 21.4, t: 23.6, op: 0.7, ad: 3, dd: 1.0 },
  { id: "s7", l: 24.8, t: 26.7, op: 0.3, ad: 2, dd: 1.2 },
  { id: "s8", l: 28.2, t: 29.8, op: 0.5, ad: 2, dd: 1.4 },
  { id: "s9", l: 31.6, t: 32.9, op: 0.7, ad: 2, dd: 1.6 },
  { id: "s10", l: 35, t: 36, op: 0.3, ad: 3, dd: 1.8 },
  { id: "s11", l: 38.4, t: 39.1, op: 0.5, ad: 3, dd: 2.0 },
  { id: "s12", l: 41.8, t: 42.2, op: 0.7, ad: 3, dd: 2.2 },
  { id: "s13", l: 45.2, t: 45.3, op: 0.3, ad: 2, dd: 2.4 },
  { id: "s14", l: 48.6, t: 48.4, op: 0.5, ad: 2, dd: 2.6 },
  { id: "s15", l: 52, t: 51.5, op: 0.7, ad: 2, dd: 2.8 },
  { id: "s16", l: 55.4, t: 54.6, op: 0.3, ad: 3, dd: 0.1 },
  { id: "s17", l: 58.8, t: 57.7, op: 0.5, ad: 3, dd: 0.3 },
  { id: "s18", l: 62.2, t: 60.8, op: 0.7, ad: 3, dd: 0.5 },
  { id: "s19", l: 65.6, t: 63.9, op: 0.3, ad: 2, dd: 0.7 },
  { id: "s20", l: 69, t: 67, op: 0.5, ad: 2, dd: 0.9 },
  { id: "s21", l: 72.4, t: 70.1, op: 0.7, ad: 2, dd: 1.1 },
  { id: "s22", l: 75.8, t: 73.2, op: 0.3, ad: 3, dd: 1.3 },
  { id: "s23", l: 79.2, t: 76.3, op: 0.5, ad: 3, dd: 1.5 },
  { id: "s24", l: 82.6, t: 79.4, op: 0.7, ad: 3, dd: 1.7 },
  { id: "s25", l: 86, t: 82.5, op: 0.3, ad: 2, dd: 1.9 },
  { id: "s26", l: 89.4, t: 85.6, op: 0.5, ad: 2, dd: 2.1 },
  { id: "s27", l: 92.8, t: 88.7, op: 0.7, ad: 2, dd: 2.3 },
  { id: "s28", l: 96.2, t: 91.8, op: 0.3, ad: 3, dd: 2.5 },
  { id: "s29", l: 7.4, t: 95, op: 0.5, ad: 3, dd: 2.7 },
  { id: "s30", l: 23, t: 98, op: 0.7, ad: 3, dd: 2.9 },
];

const SPARK_ITEMS = [
  { id: "sp1", l: 3, t: 8, fs: 0.8, ad: 2, dd: 0 },
  { id: "sp2", l: 8.2, t: 12.7, fs: 1.2, ad: 3, dd: 0.3 },
  { id: "sp3", l: 13.4, t: 17.4, fs: 1.6, ad: 4, dd: 0.6 },
  { id: "sp4", l: 18.6, t: 22.1, fs: 0.8, ad: 5, dd: 0.9 },
  { id: "sp5", l: 23.8, t: 26.8, fs: 1.2, ad: 2, dd: 1.2 },
  { id: "sp6", l: 29, t: 31.5, fs: 1.6, ad: 3, dd: 1.5 },
  { id: "sp7", l: 34.2, t: 36.2, fs: 0.8, ad: 4, dd: 1.8 },
  { id: "sp8", l: 39.4, t: 40.9, fs: 1.2, ad: 5, dd: 2.1 },
  { id: "sp9", l: 44.6, t: 45.6, fs: 1.6, ad: 2, dd: 2.4 },
  { id: "sp10", l: 49.8, t: 50.3, fs: 0.8, ad: 3, dd: 2.7 },
  { id: "sp11", l: 55, t: 55, fs: 1.2, ad: 4, dd: 3.0 },
  { id: "sp12", l: 60.2, t: 59.7, fs: 1.6, ad: 5, dd: 3.3 },
  { id: "sp13", l: 65.4, t: 64.4, fs: 0.8, ad: 2, dd: 0.1 },
  { id: "sp14", l: 70.6, t: 69.1, fs: 1.2, ad: 3, dd: 0.4 },
  { id: "sp15", l: 75.8, t: 73.8, fs: 1.6, ad: 4, dd: 0.7 },
  { id: "sp16", l: 81, t: 78.5, fs: 0.8, ad: 5, dd: 1.0 },
  { id: "sp17", l: 86.2, t: 83.2, fs: 1.2, ad: 2, dd: 1.3 },
  { id: "sp18", l: 91.4, t: 87.9, fs: 1.6, ad: 3, dd: 1.6 },
  { id: "sp19", l: 96.6, t: 92.6, fs: 0.8, ad: 4, dd: 1.9 },
  { id: "sp20", l: 5.8, t: 97.3, fs: 1.2, ad: 5, dd: 2.2 },
];

const HEART_BG = [
  { id: "hb1", e: "💕", l: 2, t: 5, fs: 1, ad: 3, dd: 0 },
  { id: "hb2", e: "❤️", l: 11, t: 13, fs: 1.5, ad: 4, dd: 0.4 },
  { id: "hb3", e: "💗", l: 20, t: 21, fs: 2, ad: 5, dd: 0.8 },
  { id: "hb4", e: "💓", l: 29, t: 29, fs: 1, ad: 6, dd: 1.2 },
  { id: "hb5", e: "💖", l: 38, t: 37, fs: 1.5, ad: 3, dd: 1.6 },
  { id: "hb6", e: "💝", l: 47, t: 45, fs: 2, ad: 4, dd: 2.0 },
  { id: "hb7", e: "🌹", l: 56, t: 53, fs: 1, ad: 5, dd: 2.4 },
  { id: "hb8", e: "💕", l: 65, t: 61, fs: 1.5, ad: 6, dd: 2.8 },
  { id: "hb9", e: "❤️", l: 74, t: 69, fs: 2, ad: 3, dd: 3.2 },
  { id: "hb10", e: "💗", l: 83, t: 77, fs: 1, ad: 4, dd: 0.2 },
  { id: "hb11", e: "💓", l: 92, t: 85, fs: 1.5, ad: 5, dd: 0.6 },
  { id: "hb12", e: "💖", l: 6, t: 88, fs: 2, ad: 6, dd: 1.0 },
];

// ==================== FLOATING FLOWERS COMPONENT ====================
function FloatingFlowers() {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {FLOWER_ITEMS.map((item) => (
        <span
          key={item.id}
          style={{
            position: "absolute",
            left: `${item.l}%`,
            bottom: "-60px",
            fontSize: `${item.s}rem`,
            animation: `floatFlower ${item.d}s ${item.dl}s infinite ease-in-out`,
            willChange: "transform",
          }}
        >
          {item.e}
        </span>
      ))}
    </div>
  );
}

// ==================== FALLING PETALS COMPONENT ====================
function FallingPetals() {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {PETAL_ITEMS.map((item) => (
        <span
          key={item.id}
          style={{
            position: "absolute",
            left: `${item.l}%`,
            top: "-60px",
            fontSize: `${item.s}rem`,
            animation: `petalFall ${item.d}s ${item.dl}s infinite ease-in-out`,
            willChange: "transform",
          }}
        >
          {item.e}
        </span>
      ))}
    </div>
  );
}

// ==================== FIREWORKS CANVAS ====================
interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  alpha: number;
  color: string;
  size: number;
  isGlitter?: boolean;
  twinkleOffset?: number;
}

interface Firework {
  x: number;
  y: number;
  targetY: number;
  vy: number;
  color: string;
  exploded: boolean;
  particles: Particle[];
  trail: Array<{ x: number; y: number }>;
}

const FW_COLORS = [
  "#e91e63",
  "#f06292",
  "#f48fb1",
  "#ff6b9d",
  "#ffd700",
  "#ff4081",
  "#ffffff",
  "#ff80ab",
  "#c2185b",
  "#ffb74d",
  "#ff6e40",
  "#ce93d8",
  "#ba68c8",
  "#e040fb",
  "#fff176",
  "#ffe082",
  "#80deea",
  "#4dd0e1",
];

function FireworksCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);
  const fireworksRef = useRef<Firework[]>([]);
  const frameCountRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const createFirework = (): Firework => ({
      x: Math.random() * canvas.width,
      y: canvas.height,
      targetY: canvas.height * 0.1 + Math.random() * canvas.height * 0.55,
      vy: -14 - Math.random() * 7,
      color: FW_COLORS[Math.floor(Math.random() * FW_COLORS.length)],
      exploded: false,
      particles: [],
      trail: [],
    });

    const explode = (fw: Firework) => {
      const burstType = Math.floor(Math.random() * 3);
      const glitterColors = ["#ffffff", "#fff176", "#ffe082", "#ffd700"];

      if (burstType === 0) {
        // Standard burst: 100-130 particles
        const count = 100 + Math.floor(Math.random() * 30);
        for (let i = 0; i < count; i++) {
          const angle = (Math.PI * 2 * i) / count + (Math.random() - 0.5) * 0.4;
          const speed = 1.5 + Math.random() * 6.5;
          const isSparkle = Math.random() < 0.2;
          fw.particles.push({
            x: fw.x,
            y: fw.y,
            vx: Math.cos(angle) * speed,
            vy: Math.sin(angle) * speed,
            alpha: isSparkle ? 0.5 : 1,
            color: fw.color,
            size: isSparkle
              ? (2 + Math.random() * 3) * 2
              : 2 + Math.random() * 3,
          });
        }
      } else if (burstType === 1) {
        // Star burst: 5 arms of 12 particles each
        const arms = 5;
        const perArm = 12;
        for (let a = 0; a < arms; a++) {
          const armAngle = (Math.PI * 2 * a) / arms;
          for (let j = 0; j < perArm; j++) {
            const spread = (Math.random() - 0.5) * 0.5;
            const speed = 3 + Math.random() * 5;
            const angle = armAngle + spread;
            const isSparkle = Math.random() < 0.2;
            fw.particles.push({
              x: fw.x,
              y: fw.y,
              vx: Math.cos(angle) * speed,
              vy: Math.sin(angle) * speed,
              alpha: isSparkle ? 0.5 : 1,
              color: fw.color,
              size: isSparkle
                ? (1.5 + Math.random() * 2.5) * 2
                : 1.5 + Math.random() * 2.5,
            });
          }
        }
      } else {
        // Ring burst: 80 particles at same speed, different angles
        const count = 80;
        for (let i = 0; i < count; i++) {
          const angle = (Math.PI * 2 * i) / count;
          const isSparkle = Math.random() < 0.2;
          fw.particles.push({
            x: fw.x,
            y: fw.y,
            vx: Math.cos(angle) * 3.5,
            vy: Math.sin(angle) * 3.5,
            alpha: isSparkle ? 0.5 : 1,
            color: fw.color,
            size: isSparkle
              ? (2 + Math.random() * 2) * 2
              : 2 + Math.random() * 2,
          });
        }
      }

      // Glitter particles: 15 slow-falling white/gold dots
      for (let g = 0; g < 15; g++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = 0.5 + Math.random() * 2;
        fw.particles.push({
          x: fw.x,
          y: fw.y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed - 1,
          alpha: 0.9,
          color:
            glitterColors[Math.floor(Math.random() * glitterColors.length)],
          size: 1 + Math.random() * 1.5,
          isGlitter: true,
          twinkleOffset: Math.random() * Math.PI * 2,
        });
      }

      fw.exploded = true;
    };

    const animate = () => {
      ctx.fillStyle = "rgba(5, 0, 16, 0.15)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      frameCountRef.current++;
      const fc = frameCountRef.current;

      if (fc % 25 === 0 && fireworksRef.current.length < 12) {
        fireworksRef.current.push(createFirework());
      }

      fireworksRef.current = fireworksRef.current.filter((fw) => {
        if (!fw.exploded) {
          // Store trail
          fw.trail.push({ x: fw.x, y: fw.y });
          if (fw.trail.length > 5) fw.trail.shift();

          // Draw trail dots
          fw.trail.forEach((pt, i) => {
            const trailAlpha = ((i + 1) / fw.trail.length) * 0.5;
            ctx.beginPath();
            ctx.arc(pt.x, pt.y, 1.5, 0, Math.PI * 2);
            ctx.fillStyle = fw.color;
            ctx.globalAlpha = trailAlpha;
            ctx.fill();
            ctx.globalAlpha = 1;
          });

          // Draw rocket
          fw.y += fw.vy;
          fw.vy += 0.25;
          ctx.beginPath();
          ctx.arc(fw.x, fw.y, 3, 0, Math.PI * 2);
          ctx.fillStyle = fw.color;
          ctx.globalAlpha = 1;
          ctx.fill();

          if (fw.y <= fw.targetY) explode(fw);
          return true;
        }

        fw.particles = fw.particles.filter((p) => {
          p.x += p.vx;
          p.y += p.vy;
          p.vy += p.isGlitter ? 0.05 : 0.15;
          p.vx *= p.isGlitter ? 0.995 : 0.97;
          p.alpha -= p.isGlitter ? 0.008 : 0.018;

          let drawAlpha = Math.max(0, p.alpha);
          if (p.isGlitter && p.twinkleOffset !== undefined) {
            // Twinkle: oscillate alpha slightly
            drawAlpha = Math.max(
              0,
              drawAlpha * (0.6 + 0.4 * Math.sin(fc * 0.3 + p.twinkleOffset)),
            );
          }

          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fillStyle = p.color;
          ctx.globalAlpha = drawAlpha;
          ctx.fill();
          ctx.globalAlpha = 1;
          return p.alpha > 0;
        });
        return fw.particles.length > 0;
      });

      animRef.current = requestAnimationFrame(animate);
    };

    animRef.current = requestAnimationFrame(animate);
    return () => {
      cancelAnimationFrame(animRef.current);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 z-0"
      style={{ display: "block" }}
    />
  );
}

// ==================== SCREEN 1: PASSWORD GATE ====================
const LANDING_HEARTS = [
  { id: "lh1", e: "💕", l: 15, t: 10, ad: 3, dd: 0 },
  { id: "lh2", e: "❤️", l: 33, t: 10, ad: 4, dd: 0.5 },
  { id: "lh3", e: "💗", l: 51, t: 35, ad: 5, dd: 1.0 },
  { id: "lh4", e: "💓", l: 69, t: 35, ad: 6, dd: 1.5 },
  { id: "lh5", e: "💖", l: 87, t: 60, ad: 7, dd: 2.0 },
];

function PasswordScreen({ onSuccess }: { onSuccess: () => void }) {
  const [value, setValue] = useState("");
  const [error, setError] = useState(false);
  const [shaking, setShaking] = useState(false);

  const handleSubmit = () => {
    if (value.trim().toLowerCase() === "nabigah nasim") {
      onSuccess();
    } else {
      setError(true);
      setShaking(true);
      setTimeout(() => setShaking(false), 600);
      setTimeout(() => setValue(""), 600);
    }
  };

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleSubmit();
  };

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden"
      style={{
        background: "#ff69b4",
      }}
    >
      {STAR_ITEMS.map((s) => (
        <span
          key={s.id}
          style={{
            position: "absolute",
            left: `${s.l}%`,
            top: `${s.t}%`,
            fontSize: "0.5rem",
            opacity: s.op,
            animation: `sparkle ${s.ad}s ${s.dd}s infinite ease-in-out`,
            pointerEvents: "none",
          }}
        >
          ✨
        </span>
      ))}

      {LANDING_HEARTS.map((h) => (
        <span
          key={h.id}
          style={{
            position: "absolute",
            left: `${h.l}%`,
            top: `${h.t}%`,
            fontSize: "1.2rem",
            animation: `floatHeart ${h.ad}s ${h.dd}s infinite ease-in-out`,
            opacity: 0.4,
            pointerEvents: "none",
          }}
        >
          {h.e}
        </span>
      ))}

      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: "easeOut" }}
        className="flex flex-col items-center z-10 px-6"
      >
        <div className="text-center mb-2">
          <span
            style={{
              fontFamily: "Fraunces, serif",
              fontSize: "clamp(4rem, 15vw, 9rem)",
              fontWeight: 300,
              color: "#000000",
              animation: "shimmer 3s ease-in-out infinite",
              display: "block",
              lineHeight: 1.1,
              letterSpacing: "0.02em",
            }}
          >
            Adaah
          </span>
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          style={{
            fontFamily: "Crimson Pro, serif",
            fontSize: "clamp(1rem, 3.5vw, 1.4rem)",
            color: "#000000",
            marginBottom: "2.5rem",
            textAlign: "center",
            fontStyle: "italic",
            letterSpacing: "0.05em",
          }}
        >
          Enter the secret word to continue... 🌹
        </motion.p>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.8, duration: 0.6 }}
          className="w-full max-w-sm"
        >
          <div
            style={{ animation: shaking ? "shake 0.6s ease-in-out" : "none" }}
          >
            <input
              data-ocid="password.input"
              type="password"
              value={value}
              onChange={(e) => {
                setValue(e.target.value);
                setError(false);
              }}
              onKeyDown={handleKey}
              placeholder="Your secret answer..."
              style={{
                width: "100%",
                padding: "1rem 1.5rem",
                fontSize: "1.1rem",
                fontFamily: "Playfair Display, serif",
                background: "rgba(255,255,255,0.8)",
                border: `2px solid ${error ? "#e91e63" : "#00000055"}`,
                borderRadius: "50px",
                color: "#000000",
                outline: "none",
                textAlign: "center",
                letterSpacing: "0.08em",
                boxShadow: error ? "0 0 20px #e91e6344" : "0 0 10px #c2185b22",
                transition: "border-color 0.3s, box-shadow 0.3s",
              }}
            />
          </div>

          {error && (
            <motion.p
              data-ocid="password.error_state"
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              style={{
                color: "#f06292",
                textAlign: "center",
                marginTop: "0.75rem",
                fontFamily: "Crimson Pro, serif",
                fontSize: "1rem",
              }}
            >
              Wrong password, try again 💔
            </motion.p>
          )}

          <motion.button
            data-ocid="password.submit_button"
            onClick={handleSubmit}
            whileHover={{ scale: 1.05, boxShadow: "0 0 30px #e91e6366" }}
            whileTap={{ scale: 0.97 }}
            style={{
              width: "100%",
              marginTop: "1.5rem",
              padding: "1rem",
              fontSize: "1.2rem",
              fontFamily: "Fraunces, serif",
              fontWeight: 500,
              background: "#000000",
              color: "#ffffff",
              border: "none",
              borderRadius: "50px",
              cursor: "pointer",
              letterSpacing: "0.1em",
              boxShadow: "0 4px 20px rgba(0,0,0,0.4)",
              transition: "all 0.3s",
            }}
          >
            Enter ❤️
          </motion.button>
        </motion.div>
      </motion.div>
    </div>
  );
}

// ==================== SCREEN 2: FLOWER LANDING ====================
const VINE_CORNERS = [
  { id: "vc1", style: { top: 0, left: 0 } },
  { id: "vc2", style: { top: 0, right: 0 } },
  { id: "vc3", style: { bottom: 0, left: 0 } },
  { id: "vc4", style: { bottom: 0, right: 0 } },
];

function LandingScreen({ onContinue }: { onContinue: () => void }) {
  return (
    <div
      className="min-h-screen relative overflow-hidden"
      style={{
        background:
          "radial-gradient(ellipse at top, #3d0b20 0%, #1e0510 50%, #0f0309 100%)",
      }}
    >
      <FloatingFlowers />

      {VINE_CORNERS.map((v) => (
        <div
          key={v.id}
          style={{
            position: "fixed",
            ...v.style,
            fontSize: "2rem",
            opacity: 0.4,
            padding: "8px",
            pointerEvents: "none",
          }}
        >
          🌿
        </div>
      ))}

      <div className="relative z-10 flex flex-col items-center justify-start min-h-screen pt-16 pb-20 px-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.7 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          className="text-center mb-6"
        >
          <span
            style={{
              fontFamily: "Fraunces, serif",
              fontSize: "clamp(2.5rem, 10vw, 6rem)",
              fontWeight: 700,
              color: "#f8bbd0",
              animation: "shimmer 2.5s ease-in-out infinite",
              display: "block",
              lineHeight: 1.2,
              letterSpacing: "0.05em",
            }}
          >
            I LOVE U ADAA
          </span>
          <div
            style={{
              fontSize: "2rem",
              marginTop: "0.5rem",
              animation: "heartbeat 2s infinite",
            }}
          >
            ❤️
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 1 }}
          style={{
            fontSize: "1.8rem",
            letterSpacing: "0.5rem",
            marginBottom: "2rem",
            opacity: 0.8,
          }}
        >
          🌹🌸🌷🌺🌼🌸🌹
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 1 }}
          style={{
            fontFamily: "Crimson Pro, serif",
            fontSize: "clamp(1.1rem, 3.5vw, 1.5rem)",
            color: "#f48fb1",
            textAlign: "center",
            fontStyle: "italic",
            maxWidth: "600px",
            lineHeight: 1.8,
            marginBottom: "3rem",
            padding: "1.5rem 2rem",
            border: "1px solid #c2185b33",
            borderRadius: "20px",
            background: "rgba(194, 24, 91, 0.07)",
            boxShadow: "0 0 30px #c2185b22",
          }}
        >
          "Every love story is beautiful, but ours is my favourite..." 💕
        </motion.div>

        <div style={{ height: "4rem" }} />

        <motion.button
          data-ocid="landing.button"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2, duration: 0.8 }}
          onClick={onContinue}
          whileHover={{
            scale: 1.06,
            boxShadow: "0 0 40px #e91e6366, 0 0 80px #c2185b33",
          }}
          whileTap={{ scale: 0.97 }}
          style={{
            padding: "1rem 2.5rem",
            fontSize: "clamp(1rem, 3vw, 1.3rem)",
            fontFamily: "Fraunces, serif",
            fontWeight: 500,
            background: "linear-gradient(135deg, #c2185b, #ad1457, #880e4f)",
            color: "#fff8f0",
            border: "2px solid #f48fb133",
            borderRadius: "50px",
            cursor: "pointer",
            letterSpacing: "0.08em",
            boxShadow: "0 4px 25px #c2185b55, 0 0 50px #c2185b22",
            animation: "borderGlow 2s ease-in-out infinite",
          }}
        >
          More About Adaa 💕
        </motion.button>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 1 }}
          style={{
            marginTop: "3rem",
            fontSize: "1.5rem",
            letterSpacing: "0.8rem",
            opacity: 0.5,
          }}
        >
          🌸💕🌸
        </motion.div>
      </div>
    </div>
  );
}

// ==================== SCREEN 3: ANNIVERSARY MESSAGE ====================
function MessageScreen({ onContinue }: { onContinue: () => void }) {
  return (
    <div
      className="min-h-screen relative overflow-hidden"
      style={{
        background:
          "linear-gradient(160deg, #2d0a1a 0%, #1a0a2e 30%, #2d0a1a 60%, #1a0510 100%)",
      }}
    >
      {HEART_BG.map((h) => (
        <span
          key={h.id}
          style={{
            position: "fixed",
            left: `${h.l}%`,
            top: `${h.t}%`,
            fontSize: `${h.fs}rem`,
            animation: `floatHeart ${h.ad}s ${h.dd}s infinite ease-in-out`,
            opacity: 0.2,
            pointerEvents: "none",
          }}
        >
          {h.e}
        </span>
      ))}

      <div className="relative z-10 flex flex-col items-center py-16 px-4 sm:px-8">
        <motion.div
          initial={{ opacity: 0, y: -40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="text-center mb-4"
        >
          <div
            style={{
              fontSize: "2rem",
              marginBottom: "0.5rem",
              animation: "heartbeat 1.5s infinite",
            }}
          >
            💖
          </div>
          <span
            style={{
              fontFamily: "Fraunces, serif",
              fontSize: "clamp(1.8rem, 6vw, 4rem)",
              fontWeight: 700,
              color: "#f8bbd0",
              animation: "glowPulse 2.5s ease-in-out infinite",
              display: "block",
              letterSpacing: "0.05em",
              lineHeight: 1.2,
            }}
          >
            HAPPY ANNIVERSARY
          </span>
          <span
            style={{
              fontFamily: "Fraunces, serif",
              fontSize: "clamp(2.2rem, 8vw, 5rem)",
              fontWeight: 300,
              color: "#f06292",
              animation: "shimmer 3s ease-in-out infinite",
              display: "block",
              letterSpacing: "0.08em",
            }}
          >
            ADAA 🌹
          </span>
          <div
            style={{
              fontSize: "1.5rem",
              marginTop: "0.5rem",
              letterSpacing: "0.5rem",
            }}
          >
            💕💐💕
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 1 }}
          style={{
            maxWidth: "720px",
            width: "100%",
            background: "rgba(194, 24, 91, 0.08)",
            border: "1px solid #c2185b44",
            borderRadius: "24px",
            padding: "clamp(1.5rem, 5vw, 3rem)",
            boxShadow: "0 0 40px #c2185b22, 0 20px 60px rgba(0,0,0,0.4)",
            marginBottom: "3rem",
          }}
        >
          <div
            style={{
              fontFamily: "Crimson Pro, serif",
              fontSize: "clamp(1rem, 2.8vw, 1.25rem)",
              color: "#fce4ec",
              lineHeight: 2,
              whiteSpace: "pre-wrap",
            }}
          >
            <span
              style={{
                fontFamily: "Fraunces, serif",
                fontSize: "clamp(1.2rem, 4vw, 1.8rem)",
                color: "#f48fb1",
                display: "block",
                marginBottom: "1rem",
              }}
            >
              ADAA HAPPY ANNIVERSARY 🎊
            </span>
            {
              "bhut bhut bhut sara congratulations \ud83c\udf8a  aj hamre relationship ko 5 mounth ho gaye hai sabse pahle to tumhara bhut bhut thank u jaan meri life me ane ke liye mene kabhi nhi socha tha ki muje itni achi wife milegi tum bhut achi ho \ud83e\udec2 mera bhut khyal rakhti ho \ud83e\udee0\ud83e\udec2tumhare sath jo sukoon milta hai or kahi nhi milta jaan \ud83e\udec2\n\n5th mounth ho gaye pata hi nhi chala kab 5th mounth ho gaye. Jaan tumse bhut bhut pyar krta hu muje pta hai tum bhi bht sara pyar krti ho muje or syd ye bhi reason hai hamare puar yaha tak aa gya hai.\n\nmuje pura turst hai ham dono ise bhut age lekar jayege ek dusre ko support krege har situation me ek dusre ka sath kabhi nhi chorege shadi ek dusre se hi krege.\n\nTum dil se bhi or nature se bhi dono se bhut khubsurt ho or Beauty ke to kya hi kehne tumare koi comparison hi nhi hai \ud83c\udf37\ud83d\udc95\ud83e\udec2"
            }
            <div
              style={{
                marginTop: "1.5rem",
                marginBottom: "1rem",
                lineHeight: 2.2,
                fontSize: "clamp(1rem, 2.5vw, 1.15rem)",
                color: "#f8bbd0",
                whiteSpace: "pre-line",
              }}
            >
              {
                "meri jaan \u2022 meri bachi \u2022 meri princess \ud83d\udc78\nmeri biwi \u2022 meri wifeyyyyyyyyyyyyyyy \ud83c\udf77\nmeri darling \u2022 meri madam jie \u2022 meri malkin\nmeri mommy \u2022 meri life partner \u2022 meri best friend\nmeri bestie \u2022 my everything \u2022 meri adaa \ud83d\udc95"
              }
            </div>
            <div
              style={{
                fontFamily: "Fraunces, serif",
                fontSize: "clamp(1.4rem, 5vw, 2.2rem)",
                color: "#f06292",
                textAlign: "center",
                animation: "glowPulse 2s ease-in-out infinite",
                marginTop: "1.5rem",
                letterSpacing: "0.05em",
              }}
            >
              LOVEEEE UUU SOO MUCH ❤️
            </div>
          </div>
        </motion.div>

        <motion.button
          data-ocid="message.continue_button"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1, duration: 0.8 }}
          onClick={onContinue}
          whileHover={{ scale: 1.06, boxShadow: "0 0 40px #e91e6366" }}
          whileTap={{ scale: 0.97 }}
          style={{
            padding: "1rem 3rem",
            fontSize: "clamp(1rem, 3vw, 1.3rem)",
            fontFamily: "Fraunces, serif",
            fontWeight: 500,
            background: "linear-gradient(135deg, #c2185b, #ad1457)",
            color: "#fff8f0",
            border: "2px solid #f48fb133",
            borderRadius: "50px",
            cursor: "pointer",
            letterSpacing: "0.1em",
            boxShadow: "0 4px 25px #c2185b55",
            animation: "borderGlow 2s ease-in-out infinite",
          }}
        >
          Continue 💖
        </motion.button>
      </div>
    </div>
  );
}

// ==================== SCREEN 4: FIREWORKS CELEBRATION ====================
function FireworksScreen({ onContinue }: { onContinue: () => void }) {
  const [showButton, setShowButton] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setShowButton(true), 4000);
    return () => clearTimeout(t);
  }, []);

  return (
    <div
      className="min-h-screen relative overflow-hidden"
      style={{
        background:
          "radial-gradient(ellipse at 50% 0%, #1a0035 0%, #0d001a 30%, #050010 60%, #000008 100%)",
      }}
    >
      {/* Tiled "i love u adaa" background text */}
      <div
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 0,
          overflow: "hidden",
          opacity: 0.12,
          pointerEvents: "none",
        }}
      >
        <div
          style={{
            width: "100%",
            height: "100%",
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='180' height='40'%3E%3Ctext x='0' y='28' font-family='serif' font-size='12' fill='%23d4a0ff'%3Ei love u adaa%3C/text%3E%3C/svg%3E")`,
            backgroundRepeat: "repeat",
          }}
        />
      </div>

      <FireworksCanvas />

      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen py-20 px-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.2, type: "spring", bounce: 0.4 }}
          className="text-center mb-8"
        >
          <span
            style={{
              fontFamily: "Fraunces, serif",
              fontSize: "clamp(2rem, 8vw, 5rem)",
              fontWeight: 700,
              color: "#f8bbd0",
              animation: "glowPulse 2s ease-in-out infinite",
              display: "block",
              letterSpacing: "0.06em",
              lineHeight: 1.2,
              textShadow: "0 0 30px #e91e63aa, 0 0 60px #c2185b66",
            }}
          >
            HAPPY ANNIVERSARY
          </span>
          <span
            style={{
              fontFamily: "Fraunces, serif",
              fontSize: "clamp(2.5rem, 10vw, 6.5rem)",
              fontWeight: 300,
              color: "#f06292",
              animation: "shimmer 2.5s ease-in-out infinite",
              display: "block",
              letterSpacing: "0.1em",
            }}
          >
            ADAA 🎊
          </span>
          <div
            style={{
              fontSize: "2.5rem",
              marginTop: "0.5rem",
              animation: "heartbeat 1.5s infinite",
            }}
          >
            ❤️🎆❤️
          </div>
        </motion.div>

        <AnimatePresence>
          {showButton && (
            <motion.button
              data-ocid="fireworks.button"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.8 }}
              onClick={onContinue}
              whileHover={{ scale: 1.06, boxShadow: "0 0 50px #e91e6377" }}
              whileTap={{ scale: 0.97 }}
              style={{
                padding: "1.2rem 3.5rem",
                fontSize: "clamp(1.1rem, 3.5vw, 1.5rem)",
                fontFamily: "Fraunces, serif",
                fontWeight: 500,
                background:
                  "linear-gradient(135deg, #c2185b, #ad1457, #880e4f)",
                color: "#fff8f0",
                border: "2px solid #f48fb155",
                borderRadius: "50px",
                cursor: "pointer",
                letterSpacing: "0.1em",
                boxShadow: "0 4px 30px #c2185b66",
                animation: "borderGlow 2s ease-in-out infinite",
              }}
            >
              THANK U 💝
            </motion.button>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

// ==================== SCREEN 5: FINAL THANK YOU ====================
function FinalScreen() {
  return (
    <div
      data-ocid="final.section"
      className="min-h-screen relative overflow-hidden flex flex-col items-center justify-center"
      style={{
        background:
          "radial-gradient(ellipse at center, #2d0a1a 0%, #1a0510 50%, #0a0208 100%)",
      }}
    >
      <FallingPetals />

      {SPARK_ITEMS.map((s) => (
        <span
          key={s.id}
          style={{
            position: "fixed",
            left: `${s.l}%`,
            top: `${s.t}%`,
            fontSize: `${s.fs}rem`,
            animation: `sparkle ${s.ad}s ${s.dd}s infinite ease-in-out`,
            opacity: 0.6,
            pointerEvents: "none",
          }}
        >
          ✨
        </span>
      ))}

      <div className="relative z-10 flex flex-col items-center text-center px-6 py-20">
        <motion.div
          initial={{ opacity: 0, scale: 0.7, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          className="mb-10"
        >
          <div
            style={{
              fontSize: "3rem",
              marginBottom: "1rem",
              animation: "heartbeat 1.8s infinite",
            }}
          >
            🌸🌹🌸
          </div>
          <span
            style={{
              fontFamily: "Fraunces, serif",
              fontSize: "clamp(2rem, 7vw, 4.5rem)",
              fontWeight: 700,
              color: "#f8bbd0",
              animation: "glowPulse 2s ease-in-out infinite",
              display: "block",
              lineHeight: 1.2,
              letterSpacing: "0.05em",
              textShadow: "0 0 30px #e91e6388",
            }}
          >
            THANK U FOR
          </span>
          <span
            style={{
              fontFamily: "Fraunces, serif",
              fontSize: "clamp(2rem, 7vw, 4.5rem)",
              fontWeight: 700,
              color: "#f06292",
              animation: "shimmer 2.5s ease-in-out infinite",
              display: "block",
              lineHeight: 1.2,
              letterSpacing: "0.05em",
            }}
          >
            COMING IN MY LIFE
          </span>
          <div
            style={{
              fontSize: "2rem",
              marginTop: "1rem",
              letterSpacing: "0.5rem",
            }}
          >
            💕🌹💕
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scaleX: 0 }}
          animate={{ opacity: 1, scaleX: 1 }}
          transition={{ delay: 0.8, duration: 1 }}
          style={{
            width: "200px",
            height: "2px",
            background:
              "linear-gradient(90deg, transparent, #c2185b, transparent)",
            marginBottom: "3rem",
          }}
        />

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 1.2 }}
          className="mb-8"
        >
          <span
            style={{
              fontFamily: "Fraunces, serif",
              fontSize: "clamp(2.5rem, 10vw, 6rem)",
              fontWeight: 300,
              color: "#f48fb1",
              animation: "shimmer 3s ease-in-out infinite",
              display: "block",
              letterSpacing: "0.08em",
              lineHeight: 1.3,
              textShadow: "0 0 40px #e91e63aa, 0 0 80px #c2185b55",
            }}
          >
            LOVE UU FOREVER
          </span>
          <div
            style={{
              fontSize: "2.5rem",
              marginTop: "0.5rem",
              animation: "heartbeat 2s infinite",
              letterSpacing: "0.3rem",
            }}
          >
            ✨💕❤️💕✨
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.5, duration: 1 }}
          style={{
            fontFamily: "Crimson Pro, serif",
            fontSize: "clamp(1rem, 3vw, 1.2rem)",
            color: "#f8bbd0",
            fontStyle: "italic",
            lineHeight: 2,
            textAlign: "center",
            maxWidth: "500px",
            padding: "1.5rem 2rem",
            background: "rgba(194, 24, 91, 0.08)",
            border: "1px solid #c2185b33",
            borderRadius: "20px",
            boxShadow: "0 0 30px #c2185b22",
            marginBottom: "2rem",
            whiteSpace: "pre-line",
          }}
        >
          {
            "Jaan, tum meri duniya ho \ud83c\udf0d\nTumhare bina sab adhura hai \ud83d\udc9e\nHar pal tumhare saath bitana chahta hu \u2764\ufe0f\nAb aur hamesha... meri Adaa \ud83c\udf39"
          }
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2, duration: 1 }}
          style={{ fontSize: "2rem", letterSpacing: "0.5rem" }}
        >
          🌸🌺🌷🌹💐🌼🌸
        </motion.div>
      </div>

      <footer
        style={{
          position: "relative",
          zIndex: 10,
          padding: "1rem",
          textAlign: "center",
          fontFamily: "Crimson Pro, serif",
          fontSize: "0.8rem",
          color: "#f48fb166",
        }}
      >
        © {new Date().getFullYear()}. Built with{" "}
        <span style={{ color: "#e91e63" }}>♥</span> using{" "}
        <a
          href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: "#f48fb188", textDecoration: "none" }}
        >
          caffeine.ai
        </a>
      </footer>
    </div>
  );
}

// ==================== MAIN APP ====================
export default function App() {
  const [screen, setScreen] = useState<Screen>("password");

  const goTo = (next: Screen) => {
    setScreen(next);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div style={{ minHeight: "100vh" }}>
      <AnimatePresence mode="wait">
        {screen === "password" && (
          <motion.div
            key="password"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
          >
            <PasswordScreen onSuccess={() => goTo("landing")} />
          </motion.div>
        )}
        {screen === "landing" && (
          <motion.div
            key="landing"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
          >
            <LandingScreen onContinue={() => goTo("message")} />
          </motion.div>
        )}
        {screen === "message" && (
          <motion.div
            key="message"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
          >
            <MessageScreen onContinue={() => goTo("fireworks")} />
          </motion.div>
        )}
        {screen === "fireworks" && (
          <motion.div
            key="fireworks"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
          >
            <FireworksScreen onContinue={() => goTo("final")} />
          </motion.div>
        )}
        {screen === "final" && (
          <motion.div
            key="final"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
          >
            <FinalScreen />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
