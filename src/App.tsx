/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import Hero from './components/Hero';
import AboutMe from './components/AboutMe';
import Contact from './components/Contact';
import Cursor from './components/Cursor';
import Background from './components/Background';
import Menu from './components/Menu';
import PhysicsPlayground from './components/PhysicsPlayground';

export default function App() {
  return (
    <main className="min-h-screen selection:bg-blue-500 selection:text-white cursor-none">
      <Cursor />
      <Background />
      <Menu />
      
      <div className="relative z-10">
        <Hero />
        <AboutMe />
        <PhysicsPlayground />
        <Contact />
      </div>
      
      <footer className="relative z-10 py-10 bg-zinc-950/50 backdrop-blur-sm text-center text-zinc-600 text-xs font-bold uppercase tracking-[0.4em] border-t border-zinc-900">
        Digital Playground — 2026
      </footer>
    </main>
  );
}
