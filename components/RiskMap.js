"use client";
import { MapContainer, TileLayer, GeoJSON } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

const RiskMap = ({ geoJsonData, riskData }) => {
  if (!geoJsonData || !riskData) return null;

  // FUNGSI MATCHING YANG DISESUAIKAN DENGAN DATA CSV KAMU
  const getCleanKecName = (feature) => {
    // nm_kecamatan dari GeoJSON (Contoh: "Semarang Utara")
    const rawName = feature.properties.nm_kecamatan || "";
    
    // Kita ubah ke UPPERCASE agar cocok dengan hasil df['kecamatan'].str.upper() di Flask
    let clean = rawName.toString().toUpperCase().trim();
    
    // DEBUG: Untuk memastikan nama apa yang sedang dicari
    // console.log("Mencari di database:", clean);
    
    return clean;
  };

  const getColor = (ir) => {
    const val = parseFloat(ir) || 0;
    if (val > 55) return '#DC143C'; // Tinggi
    if (val > 20) return '#EB4C4C';  // Sedang
    return '#FD7979';                // Rendah
  };

  const style = (feature) => {
    const kecName = getCleanKecName(feature);
    const stats = riskData[kecName] || { ir: 0 };
    
    return {
      fillColor: getColor(stats.ir),
      weight: 1.5,
      opacity: 1,
      color: 'white',
      fillOpacity: 0.8,
    };
  };

  const onEachFeature = (feature, layer) => {
    const kecName = getCleanKecName(feature);
    const stats = riskData[kecName] || { ir: 0, kasus: 0, meninggal: 0 };
    
    layer.bindTooltip(`
      <div style="font-family: sans-serif; padding: 5px; min-width: 140px;">
        <strong style="font-size: 14px; color: #1e293b; display: block; margin-bottom: 4px;">${kecName}</strong>
        <div style="display: flex; justify-content: space-between; border-top: 1px solid #fce7f3; padding-top: 4px; margin-top: 4px;">
          <span style="color: #64748b;">IR:</span>
          <b style="color: #db2777;">${stats.ir.toFixed(2)}</b>
        </div>
        <div style="display: flex; justify-content: space-between;">
          <span style="color: #64748b;">Kasus:</span>
          <b style="color: #1e293b;">${stats.kasus}</b>
        </div>
        <div style="display: flex; justify-content: space-between;">
          <span style="color: #64748b;">Meninggal:</span>
          <b style="color: #ef4444;">${stats.meninggal}</b>
        </div>
      </div>
    `, { sticky: true, opacity: 0.95 });
  };

  return (
    <div className="h-[500px] w-full rounded-[2.5rem] overflow-hidden border border-rose-100 shadow-sm relative z-0">
      <MapContainer 
        center={[-7.0051, 110.4381]} 
        zoom={12} 
        scrollWheelZoom={false}
        className="h-full w-full"
      >
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
          attribution='&copy; CartoDB'
        />
        <GeoJSON 
          key={JSON.stringify(riskData)} 
          data={geoJsonData} 
          style={style} 
          onEachFeature={onEachFeature} 
        />
      </MapContainer>
    </div>
  );
};

export default RiskMap;