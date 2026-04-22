import React, { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Github, Linkedin, Twitter, Facebook, Instagram, Globe } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

// --- CUSTOMIZABLE DATA ---
const USER_INFO = {
  name: "The Creator",
  tagline: "I build digital experiences that defy the ordinary.",
  strongWords: ["experiences", "defy", "ordinary"],
  profilePic: "https://www.shutterstock.com/image-photo/very-random-pose-asian-men-260nw-2423213779.jpg",
  bio: [
    "Based in the intersection of design and code, I specialize in creating interactive playgrounds that engage and surprise. My work is driven by a passion for high-performance animations and bold visual storytelling.",
    "Every project is an experiment in how we interact with the digital world. I believe that the web should be more than just static pages—it should be a space for play and discovery."
  ],
  skills: ["Creative Coding", "GSAP Animation", "React / Vite", "Tailwind CSS"],
  focus: ["UX Design", "Interaction", "Performance", "3D Web"],
  experience: [
    { year: "2024 - Present", role: "Lead Creative Developer", company: "Studio X" },
    { year: "2022 - 2024", role: "Interactive Designer", company: "Digital Wave" },
    { year: "2020 - 2022", role: "Frontend Engineer", company: "Tech Flow" }
  ],
  education: [
    { year: "2020", degree: "B.S. in Computer Science", school: "University of Design" },
    { year: "2018", degree: "Web Design Certification", school: "Creative Academy" }
  ],
  socials: [
    { name: "Github", url: "https://github.com", icon: Github },
    { name: "LinkedIn", url: "https://linkedin.com", icon: Linkedin },
    { name: "Twitter", url: "https://twitter.com", icon: Twitter },
    { name: "Facebook", url: "https://facebook.com", icon: Facebook },
    { name: "Instagram", url: "https://instagram.com", icon: Instagram },
    { name: "Website", url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ", icon: Globe }
  ]
};

export default function AboutMe() {
  const containerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);

  const handleMouseEnter = (e: React.MouseEvent<HTMLSpanElement>) => {
    gsap.to(e.currentTarget, {
      scale: 1.2,
      rotate: Math.random() * 10 - 5,
      color: "var(--color-theme)",
      textShadow: "0 0 20px var(--color-theme-glow)",
      duration: 0.3,
      ease: "power2.out"
    });
  };

  const handleMouseLeave = (e: React.MouseEvent<HTMLSpanElement>) => {
    gsap.to(e.currentTarget, {
      scale: 1,
      rotate: 0,
      color: "white",
      textShadow: "0 0 0px var(--color-theme-glow)",
      duration: 0.3,
      ease: "power2.out"
    });
  };

  const handleImageMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!imageRef.current) return;
    const { left, top, width, height } = imageRef.current.getBoundingClientRect();
    const x = (e.clientX - left) / width - 0.5;
    const y = (e.clientY - top) / height - 0.5;

    gsap.to(imageRef.current, {
      rotateY: x * 20,
      rotateX: -y * 20,
      scale: 1.05,
      duration: 0.5,
      ease: "power2.out",
      transformPerspective: 1000
    });
  };

  const handleImageMouseLeave = () => {
    gsap.to(imageRef.current, {
      rotateY: 0,
      rotateX: 0,
      scale: 1,
      duration: 0.5,
      ease: "power2.out"
    });
  };

  useEffect(() => {
    const section = containerRef.current;
    if (!section) return;

    gsap.fromTo(section, 
      { rotateX: 20, opacity: 0, scale: 0.9 },
      { 
        rotateX: 0, 
        opacity: 1, 
        scale: 1,
        duration: 1.2,
        ease: "power3.out",
        scrollTrigger: {
          trigger: section,
          start: "top bottom",
          end: "top center",
          scrub: true
        }
      }
    );
  }, []);

  return (
    <section id="about" ref={containerRef} className="relative py-32 bg-transparent text-white px-6 overflow-hidden perspective-1000">
      <div className="max-w-5xl mx-auto">
        <div className="flex flex-col gap-12">
          <div className="flex items-center gap-4">
            <div className="w-12 h-px bg-[var(--color-theme)]" />
            <span className="text-sm font-bold uppercase tracking-[0.3em] text-[var(--color-theme)] glow-text">{USER_INFO.name}</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-12 items-center">
            <div className="md:col-span-8">
              <h2 className="text-5xl md:text-8xl font-black uppercase leading-[0.9] tracking-tighter">
                {USER_INFO.tagline.split(' ').map((word, i) => (
                  <span 
                    key={i}
                    onMouseEnter={handleMouseEnter} 
                    onMouseLeave={handleMouseLeave} 
                    className={`inline-block cursor-default transition-colors mr-4 ${USER_INFO.strongWords.includes(word.toLowerCase().replace(/[.,]/g, '')) ? 'strong-text' : ''}`}
                  >
                    {word}
                  </span>
                ))}
              </h2>
            </div>
            
            <div className="md:col-span-4 perspective-1000">
              <div 
                ref={imageRef}
                onMouseMove={handleImageMouseMove}
                onMouseLeave={handleImageMouseLeave}
                className="relative aspect-[3/4] w-full rounded-[2rem] overflow-hidden border border-white/10 shadow-2xl preserve-3d"
              >
                <img 
                  src={USER_INFO.profilePic} 
                  alt={USER_INFO.name}
                  className="w-full h-full object-cover scale-110 pointer-events-none"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent pointer-events-none" />
                <div className="absolute inset-x-0 bottom-0 p-6 flex justify-between items-end pointer-events-none">
                  <div className="text-[10px] font-mono uppercase tracking-[0.2em] text-white/50">Subject: Author</div>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 mt-12">
            <div className="space-y-6">
              {USER_INFO.bio.map((para, i) => (
                <p key={i} className="text-xl text-zinc-400 leading-relaxed">
                  {para}
                </p>
              ))}
            </div>

            <div className="grid grid-cols-2 gap-8">
              <div>
                <h4 className="text-xs font-bold uppercase tracking-widest text-zinc-500 mb-4">Skills</h4>
                <ul className="space-y-2 text-sm font-medium uppercase tracking-wider">
                  {USER_INFO.skills.map((skill, i) => <li key={i}>{skill}</li>)}
                </ul>
              </div>
              <div>
                <h4 className="text-xs font-bold uppercase tracking-widest text-zinc-500 mb-4">Focus</h4>
                <ul className="space-y-2 text-sm font-medium uppercase tracking-wider">
                  {USER_INFO.focus.map((f, i) => <li key={i}>{f}</li>)}
                </ul>
              </div>
              <div className="col-span-2 mt-4">
                <h4 className="text-xs font-bold uppercase tracking-widest text-zinc-500 mb-4">Socials</h4>
                <div className="flex flex-wrap gap-4">
                  {USER_INFO.socials.map((social, i) => (
                    <a 
                      key={i} 
                      href={social.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="group flex items-center justify-center w-10 h-10 rounded-full bg-zinc-900 border border-zinc-800 hover:border-[var(--color-theme)] hover:shadow-[0_0_15px_var(--color-theme-glow)] transition-all"
                      title={social.name}
                    >
                      <social.icon className="w-5 h-5 text-zinc-400 group-hover:text-[var(--color-theme)] transition-colors" />
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* New Sections */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 mt-24 pt-24 border-t border-zinc-800">
            <div>
              <h3 className="text-2xl font-black uppercase tracking-tighter mb-8 hover-scale">Experience</h3>
              <div className="space-y-8">
                {USER_INFO.experience.map((exp, i) => (
                  <div key={i} className="group flex justify-between items-start border-b border-zinc-900 pb-4 hover:border-[var(--color-theme)] transition-colors">
                    <div>
                      <h4 className="font-bold text-lg group-hover:text-[var(--color-theme)] transition-colors">{exp.role}</h4>
                      <p className="text-zinc-500 text-sm">{exp.company}</p>
                    </div>
                    <span className="text-xs font-mono text-zinc-600">{exp.year}</span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-2xl font-black uppercase tracking-tighter mb-8 hover-scale">Education</h3>
              <div className="space-y-8">
                {USER_INFO.education.map((edu, i) => (
                  <div key={i} className="group flex justify-between items-start border-b border-zinc-900 pb-4 hover:border-[var(--color-theme)] transition-colors">
                    <div>
                      <h4 className="font-bold text-lg group-hover:text-[var(--color-theme)] transition-colors">{edu.degree}</h4>
                      <p className="text-zinc-500 text-sm">{edu.school}</p>
                    </div>
                    <span className="text-xs font-mono text-zinc-600">{edu.year}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
