"use client";
import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { Activity, AlertCircle, Users, Filter, Map as MapIcon, BarChart3, PieChart as PieIcon, Trophy } from 'lucide-react';
import { Chart as ChartJS, registerables, BarElement, CategoryScale, LinearScale } from 'chart.js';
import { Line, Pie, Bar } from 'react-chartjs-2';

ChartJS.register(...registerables, BarElement, CategoryScale, LinearScale);

const RiskMap = dynamic(() => import('@/components/RiskMap'), { 
  ssr: false,
  loading: () => <div className="h-[300px] md:h-[500px] bg-red-50 animate-pulse rounded-[1.5rem] md:rounded-3xl border border-rose-100" />
});

export default function Dashboard() {
  const [year, setYear] = useState('2025'); 
  const [data, setData] = useState(null);
  const [geoData, setGeoData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/maps/semarang.geojson')
      .then(res => res.json())
      .then(json => setGeoData(json))
      .catch(err => console.error("Gagal load GeoJSON:", err));
  }, []);

  useEffect(() => {
    setLoading(true);
    fetch(`https://dbd-prediction-backend.vercel.app/api/dashboard-stats?tahun=${year}`)
      .then(res => res.json())
      .then(json => {
        setData(json);
        setLoading(false);
      })
      .catch(err => {
        console.error("Fetch error:", err);
        setLoading(false);
      });
  }, [year]);

  if (loading || !data) {
    return (
      <div className="flex flex-col items-center justify-center h-[70vh] text-red-500">
        <div className="w-8 h-8 md:w-10 md:h-10 border-4 border-red-200 border-t-red-500 rounded-full animate-spin mb-4"></div>
        <p className="text-sm md:text-base font-bold animate-pulse">Sinkronisasi Data...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 md:space-y-8 animate-in fade-in duration-700 px-4 sm:px-6 md:px-0">
      
      {/* Header & Filter */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-black text-slate-800 tracking-tight">Dashboard Analisis</h1>
          <p className="text-xs md:text-sm text-red-400 font-medium mt-1">Tren & Persebaran Kasus DBD</p>
        </div>
        <div className="flex items-center justify-between bg-white border border-rose-100 rounded-xl md:rounded-2xl px-4 py-2 sm:py-2.5 shadow-sm w-full sm:w-auto">
          <div className="flex items-center">
            <Filter size={16} className="text-red-400 mr-2" />
            <span className="text-xs md:text-sm text-slate-400 font-medium mr-2 hidden sm:inline">Filter:</span>
          </div>
          <select 
            value={year} 
            onChange={(e) => setYear(e.target.value)}
            className="outline-none bg-transparent text-sm md:text-base font-bold text-slate-700 cursor-pointer w-full sm:w-auto text-right sm:text-left"
          >
            {['2016','2017','2018','2019','2020','2021','2022','2023','2024','2025','2026'].map(y => (
              <option key={y} value={y}>Tahun {y}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Card Views */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
        <StatCard title="Total Kasus" value={data.cards.total_kasus} icon={<Activity size={20} />} color="bg-red-500" />
        <StatCard title="Rata-rata IR" value={data.cards.avg_ir} icon={<AlertCircle size={20} />} color="bg-rose-400" />
        {/* Kasus meninggal akan memakan 2 kolom di HP jika tanggung, kita biarkan otomatis di grid-cols-1 */}
        <StatCard title="Kasus Meninggal" value={data.cards.total_meninggal} icon={<Users size={20} />} color="bg-red-600" />
      </div>

      {/* MAP SECTION */}
      <div className="bg-white p-5 sm:p-6 md:p-8 rounded-[1.5rem] md:rounded-[2.5rem] border border-rose-100 shadow-sm">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-5 md:mb-6 gap-3">
          <h3 className="font-bold text-slate-700 flex items-center gap-2 text-sm md:text-base">
            <div className="bg-red-50 p-1.5 md:p-2 rounded-lg text-red-500"><MapIcon size={18} /></div>
            Zonasi Risiko Kecamatan
          </h3>
          <div className="flex flex-wrap gap-3 md:gap-4 text-[9px] md:text-[10px] font-black uppercase tracking-widest text-slate-400">
             <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-[#2ECC71]"></span> Rendah</div>
             <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-[#F39C12]"></span> Sedang</div>
             <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-[#C0392B]"></span> Tinggi</div>
          </div>
        </div>
        {/* Pastikan komponen RiskMap di dalam punya tinggi dinamis, misal h-[300px] md:h-[500px] */}
        <div className="h-[350px] md:h-[500px] w-full rounded-xl overflow-hidden">
          <RiskMap geoJsonData={geoData} riskData={data.map_data} />
        </div>
      </div>

      {/* CHARTS SECTION */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
        
        {/* Tren Bulanan */}
        <div className="bg-white p-5 sm:p-6 md:p-8 rounded-[1.5rem] md:rounded-[2.5rem] border border-rose-100 shadow-sm">
          <h3 className="font-bold text-slate-700 mb-4 md:mb-6 flex items-center gap-2 text-sm md:text-base">
            <BarChart3 size={18} className="text-red-400" /> Tren Kasus Bulanan
          </h3>
          <div className="h-[200px] md:h-64">
            <Line 
              data={{
                labels: data.monthly_trend.map(d => d.label),
                datasets: [{ 
                  label: 'Kasus', 
                  data: data.monthly_trend.map(d => d.value), 
                  borderColor: '#EB4C4C', 
                  backgroundColor: 'rgba(222, 65, 83, 0.1)',
                  fill: true,
                  tension: 0.4,
                  pointRadius: window.innerWidth < 768 ? 2 : 4,
                }]
              }} 
              options={{ 
                maintainAspectRatio: false, 
                plugins: { legend: { display: false } },
                scales: {
                  x: { ticks: { font: { size: 10 } } },
                  y: { ticks: { font: { size: 10 } } }
                }
              }} 
            />
          </div>
        </div>

        {/* Pie Chart */}
        <div className="bg-white p-5 sm:p-6 md:p-8 rounded-[1.5rem] md:rounded-[2.5rem] border border-rose-100 shadow-sm">
          <h3 className="font-bold text-slate-700 mb-4 md:mb-6 flex items-center gap-2 justify-start text-sm md:text-base">
            <PieIcon size={18} className="text-red-400" /> Distribusi Risiko
          </h3>
          <div className="h-[200px] md:h-64 flex justify-center">
            <Pie 
              data={{
                labels: Object.keys(data.ir_distribution),
                datasets: [{
                  data: Object.values(data.ir_distribution),
                  backgroundColor: ['#2ECC71', '#F39C12', '#C0392B'],
                  borderWidth: 0
                }]
              }}
              options={{ maintainAspectRatio: false }}
            />
          </div>
        </div>
        
        {/* BAR CHART TOP 10 KECAMATAN */}
        <div className="bg-white p-5 sm:p-6 md:p-8 rounded-[1.5rem] md:rounded-[2.5rem] border border-rose-100 shadow-sm lg:col-span-2">
          <h3 className="font-bold text-slate-700 mb-4 md:mb-6 flex items-center gap-2 text-sm md:text-base">
            <Trophy size={18} className="text-red-500" /> 10 Kecamatan Kasus Tertinggi
          </h3>
          <div className="h-[300px] md:h-80">
            <Bar 
              data={{
                labels: Object.entries(data.top_kecamatan)
                  .sort((a, b) => b[1] - a[1])
                  .map(entry => entry[0]),
                datasets: [{ 
                  label: 'Jumlah Kasus', 
                  data: Object.entries(data.top_kecamatan)
                    .sort((a, b) => b[1] - a[1])
                    .map(entry => entry[1]), 
                  backgroundColor: '#EB4C4C',
                  borderRadius: window.innerWidth < 768 ? 4 : 10,
                  hoverBackgroundColor: '#e61919'
                }]
              }} 
              options={{ 
                indexAxis: 'y', 
                maintainAspectRatio: false,
                plugins: { legend: { display: false } },
                scales: {
                  x: { grid: { display: false }, ticks: { font: { weight: 'bold', size: 10 } } },
                  y: { grid: { display: false }, ticks: { font: { weight: 'bold', size: 9 } } }
                }
              }} 
            />
          </div>
        </div>
      </div>
    </div>
  );
}

/* Komponen StatCard yang Diperbarui */
function StatCard({ title, value, icon, color, shadow }) {
  return (
    <div className="bg-white p-5 md:p-8 rounded-[1.5rem] md:rounded-[2.5rem] border border-slate-100 shadow-sm flex items-center gap-4 md:gap-6 transition-all hover:-translate-y-1 hover:shadow-md">
      <div className={`${color} p-3 md:p-4 rounded-xl md:rounded-2xl text-white shadow-lg ${shadow}`}>
        {icon}
      </div>
      <div>
        <p className="text-slate-400 text-[9px] md:text-[10px] font-black uppercase tracking-widest mb-1">{title}</p>
        <h3 className="text-2xl md:text-3xl font-black text-slate-800 tracking-tight">{value}</h3>
      </div>
    </div>
  );
}