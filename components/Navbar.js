"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
// Tambahkan import Menu dan X untuk tombol mobile
import { LayoutDashboard, LineChart, Home, Menu, X } from 'lucide-react';

export default function Navbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  // State untuk mengontrol buka/tutup menu di layar HP
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { name: 'Beranda', path: '/', icon: <Home size={18} /> },
    { name: 'Dashboard', path: '/dashboard', icon: <LayoutDashboard size={18} /> },
    { name: 'Prediksi', path: '/prediksi', icon: <LineChart size={18} /> },
  ];

  return (
    <nav className={`
      fixed top-0 left-0 right-0 z-[100] transition-all duration-300 w-full
      bg-white border-b border-slate-100
      ${scrolled ? 'shadow-md py-3' : 'py-4 md:py-5'}
    `}>
      <div className="max-w-[1440px] w-[90%] md:w-[95%] mx-auto flex items-center justify-between relative">
        
        {/* Logo Section */}
        <Link href="/" className="flex items-center gap-3 group z-50" onClick={() => setIsOpen(false)}>
          <div className="flex flex-col">
            <span className="font-black text-slate-800 tracking-tighter text-lg md:text-xl leading-none">SPDS</span>
            <span className="text-[8px] md:text-[10px] font-bold text-rose-400 uppercase tracking-[0.15em] md:tracking-[0.2em]">
              Smart Prediction DBD <span className="hidden sm:inline">Semarang</span>
            </span>
          </div>
        </Link>

        {/* Tombol Hamburger untuk Mobile */}
        <button 
          className="md:hidden flex items-center text-slate-600 hover:text-rose-500 transition-colors z-50"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle Menu"
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        {/* Navigation - Desktop (Disembunyikan di HP dengan 'hidden md:flex') */}
        <div className="hidden md:flex items-center gap-1">
          {navItems.map((item) => (
            <Link 
              key={item.path} 
              href={item.path}
              className={`
                flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all
                ${pathname === item.path 
                  ? 'bg-rose-50 text-rose-600 shadow-sm' 
                  : 'text-slate-500 hover:bg-slate-50 hover:text-rose-500'}
              `}
            >
              {item.icon}
              <span>{item.name}</span>
            </Link>
          ))}
        </div>
      </div>

      {/* Navigation - Mobile Menu Dropdown */}
      <div className={`
        absolute top-full left-0 right-0 bg-white border-b border-slate-100 shadow-xl md:hidden overflow-hidden transition-all duration-300 ease-in-out
        ${isOpen ? 'max-h-64 opacity-100' : 'max-h-0 opacity-0'}
      `}>
        <div className="flex flex-col px-5 py-4 gap-2">
          {navItems.map((item) => (
            <Link 
              key={item.path} 
              href={item.path}
              onClick={() => setIsOpen(false)} // Otomatis tutup menu saat diklik
              className={`
                flex items-center gap-3 px-5 py-4 rounded-xl text-sm font-bold transition-all
                ${pathname === item.path 
                  ? 'bg-rose-50 text-rose-600 shadow-sm' 
                  : 'text-slate-500 hover:bg-slate-50 hover:text-rose-500'}
              `}
            >
              {item.icon}
              <span>{item.name}</span>
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}