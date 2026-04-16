import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import { ArrowRight, PlayCircle, Fingerprint, Unlock, Copy, ShieldAlert, Monitor, Cpu, Database, Network, Bolt, EyeOff, Shield } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

export default function Home() {
  const containerRef = useRef();

  useEffect(() => {
    let ctx = gsap.context(() => {
      // Hero reveal
      gsap.from(".gs-reveal-hero", {
        y: 50, opacity: 0, duration: 1, stagger: 0.2, ease: "power3.out", delay: 0.2
      });
      gsap.from(".gs-reveal-right", {
        x: 50, opacity: 0, duration: 1.2, ease: "power3.out", delay: 0.6
      });

      // Scroll Reveal Elements
      const revealElements = gsap.utils.toArray('.gs-reveal:not(.gs-reveal-hero)');
      revealElements.forEach((el) => {
        gsap.from(el, {
          scrollTrigger: {
            trigger: el,
            start: "top 85%",
            toggleActions: "play none none reverse"
          },
          y: 30, opacity: 0, duration: 0.8, ease: "power2.out"
        });
      });

      // Progress line
      const progressLine = document.getElementById('progress-line');
      if(progressLine) {
        ScrollTrigger.create({
          trigger: "#how-it-works",
          start: "top center",
          end: "bottom center",
          onUpdate: (self) => {
            progressLine.style.width = Math.min(self.progress * 120, 90) + "%";
          }
        });
      }

      // Validation logs
      const logs = [
        "VALIDATING: READ REQUEST...",
        "STATUS: ALLOWED",
        "VALIDATING: MEM_COPY_BULK...",
        "STATUS: ANOMALY DETECTED. BLOCKED.",
        "ENFORCELOCK: TRUE",
        "WAITING FOR INPUT..."
      ];
      const logEl = document.getElementById('validation-logs');
      let logIndex = 0;
      let logInterval;
      if(logEl) {
        logInterval = setInterval(() => {
          logEl.textContent = logs[logIndex];
          logEl.style.color = logs[logIndex].includes("BLOCKED") ? "var(--cyber-alert)" : "var(--cyber-neon)";
          logIndex = (logIndex + 1) % logs.length;
        }, 2000);
      }
      return () => { if(logInterval) clearInterval(logInterval); }
    }, containerRef);
    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef}>
      {/* Cyber Grid Background */}
      <div className="fixed inset-0 z-[-1] cyber-bg">
        <div className="absolute inset-0 cyber-grid-pattern"></div>
        <div className="absolute inset-0 bg-cyber-black [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]"></div>
      </div>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center pt-24 pb-12 overflow-hidden" id="hero">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-cyber-accent/20 rounded-full blur-[120px] -z-10 mix-blend-screen opacity-50"></div>
        <div className="container mx-auto px-6 grid md:grid-cols-2 gap-12 items-center">
            <div className="z-10 space-y-8 gs-reveal-hero">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyber-border/30 border border-cyber-neon/30 text-cyber-neon text-xs font-semibold tracking-widest uppercase">
                    <span className="w-2 h-2 rounded-full bg-cyber-neon animate-pulse"></span> Next Gen Hardware Security
                </div>
                <h1 className="text-5xl md:text-7xl font-heading font-extrabold text-white leading-tight">
                    Your Data. <br/>
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyber-neon to-cyber-accent">Never Out Of Control.</span>
                </h1>
                <p className="text-lg md:text-xl text-gray-400 max-w-lg font-light">
                    The world's first hardware-enforced secure USB with behavioral protection. Military-grade encryption meets algorithmic access policies.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 pt-4">
                    <Link to="/purchase" className="px-8 py-4 bg-cyber-neon text-black font-bold rounded hover:bg-white transition-all shadow-[0_0_20px_rgba(0,240,255,0.3)] hover:shadow-[0_0_30px_rgba(0,240,255,0.6)] flex items-center justify-center gap-2">
                        Get Started <ArrowRight className="w-5 h-5"/>
                    </Link>
                    <button className="px-8 py-4 bg-white/5 border border-white/10 text-white font-medium rounded hover:bg-white/10 hover:border-cyber-border transition-all flex items-center justify-center gap-2 backdrop-blur-sm group">
                        <PlayCircle className="w-5 h-5 group-hover:text-cyber-neon transition-colors" /> Watch Demo
                    </button>
                </div>
                <div className="flex items-center gap-4 pt-8 text-sm text-gray-500">
                    <div className="flex -space-x-2">
                        <img className="w-8 h-8 rounded-full border border-cyber-black" src="https://i.pravatar.cc/100?img=1" alt="User" />
                        <img className="w-8 h-8 rounded-full border border-cyber-black" src="https://i.pravatar.cc/100?img=2" alt="User" />
                        <img className="w-8 h-8 rounded-full border border-cyber-black" src="https://i.pravatar.cc/100?img=3" alt="User" />
                    </div>
                    <span>Trusted by 500+ security teams</span>
                </div>
            </div>
            
            <div className="relative flex justify-center items-center h-[500px] gs-reveal-right">
                <div className="absolute inset-0 bg-cyber-neon/10 rounded-full blur-3xl animate-pulse"></div>
                <div className="usb-device-container relative w-48 h-96 floating-animation">
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-16 h-12 bg-gradient-to-b from-gray-300 to-gray-500 rounded-t-sm border-2 border-gray-400 z-10 flex justify-center gap-2 py-2">
                        <div className="w-2 h-3 bg-gray-800 rounded-sm"></div>
                        <div className="w-2 h-3 bg-gray-800 rounded-sm"></div>
                    </div>
                    <div className="absolute top-10 left-0 w-full h-[320px] bg-gradient-to-br from-gray-900 via-gray-800 to-black rounded-xl border border-white/10 shadow-2xl flex flex-col items-center justify-between py-6 overflow-hidden glass-panel">
                        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZD0iTTAgMGg0MHY0MEgweiIgZmlsbD0ibm9uZSIvPjxwb2x5Z29uIHBvaW50cz0iMCAwIDIwIDIwIDAgMjAiIGZpbGw9InJnYmEoMCwyNDAsMjU1LDAuMDUpIi8+PC9zdmc+')] opacity-20"></div>
                        <div className="z-10 w-full px-6 flex flex-col items-center gap-4">
                            <div className="relative w-16 h-16 rounded-full border-2 border-cyber-neon/30 flex items-center justify-center">
                                <div className="w-12 h-12 rounded-full bg-cyber-neon/10 border border-cyber-neon/50"></div>
                                <Fingerprint className="absolute text-cyber-neon w-8 h-8" />
                                <div className="absolute top-0 w-full h-0.5 bg-cyber-neon shadow-[0_0_8px_#00f0ff] scan-line-anim"></div>
                            </div>
                            <div className="flex gap-2">
                                <div className="w-2 h-2 rounded-full bg-cyber-neon shadow-[0_0_10px_#00f0ff] animate-pulse"></div>
                                <div className="w-2 h-2 rounded-full bg-cyber-border"></div>
                                <div className="w-2 h-2 rounded-full bg-cyber-border"></div>
                            </div>
                        </div>
                        <div className="z-10 bg-black/50 w-full py-4 border-y border-white/5 text-center mt-auto">
                            <span className="font-heading font-black tracking-widest text-white text-xl">ARC<span className="text-gray-500 text-sm block tracking-normal font-sans font-normal mt-1">SECURE</span></span>
                        </div>
                    </div>
                    <div className="absolute -bottom-16 left-1/2 -translate-x-1/2 w-64 h-32 bg-cyber-neon/20 rounded-full blur-2xl block-perspective mask-bottom"></div>
                </div>
            </div>
        </div>
      </section>

      {/* Problem Section */}
      <section className="py-24 bg-cyber-dark relative border-y border-white/5" id="problem">
          <div className="container mx-auto px-6">
              <div className="text-center max-w-3xl mx-auto mb-16 gs-reveal">
                  <h2 className="text-cyber-neon font-bold tracking-widest uppercase text-sm mb-3">The Vulnerability</h2>
                  <h3 className="text-4xl md:text-5xl font-heading font-bold text-white mb-6">The Problem with Traditional USB Drives</h3>
                  <p className="text-gray-400 text-lg">Even with military-grade encryption, standard secure drives fail the moment they are unlocked. Once access is granted, your data is at the mercy of the host system.</p>
              </div>

              <div className="grid md:grid-cols-3 gap-8 gs-reveal">
                  <div className="glass-card p-8 rounded-2xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.04] transition-all group">
                      <div className="w-14 h-14 bg-red-500/10 rounded-xl flex items-center justify-center mb-6 border border-red-500/20 group-hover:scale-110 transition-transform">
                          <Unlock className="text-red-400 w-8 h-8" />
                      </div>
                      <h4 className="text-xl font-bold text-white mb-3">Data Exposed on Unlock</h4>
                      <p className="text-gray-400">Once traditional drives are authenticated, data becomes available in raw format to the entire OS, creating a massive attack surface.</p>
                  </div>
                  <div className="glass-card p-8 rounded-2xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.04] transition-all group">
                      <div className="w-14 h-14 bg-orange-500/10 rounded-xl flex items-center justify-center mb-6 border border-orange-500/20 group-hover:scale-110 transition-transform">
                          <Copy className="text-orange-400 w-8 h-8" />
                      </div>
                      <h4 className="text-xl font-bold text-white mb-3">Copying & Cloning</h4>
                      <p className="text-gray-400">Malware or unauthorized users can silently copy, clone, or exfiltrate unlocked files in the background without triggering guards.</p>
                  </div>
                  <div className="glass-card p-8 rounded-2xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.04] transition-all group">
                      <div className="w-14 h-14 bg-purple-500/10 rounded-xl flex items-center justify-center mb-6 border border-purple-500/20 group-hover:scale-110 transition-transform">
                          <ShieldAlert className="text-purple-400 w-8 h-8" />
                      </div>
                      <h4 className="text-xl font-bold text-white mb-3">Encryption is Static</h4>
                      <p className="text-gray-400">Standard AES encryption only protects data at rest. It offers absolutely zero protection when the data is actively in use.</p>
                  </div>
              </div>
          </div>
      </section>

      {/* Solution Section */}
      <section className="py-24 relative overflow-hidden" id="solution">
          <div className="absolute right-0 top-1/4 w-[500px] h-[500px] bg-cyber-neon/10 rounded-full blur-[100px] -z-10 mix-blend-screen"></div>
          <div className="container mx-auto px-6">
              <div className="grid lg:grid-cols-2 gap-16 items-center">
                  <div className="relative h-[600px] rounded-2xl border border-cyber-border bg-cyber-dark/60 backdrop-blur-md p-8 overflow-hidden gs-reveal flex flex-col items-center justify-center box-shadow-neon">
                      <div className="absolute top-0 w-full h-1 bg-gradient-to-r from-transparent via-cyber-neon to-transparent opacity-50"></div>
                      <div className="flex flex-col items-center gap-6 w-full max-w-sm">
                          <div className="w-full bg-white/5 border border-white/10 rounded-lg p-4 flex items-center justify-between shadow-lg backdrop-blur-sm z-10 transition-all hover:bg-white/10">
                              <div className="flex items-center gap-3">
                                  <Monitor className="text-gray-400 w-5 h-5"/>
                                  <span className="text-white font-medium text-sm">Host System Request</span>
                              </div>
                          </div>
                          <div className="w-full p-6 pb-4 border-2 border-cyber-neon/50 rounded-xl bg-cyber-neon/5 relative">
                              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-cyber-black px-4 text-xs text-cyber-neon font-bold tracking-wider rounded-full">
                                  ARC SECURE BOUNDARY
                              </div>
                              <div className="w-full bg-cyber-dark border border-cyber-border rounded-lg p-4 flex flex-col items-center shadow-[0_0_15px_rgba(0,240,255,0.2)] mb-6 pulse-border relative z-10">
                                  <div className="text-cyber-neon text-right w-full text-[10px] mb-2 font-mono" id="validation-logs">VALIDATING...</div>
                                  <Cpu className="w-10 h-10 text-cyber-neon mb-2" />
                                  <span className="text-white font-bold text-sm">Hardware Policy Engine</span>
                                  <span className="text-gray-400 text-xs text-center mt-1">Rule: Read-Only. No Copy.</span>
                              </div>
                              <div className="flex justify-center h-12 relative overflow-hidden">
                                  <div className="w-1 h-full bg-cyber-border relative">
                                      <div className="absolute top-0 w-full h-1/3 bg-cyber-neon animate-data-stream"></div>
                                  </div>
                              </div>
                              <div className="w-full bg-gray-900 border border-white/10 rounded-lg p-4 flex items-center justify-center gap-3 mt-2">
                                  <Database className="text-gray-500 w-5 h-5"/>
                                  <span className="text-gray-300 font-medium text-sm">AES-256 Memory</span>
                              </div>
                          </div>
                      </div>
                  </div>

                  <div className="z-10 gs-reveal">
                      <h2 className="text-cyber-neon font-bold tracking-widest uppercase text-sm mb-3">The Paradigm Shift</h2>
                      <h3 className="text-4xl md:text-5xl font-heading font-bold text-white mb-6">Meet ARC Drive</h3>
                      <p className="text-gray-400 text-lg mb-8 leading-relaxed">
                          ARC Drive fundamentally changes data security by shifting access control from the software layer to a dedicated on-board hardware policy engine. 
                      </p>
                      <ul className="space-y-6">
                          <li className="flex gap-4 items-start">
                              <div className="w-10 h-10 rounded-full bg-cyber-neon/10 border border-cyber-border flex items-center justify-center shrink-0 mt-1">
                                  <EyeOff className="text-cyber-neon w-5 h-5"/>
                              </div>
                              <div>
                                  <h4 className="text-white font-bold text-lg">Never Exposes Raw Memory</h4>
                                  <p className="text-gray-400 text-sm mt-1">Data is streamed conditionally through the Policy Engine instead of mounting as standard storage.</p>
                              </div>
                          </li>
                          <li className="flex gap-4 items-start">
                              <div className="w-10 h-10 rounded-full bg-cyber-neon/10 border border-cyber-border flex items-center justify-center shrink-0 mt-1">
                                  <Network className="text-cyber-neon w-5 h-5"/>
                              </div>
                              <div>
                                  <h4 className="text-white font-bold text-lg">Works Independently of OS</h4>
                                  <p className="text-gray-400 text-sm mt-1">No software drivers needed. Security policies are enforced at the hardware level.</p>
                              </div>
                          </li>
                          <li className="flex gap-4 items-start">
                              <div className="w-10 h-10 rounded-full bg-cyber-neon/10 border border-cyber-border flex items-center justify-center shrink-0 mt-1">
                                  <Bolt className="text-cyber-neon w-5 h-5"/>
                              </div>
                              <div>
                                  <h4 className="text-white font-bold text-lg">Behavior-Based Security</h4>
                                  <p className="text-gray-400 text-sm mt-1">Detects and blocks anomalous activities in real-time.</p>
                              </div>
                          </li>
                      </ul>
                  </div>
              </div>
          </div>
      </section>
      
      {/* Shortened rest for React conversion (Features, CTA) */}
      <section className="py-24 bg-cyber-dark relative border-y border-white/5" id="features">
        <div className="container mx-auto px-6 text-center">
            <h2 className="text-cyber-neon font-bold tracking-widest uppercase text-sm mb-3">Capabilities</h2>
            <h3 className="text-3xl md:text-4xl font-heading font-bold text-white mb-12">Core Features</h3>
            <div className="grid md:grid-cols-3 gap-6 gs-reveal">
                {[
                  { icon: Cpu, iColor: 'text-cyber-neon', title: 'Hardware Policy Engine', desc: 'A dedicated RISC-V coprocessor evaluating I/O requests.' },
                  { icon: Shield, iColor: 'text-cyber-neon', title: 'AES-256 Encrypted', desc: 'Military-grade hardware encryption.' },
                  { icon: ShieldAlert, iColor: 'text-cyber-neon', title: 'Tamper Detection', desc: 'Secure wiping of keys upon case intrusion.' }
                ].map((ft, idx) => (
                  <div key={idx} className="bg-white/[0.02] border border-white/5 p-6 rounded-2xl hover:bg-white/[0.04] transition-all">
                      <ft.icon className={`w-8 h-8 ${ft.iColor} mb-4 mx-auto`} />
                      <h4 className="text-white font-bold text-lg mb-2">{ft.title}</h4>
                      <p className="text-gray-400 text-sm">{ft.desc}</p>
                  </div>
                ))}
            </div>
        </div>
      </section>

      <section className="py-32 relative text-center">
        <h2 className="text-5xl font-heading font-black text-white mb-6">Take Back Control.</h2>
        <Link to="/purchase" className="btn-primary inline-flex gap-2 items-center text-lg px-8 py-3">
            Secure Your Data Today <ArrowRight />
        </Link>
      </section>

    </div>
  );
}
