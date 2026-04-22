import React, { useEffect, useRef } from 'react';
import Matter from 'matter-js';
import gsap from 'gsap';

export default function PhysicsPlayground() {
  const sceneRef = useRef<HTMLDivElement>(null);
  const engineRef = useRef<Matter.Engine | null>(null);
  const renderRef = useRef<Matter.Render | null>(null);

  useEffect(() => {
    if (!sceneRef.current) return;

    // Matter.js setup
    const Engine = Matter.Engine,
      Render = Matter.Render,
      Runner = Matter.Runner,
      Bodies = Matter.Bodies,
      Composite = Matter.Composite,
      Mouse = Matter.Mouse,
      MouseConstraint = Matter.MouseConstraint;

    const engine = Engine.create();
    engineRef.current = engine;
    
    // Set up world properties
    engine.gravity.y = 1;

    const width = sceneRef.current.clientWidth;
    const height = 600;

    const render = Render.create({
      element: sceneRef.current,
      engine: engine,
      options: {
        width,
        height,
        wireframes: false,
        background: 'transparent',
        pixelRatio: window.devicePixelRatio
      }
    });
    renderRef.current = render;

    // Create boundaries
    const thickness = 100;
    const ground = Bodies.rectangle(width / 2, height + thickness / 2, width, thickness, { 
      isStatic: true, 
      render: { fillStyle: 'transparent' } 
    });
    const leftWall = Bodies.rectangle(-thickness / 2, height / 2, thickness, height, { 
      isStatic: true, 
      render: { fillStyle: 'transparent' } 
    });
    const rightWall = Bodies.rectangle(width + thickness / 2, height / 2, thickness, height, { 
      isStatic: true, 
      render: { fillStyle: 'transparent' } 
    });
    const ceiling = Bodies.rectangle(width / 2, -thickness / 2, width, thickness, { 
      isStatic: true, 
      render: { fillStyle: 'transparent' } 
    });

    Composite.add(engine.world, [ground, leftWall, rightWall, ceiling]);

    // Add some blocks
    const colors = ['#61afef', '#a855f7', '#10b981', '#f43f5e', '#fbbf24'];
    const blocks: Matter.Body[] = [];

    for (let i = 0; i < 15; i++) {
        const size = Math.random() * 40 + 40;
        const x = Math.random() * (width - 100) + 50;
        const y = Math.random() * -500; // Spawn from top
        
        const isCircle = Math.random() > 0.5;
        const body = isCircle 
            ? Bodies.circle(x, y, size / 2, {
                restitution: 0.6,
                friction: 0.1,
                render: {
                    fillStyle: colors[Math.floor(Math.random() * colors.length)] + 'cc',
                    strokeStyle: '#ffffff22',
                    lineWidth: 1
                }
              })
            : Bodies.rectangle(x, y, size, size, {
                chamfer: { radius: 10 },
                restitution: 0.5,
                friction: 0.1,
                render: {
                    fillStyle: colors[Math.floor(Math.random() * colors.length)] + 'cc',
                    strokeStyle: '#ffffff22',
                    lineWidth: 1
                }
              });
        
        blocks.push(body);
    }

    Composite.add(engine.world, blocks);

    // Add mouse control
    const mouse = Mouse.create(render.canvas);
    
    // Configure mouse to allow page scrolling
    // We try to remove the wheel listeners that Matter.js binds by default
    if ((mouse as any).mousewheel) {
        (mouse as any).element.removeEventListener("mousewheel", (mouse as any).mousewheel);
        (mouse as any).element.removeEventListener("DOMMouseScroll", (mouse as any).mousewheel);
    }

    const mouseConstraint = MouseConstraint.create(engine, {
      mouse: mouse,
      constraint: {
        stiffness: 0.2,
        render: { visible: false }
      }
    });

    Composite.add(engine.world, mouseConstraint);
    render.mouse = mouse;

    // Spawn block on click (if not dragging)
    // Use Matter.js events for better synchronization with physics state
    Matter.Events.on(mouseConstraint, 'mousedown', (event: any) => {
        const mouseBody = mouseConstraint.body;
        if (mouseBody) return; // We are dragging something

        const { x, y } = event.mouse.position;
        const size = Math.random() * 120 + 30;
        const color = colors[Math.floor(Math.random() * colors.length)];
        
        const isCircle = Math.random() > 0.5;
        const newBody = isCircle 
            ? Bodies.circle(x, y, size / 2, {
                restitution: 0.6,
                render: { fillStyle: color + 'dd' }
              })
            : Bodies.rectangle(x, y, size, size, {
                chamfer: { radius: 8 },
                restitution: 0.5,
                render: { fillStyle: color + 'dd' }
              });
        
        Composite.add(engine.world, newBody);
        
        // Small punch animation
        if (sceneRef.current) {
          gsap.fromTo(sceneRef.current, 
              { scale: 0.995 }, 
              { scale: 1, duration: 0.2, ease: "power2.out" }
          );
        }
    });

    // Run the engine
    const runner = Runner.create();
    Runner.run(runner, engine);
    Render.run(render);

    // GSAP entrance for the whole section
    gsap.fromTo(sceneRef.current, 
      { opacity: 0, y: 50 },
      { opacity: 1, y: 0, duration: 1, scrollTrigger: {
        trigger: sceneRef.current,
        start: "top 80%",
      }}
    );

    // Handle resize
    const handleResize = () => {
        if (!sceneRef.current) return;
        const newWidth = sceneRef.current.clientWidth;
        render.options.width = newWidth;
        render.canvas.width = newWidth;
        
        Matter.Body.setPosition(ground, { x: newWidth / 2, y: height + thickness / 2 });
        Matter.Body.setPosition(rightWall, { x: newWidth + thickness / 2, y: height / 2 });
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      Render.stop(render);
      Engine.clear(engine);
      render.canvas.remove();
      render.textures = {};
    };
  }, []);

  return (
    <section id="playground" className="relative py-24 bg-transparent overflow-hidden">
      <div className="max-w-5xl mx-auto px-6 mb-12">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-12 h-px bg-[var(--color-theme)]" />
          <span className="text-sm font-bold uppercase tracking-[0.3em] text-[var(--color-theme)] glow-text">Interactive</span>
        </div>
        <h2 className="text-6xl md:text-8xl font-black uppercase tracking-tighter hover-scale text-white">
          Physics <span className="text-transparent stroke-text" style={{ WebkitTextStroke: '3px rgba(255,255,255,0.2)' }}>Playground</span>
        </h2>
        <p className="text-zinc-500 mt-6 max-w-xl text-lg">
          Grab, throw, and play with these blocks. A demonstration of real-time physics integration within a high-performance digital environment.
        </p>
      </div>

      <div 
        ref={sceneRef} 
        className="w-full h-[600px] cursor-grab active:cursor-grabbing border-y border-white/5 bg-zinc-950/20 backdrop-blur-sm relative"
        style={{ touchAction: 'pan-y' }}
      >
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-10">
            <span className="text-4xl font-black uppercase tracking-widest text-white">Interact With Gravity</span>
        </div>
      </div>
    </section>
  );
}
