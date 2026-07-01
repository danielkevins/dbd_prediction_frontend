"use client";
import { useState } from 'react';
import { Line } from 'react-chartjs-2';
import { 
  Chart as ChartJS, 
  CategoryScale, 
  LinearScale, 
  PointElement, 
  LineElement, 
  Title, 
  Tooltip, 
  Legend, 
  Filler 
} from 'chart.js';
import { Sparkles, ClipboardList } from 'lucide-react';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler);

export default function Prediksi() {
  const [result, setResult] = useState(null);
  const [chartData, setChartData] = useState(null);
  const [loading, setLoading] = useState(false);

  const handlePredict = async () => {
    setLoading(true);
    try {
      const res = await fetch('https://dbd-prediction-backend.vercel.app/api/predict-full');
      const json = await res.json();
      
      if (json.error) throw new Error(json.error);

      // Menggabungkan data historis dan hasil prediksi (forecast) untuk chart
      const allLabels = [...json.historical.labels, ...json.forecast.labels];
      const histValues = [...json.historical.values, ...Array(json.forecast.values.length).fill(null)];
      const lastHistValue = json.historical.values[json.historical.values.length - 1];
      const foreValues = [
        ...Array(json.historical.values.length - 1).fill(null), 
        lastHistValue, 
        ...json.forecast.values
      ];

      setChartData({
        labels: allLabels,
        datasets: [
          {
            label: 'Data Historis',
            data: histValues,
            borderColor: '#FD7979',
            borderWidth: window.innerWidth < 768 ? 2 : 3, 
            tension: 0.4,
            pointRadius: 0,
            fill: false,
          },
          {
            label: 'Hasil Prediksi',
            data: foreValues,
            borderColor: '#DC143C',
            borderDash: [6, 6],
            backgroundColor: 'rgba(219, 39, 119, 0.05)',
            fill: true,
            tension: 0.4,
            pointRadius: window.innerWidth < 768 ? 4 : 6, 
            pointBackgroundColor: '#fff',
            pointBorderWidth: 2,
          }
        ]
      });

      setResult(json);
    } catch (err) {
      console.error("Error:", err.message);
      alert("Gagal memuat prediksi: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 md:space-y-8 animate-in fade-in duration-700 px-4 sm:px-6 md:px-0">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-black text-slate-800 tracking-tight">Prediksi Kasus DBD</h1>
          {/* Teks model disesuaikan */}
          <p className="text-sm md:text-base text-red-400 font-medium mt-1">Lihat proyeksi jumlah kasus di masa depan untuk mendukung pengambilan keputusan</p>
        </div>
        <button 
          onClick={handlePredict} 
          disabled={loading}
          className="w-full md:w-auto justify-center bg-red-500 text-white px-6 md:px-8 py-3 md:py-4 rounded-xl md:rounded-2xl hover:bg-red-600 transition-all shadow-xl shadow-red-100 font-bold flex items-center gap-2 disabled:bg-red-200 text-sm md:text-base"
        >
          {loading ? "Menganalisis..." : <><Sparkles size={20} />Prediksi</>}
        </button>
      </div>

      {result && chartData ? (
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 md:gap-8 items-start">
          
          {/* Grafik Gabungan */}
          <div className="xl:col-span-2 bg-white p-4 sm:p-6 md:p-8 rounded-2xl md:rounded-3xl border border-rose-100 shadow-sm overflow-hidden w-full">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 md:mb-8">
               <h3 className="font-bold text-slate-700 flex items-center gap-2 text-sm md:text-base">
                 <div className="w-1.5 h-4 md:h-5 bg-red-500 rounded-full"></div>
                 Visualisasi Tren Kasus
               </h3>
               <div className="flex gap-3 md:gap-4 text-[9px] md:text-[10px] font-bold uppercase tracking-widest">
                  <div className="flex items-center gap-1.5 text-red-300">
                    <span className="w-3 md:w-4 h-1 bg-red-400 rounded-full"></span> Historis
                  </div>
                  <div className="flex items-center gap-1.5 text-red-600">
                    <span className="w-3 md:w-4 h-1 border-t-2 border-dashed border-red-500"></span> Prediksi
                  </div>
               </div>
            </div>
            
            <div className="w-full overflow-x-auto pb-4">
              <div className="min-w-[600px] md:min-w-full h-[300px] md:h-[400px]">
                <Line 
                  data={chartData}
                  options={{ 
                    maintainAspectRatio: false,
                    responsive: true,
                    plugins: { 
                      legend: { display: false },
                      tooltip: {
                        mode: 'index',
                        intersect: false,
                      }
                    },
                    scales: {
                      y: { 
                        grid: { color: '#fff1f2' }, 
                        beginAtZero: true,
                        ticks: { font: { size: 10 } }
                      },
                      x: { 
                        grid: { display: false },
                        ticks: { 
                          font: { size: 10 },
                          maxRotation: 45, 
                          minRotation: 45
                        }
                      }
                    }
                  }} 
                />
              </div>
            </div>
          </div>

          {/* Tabel Hasil Prediksi */}
          <div className="bg-white rounded-2xl md:rounded-3xl border border-rose-100 shadow-sm overflow-hidden h-full">
            <div className="p-4 md:p-6 border-b border-rose-50 bg-rose-50/30 flex items-center gap-2">
              <ClipboardList className="text-red-500" size={18} />
              <h3 className="font-bold text-slate-700 text-sm md:text-base">Detail Prediksi</h3>
            </div>
            <div className="p-0 overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[250px]">
                <thead className="bg-white text-rose-400 text-[9px] md:text-[10px] font-bold uppercase tracking-widest">
                  <tr>
                    <th className="p-4 md:p-5 border-b border-red-50 whitespace-nowrap">Bulan</th>
                    <th className="p-4 md:p-5 border-b border-red-50 text-right whitespace-nowrap">Prediksi</th>
                  </tr>
                </thead>
                <tbody className="text-slate-700">
                  {/* Diubah menggunakan result.forecast.values */}
                  {result.forecast.values.map((val, idx) => (
                    <tr key={idx} className="hover:bg-rose-50/50 transition-colors group">
                      <td className="p-4 md:p-5">
                        {/* Diubah menggunakan result.forecast.labels */}
                        <p className="font-bold text-slate-800 text-sm md:text-base whitespace-nowrap">{result.forecast.labels[idx]}</p>
                        <p className="text-[9px] md:text-[10px] text-slate-400 font-medium">Bulan Proyeksi {idx + 1}</p>
                      </td>
                      <td className="p-4 md:p-5 text-right">
                        <span className="text-lg md:text-xl font-black text-red-600">{val}</span>
                        <span className="text-[9px] md:text-[10px] text-slate-400 ml-1 font-bold italic">Kasus</span>
                        <div className={`mt-1 text-[9px] md:text-[10px] font-bold ${val > 20 ? 'text-red-500' : 'text-emerald-500'}`}>
                          {val > 20 ? '● WASPADA' : '● AMAN'}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      ) : (
        <div className="bg-white p-10 md:p-24 rounded-[2rem] md:rounded-[40px] border-2 border-dashed border-rose-100 flex flex-col items-center text-center shadow-sm">
          <div className="bg-rose-50 p-6 md:p-8 rounded-full mb-4 md:mb-6 text-red-300 animate-pulse">
            <Sparkles size={48} className="md:w-16 md:h-16" />
          </div>
          <h2 className="text-xl md:text-2xl font-black text-slate-800 mb-2">Mulai Prediksi</h2>
          <p className="text-xs md:text-sm text-slate-400 max-w-sm leading-relaxed px-4">
           Klik tombol di atas untuk memproses data dan melihat hasil prediksi tren kasus DBD.

          </p>
        </div>
      )}
    </div>
  );
}