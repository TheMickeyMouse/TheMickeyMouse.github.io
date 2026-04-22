import { useEffect, useRef, useState, FormEvent } from 'react';
import gsap from 'gsap';
import { Draggable } from 'gsap/Draggable';
import { Mail, Github, Twitter, Send, CheckCircle2 } from 'lucide-react';

gsap.registerPlugin(Draggable);

export default function Contact() {
  const cardRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [formData, setFormData] = useState({ name: '', message: '' });
  const [isSent, setIsSent] = useState(false);
  const [isConnected, setIsConnected] = useState(false);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.message) return;
    
    // "Do nothing for now" - just show a success state
    setIsSent(true);
    setTimeout(() => {
      setIsSent(false);
      setFormData({ name: '', message: '' });
    }, 3000);
  };

  useEffect(() => {
    if (!cardRef.current || !containerRef.current) return;

    const card = cardRef.current;
    
    const handleMouseMove = (e: MouseEvent) => {
      const { left, top, width, height } = card.getBoundingClientRect();
      const x = (e.clientX - left) / width - 0.5;
      const y = (e.clientY - top) / height - 0.5;

      gsap.to(card, {
        rotateY: x * 30,
        rotateX: -y * 30,
        duration: 0.5,
        ease: "power2.out",
        transformPerspective: 1000
      });
    };

    const handleMouseLeave = () => {
      gsap.to(card, {
        rotateY: 0,
        rotateX: 0,
        duration: 0.5,
        ease: "power2.out"
      });
    };

    card.addEventListener('mousemove', handleMouseMove);
    card.addEventListener('mouseleave', handleMouseLeave);

    Draggable.create(card, {
      bounds: containerRef.current,
      dragClickables: false, // Ensure inputs are clickable
      onDragStart: function() {
        gsap.to(this.target, { scale: 1.05, boxShadow: "0 20px 40px rgba(0,0,0,0.4)", duration: 0.3 });
      },
      onDragEnd: function() {
        gsap.to(this.target, { scale: 1, boxShadow: "0 10px 20px rgba(0,0,0,0.2)", duration: 0.3 });
      }
    });

    return () => {
      card.removeEventListener('mousemove', handleMouseMove);
      card.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  return (
    <section id="contact" ref={containerRef} className="relative h-screen bg-transparent flex items-center justify-center overflow-hidden px-6 py-20 perspective-1000">
      <div className="absolute inset-0 z-0 flex items-center justify-center pointer-events-none">
        <h2 className="text-[20vw] font-black text-white/[0.02] uppercase select-none">Connect</h2>
      </div>

      <div 
        ref={cardRef}
        className="relative z-10 w-full max-w-md bg-zinc-800 border border-zinc-700 p-8 rounded-3xl shadow-2xl cursor-grab active:cursor-grabbing preserve-3d"
      >
        <div className="flex items-center gap-4 mb-8">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[var(--color-theme)] to-blue-500 flex items-center justify-center shadow-[0_0_20px_var(--color-theme-glow)]">
            {isSent ? <CheckCircle2 className="text-white w-8 h-8" /> : <Send className="text-white w-8 h-8" />}
          </div>
          <div>
            <h3 className="text-2xl font-black text-white uppercase italic hover-scale">
              {isSent ? "Message Sent!" : "Let's Play"}
            </h3>
            <p className="text-zinc-400 text-sm">
              {isSent ? "Thanks for reaching out." : "Drag me around or send a message"}
            </p>
          </div>
        </div>

        <form className="space-y-4 mb-8" onSubmit={handleSubmit}>
          <div>
            <label className="block text-xs font-bold uppercase tracking-widest text-zinc-500 mb-2">Name</label>
            <input 
              type="text" 
              placeholder="Your Name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[var(--color-theme)] focus:shadow-[0_0_15px_var(--color-theme-glow)] transition-all"
              required
            />
          </div>
          <div>
            <label className="block text-xs font-bold uppercase tracking-widest text-zinc-500 mb-2">Message</label>
            <textarea 
              placeholder="What's on your mind?"
              rows={4}
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[var(--color-theme)] focus:shadow-[0_0_15px_var(--color-theme-glow)] transition-all resize-none"
              required
            />
          </div>
          <button 
            type="submit"
            disabled={isSent}
            className={`w-full py-4 font-black uppercase tracking-widest rounded-xl transition-all ${
              isSent 
                ? "bg-emerald-500 text-white shadow-[0_0_25px_rgba(16,185,129,0.4)]" 
                : "bg-white text-black hover:bg-[var(--color-theme)] hover:text-white hover:shadow-[0_0_25px_var(--color-theme-glow)]"
            }`}
          >
            {isSent ? "Sent Successfully" : "Send Message"}
          </button>
          <button 
            type="button"
            disabled={isConnected}
            className={`w-full py-4 font-black uppercase tracking-widest rounded-xl transition-all ${
              isConnected
                ? "bg-emerald-500 text-white shadow-[0_0_25px_rgba(16,185,129,0.4)]" 
                : "bg-white text-black hover:bg-[var(--color-theme)] hover:text-white hover:shadow-[0_0_25px_var(--color-theme-glow)]"
            }`}
          >
            {isConnected ? "Connected!" : "Connect to Our Group"}
          </button>
        </form>

        <div className="flex justify-between items-center pt-6 border-t border-zinc-700">
          <div className="flex gap-4">
            <a href="#" data-cursor="hover" className="text-zinc-400 hover:text-white transition-colors"><Mail size={20} /></a>
            <a href="#" data-cursor="hover" className="text-zinc-400 hover:text-white transition-colors"><Github size={20} /></a>
            <a href="#" data-cursor="hover" className="text-zinc-400 hover:text-white transition-colors"><Twitter size={20} /></a>
          </div>
          <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-600">© 2026 Playground</span>
        </div>
      </div>
    </section>
  );
}
