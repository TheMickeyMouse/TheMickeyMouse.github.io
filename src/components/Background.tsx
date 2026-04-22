import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';

export default function Background() {
  const containerRef = useRef<HTMLDivElement>(null);
  const shapesRef = useRef<(HTMLDivElement | null)[]>([]);
  const orbsRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    // 1. Theme Transition Logic (Intersection Observer)
    const themes = {
      home: { bg: '#09090b', l1: '#18181b', l2: '#27272a', l3: '#3f3f46', orb: '#61afef' },
      about: { bg: '#0b0b14', l1: '#141420', l2: '#1a1a2b', l3: '#222238', orb: '#a855f7' },
      playground: { bg: '#0b0909', l1: '#181212', l2: '#221a1a', l3: '#2b2121', orb: '#f43f5e' },
      contact: { bg: '#080c09', l1: '#111813', l2: '#18221c', l3: '#212b25', orb: '#10b981' }
    };

    const updateTheme = (id: string) => {
      const theme = themes[id as keyof typeof themes];
      if (!theme || !containerRef.current) return;
      
      const root = containerRef.current;
      root.style.setProperty('--bg-color', theme.bg);
      root.style.setProperty('--layer-1-color', theme.l1);
      root.style.setProperty('--layer-2-color', theme.l2);
      root.style.setProperty('--layer-3-color', theme.l3);
      root.style.setProperty('--orb-color', theme.orb);
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          updateTheme(entry.target.id);
        }
      });
    }, { threshold: 0.5 });

    ['home', 'about', 'playground', 'contact'].forEach(id => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    // 2. Entrance Animation (One-time)
    const ctx = gsap.context(() => {
      const tl = gsap.timeline();
      tl.fromTo(".landscape-layer-1", { y: 100, opacity: 0 }, { y: 0, opacity: 1, duration: 1.5, ease: "power3.out" })
        .fromTo(".landscape-layer-2", { y: 150, opacity: 0 }, { y: 0, opacity: 1, duration: 1.5, ease: "power3.out" }, "-=1.2")
        .fromTo(".landscape-layer-3", { y: 200, opacity: 0 }, { y: 0, opacity: 1, duration: 1.5, ease: "power3.out" }, "-=1.2")
        .fromTo(shapesRef.current, { scale: 0, opacity: 0 }, { scale: 1, opacity: 1, stagger: 0.05, duration: 1, ease: "back.out(1.7)" }, "-=1");
    }, containerRef);

    // 3. Parallax Logic (Lighter CSS Variable Based)
    const handleMouseMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 2; // -1 to 1
      const y = (e.clientY / window.innerHeight - 0.5) * 2; // -1 to 1
      
      if (containerRef.current) {
        containerRef.current.style.setProperty('--mouse-x', x.toString());
        containerRef.current.style.setProperty('--mouse-y', y.toString());
      }

      // Magnetic effect stays GSAP for the smooth elastic return
      shapesRef.current.forEach((shape) => {
        if (!shape) return;
        const rect = shape.getBoundingClientRect();
        const shapeX = rect.left + rect.width / 2;
        const shapeY = rect.top + rect.height / 2;
        const dist = Math.hypot(e.clientX - shapeX, e.clientY - shapeY);
        if (dist < 300) {
          const power = (300 - dist) / 300;
          gsap.to(shape, {
            x: (e.clientX - shapeX) * power * 0.2,
            y: (e.clientY - shapeY) * power * 0.2,
            rotate: power * 45,
            duration: 0.4,
            ease: "power2.out",
            overwrite: 'auto'
          });
        } else {
          gsap.to(shape, { x: 0, y: 0, rotate: 0, duration: 1, ease: "elastic.out(1, 0.3)", overwrite: 'auto' });
        }
      });
    };

    const handleMouseDown = (e: MouseEvent) => {
      if (!containerRef.current) return;
      const ripple = document.createElement('div');
      ripple.className = 'absolute rounded-full border-2 border-[var(--orb-color)] opacity-50 pointer-events-none z-[1]';
      const size = 10;
      ripple.style.width = `${size}px`;
      ripple.style.height = `${size}px`;
      ripple.style.left = `${e.clientX - size / 2}px`;
      ripple.style.top = `${e.clientY - size / 2}px`;
      containerRef.current.appendChild(ripple);

      gsap.to(ripple, { 
        scale: 25, 
        opacity: 0, 
        duration: 1.5, 
        ease: "power2.out",
        onComplete: () => ripple.remove(),
        overwrite: true
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mousedown', handleMouseDown);
    
    return () => {
      observer.disconnect();
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mousedown', handleMouseDown);
      ctx.revert();
    };
  }, []);

  return (
    <div 
      ref={containerRef} 
      className="fixed inset-0 z-0 pointer-events-none overflow-hidden bg-transition"
      style={{ backgroundColor: 'var(--bg-color)' } as React.CSSProperties}
    >
      {/* Background Layers with CSS Parallax */}
      <svg 
        className="landscape-layer-1 absolute bottom-0 left-0 w-[120%] h-[50%] -translate-x-[10%] bg-transition" 
        style={{ 
          color: 'var(--layer-1-color)',
          transform: `translateX(calc(-10% + (var(--mouse-x) * 10px))) translateY(calc(var(--mouse-y) * 5px))`
        } as React.CSSProperties} 
        viewBox="0 0 1000 100" 
        preserveAspectRatio="none"
      >
        <path d="M0,100 L0,50 L100,20 L200,60 L300,10 L400,70 L500,30 L600,80 L700,40 L800,90 L900,20 L1000,50 L1000,100 Z" fill="currentColor" />
      </svg>

      {/* Floating Shapes */}
      {[
        "top-[15%] left-[10%] w-24 h-24 border-2 border-[var(--orb-color)]/30 rotate-12 rounded-lg",
        "top-[40%] right-[15%] w-16 h-16 bg-[var(--orb-color)]/20 rounded-full blur-sm",
        "bottom-[20%] left-[20%] w-32 h-32 border border-white/10 -rotate-45",
        "top-[60%] left-[5%] w-12 h-12 bg-pink-500/20 rounded-sm rotate-45 blur-[2px]",
        "top-[10%] right-[30%] w-8 h-8 bg-yellow-500/20 rounded-full",
        "top-[70%] right-[10%] w-40 h-40 border-2 border-emerald-500/10 rounded-full",
        "top-[30%] left-[40%] w-20 h-20 border border-blue-400/10 rotate-[30deg]"
      ].map((style, i) => (
        <div 
          key={i} 
          ref={el => shapesRef.current[i] = el}
          className={`absolute ${style}`}
          style={{ transform: `translate(calc(var(--mouse-x) * ${20 + i * 5}px), calc(var(--mouse-y) * ${10 + i * 2}px))` } as React.CSSProperties}
        />
      ))}
      
      {/* Middle Layer */}
      <svg 
        className="landscape-layer-2 absolute bottom-0 left-0 w-[130%] h-[35%] -translate-x-[15%] bg-transition"
        style={{ 
          color: 'var(--layer-2-color)',
          transform: `translateX(calc(-15% + (var(--mouse-x) * 25px))) translateY(calc(var(--mouse-y) * 12px))`
        } as React.CSSProperties} 
        viewBox="0 0 1000 100" 
        preserveAspectRatio="none"
      >
        <path d="M0,100 L0,70 C150,20 350,120 500,70 C650,20 850,120 1000,70 L1000,100 Z" fill="currentColor" />
      </svg>

      {/* Front Layer */}
      <svg 
        className="landscape-layer-3 absolute bottom-0 left-0 w-[140%] h-[25%] -translate-x-[20%] bg-transition"
        style={{ 
          color: 'var(--layer-3-color)',
          transform: `translateX(calc(-20% + (var(--mouse-x) * 40px))) translateY(calc(var(--mouse-y) * 20px))`
        } as React.CSSProperties} 
        viewBox="0 0 1000 100" 
        preserveAspectRatio="none"
      >
        <path d="M0,100 L0,80 Q250,40 500,80 Q750,120 1000,80 L1000,100 Z" fill="currentColor" />
      </svg>

      {/* Orbs */}
      <div 
        ref={el => orbsRef.current[0] = el}
        className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full blur-[120px] bg-transition" 
        style={{ backgroundColor: 'color-mix(in srgb, var(--orb-color) 20%, transparent)', transform: `translate(calc(var(--mouse-x) * 30px), calc(var(--mouse-y) * 15px))` } as React.CSSProperties}
      />
      <div 
        ref={el => orbsRef.current[1] = el}
        className="absolute top-1/2 right-1/4 w-96 h-96 rounded-full blur-[150px] bg-transition" 
        style={{ backgroundColor: 'color-mix(in srgb, var(--orb-color) 10%, transparent)', transform: `translate(calc(var(--mouse-x) * 50px), calc(var(--mouse-y) * 25px))` } as React.CSSProperties}
      />
    </div>
  );
}
