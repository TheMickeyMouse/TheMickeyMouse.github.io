import { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import { Menu as MenuIcon, X } from 'lucide-react';

export default function Menu() {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      gsap.to(overlayRef.current, {
        clipPath: "circle(150% at 100% 0%)",
        duration: 0.8,
        ease: "power3.inOut"
      });
      gsap.fromTo(".menu-item", 
        { y: 50, opacity: 0 }, 
        { y: 0, opacity: 1, duration: 0.5, stagger: 0.1, ease: "power3.out", delay: 0.4 }
      );
    } else {
      gsap.to(overlayRef.current, {
        clipPath: "circle(0% at 100% 0%)",
        duration: 0.8,
        ease: "power3.inOut"
      });
    }
  }, [isOpen]);

  const toggleMenu = () => setIsOpen(!isOpen);

  return (
    <>
      <nav className="fixed top-0 left-0 w-full z-[999] flex justify-between items-center p-8 mix-blend-difference">
        <div className="text-2xl font-black uppercase tracking-tighter text-white">Playground</div>
        <button 
          onClick={toggleMenu}
          data-cursor="hover"
          className="relative z-[1001] w-12 h-12 flex items-center justify-center bg-white text-black rounded-full transition-transform active:scale-90"
        >
          {isOpen ? <X size={24} /> : <MenuIcon size={24} />}
        </button>
      </nav>

      <div 
        ref={overlayRef}
        className="fixed inset-0 z-[1000] bg-zinc-950 flex flex-col items-center justify-center"
        style={{ clipPath: "circle(0% at 100% 0%)" }}
      >
        <div className="flex flex-col items-center gap-8">
          {['Home', 'About', 'Playground', 'Contact'].map((item, i) => (
            <a 
              key={i}
              href={`#${item.toLowerCase()}`}
              onClick={() => setIsOpen(false)}
              data-cursor="hover"
              className="menu-item text-6xl md:text-9xl font-black uppercase tracking-tighter text-white hover:text-blue-500 transition-colors"
            >
              {item}
            </a>
          ))}
        </div>

        <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex gap-8 text-xs font-bold uppercase tracking-[0.4em] text-zinc-500">
          <a href="#" className="hover:text-white transition-colors">Twitter</a>
          <a href="#" className="hover:text-white transition-colors">Github</a>
          <a href="#" className="hover:text-white transition-colors">Dribbble</a>
        </div>
      </div>
    </>
  );
}
