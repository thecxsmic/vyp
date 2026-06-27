"use client";

import { useState, useEffect, useRef } from 'react';
import { 
  Zap, Target, TrendingUp, Search, Cpu, ArrowRight, Check, Play, Sparkles, 
  Clock, Star, ArrowUpRight, HelpCircle, ChevronDown, Monitor, 
  BarChart3, Users, BookOpen, RefreshCw, Terminal, Eye, AlertCircle,
  Menu, X
} from 'lucide-react';
import DemoDashboard from '../components/DemoDashboard';

export default function LandingPage() {
  // Navigation scroll state
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  // Custom cursor states
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [ringPos, setRingPos] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const [isMobile, setIsMobile] = useState(false);


  
  // Pricing counter states (animated)
  const [priceDisplay, setPriceDisplay] = useState(499);
  
  // FAQ state
  const [openFaq, setOpenFaq] = useState(null);

  // Terminal scanner states
  const [terminalNiche, setTerminalNiche] = useState('SaaS & Tech');
  const [terminalLogs, setTerminalLogs] = useState([]);
  const [isScanning, setIsScanning] = useState(false);
  const [scanResultReady, setScanResultReady] = useState(false);
  const [scanResultData, setScanResultData] = useState(null);
  
  // Countdown Timer states
  const [timeLeft, setTimeLeft] = useState({ hours: 23, minutes: 47, seconds: 12 });

  // Refs for tilt card
  const heroCardRef = useRef(null);
  const [cardTransform, setCardTransform] = useState('');
  
  // Ref for canvas particle background
  const canvasRef = useRef(null);

  // Detect mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Custom cursor handler
  useEffect(() => {
    if (isMobile) return;
    
    const onMouseMove = (e) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', onMouseMove);

    // Add hover states to interactables
    const addHoverListeners = () => {
      const elements = document.querySelectorAll('button, a, .interactive-card, [role="button"]');
      elements.forEach(el => {
        el.addEventListener('mouseenter', () => setIsHovering(true));
        el.addEventListener('mouseleave', () => setIsHovering(false));
      });
    };

    addHoverListeners();
    // Re-apply listeners if DOM updates
    const observer = new MutationObserver(addHoverListeners);
    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      observer.disconnect();
    };
  }, [isMobile]);

  // Smooth ring follow effect
  useEffect(() => {
    if (isMobile) return;
    let animId;
    const followMouse = () => {
      setRingPos(prev => {
        const dx = mousePos.x - prev.x;
        const dy = mousePos.y - prev.y;
        return {
          x: prev.x + dx * 0.12,
          y: prev.y + dy * 0.12
        };
      });
      animId = requestAnimationFrame(followMouse);
    };
    animId = requestAnimationFrame(followMouse);
    return () => cancelAnimationFrame(animId);
  }, [mousePos, isMobile]);

  // Navigation scroll listener
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Countdown timer handler
  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        } else if (prev.hours > 0) {
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        } else {
          // Reset countdown to preserve UI action
          return { hours: 23, minutes: 59, seconds: 59 };
        }
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Animate pricing on mount
  useEffect(() => {
    let startTime = null;
    const duration = 1200; // ms
    const startPrice = 199;
    const targetPrice = 499;
    
    const animate = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(startPrice + (targetPrice - startPrice) * ease);
      setPriceDisplay(current);
      
      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };
    
    requestAnimationFrame(animate);
  }, []);

  // Canvas particle background
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let W, H;
    let particles = [];
    
    const initCanvas = () => {
      W = canvas.width = window.innerWidth;
      H = canvas.height = window.innerHeight;
      particles = [];
      const particleCount = Math.min(Math.floor(W / 15), 80);
      
      for (let i = 0; i < particleCount; i++) {
        particles.push({
          x: Math.random() * W,
          y: Math.random() * H,
          vx: (Math.random() - 0.5) * 0.3,
          vy: (Math.random() - 0.5) * 0.3,
          r: Math.random() * 1.5 + 0.5,
          color: Math.random() < 0.7 ? '200, 241, 53' : '61, 255, 192', // Volt or Mint
          alpha: Math.random() * 0.2 + 0.05
        });
      }
    };

    initCanvas();
    window.addEventListener('resize', initCanvas);

    let animId;
    const draw = () => {
      ctx.clearRect(0, 0, W, H);
      
      // Update & Draw particles
      particles.forEach((p, idx) => {
        p.x += p.vx;
        p.y += p.vy;
        
        if (p.x < 0) p.x = W;
        if (p.x > W) p.x = 0;
        if (p.y < 0) p.y = H;
        if (p.y > H) p.y = 0;
        
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${p.color}, ${p.alpha})`;
        ctx.fill();
        
        // Connections
        for (let j = idx + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dx = p.x - p2.x;
          const dy = p.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          
          if (dist < 130) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            const connectionAlpha = 0.08 * (1 - dist / 130);
            ctx.strokeStyle = `rgba(200, 241, 53, ${connectionAlpha})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      });
      
      animId = requestAnimationFrame(draw);
    };
    
    draw();
    return () => {
      window.removeEventListener('resize', initCanvas);
      cancelAnimationFrame(animId);
    };
  }, []);

  // Card 3D tilt effect handler
  const handleCardMouseMove = (e) => {
    const card = heroCardRef.current;
    if (!card) return;
    
    const rect = card.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    
    const px = (e.clientX - cx) / (rect.width / 2); // -1 to 1
    const py = (e.clientY - cy) / (rect.height / 2); // -1 to 1
    
    const rotateX = py * -10; // degrees max
    const rotateY = px * 10;
    
    setCardTransform(`perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`);
  };

  const handleCardMouseLeave = () => {
    setCardTransform('perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)');
  };

  // Niche Scanner simulator calling backend API
  const runNicheScanner = () => {
    if (isScanning) return;
    
    setIsScanning(true);
    setScanResultReady(false);
    setTerminalLogs([]);
    
    const rawLogs = [
      { msg: `Initializing scan parameters for niche: "${terminalNiche}"...`, delay: 100 },
      { msg: "Connecting to global YouTube API node cluster...", delay: 600 },
      { msg: "Scraping competitor channels within database segment [v3.0.4]...", delay: 1100 },
      { msg: "Analyzing Content DNA and calculating subscriber growth vectors...", delay: 1700 },
      { msg: "Parsing vector database (Zilliz/Milvus) for semantic matching...", delay: 2400 },
      { msg: "Applying AI virality ranking algorithm (@/lib/ranking/virality)...", delay: 3100 },
      { msg: "Finalizing content blueprints and growth vectors...", delay: 3800 }
    ];
    
    rawLogs.forEach((log) => {
      setTimeout(() => {
        setTerminalLogs(prev => [...prev, log.msg]);
      }, log.delay);
    });

    // Call REST API
    fetch(`/api/trends?niche=${encodeURIComponent(terminalNiche)}`)
      .then(res => res.json())
      .then(data => {
        setTimeout(() => {
          setIsScanning(false);
          setScanResultReady(true);
          
          // Format API response into UI data shape
          const trends = data.insights.emergingTrends.map(item => ({
            topic: item.topic,
            score: item.viralScore,
            estViews: item.estimatedViews,
            difficulty: item.difficulty
          }));
          const wins = data.insights.quickWins.map(item => ({
            title: item.idea,
            why: item.why,
            effort: item.effort
          }));
          
          setScanResultData({ trends, wins });
        }, 4300);
      })
      .catch(err => {
        console.error("Scraper API Error", err);
        setTimeout(() => {
          setIsScanning(false);
          setTerminalLogs(prev => [
            ...prev, 
            "[ERROR] Scraping pipeline failed to reach backend API node cluster."
          ]);
        }, 4300);
      });
  };

  // Pre-load default terminal log on mount
  useEffect(() => {
    setTerminalLogs([
      "System idle. Select niche and click 'Scan Niche' to initiate scraping pipeline...",
      "Ready to scrape video benchmarks, tags, and psychological hooks."
    ]);
  }, []);

  return (
    <div className="relative min-h-screen w-full overflow-x-hidden">
      {/* Custom Pointer following ring (hidden on mobile) */}
      {!isMobile && (
        <>
          <div 
            className="fixed w-3 h-3 bg-brand-volt rounded-full pointer-events-none z-[9999] -translate-x-1/2 -translate-y-1/2 transition-transform duration-100 ease-out mix-blend-difference"
            style={{ left: `${mousePos.x}px`, top: `${mousePos.y}px`, transform: `translate(-50%, -50%) scale(${isHovering ? 1.8 : 1})` }}
          />
          <div 
            className="fixed w-10 h-10 border border-brand-volt/40 rounded-full pointer-events-none z-[9998] -translate-x-1/2 -translate-y-1/2 transition-transform duration-300 ease-out"
            style={{ 
              left: `${ringPos.x}px`, 
              top: `${ringPos.y}px`, 
              transform: `translate(-50%, -50%) scale(${isHovering ? 1.5 : 1})`,
              borderColor: isHovering ? 'rgba(200, 241, 53, 0.7)' : 'rgba(200, 241, 53, 0.3)'
            }}
          />
        </>
      )}

      {/* Floating blur orbs - Visual background accent */}
      <div className="absolute top-[10%] right-[10%] w-96 h-96 bg-brand-volt/5 rounded-full filter blur-[100px] pointer-events-none animate-pulse-slow z-0" />
      <div className="absolute top-[40%] left-[5%] w-[450px] h-[450px] bg-brand-mint/4 rounded-full filter blur-[120px] pointer-events-none animate-spin-slow z-0" />
      <div className="absolute bottom-[15%] right-[5%] w-[350px] h-[350px] bg-brand-rose/4 rounded-full filter blur-[90px] pointer-events-none animate-pulse-slow z-0" />

      {/* Dynamic particles and tech Grid overlay */}
      <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-0 opacity-70" />
      <div className="fixed inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.015)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.015)_1px,transparent_1px)] bg-[size:4.5rem_4.5rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none z-0" />
      
      {/* Background grain texture */}
      <div className="bg-grain" />

      {/* ── HEADER (GLASSMORPHIC FLOATING ISLAND) ── */}
      <header className="fixed top-0 left-0 right-0 w-full max-w-[100vw] z-50 px-3 sm:px-4 md:px-8 py-4 transition-all duration-300">
        <div className={`max-w-5xl w-full mx-auto px-4 sm:px-6 py-3 flex flex-col lg:flex-row lg:items-center justify-between gap-0 lg:gap-4 rounded-2xl bg-black/85 border ${scrolled ? 'border-brand-volt/20 shadow-[0_8px_32px_rgba(200,241,53,0.05)]' : 'border-white/[0.08] shadow-[0_8px_32px_rgba(0,0,0,0.8)]'} backdrop-blur-md transition-[border-color,background-color,box-shadow] duration-200`}>
          <div className="flex items-center justify-between w-full lg:w-auto py-1">
            {/* Logo */}
            <a href="#" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-2 group">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-brand-volt via-[#dff453] to-brand-mint p-[1.5px] shadow-[0_0_15px_rgba(200,241,53,0.2)] group-hover:shadow-[0_0_25px_rgba(200,241,53,0.4)] transition-all">
                <div className="w-full h-full bg-black rounded-[6px] flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-brand-volt group-hover:rotate-12 transition-transform duration-300" />
                </div>
              </div>
              <span className="font-display font-extrabold text-lg text-white tracking-tight">VYRON</span>
            </a>

            {/* Hamburger menu button for mobile */}
            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden flex items-center justify-center p-2 rounded-full border border-zinc-800 text-zinc-400 hover:text-white bg-zinc-950/40 hover:bg-zinc-900 transition-all cursor-pointer focus:outline-none"
            >
              {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>
          </div>

          {/* Links */}
          <nav className={`${mobileMenuOpen ? 'flex' : 'hidden'} lg:flex flex-col lg:flex-row items-start lg:items-center gap-4 lg:gap-8 text-[11px] font-bold uppercase tracking-wider text-zinc-400 w-full lg:w-auto pt-4 pb-2 lg:py-0 border-t border-zinc-900 lg:border-t-0`}>
            <a href="#features" onClick={() => setMobileMenuOpen(false)} className="hover:text-white transition-colors relative group py-1 w-full lg:w-auto">
              Features
              <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-brand-volt transition-all group-hover:w-full hidden lg:block" />
            </a>
            <a href="#demo" onClick={() => setMobileMenuOpen(false)} className="hover:text-white transition-colors relative group py-1 w-full lg:w-auto">
              Live Demo
              <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-brand-volt transition-all group-hover:w-full hidden lg:block" />
            </a>
            <a href="#scanner" onClick={() => setMobileMenuOpen(false)} className="hover:text-white transition-colors relative group py-1 w-full lg:w-auto">
              Radar Terminal
              <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-brand-volt transition-all group-hover:w-full hidden lg:block" />
            </a>
            <a href="#pricing" onClick={() => setMobileMenuOpen(false)} className="hover:text-white transition-colors relative group py-1 w-full lg:w-auto">
              Pricing
              <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-brand-volt transition-all group-hover:w-full hidden lg:block" />
            </a>
          </nav>

          {/* Action Button */}
          <div className={`${mobileMenuOpen ? 'block' : 'hidden'} lg:block w-full lg:w-auto pt-2 pb-1 lg:py-0`}>
            <a href="#pricing" onClick={() => setMobileMenuOpen(false)} className="relative inline-flex items-center justify-center p-0.5 overflow-hidden text-[11px] font-bold uppercase tracking-wider text-black rounded-full group bg-gradient-to-br from-brand-volt to-brand-mint group-hover:from-brand-volt group-hover:to-brand-mint hover:text-black dark:text-white focus:ring-4 focus:outline-none focus:ring-lime-800 transition-all duration-300 w-full lg:w-auto">
              <span className="relative px-5 py-2 transition-all ease-in duration-75 bg-brand-volt rounded-full group-hover:bg-opacity-0 group-hover:text-white text-black font-extrabold flex items-center justify-center gap-1.5 w-full lg:w-auto">
                Start Trial <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </a>
          </div>
        </div>
      </header>

      {/* ── HERO SECTION ── */}
      <section className="relative z-10 pt-32 pb-24 md:pt-40 md:pb-36 px-4 md:px-8 max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-6 lg:gap-8 items-center">
        {/* Hero Info */}
        <div className="md:col-span-6 lg:col-span-7 flex flex-col items-start text-left">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-brand-volt/10 border border-brand-volt/20 px-3.5 py-1.5 rounded-full mb-8 shadow-[0_0_15px_rgba(200,241,53,0.03)]">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-volt opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-volt"></span>
            </span>
            <span className="text-[10px] font-black uppercase tracking-widest text-brand-volt">v3.0 Live Intelligence</span>
          </div>

          {/* Main Title */}
          <h1 className="font-display font-extrabold text-5xl md:text-4xl lg:text-5xl xl:text-7xl leading-[1.0] tracking-tight text-white mb-4 md:mb-6">
            Outrank.<br/>
            Outsmart.<br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-volt via-[#d8f553] to-brand-mint drop-shadow-[0_0_15px_rgba(200,241,53,0.1)] text-glow-volt">
              Outgrow.
            </span>
          </h1>

          {/* Description */}
          <p className="text-zinc-400 text-base md:text-xs lg:text-sm xl:text-base leading-relaxed max-w-xl mb-6 md:mb-8 xl:mb-10 font-normal">
            Vyron continuously scans competitor channels, scores emerging trends, and parses custom YouTube data via semantic vector structures. Master your niche before competitors realize the trend exists.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-4 w-full sm:w-auto">
            <a 
              href="#pricing"
              className="w-full sm:w-auto px-6 md:px-5 lg:px-8 py-3 md:py-2.5 lg:py-4 bg-brand-volt hover:bg-[#d6fb3a] text-black font-extrabold text-sm md:text-xs lg:text-sm uppercase tracking-wider rounded-xl transition-all shadow-[0_0_30px_rgba(200,241,53,0.25)] hover:shadow-[0_0_40px_rgba(200,241,53,0.45)] hover:-translate-y-0.5 text-center flex items-center justify-center gap-2"
            >
              Get Started Free <ArrowRight className="w-4 h-4" />
            </a>
            <a 
              href="#demo"
              className="w-full sm:w-auto px-6 md:px-5 lg:px-8 py-3 md:py-2.5 lg:py-4 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 hover:border-zinc-700 text-white font-extrabold text-sm md:text-xs lg:text-sm uppercase tracking-wider rounded-xl transition-all text-center flex items-center justify-center gap-2 hover:-translate-y-0.5"
            >
              <Play className="w-4 h-4 fill-white" /> Watch Demo
            </a>
          </div>

          {/* Quick Stats banner */}
          <div className="mt-8 md:mt-4 lg:mt-6 xl:mt-12 pt-6 md:pt-3 lg:pt-4 xl:pt-8 border-t border-zinc-900 w-full grid grid-cols-3 gap-4 md:gap-2 lg:gap-3 xl:gap-6 text-left">
            <div>
              <p className="font-mono text-xl md:text-base lg:text-lg xl:text-2xl font-bold text-white tracking-tight">48K+</p>
              <p className="text-[10px] uppercase font-bold text-zinc-500 tracking-wider">Channels Scraped</p>
            </div>
            <div>
              <p className="font-mono text-xl md:text-base lg:text-lg xl:text-2xl font-bold text-white tracking-tight">1.5 hr</p>
              <p className="text-[10px] uppercase font-bold text-zinc-500 tracking-wider">Trend Scan Cycle</p>
            </div>
            <div>
              <p className="font-mono text-xl md:text-base lg:text-lg xl:text-2xl font-bold text-white tracking-tight">94.8%</p>
              <p className="text-[10px] uppercase font-bold text-zinc-500 tracking-wider">Score Accuracy</p>
            </div>
          </div>
        </div>

        {/* Hero Visual Card (3D Tilt Widget) */}
        <div className="md:col-span-6 lg:col-span-5 flex items-center justify-center relative">
          <div 
            ref={heroCardRef}
            onMouseMove={handleCardMouseMove}
            onMouseLeave={handleCardMouseLeave}
            className="w-full max-w-[360px] lg:max-w-[420px] rounded-3xl p-4 lg:p-6 glass-panel-glow relative overflow-hidden transition-all duration-200"
            style={{ 
              transform: cardTransform,
              boxShadow: '0 25px 60px rgba(0,0,0,0.8), 0 0 40px rgba(200,241,53,0.06)'
            }}
          >
            {/* Top decorative accent bar */}
            <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-brand-volt to-brand-mint opacity-85" />
            
            {/* Header info */}
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-zinc-900">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-brand-volt animate-pulse" />
                <span className="font-mono text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Growth Analytics</span>
              </div>
              <span className="font-mono text-[9px] font-black text-brand-mint bg-brand-mint/10 border border-brand-mint/20 px-2 py-0.5 rounded">LIVE ACTIVE</span>
            </div>

            {/* Channels metrics */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-zinc-950/60 border border-white/[0.03] p-4 rounded-2xl relative overflow-hidden group hover:border-brand-volt/20 transition-colors">
                <p className="text-[9px] font-bold text-zinc-500 uppercase tracking-wider mb-1">Subscriber Net</p>
                <p className="font-display font-extrabold text-2xl text-white">48,250</p>
                <p className="text-[10px] text-brand-volt font-bold mt-1">↑ +2.1% today</p>
                <div className="absolute bottom-0 right-0 w-8 h-8 bg-brand-volt/[0.02] rounded-tl-2xl" />
              </div>
              <div className="bg-zinc-950/60 border border-white/[0.03] p-4 rounded-2xl relative overflow-hidden group hover:border-brand-mint/20 transition-colors">
                <p className="text-[9px] font-bold text-zinc-500 uppercase tracking-wider mb-1">Virality Index</p>
                <p className="font-display font-extrabold text-2xl text-white">92.4 <span className="text-xs text-brand-mint">/100</span></p>
                <p className="text-[10px] text-brand-mint font-bold mt-1">↑ Strong Surge</p>
                <div className="absolute bottom-0 right-0 w-8 h-8 bg-brand-mint/[0.02] rounded-tl-2xl" />
              </div>
            </div>

            {/* Glowing Chart Simulation */}
            <div className="mb-6">
              <div className="flex justify-between items-center mb-2">
                <span className="text-[9px] font-bold text-zinc-500 uppercase tracking-wider">Weekly View Volume</span>
                <span className="text-[9px] font-mono text-zinc-400">Total: 3.4M</span>
              </div>
              <div className="h-28 flex items-end justify-between gap-1.5 pt-4 pb-2 relative border-b border-zinc-900">
                {/* Simulated Chart Bars with scaling delays */}
                {[30, 48, 35, 62, 55, 75, 68, 88, 98, 72, 85, 95].map((val, idx) => (
                  <div key={idx} className="flex-1 flex flex-col items-center h-full justify-end group">
                    {/* Tooltip on hover */}
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-brand-volt text-black text-[8px] font-black px-1 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10 whitespace-nowrap">
                      +{val}%
                    </div>
                    {/* Bar */}
                    <div 
                      className="w-full bg-brand-volt/10 group-hover:bg-brand-volt/30 border-t border-brand-volt/30 rounded-t-[2px] transition-all duration-500 cursor-pointer origin-bottom"
                      style={{ 
                        height: `${val}%`, 
                        animationDelay: `${idx * 0.05}s`
                      }} 
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Hot topics block */}
            <div className="space-y-2">
              <p className="text-[9px] font-bold text-zinc-500 uppercase tracking-wider mb-2">Topic Velocity Alerts</p>
              
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-zinc-950/40 border border-white/[0.03] hover:border-zinc-800 transition-colors">
                <div className="flex items-center gap-2.5">
                  <div className="w-6 h-6 rounded-lg bg-red-500/10 flex items-center justify-center text-xs">🔥</div>
                  <div>
                    <p className="text-[11px] font-bold text-white">AI Agents 2026</p>
                    <p className="text-[8px] text-zinc-500 font-medium">Scraped 3m ago · Tech</p>
                  </div>
                </div>
                <span className="text-[9px] font-mono font-black text-brand-rose bg-brand-rose/10 border border-brand-rose/20 px-2 py-0.5 rounded">VIRAL</span>
              </div>

              <div className="flex items-center justify-between p-2.5 rounded-xl bg-zinc-950/40 border border-white/[0.03] hover:border-zinc-800 transition-colors">
                <div className="flex items-center gap-2.5">
                  <div className="w-6 h-6 rounded-lg bg-brand-volt/10 flex items-center justify-center text-xs">🚀</div>
                  <div>
                    <p className="text-[11px] font-bold text-white">Milvus Vector Database</p>
                    <p className="text-[8px] text-zinc-500 font-medium">Scraped 15m ago · Dev</p>
                  </div>
                </div>
                <span className="text-[9px] font-mono font-black text-brand-volt bg-brand-volt/10 border border-brand-volt/20 px-2 py-0.5 rounded">+147%</span>
              </div>
            </div>
          </div>

          {/* Layered floating metric badge 1 (Top-Right) - visible on lg screens and up */}
          <div className="hidden lg:flex items-center gap-2.5 p-3 rounded-full bg-zinc-950/90 border border-brand-volt/20 shadow-[0_15px_30px_rgba(0,0,0,0.8)] absolute -top-6 lg:-right-2 xl:-right-16 scale-90 xl:scale-100 z-25 backdrop-blur-md transition-all duration-300 hover:-translate-y-1">
            <div className="w-5 h-5 rounded-full bg-brand-volt/10 flex items-center justify-center text-[10px]">📈</div>
            <div>
              <p className="text-[8px] text-zinc-500 font-bold uppercase tracking-widest leading-none">Niche Gap</p>
              <p className="text-[10px] font-black text-white leading-none mt-0.5">+28.4% CPM</p>
            </div>
          </div>

          {/* Layered floating audit card 2 (Bottom-Right) - visible on lg screens and up */}
          <div className="hidden lg:flex flex-col gap-2.5 p-4 rounded-2xl bg-zinc-950/90 border border-brand-mint/20 shadow-[0_20px_40px_rgba(0,0,0,0.9)] absolute -bottom-10 lg:-right-2 xl:-right-8 w-52 scale-90 xl:scale-100 z-25 backdrop-blur-md transition-all duration-300 hover:-translate-y-1 text-left">
            <div className="flex items-center justify-between">
              <span className="text-[8px] font-mono font-bold text-zinc-400 uppercase tracking-widest">Competitor DNA</span>
              <span className="w-1.5 h-1.5 rounded-full bg-brand-mint animate-pulse" />
            </div>
            <div>
              <p className="text-[8px] text-zinc-500 uppercase font-black tracking-wider leading-none">Velocity Score</p>
              <div className="flex items-baseline gap-1 mt-0.5">
                <span className="text-base font-display font-extrabold text-white">88.2</span>
                <span className="text-[8px] font-bold text-brand-mint">↑ +14%</span>
              </div>
            </div>
            <div className="space-y-1">
              <div className="flex justify-between text-[7px] font-mono text-zinc-500 leading-none">
                <span>QUEUE</span>
                <span>94%</span>
              </div>
              <div className="w-full h-1 bg-zinc-900 rounded-full overflow-hidden">
                <div className="h-full bg-brand-mint rounded-full" style={{ width: '94%' }} />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── LIVE INTERACTIVE SCALING TICKER ── */}
      <section className="border-y border-zinc-900 bg-black/40 backdrop-blur-sm py-4 overflow-hidden relative z-10">
        <div className="marquee-track flex gap-16 whitespace-nowrap flex-row w-max">
          <div className="flex gap-16 text-zinc-500 font-mono text-[11px] font-bold uppercase tracking-wider">
            <span>🚀 <strong className="text-brand-volt">48.2K</strong> channels scanned daily</span>
            <span>✦</span>
            <span>⚡ <strong className="text-white">Trend Radar</strong> cycle runs hourly</span>
            <span>✦</span>
            <span>📊 <strong className="text-brand-mint">3.4M+</strong> data points processed</span>
            <span>✦</span>
            <span>🔥 <strong className="text-brand-rose">Competitor Matrix</strong> 50+ key niches mapped</span>
            <span>✦</span>
            <span>🎯 <strong className="text-white">Milvus Integration</strong> semantic search</span>
          </div>
          <div className="flex gap-16 text-zinc-500 font-mono text-[11px] font-bold uppercase tracking-wider">
            <span>🚀 <strong className="text-brand-volt">48.2K</strong> channels scanned daily</span>
            <span>✦</span>
            <span>⚡ <strong className="text-white">Trend Radar</strong> cycle runs hourly</span>
            <span>✦</span>
            <span>📊 <strong className="text-brand-mint">3.4M+</strong> data points processed</span>
            <span>✦</span>
            <span>🔥 <strong className="text-brand-rose">Competitor Matrix</strong> 50+ key niches mapped</span>
            <span>✦</span>
            <span>🎯 <strong className="text-white">Milvus Integration</strong> semantic search</span>
          </div>
        </div>
      </section>

      {/* ── LIVE DEMO PREVIEW (INTEGRATED INTERACTIVE COMPONENT) ── */}
      <section id="demo" className="relative z-10 py-20 px-4 md:px-8 max-w-7xl mx-auto scroll-mt-20">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 bg-brand-mint/10 border border-brand-mint/20 px-3.5 py-1.5 rounded-full mb-4">
            <Sparkles className="w-3.5 h-3.5 text-brand-mint" />
            <span className="text-[10px] font-black uppercase tracking-widest text-brand-mint">Dynamic Simulator</span>
          </div>
          <h2 className="font-display font-extrabold text-3.5xl md:text-5xl tracking-tight text-white mb-4">
            Explore the Vyron Intelligence Console
          </h2>
          <p className="text-zinc-400 text-sm leading-relaxed max-w-md mx-auto">
            Interact with our simulated live interface. Explore trends, check competitor data, and see how our vector ranking model scores content.
          </p>
        </div>

        {/* Browser wrapper mockup */}
        <div className="w-full rounded-2xl border border-zinc-800/80 bg-zinc-950/80 shadow-[0_30px_70px_rgba(0,0,0,0.8)] overflow-hidden">
          <DemoDashboard />
        </div>
      </section>

      {/* ── INTERACTIVE NICHE RADAR TERMINAL ── */}
      <section id="scanner" className="relative z-10 py-16 px-4 md:px-8 max-w-7xl mx-auto scroll-mt-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Info Column */}
          <div className="lg:col-span-5 text-left">
            <div className="inline-flex items-center gap-2 bg-brand-volt/10 border border-brand-volt/20 px-3.5 py-1.5 rounded-full mb-4">
              <Terminal className="w-3.5 h-3.5 text-brand-volt" />
              <span className="text-[10px] font-black uppercase tracking-widest text-brand-volt">Automated Scraper</span>
            </div>
            <h2 className="font-display font-extrabold text-3.5xl md:text-4.5xl tracking-tight text-white mb-4">
              Trigger a Live Niche Analysis
            </h2>
            <p className="text-zinc-400 text-sm leading-relaxed mb-6 font-normal">
              Select a content vertical and trigger our simulated automated analysis engine. Watch how Vyron maps keywords, scores virality metrics, and produces content recommendations in real time.
            </p>

            {/* Niche selectors */}
            <div className="space-y-3 mb-8">
              <label className="text-[10px] font-extrabold uppercase text-zinc-500 tracking-wider">Choose target niche:</label>
              <div className="grid grid-cols-2 gap-2">
                {['SaaS & Tech', 'Finance & Crypto', 'Gaming & Tech', 'Fitness & Lifestyle'].map((niche) => (
                  <button
                    key={niche}
                    onClick={() => {
                      setTerminalNiche(niche);
                      setScanResultReady(false);
                      setTerminalLogs([`Niche changed to "${niche}". Ready to scan.`]);
                    }}
                    className={`px-4 py-2.5 rounded-xl font-bold text-[11px] uppercase tracking-wider text-left transition-all border ${
                      terminalNiche === niche
                        ? 'bg-brand-volt text-black border-brand-volt shadow-[0_0_15px_rgba(200,241,53,0.15)] font-black'
                        : 'bg-zinc-950/40 text-zinc-400 border-zinc-800/60 hover:border-zinc-700 hover:text-white'
                    }`}
                  >
                    {niche}
                  </button>
                ))}
              </div>
            </div>

            {/* Run Button */}
            <button
              onClick={runNicheScanner}
              disabled={isScanning}
              className={`w-full py-4 rounded-xl text-sm font-extrabold uppercase tracking-wider transition-all flex items-center justify-center gap-2 ${
                isScanning
                  ? 'bg-zinc-800 text-zinc-500 cursor-not-allowed border border-transparent'
                  : 'bg-white text-black hover:bg-zinc-200 shadow-xl hover:-translate-y-0.5'
              }`}
            >
              {isScanning ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" /> Scanning Database...
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 fill-black" /> Run Scraper Command
                </>
              )}
            </button>
          </div>

          {/* Terminal Console Column */}
          <div className="lg:col-span-7">
            <div className="w-full rounded-2xl border border-zinc-800/70 bg-zinc-950/90 shadow-[0_20px_50px_rgba(0,0,0,0.7)] font-mono overflow-hidden">
              {/* Console header */}
              <div className="flex items-center justify-between bg-zinc-900 px-4 py-3 border-b border-zinc-800">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-red-500" />
                  <div className="w-2.5 h-2.5 rounded-full bg-yellow-500" />
                  <div className="w-2.5 h-2.5 rounded-full bg-green-500" />
                </div>
                <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider flex items-center gap-1.5">
                  vyron-scraper-v3.0.sh
                </span>
                <div className="w-8" />
              </div>

              {/* Console logs */}
              <div className="p-5 h-[230px] overflow-y-auto text-[11px] leading-relaxed text-zinc-400 space-y-1.5 scroll-smooth border-b border-zinc-900">
                {terminalLogs.map((log, index) => {
                  let colorClass = "text-zinc-400";
                  if (log.includes("[SUCCESS]")) colorClass = "text-brand-mint font-bold";
                  if (log.includes("[ERROR]")) colorClass = "text-brand-rose font-bold";
                  if (log.includes("Initializing")) colorClass = "text-brand-volt font-bold";
                  
                  return (
                    <div key={index} className="flex gap-2 items-start">
                      <span className="text-zinc-600 select-none">$</span>
                      <span className={colorClass}>{log}</span>
                    </div>
                  );
                })}
                {isScanning && (
                  <div className="flex items-center gap-2 text-brand-volt font-bold">
                    <span className="text-zinc-600 select-none">$</span>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Processing parameters...</span>
                  </div>
                )}
              </div>

              {/* Scan Results Panel */}
              <div className="p-5 bg-black/40 min-h-[140px] flex items-center justify-center text-center">
                {!scanResultReady && !isScanning && (
                  <div className="text-zinc-600 flex flex-col items-center gap-2">
                    <AlertCircle className="w-7 h-7 stroke-1" />
                    <p className="text-xs uppercase font-extrabold tracking-wider">No active scan logs</p>
                  </div>
                )}
                
                {isScanning && (
                  <div className="text-brand-volt flex flex-col items-center gap-2 animate-pulse">
                    <RefreshCw className="w-7 h-7 animate-spin" />
                    <p className="text-xs uppercase font-extrabold tracking-wider">Compiling metrics...</p>
                  </div>
                )}

                {scanResultReady && scanResultData && (
                  <div className="w-full text-left space-y-4">
                    <div className="flex justify-between items-center">
                      <h4 className="text-[10px] font-black uppercase text-brand-mint tracking-wider flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-brand-mint" /> Scraper Scan Complete
                      </h4>
                      <span className="text-[9px] font-mono text-zinc-500">Emerging trends parsed</span>
                    </div>
                    
                    {/* Rendered trends */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-[11px]">
                      {scanResultData.trends && scanResultData.trends.map((tr, i) => (
                        <div key={i} className="bg-zinc-900/60 border border-zinc-800 p-3 rounded-xl">
                          <p className="font-bold text-white mb-1 truncate">{tr.topic}</p>
                          <div className="flex items-center justify-between text-[10px] font-mono text-zinc-500 pt-1">
                            <span>Viral Score: <strong className="text-brand-volt font-bold">{tr.score}</strong></span>
                            <span>Views: <strong className="text-white">{tr.estViews}</strong></span>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Quick win suggestion */}
                    {scanResultData.wins && scanResultData.wins.length > 0 && (
                      <div className="border-t border-zinc-900 pt-3 flex gap-2 items-start bg-brand-volt/[0.02] p-2.5 rounded-lg border border-brand-volt/10">
                        <div className="text-brand-volt shrink-0 mt-0.5">🏆</div>
                        <div>
                          <p className="text-[10px] font-extrabold uppercase text-brand-volt tracking-wider">Quick Win blueprint</p>
                          <p className="text-xs text-zinc-300 font-medium mb-0.5">{scanResultData.wins[0].title}</p>
                          <p className="text-[10px] text-zinc-500 italic">"{scanResultData.wins[0].why}"</p>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── CORE CAPABILITIES (FEATURES GRID) ── */}
      <section id="features" className="relative z-10 py-24 px-4 md:px-8 max-w-7xl mx-auto scroll-mt-20">
        {/* Title */}
        <div className="max-w-3xl mb-16 text-left">
          <div className="inline-flex items-center gap-2 bg-brand-volt/10 border border-brand-volt/20 px-3.5 py-1.5 rounded-full mb-4">
            <Cpu className="w-3.5 h-3.5 text-brand-volt" />
            <span className="text-[10px] font-black uppercase tracking-widest text-brand-volt">Power Capabilities</span>
          </div>
          <h2 className="font-display font-extrabold text-4xl md:text-5xl tracking-tight text-white mb-6">
            Engineered for channels<br/>that play to <em className="text-brand-volt not-italic text-glow-volt">win</em>
          </h2>
          <p className="text-zinc-400 text-sm md:text-base leading-relaxed max-w-lg">
            Vyron provides advanced metrics and machine-learning scoring mechanisms to filter high-velocity content, track rival matrices, and maintain your growth speed.
          </p>
        </div>

        {/* Feature Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Card 1 */}
          <div className="interactive-card group relative p-8 rounded-3xl bg-zinc-950/60 border border-zinc-900 hover:border-zinc-800 transition-all duration-300 hover:-translate-y-1">
            <div className="absolute top-0 right-0 w-32 h-32 bg-brand-volt/2 rounded-bl-full pointer-events-none group-hover:bg-brand-volt/5 transition-all duration-500" />
            <span className="font-mono text-[9px] font-extrabold text-zinc-600 group-hover:text-brand-volt transition-colors uppercase tracking-widest block mb-4">01 // TRACKING</span>
            <div className="w-12 h-12 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-xl mb-6 group-hover:border-brand-volt/30 group-hover:bg-zinc-950 transition-colors">
              <BarChart3 className="w-5 h-5 text-brand-volt" />
            </div>
            <h3 className="font-display font-bold text-lg text-white mb-3">Analytics & Tracking</h3>
            <p className="text-zinc-400 text-xs leading-relaxed mb-6 font-normal">
              Capture automated daily snapshots of subscribers, view velocity, and uploading ratios. Run predictive scaling formulas to project milestones.
            </p>
            <div className="flex flex-wrap gap-2">
              {['Historical', 'Predictions', 'Milestones'].map(t => (
                <span key={t} className="text-[9px] font-bold uppercase tracking-wider text-zinc-500 border border-zinc-800/80 px-2 py-0.5 rounded bg-zinc-950/40 group-hover:border-zinc-800">{t}</span>
              ))}
            </div>
          </div>

          {/* Card 2 */}
          <div className="interactive-card group relative p-8 rounded-3xl bg-zinc-950/60 border border-zinc-900 hover:border-zinc-800 transition-all duration-300 hover:-translate-y-1">
            <div className="absolute top-0 right-0 w-32 h-32 bg-brand-mint/2 rounded-bl-full pointer-events-none group-hover:bg-brand-mint/5 transition-all duration-500" />
            <span className="font-mono text-[9px] font-extrabold text-zinc-600 group-hover:text-brand-mint transition-colors uppercase tracking-widest block mb-4">02 // DISCOVERY</span>
            <div className="w-12 h-12 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-xl mb-6 group-hover:border-brand-mint/30 group-hover:bg-zinc-950 transition-colors">
              <Zap className="w-5 h-5 text-brand-mint" />
            </div>
            <h3 className="font-display font-bold text-lg text-white mb-3">Trend Radar</h3>
            <p className="text-zinc-400 text-xs leading-relaxed mb-6 font-normal">
              Scours niche tags, queries, and titles every hour. Identifies search metrics spikes and prompts you with actionable Quick Wins content scripts.
            </p>
            <div className="flex flex-wrap gap-2">
              {['Real-time', 'AI Prompts', 'Viral Hooks'].map(t => (
                <span key={t} className="text-[9px] font-bold uppercase tracking-wider text-zinc-500 border border-zinc-800/80 px-2 py-0.5 rounded bg-zinc-950/40 group-hover:border-zinc-800">{t}</span>
              ))}
            </div>
          </div>

          {/* Card 3 */}
          <div className="interactive-card group relative p-8 rounded-3xl bg-zinc-950/60 border border-zinc-900 hover:border-zinc-800 transition-all duration-300 hover:-translate-y-1">
            <div className="absolute top-0 right-0 w-32 h-32 bg-brand-rose/2 rounded-bl-full pointer-events-none group-hover:bg-brand-rose/5 transition-all duration-500" />
            <span className="font-mono text-[9px] font-extrabold text-zinc-600 group-hover:text-brand-rose transition-colors uppercase tracking-widest block mb-4">03 // INTEL</span>
            <div className="w-12 h-12 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-xl mb-6 group-hover:border-brand-rose/30 group-hover:bg-zinc-950 transition-colors">
              <Users className="w-5 h-5 text-brand-rose" />
            </div>
            <h3 className="font-display font-bold text-lg text-white mb-3">Competitor Matrix</h3>
            <p className="text-zinc-400 text-xs leading-relaxed mb-6 font-normal">
              Profile direct rivals and sector speed leaders. Deep-dive into competitor upload frequency, view efficiency ratios, and content tags.
            </p>
            <div className="flex flex-wrap gap-2">
              {['Content DNA', 'Speed Matrix', 'Benchmarks'].map(t => (
                <span key={t} className="text-[9px] font-bold uppercase tracking-wider text-zinc-500 border border-zinc-800/80 px-2 py-0.5 rounded bg-zinc-950/40 group-hover:border-zinc-800">{t}</span>
              ))}
            </div>
          </div>

          {/* Card 4 */}
          <div className="interactive-card group relative p-8 rounded-3xl bg-zinc-950/60 border border-zinc-900 hover:border-zinc-800 transition-all duration-300 hover:-translate-y-1">
            <div className="absolute top-0 right-0 w-32 h-32 bg-brand-rose/2 rounded-bl-full pointer-events-none group-hover:bg-brand-rose/5 transition-all duration-500" />
            <span className="font-mono text-[9px] font-extrabold text-zinc-600 group-hover:text-brand-rose transition-colors uppercase tracking-widest block mb-4">04 // PARSING</span>
            <div className="w-12 h-12 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-xl mb-6 group-hover:border-brand-rose/30 group-hover:bg-zinc-950 transition-colors">
              <Search className="w-5 h-5 text-brand-rose" />
            </div>
            <h3 className="font-display font-bold text-lg text-white mb-3">Advanced Search</h3>
            <p className="text-zinc-400 text-xs leading-relaxed mb-6 font-normal">
              Filters video uploads by locale, length, and timestamp. Sort directly by our custom virality score to separate core content patterns from anomalies.
            </p>
            <div className="flex flex-wrap gap-2">
              {['Virality Rank', 'Growth Factor', 'Precision'].map(t => (
                <span key={t} className="text-[9px] font-bold uppercase tracking-wider text-zinc-500 border border-zinc-800/80 px-2 py-0.5 rounded bg-zinc-950/40 group-hover:border-zinc-800">{t}</span>
              ))}
            </div>
          </div>

          {/* Card 5 */}
          <div className="interactive-card group relative p-8 rounded-3xl bg-zinc-950/60 border border-zinc-900 hover:border-zinc-800 transition-all duration-300 hover:-translate-y-1">
            <div className="absolute top-0 right-0 w-32 h-32 bg-brand-volt/2 rounded-bl-full pointer-events-none group-hover:bg-brand-volt/5 transition-all duration-500" />
            <span className="font-mono text-[9px] font-extrabold text-zinc-600 group-hover:text-brand-volt transition-colors uppercase tracking-widest block mb-4">05 // ARCHIVE</span>
            <div className="w-12 h-12 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-xl mb-6 group-hover:border-brand-volt/30 group-hover:bg-zinc-950 transition-colors">
              <BookOpen className="w-5 h-5 text-brand-volt" />
            </div>
            <h3 className="font-display font-bold text-lg text-white mb-3">Research Library</h3>
            <p className="text-zinc-400 text-xs leading-relaxed mb-6 font-normal">
              Save trends, competitor logs, and keyword groupings. Write script structures and scripts inside our markdown editor module.
            </p>
            <div className="flex flex-wrap gap-2">
              {['Saved Notes', 'Blueprints', 'Editor Mode'].map(t => (
                <span key={t} className="text-[9px] font-bold uppercase tracking-wider text-zinc-500 border border-zinc-800/80 px-2 py-0.5 rounded bg-zinc-950/40 group-hover:border-zinc-800">{t}</span>
              ))}
            </div>
          </div>

          {/* Card 6 */}
          <div className="interactive-card group relative p-8 rounded-3xl bg-zinc-950/60 border border-zinc-900 hover:border-zinc-800 transition-all duration-300 hover:-translate-y-1">
            <div className="absolute top-0 right-0 w-32 h-32 bg-brand-mint/2 rounded-bl-full pointer-events-none group-hover:bg-brand-mint/5 transition-all duration-500" />
            <span className="font-mono text-[9px] font-extrabold text-zinc-600 group-hover:text-brand-mint transition-colors uppercase tracking-widest block mb-4">06 // INFRA</span>
            <div className="w-12 h-12 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-xl mb-6 group-hover:border-brand-mint/30 group-hover:bg-zinc-950 transition-colors">
              <Cpu className="w-5 h-5 text-brand-mint" />
            </div>
            <h3 className="font-display font-bold text-lg text-white mb-3">AI Infrastructure</h3>
            <p className="text-zinc-400 text-xs leading-relaxed mb-6 font-normal">
              Utilizes semantic indexing inside Zilliz/Milvus vector databases. Runs background cron indexing and triggers automated digests to your email inbox via Resend.
            </p>
            <div className="flex flex-wrap gap-2">
              {['Vector Search', 'Cron indexing', 'Email Reports'].map(t => (
                <span key={t} className="text-[9px] font-bold uppercase tracking-wider text-zinc-500 border border-zinc-800/80 px-2 py-0.5 rounded bg-zinc-950/40 group-hover:border-zinc-800">{t}</span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── METALLIC PRICING (HIGH CONVERTING SaaS CARD) ── */}
      <section id="pricing" className="relative z-10 py-20 px-4 md:px-8 max-w-5xl mx-auto scroll-mt-20">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-brand-volt/10 border border-brand-volt/20 px-3.5 py-1.5 rounded-full mb-4">
            <Star className="w-3.5 h-3.5 text-brand-volt fill-brand-volt" />
            <span className="text-[10px] font-black uppercase tracking-widest text-brand-volt">Early Pricing</span>
          </div>
          <h2 className="font-display font-extrabold text-4xl md:text-5xl tracking-tight text-white mb-4">
            Get Complete Access. Locked Pricing.
          </h2>
          <p className="text-zinc-400 text-sm leading-relaxed max-w-sm mx-auto">
            7 days trial. Razorpay integration for billing setups. Cancel subscription anytime with one click.
          </p>


        </div>

        {/* early adopter banner */}
        <div className="rounded-3xl border border-zinc-800/80 bg-zinc-950/40 backdrop-blur-md overflow-hidden relative mb-6">
          <div className="p-6 md:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="flex items-start md:items-center gap-4">
              <span className="bg-brand-rose text-white text-[9px] font-black tracking-widest px-2.5 py-1 rounded">VERSION 3 OFFER</span>
              <div>
                <h3 className="font-display font-extrabold text-lg text-white">50% off for life for first 500 members</h3>
                <p className="text-xs text-zinc-500 mt-0.5">Secure early adopter status. Price will never raise for your account.</p>
              </div>
            </div>

            {/* Countdown timer */}
            <div className="flex items-center gap-3 bg-zinc-950 border border-zinc-900 p-3 rounded-2xl shrink-0">
              <span className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest">Ends in:</span>
              <div className="flex items-center gap-1 font-mono font-bold text-sm text-brand-volt">
                <span>{String(timeLeft.hours).padStart(2, '0')}</span>
                <span className="opacity-40 animate-pulse">:</span>
                <span>{String(timeLeft.minutes).padStart(2, '0')}</span>
                <span className="opacity-40 animate-pulse">:</span>
                <span>{String(timeLeft.seconds).padStart(2, '0')}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Pricing Card */}
        <div className="rounded-3xl border border-brand-volt/20 bg-zinc-950/70 backdrop-blur-md overflow-hidden relative grid grid-cols-1 md:grid-cols-12 gap-8 p-8 md:p-12 shadow-[0_30px_60px_rgba(0,0,0,0.8),0_0_50px_rgba(200,241,53,0.02)]">
          {/* Top highlight bar */}
          <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-brand-volt to-brand-mint" />
          
          {/* Left Pricing Panel */}
          <div className="md:col-span-6 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 text-brand-volt font-black uppercase text-[10px] tracking-widest mb-6">
                <span className="w-1.5 h-1.5 rounded-full bg-brand-volt" /> Pro Tier Plan
              </div>
              
              <div className="flex items-baseline gap-1.5 mb-2">
                <span className="font-display font-extrabold text-3xl text-zinc-500">₹</span>
                <span className="font-display font-extrabold text-6xl md:text-7.5xl text-white tracking-tighter transition-all">
                  {priceDisplay}
                </span>
                <span className="font-mono text-zinc-500 text-xs font-bold">/ month</span>
              </div>

              {/* strike price */}
              <div className="flex items-center gap-2 mb-6">
                <span className="text-zinc-500 line-through text-sm font-bold">₹999/mo</span>
                <span className="bg-brand-rose/15 text-brand-rose border border-brand-rose/25 font-black text-[9px] px-2 py-0.5 rounded tracking-wide uppercase">SAVE 50%</span>
              </div>

              <div className="flex items-center gap-2 text-xs font-extrabold text-brand-mint mb-8">
                <Check className="w-4 h-4" /> 7 days free trial · no payment card required
              </div>
            </div>

            <div>
              <button className="w-full py-4.5 bg-brand-volt hover:bg-[#d6fb3a] text-black font-extrabold text-sm uppercase tracking-wider rounded-2xl transition-all shadow-[0_0_35px_rgba(200,241,53,0.3)] hover:shadow-[0_0_50px_rgba(200,241,53,0.55)] hover:-translate-y-0.5">
                Start 7-Day Free Trial
              </button>
              <p className="text-[10px] text-zinc-500 text-center mt-3 font-semibold tracking-wide">
                Then ₹499/mo · Cancel subscription anytime · Powered by Razorpay secure checkout
              </p>
            </div>
          </div>

          {/* Right Features List Panel */}
          <div className="md:col-span-6 border-t md:border-t-0 md:border-l border-zinc-900 pt-8 md:pt-0 md:pl-8 flex flex-col justify-center">
            <ul className="space-y-3.5 text-xs text-zinc-300">
              {[
                "Real-time Trend Radar + Quick Wins prompts",
                "Competitor Matrix & Content DNA tracking profiles",
                "Growth vector projections & milestone calculations",
                "YouTube search sorts by custom Virality Score",
                "Daily stats snapshot tracking & historical log archives",
                "Unlimited research notebook slots & strategy blueprints",
                "Background scraper indexing & automated Resend digests",
                "Vector database semantic scanning (Zilliz/Milvus)",
                "Support for all futuras additions without cost increases"
              ].map((feat, idx) => (
                <li key={idx} className="flex items-start gap-3">
                  <span className="text-brand-volt font-bold shrink-0 mt-0.5">→</span>
                  <span className="font-normal">{feat}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* ── FAQ ACCORDION SECTION (NEW STUNNING WIDGET) ── */}
      <section className="relative z-10 py-16 px-4 md:px-8 max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-brand-mint/10 border border-brand-mint/20 px-3.5 py-1.5 rounded-full mb-4">
            <HelpCircle className="w-3.5 h-3.5 text-brand-mint" />
            <span className="text-[10px] font-black uppercase tracking-widest text-brand-mint">Common Questions</span>
          </div>
          <h2 className="font-display font-extrabold text-3.5xl md:text-4.5xl tracking-tight text-white mb-4">
            Frequently Asked Queries
          </h2>
          <p className="text-zinc-400 text-sm leading-relaxed max-w-sm mx-auto">
            Everything you need to know about the Vyron system, indexes, and account configs.
          </p>
        </div>

        {/* FAQs */}
        <div className="space-y-3">
          {[
            {
              q: "What is Vyron Intelligence and how does it function?",
              a: "Vyron is a multi-parameter channel analysis dashboard. It tracks channel data, indexes competitor videos in vector spaces via Zilliz/Milvus databases, and runs scoring formulas to isolate real content patterns from search noise."
            },
            {
              q: "Must I link my YouTube/Google account to use it?",
              a: "Linking is entirely optional. You can connect your channel via read-only APIs to unlock automated growth projection tools, or run the system isolated for market trends research and rival channel tracking."
            },
            {
              q: "What is the Trend Radar?",
              a: "The Trend Radar is our hourly scraping cron job. It scans targeted keywords, metrics, and tags across your vertical to record early keyword spikes, then translates them into video ideas and hook recommendations."
            },
            {
              q: "How does the 7-day trial and billing cancelation behave?",
              a: "Your trial lasts 7 days with zero initial credit card billing. If you proceed, Razorpay billing triggers at ₹499/mo (or ₹399/mo yearly). You can cancel from your billing portal with one click anytime."
            }
          ].map((faq, idx) => {
            const isOpen = openFaq === idx;
            return (
              <div 
                key={idx}
                className="rounded-2xl border border-zinc-900 bg-zinc-950/40 overflow-hidden transition-all duration-300 hover:border-zinc-800"
              >
                <button
                  onClick={() => setOpenFaq(isOpen ? null : idx)}
                  className="w-full p-5 flex items-center justify-between gap-4 text-left transition-colors hover:text-white"
                >
                  <span className="font-display font-bold text-sm md:text-base text-zinc-100">{faq.q}</span>
                  <ChevronDown className={`w-4 h-4 text-zinc-500 transition-transform duration-300 shrink-0 ${isOpen ? 'rotate-180 text-brand-volt' : ''}`} />
                </button>
                
                <div 
                  className="transition-all duration-300 ease-in-out overflow-hidden"
                  style={{ maxHeight: isOpen ? '200px' : '0' }}
                >
                  <p className="px-5 pb-5 pt-1 text-xs md:text-sm text-zinc-400 leading-relaxed border-t border-zinc-950/50">
                    {faq.a}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ── BOTTOM CALL TO ACTION ── */}
      <section className="relative z-10 py-16 px-4 md:px-8 max-w-7xl mx-auto">
        <div className="rounded-3xl border border-zinc-900 bg-zinc-950/40 backdrop-blur-md p-10 md:p-16 text-center relative overflow-hidden shadow-[0_30px_70px_rgba(0,0,0,0.9)]">
          {/* Decorative glows */}
          <div className="absolute -bottom-16 left-1/2 -translate-x-1/2 w-96 h-96 bg-brand-volt/5 rounded-full filter blur-[80px] pointer-events-none" />
          
          {/* Huge watermark text */}
          <div className="absolute font-display font-black text-white/[0.015] text-8xl md:text-[160px] leading-none tracking-tighter select-none pointer-events-none top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 uppercase">
            VYRON
          </div>

          <div className="relative z-10 max-w-xl mx-auto">
            <span className="text-[10px] font-black uppercase tracking-widest text-brand-volt mb-4 block">DOMINATE YOUR VERTICAL</span>
            <h2 className="font-display font-extrabold text-3.5xl md:text-5xl tracking-tight text-white mb-6">
              Your niche is moving.<br/>Stop lagging.
            </h2>
            <p className="text-zinc-400 text-sm leading-relaxed mb-10 font-normal">
              Every hour without trend scraping is another hour competitors gain margins. Start tracking today.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <a 
                href="#pricing"
                className="w-full sm:w-auto px-8 py-4 bg-brand-volt hover:bg-[#d6fb3a] text-black font-extrabold text-xs uppercase tracking-wider rounded-xl transition-all shadow-[0_0_25px_rgba(200,241,53,0.15)] text-center"
              >
                Start 7-Day Trial Free
              </a>
              <a 
                href="#features"
                className="w-full sm:w-auto px-8 py-4 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-white font-extrabold text-xs uppercase tracking-wider rounded-xl transition-all text-center"
              >
                Read Capabilities list
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="relative z-10 border-t border-zinc-900/80 bg-zinc-950/40 backdrop-blur-md py-16 px-4 md:px-8 mt-20">
        <div className="max-w-5xl mx-auto">
          {/* Top Section */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-10 pb-12">
            {/* Brand Column */}
            <div className="md:col-span-7 flex flex-col items-start gap-4">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-lg bg-gradient-to-tr from-brand-volt via-[#dff453] to-brand-mint p-[1px] shadow-[0_0_15px_rgba(200,241,53,0.15)]">
                  <div className="w-full h-full bg-black rounded-[7px] flex items-center justify-center">
                    <Sparkles className="w-3.5 h-3.5 text-brand-volt" />
                  </div>
                </div>
                <span className="font-display font-extrabold text-base text-white tracking-tight">VYRON</span>
              </div>
              <p className="text-zinc-500 text-xs leading-relaxed max-w-sm">
                Continuously scanning competitor content, scoring emerging velocity indicators, and parsing vector data to secure your channel's growth.
              </p>
              {/* Status Indicator */}
              <div className="inline-flex items-center gap-2 bg-zinc-900/50 border border-zinc-800/80 px-3 py-1 rounded-full text-[9px] font-mono font-bold text-brand-mint mt-2">
                <span className="w-1.5 h-1.5 rounded-full bg-brand-mint animate-pulse" />
                ALL SYSTEMS OPERATIONAL
              </div>
            </div>

            {/* Links Column */}
            <div className="md:col-span-5 flex flex-col md:items-end justify-start gap-6">
              <div className="flex flex-wrap md:justify-end gap-x-8 gap-y-4 text-[10px] font-black uppercase tracking-widest text-zinc-500">
                <a href="#features" className="hover:text-brand-volt transition-colors">Features</a>
                <a href="#demo" className="hover:text-brand-volt transition-colors">Live Demo</a>
                <a href="#scanner" className="hover:text-brand-volt transition-colors">Radar Terminal</a>
                <a href="#pricing" className="hover:text-brand-volt transition-colors">Pricing</a>
              </div>
            </div>
          </div>

          {/* Bottom Divider & Copyright */}
          <div className="border-t border-zinc-900/80 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-[9px] font-mono text-zinc-600 font-bold uppercase tracking-widest">
              © 2026 Vyron Intelligence Platform. All rights reserved.
            </p>
            <a 
              href="#" 
              className="text-[9px] font-mono text-zinc-500 hover:text-white uppercase tracking-widest font-bold flex items-center gap-1 transition-colors"
            >
              Back to top ↑
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
