"use client";

import { useEffect, useRef } from "react";

/* ===========================================================================
   1. ROMANTIC HEART CANVAS (Kalp Çizgisi)
   ========================================================================= */
export function RomanticHeartCanvas({ className = "" }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", handleResize);

    const particles: Array<{
      x: number;
      y: number;
      size: number;
      speedY: number;
      speedX: number;
      opacity: number;
      fadeSpeed: number;
    }> = Array.from({ length: 35 }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      size: Math.random() * 8 + 4,
      speedY: -(Math.random() * 0.5 + 0.2),
      speedX: (Math.random() - 0.5) * 0.4,
      opacity: Math.random() * 0.4 + 0.1,
      fadeSpeed: Math.random() * 0.003 + 0.001,
    }));

    const drawHeart = (x: number, y: number, size: number, opacity: number) => {
      ctx.save();
      ctx.translate(x, y);
      ctx.beginPath();
      ctx.fillStyle = `rgba(225, 120, 140, ${opacity})`;
      ctx.moveTo(0, 0);
      ctx.bezierCurveTo(-size / 2, -size / 2, -size, size / 3, 0, size);
      ctx.bezierCurveTo(size, size / 3, size / 2, -size / 2, 0, 0);
      ctx.fill();
      ctx.restore();
    };

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      particles.forEach((p) => {
        p.y += p.speedY;
        p.x += p.speedX;
        p.opacity += p.fadeSpeed;
        if (p.opacity > 0.4 || p.opacity < 0.05) p.fadeSpeed = -p.fadeSpeed;

        if (p.y < -20) {
          p.y = height + 20;
          p.x = Math.random() * width;
        }

        drawHeart(p.x, p.y, p.size, p.opacity);
      });

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className={`pointer-events-none absolute inset-0 z-0 ${className}`}
    />
  );
}

/* ===========================================================================
   2. STARRY SKY CANVAS (Söz Vakti)
   ========================================================================= */
export function StarrySkyCanvas({ className = "" }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", handleResize);

    const stars: Array<{
      x: number;
      y: number;
      r: number;
      alpha: number;
      alphaSpeed: number;
    }> = Array.from({ length: 90 }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      r: Math.random() * 1.8 + 0.4,
      alpha: Math.random(),
      alphaSpeed: (Math.random() - 0.5) * 0.015,
    }));

    let shootingStar = {
      x: Math.random() * width,
      y: Math.random() * (height / 2),
      length: Math.random() * 80 + 40,
      speed: Math.random() * 8 + 6,
      active: false,
      timer: 0,
    };

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      stars.forEach((s) => {
        s.alpha += s.alphaSpeed;
        if (s.alpha > 1 || s.alpha < 0.1) s.alphaSpeed = -s.alphaSpeed;

        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(212, 185, 115, ${Math.abs(s.alpha)})`;
        ctx.shadowBlur = 8;
        ctx.shadowColor = "#d4af37";
        ctx.fill();
      });

      shootingStar.timer++;
      if (shootingStar.timer > 180 && !shootingStar.active) {
        shootingStar.active = true;
        shootingStar.x = Math.random() * width;
        shootingStar.y = Math.random() * (height / 2);
        shootingStar.timer = 0;
      }

      if (shootingStar.active) {
        ctx.beginPath();
        ctx.moveTo(shootingStar.x, shootingStar.y);
        ctx.lineTo(
          shootingStar.x - shootingStar.length,
          shootingStar.y + shootingStar.length * 0.6
        );
        ctx.strokeStyle = "rgba(255, 235, 180, 0.8)";
        ctx.lineWidth = 1.5;
        ctx.stroke();

        shootingStar.x += shootingStar.speed;
        shootingStar.y += shootingStar.speed * 0.6;

        if (shootingStar.x > width || shootingStar.y > height) {
          shootingStar.active = false;
        }
      }

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className={`pointer-events-none absolute inset-0 z-0 ${className}`}
    />
  );
}

/* ===========================================================================
   3. MARBLE GOLD SHIMMER CANVAS (Mermer Yaldız)
   ========================================================================= */
export function MarbleGoldShimmerCanvas({ className = "" }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);
    let time = 0;

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", handleResize);

    const render = () => {
      ctx.clearRect(0, 0, width, height);
      time += 0.008;

      ctx.save();
      ctx.lineWidth = 1.5;
      ctx.strokeStyle = "rgba(201, 169, 97, 0.18)";
      ctx.shadowBlur = 12;
      ctx.shadowColor = "rgba(201, 169, 97, 0.5)";

      for (let i = 0; i < 4; i++) {
        ctx.beginPath();
        let startY = (height / 5) * (i + 1);
        ctx.moveTo(0, startY);

        for (let x = 0; x <= width; x += 30) {
          let y = startY + Math.sin(x * 0.005 + time + i) * 40 + Math.cos(x * 0.002 + time) * 20;
          ctx.lineTo(x, y);
        }
        ctx.stroke();
      }

      ctx.restore();
      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className={`pointer-events-none absolute inset-0 z-0 ${className}`}
    />
  );
}

/* ===========================================================================
   4. HENNA SPARKS CANVAS (Kırmızı Kına)
   ========================================================================= */
export function HennaSparksCanvas({ className = "" }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", handleResize);

    const sparks: Array<{
      x: number;
      y: number;
      r: number;
      vy: number;
      vx: number;
      alpha: number;
    }> = Array.from({ length: 45 }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      r: Math.random() * 2 + 1,
      vy: -(Math.random() * 0.8 + 0.3),
      vx: (Math.random() - 0.5) * 0.5,
      alpha: Math.random() * 0.6 + 0.2,
    }));

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      sparks.forEach((sp) => {
        sp.y += sp.vy;
        sp.x += sp.vx;

        if (sp.y < -10) {
          sp.y = height + 10;
          sp.x = Math.random() * width;
        }

        ctx.beginPath();
        ctx.arc(sp.x, sp.y, sp.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(240, 212, 154, ${sp.alpha})`;
        ctx.shadowBlur = 10;
        ctx.shadowColor = "#f0d49a";
        ctx.fill();
      });

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className={`pointer-events-none absolute inset-0 z-0 ${className}`}
    />
  );
}

