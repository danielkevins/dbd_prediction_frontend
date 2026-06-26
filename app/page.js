"use client";
import Link from 'next/link';
import React from 'react';
import { ShieldAlert, ArrowRight, BarChart3, Map as MapIcon } from 'lucide-react';
import { Chart as ChartJS, registerables, BarElement, CategoryScale, LinearScale } from 'chart.js';

ChartJS.register(...registerables, BarElement, CategoryScale, LinearScale);

export default function Home() {
  return (
    /* Menambahkan overflow-hidden agar elemen tidak membuat layar bisa di-scroll ke samping di HP */
    <div className="relative w-full flex flex-col items-center space-y-16 md:space-y-20 animate-in fade-in duration-1000 overflow-hidden">
      
      {/* Hero Section */}
      <div className="flex flex-col items-center justify-center min-h-[65vh] pt-16 pb-10 px-4 sm:px-6 text-center w-full">
        
        {/* Badge responsif: teks sedikit dikecilkan di layar HP */}
        <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-md px-4 py-2 sm:px-5 rounded-full border border-white shadow-sm mb-6 sm:mb-8">
          <span className="flex h-2 w-2 sm:h-2.5 sm:w-2.5 rounded-full bg-rose-500 animate-pulse"></span>
          <span className="text-[10px] sm:text-xs font-black text-rose-600 uppercase tracking-[0.2em] sm:tracking-[0.3em]">
            Smart DBD Prediction System Semarang
          </span>
        </div>
        
        {/* Teks h1 responsif: Mulai dari 4xl (HP), 5xl (Tablet), hingga 8xl (Desktop) */}
        <h1 className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-black text-slate-800 tracking-tighter leading-[1.1] md:leading-[0.9] mb-6 sm:mb-8">
          Sistem Prediksi dan <br className="hidden sm:block" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-500 to-pink-600">
            Monitoring DBD 
          </span> <br className="hidden sm:block"/>
          Kota Semarang
        </h1>
        
        {/* Paragraf responsif */}
        <p className="max-w-2xl text-base sm:text-lg md:text-xl text-slate-500 font-medium leading-relaxed mb-8 sm:mb-10 px-2">
          Mengintegrasikan data historis dan data iklim untuk menganalisis pola penyebaran serta memprediksi tren kasus Demam Berdarah Dengue (DBD) secara lebih akurat dan berbasis data.
        </p>

        {/* Tombol responsif: flex-col (turun ke bawah) di HP, flex-row (menyamping) di Tablet+ */}
        <div className="flex flex-col sm:flex-row justify-center items-center gap-4 sm:gap-5 w-full sm:w-auto px-4 sm:px-0">
          <Link 
            href="/dashboard" 
            className="w-full sm:w-auto justify-center bg-slate-900 text-white px-8 py-4 sm:px-10 sm:py-5 rounded-full font-bold shadow-2xl hover:bg-rose-500 transition-all hover:scale-105 flex items-center gap-3 text-sm sm:text-base"
          >
            Lihat Dashboard <ArrowRight size={20} className="sm:w-[22px] sm:h-[22px]" />
          </Link>
          
          <Link 
            href="/prediksi" 
            className="w-full sm:w-auto justify-center bg-white border-2 border-slate-100 text-slate-700 px-8 py-4 sm:px-10 sm:py-5 rounded-full font-bold shadow-lg hover:border-rose-500 hover:text-rose-500 transition-all hover:scale-105 flex items-center gap-3 text-sm sm:text-base"
          >
            Mulai Prediksi <ArrowRight size={20} className="sm:w-[22px] sm:h-[22px]" />
          </Link>
        </div>
      </div>

      {/* Feature Cards - Grid dirapikan untuk HP (1 kolom), Tablet (2 kolom), Desktop (3 kolom) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 md:gap-8 w-full max-w-6xl px-4 sm:px-6">
        <FeatureCard 
          icon={<MapIcon className="text-pink-500" />} 
          title="Persebaran Kasus" 
          desc="Menyajikan gambaran persebaran kasus DBD di setiap kecamatan di Kota Semarang untuk menunjukkan wilayah dengan tingkat penyebaran tinggi."
        />
        <FeatureCard 
          icon={<BarChart3 className="text-pink-500" />} 
          title="Analisis Tren" 
          desc="Menampilkan pola fluktuasi kasus DBD secara berkala untuk membantu memahami tren kenaikan maupun penurunan kasus dari waktu ke waktu."
        />
        <FeatureCard 
          icon={<ShieldAlert className="text-pink-500" />} 
          title="Mitigasi Kasus" 
          desc="Mendukung upaya mitigasi risiko DBD melalui prediksi jumlah kasus pada periode mendatang, sehingga dapat menjadi dasar dalam perencanaan tindakan pencegahan dan penanganan yang lebih efektif."
        />
      </div>

      {/* Footer / Info */}
      <div className="pt-10 pb-8 border-t border-rose-100 w-full max-w-4xl text-center px-4 sm:px-6 mt-12">
        <p className="text-slate-400 text-[10px] sm:text-xs font-medium leading-relaxed">
          Sistem ini dikembangkan sebagai bagian dari penelitian Tugas Akhir Program Studi Sistem Informasi Universitas Dian Nuswantoro <br className="hidden sm:block" />
          Data bersumber dari Dinas Kesehatan Kota Semarang & BMKG
        </p>
      </div>
    </div>
  );
}

function FeatureCard({ icon, title, desc }) {
  return (
    <div className="bg-white p-6 sm:p-8 rounded-[2rem] sm:rounded-[2.5rem] border border-rose-100 shadow-sm hover:shadow-md transition-all group flex flex-col items-center text-center">
      <div className="bg-rose-50 w-12 h-12 sm:w-14 sm:h-14 rounded-2xl flex items-center justify-center mb-5 sm:mb-6 group-hover:scale-110 transition-transform">
        {icon}
      </div>
      <h3 className="text-base sm:text-lg font-black text-slate-800 mb-2">{title}</h3>
      <p className="text-slate-500 text-xs sm:text-sm leading-relaxed">{desc}</p>
    </div>
  );
}