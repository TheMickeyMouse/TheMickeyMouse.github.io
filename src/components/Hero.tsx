import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { useMagnetic } from '../hooks/useMagnetic';

export default function Hero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const magneticRef = useMagnetic();

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const ctx = gsap.context(() => {
      // Entrance Animation
      const tl = gsap.timeline({ delay: 0.5 });
      
      tl.fromTo(titleRef.current, 
        { y: 100, opacity: 0, rotateX: -45 },
        { y: 0, opacity: 1, rotateX: 0, duration: 1.5, ease: "power4.out" }
      )
      .fromTo("#hero-subtitle", 
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 1, ease: "power3.out" }, 
        "-=1"
      )
      .fromTo("#hero-cta", 
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 1, ease: "power3.out" }, 
        "-=0.8"
      )
      .fromTo("#scroll-indicator", 
        { opacity: 0, y: -20 },
        { opacity: 1, y: 0, duration: 1, ease: "power2.out" }, 
        "-=0.5"
      );
    }, containerRef);

    const handleMouseMove = (e: MouseEvent) => {
      const { clientX, clientY } = e;
      const xPos = (clientX / window.innerWidth - 0.5);
      const yPos = (clientY / window.innerHeight - 0.5);

      gsap.to(titleRef.current, {
        rotateY: xPos * 20,
        rotateX: -yPos * 20,
        duration: 1,
        ease: "power2.out",
        transformPerspective: 1000
      });
    };

    const handleMouseEnter = () => {
      gsap.to(titleRef.current, {
        scale: 1.1,
        duration: 0.4,
        ease: "power2.out"
      });
    };

    const handleMouseLeave = () => {
      gsap.to(titleRef.current, {
        scale: 1,
        duration: 0.4,
        ease: "power2.out"
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    titleRef.current?.addEventListener('mouseenter', handleMouseEnter);
    titleRef.current?.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      titleRef.current?.removeEventListener('mouseenter', handleMouseEnter);
      titleRef.current?.removeEventListener('mouseleave', handleMouseLeave);
      ctx.revert(); // Cleanup GSAP
    };
  }, []);

  return (
    <section id="home" ref={containerRef} className="relative h-screen flex flex-col items-center justify-center overflow-hidden bg-transparent text-white px-6 perspective-1000">
      <div className="relative z-10 text-center preserve-3d">
        <h1 
          ref={titleRef}
          className="text-[12vw] font-black leading-[0.8] uppercase tracking-tighter mb-8 hero-title hover-scale"
        >
          Digital<br />Playground
        </h1>
        
        <p id="hero-subtitle" className="text-xl md:text-2xl font-medium max-w-2xl mx-auto mb-12 opacity-80">
          An experimental space where code meets creativity. 
          Move your mouse to interact with the environment.
        </p>

        <button
          id="hero-cta"
          ref={magneticRef as any}
          className="group relative px-8 py-4 bg-white text-black font-bold rounded-full overflow-hidden transition-transform active:scale-95 shadow-[0_0_20px_rgba(255,255,255,0.3)] hover:shadow-[0_0_30px_var(--color-theme-glow)]"
        >
          <a className="relative z-10 p-10" href="#contact">Contact Us</a>
          <div className="absolute inset-0 bg-[var(--color-theme)] translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
        </button>
      </div>

      <div id="scroll-indicator" className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce opacity-50">
        <div className="w-px h-12 bg-white" />
      </div>
    </section>
  );
}