/* ===========================================================================
   5. FLOATING PETALS CANVAS (Nişan Çemberi)
   ========================================================================= */
export function FloatingPetalsCanvas({ className = "" }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", handleResize);

    const petals: Array<{
      x: number;
      y: number;
      size: number;
      vy: number;
      vx: number;
      rot: number;
      vRot: number;
      opacity: number;
    }> = Array.from({ length: 30 }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      size: Math.random() * 7 + 5,
      vy: Math.random() * 0.6 + 0.3,
      vx: Math.random() * 0.4 - 0.2,
      rot: Math.random() * Math.PI * 2,
      vRot: (Math.random() - 0.5) * 0.02,
      opacity: Math.random() * 0.5 + 0.2,
    }));

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      petals.forEach((p) => {
        p.y += p.vy;
        p.x += p.vx;
        p.rot += p.vRot;

        if (p.y > height + 20) {
          p.y = -20;
          p.x = Math.random() * width;
        }

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rot);
        ctx.beginPath();
        ctx.fillStyle = `rgba(244, 180, 195, ${p.opacity})`;
        ctx.ellipse(0, 0, p.size, p.size / 2, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      });

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className={`pointer-events-none absolute inset-0 z-0 ${className}`}
    />
  );
}

/* ===========================================================================
   6. SUNLIGHT AURA CANVAS (Zeytin Bahçesi)
   ========================================================================= */
export function SunlightAuraCanvas({ className = "" }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", handleResize);

    const leaves: Array<{
      x: number;
      y: number;
      r: number;
      vy: number;
      vx: number;
      alpha: number;
    }> = Array.from({ length: 30 }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      r: Math.random() * 3 + 2,
      vy: Math.random() * 0.4 + 0.2,
      vx: (Math.random() - 0.5) * 0.3,
      alpha: Math.random() * 0.4 + 0.2,
    }));

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      leaves.forEach((l) => {
        l.y += l.vy;
        l.x += l.vx;
        if (l.y > height + 10) {
          l.y = -10;
          l.x = Math.random() * width;
        }

        ctx.beginPath();
        ctx.arc(l.x, l.y, l.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(180, 160, 110, ${l.alpha})`;
        ctx.fill();
      });

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className={`pointer-events-none absolute inset-0 z-0 ${className}`}
    />
  );
}

/* ===========================================================================
   7. GOLD DUST CANVAS (Belle Époque)
   ========================================================================= */
export function GoldDustCanvas({ className = "" }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", handleResize);

    const dust: Array<{
      x: number;
      y: number;
      r: number;
      vy: number;
      alpha: number;
      fadeSpeed: number;
    }> = Array.from({ length: 50 }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      r: Math.random() * 1.5 + 0.5,
      vy: -(Math.random() * 0.4 + 0.1),
      alpha: Math.random() * 0.5 + 0.1,
      fadeSpeed: (Math.random() - 0.5) * 0.01,
    }));

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      dust.forEach((d) => {
        d.y += d.vy;
        d.alpha += d.fadeSpeed;
        if (d.alpha > 0.6 || d.alpha < 0.1) d.fadeSpeed = -d.fadeSpeed;

        if (d.y < -10) {
          d.y = height + 10;
          d.x = Math.random() * width;
        }

        ctx.beginPath();
        ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(200, 162, 76, ${Math.abs(d.alpha)})`;
        ctx.shadowBlur = 6;
        ctx.shadowColor = "#c8a24c";
        ctx.fill();
      });

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className={`pointer-events-none absolute inset-0 z-0 ${className}`}
    />
  );
}
