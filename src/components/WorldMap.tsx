/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { CountryPerformance } from '../types';
import { Globe, TrendingUp } from 'lucide-react';

interface WorldMapProps {
  countries: CountryPerformance[];
  selectedCountry: string;
  onSelectCountry: (country: string) => void;
  selectedRegion: string;
}

export const WorldMap: React.FC<WorldMapProps> = ({
  countries,
  selectedCountry,
  onSelectCountry,
  selectedRegion
}) => {
  // Toggle between 'spend', 'leads', and 'visits' for bubble volume & KPI rank listing
  const [activeMetric, setActiveMetric] = useState<'spend' | 'leads' | 'visits'>('spend');
  
  // Script loading state for Leaflet
  const [isMapLoaded, setIsMapLoaded] = useState(false);

  const mapRef = useRef<HTMLDivElement>(null);
  const leafletMap = useRef<any>(null);
  const markersRef = useRef<any[]>([]);

  // 1. Asynchronously Load Leaflet Assets from corporate-safe Cloud CDN
  useEffect(() => {
    // Inject CSS
    const linkId = 'leaflet-css-cdn';
    if (!document.getElementById(linkId)) {
      const link = document.createElement('link');
      link.id = linkId;
      link.rel = 'stylesheet';
      link.href = 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.css';
      document.head.appendChild(link);
    }

    // Inject JS
    const scriptId = 'leaflet-js-cdn';
    if (!document.getElementById(scriptId)) {
      const script = document.createElement('script');
      script.id = scriptId;
      script.src = 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.js';
      script.onload = () => setIsMapLoaded(true);
      document.head.appendChild(script);
    } else {
      if ((window as any).L) {
        setIsMapLoaded(true);
      } else {
        const interval = setInterval(() => {
          if ((window as any).L) {
            setIsMapLoaded(true);
            clearInterval(interval);
          }
        }, 100);
        return () => clearInterval(interval);
      }
    }
  }, []);

  // 2. Initialize Leaflet Map Instance
  useEffect(() => {
    if (!isMapLoaded || !mapRef.current) return;

    const L = (window as any).L;
    if (!L) return;

    if (!leafletMap.current) {
      leafletMap.current = L.map(mapRef.current, {
        center: [20, 0],
        zoom: 1.5,
        zoomControl: true,
        attributionControl: false,
        minZoom: 1.1,
        maxZoom: 6,
        worldCopyJump: true,
        scrollWheelZoom: false // Avoid mouse wheel hijack during dashboard scrolling
      });

      // Add elegant grayscale CartoDB Positron map tiles (perfect corporate branding style)
      L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
        maxZoom: 18
      }).addTo(leafletMap.current);
    }

    return () => {
      if (leafletMap.current) {
        leafletMap.current.remove();
        leafletMap.current = null;
      }
    };
  }, [isMapLoaded]);

  // 3. Dynamic Marker Updates & View Pans (FlyTo animations)
  useEffect(() => {
    const L = (window as any).L;
    if (!L || !leafletMap.current) return;

    // Refresh size context to avoid grey map tiles issue
    setTimeout(() => {
      if (leafletMap.current) {
        leafletMap.current.invalidateSize();
      }
    }, 100);

    // Clear previous circles
    markersRef.current.forEach(m => m.remove());
    markersRef.current = [];

    // Scale calculation helper based on active metric (Maximum value is baseline)
    const maxVal = Math.max(...countries.map((c) => c[activeMetric])) || 1;

    countries.forEach(c => {
      const isSelected = selectedCountry === c.country;
      const belongsToRegion = selectedRegion === 'global' || c.region === selectedRegion;
      const metricValue = c[activeMetric];

      // Bubble sizing (Radius dimensions)
      const minRadius = 5;
      const maxRadius = 24;
      const radius = minRadius + (metricValue / maxVal) * (maxRadius - minRadius);

      // Color scheme based on regional bounds and active selection tags
      const ringColor = belongsToRegion ? (isSelected ? '#f37321' : '#2563eb') : '#94a3b8';
      const fillThemeColor = belongsToRegion ? (isSelected ? '#f37321' : '#3b82f6') : '#cbd5e1';
      const opacity = belongsToRegion ? 0.8 : 0.15;
      const fillOpacity = belongsToRegion ? (isSelected ? 0.7 : 0.45) : 0.1;

      // Draw custom vector circle markers onto the Leaflet Canvas
      const circle = L.circleMarker([c.lat, c.lng], {
        radius: radius,
        color: ringColor,
        weight: isSelected ? 2.5 : 1.2,
        opacity: opacity,
        fillColor: fillThemeColor,
        fillOpacity: fillOpacity
      });

      // Rich tooltips
      const tooltipContent = `
        <div style="font-family: sans-serif; font-size: 11px; padding: 4px; min-width: 155px; line-height: 1.4;">
          <strong style="color: #0f172a; font-size: 11px; display: block; margin-bottom: 6px; border-b: 1px solid #f1f5f9; padding-bottom: 4px;">
            ${c.country}
          </strong>
          <div style="display: flex; justify-content: space-between; margin-bottom: 3px;">
            <span style="color: #64748b; font-weight: 500;">AD SPEND:</span>
            <strong style="color: #1e293b;">$${c.spend.toLocaleString()}</strong>
          </div>
          <div style="display: flex; justify-content: space-between; margin-bottom: 3px;">
            <span style="color: #64748b; font-weight: 500;">VISITS:</span>
            <strong style="color: #1e293b;">${c.visits.toLocaleString()}</strong>
          </div>
          <div style="display: flex; justify-content: space-between; margin-bottom: 3px;">
            <span style="color: #64748b; font-weight: 500;">CTR:</span>
            <strong style="color: #1e293b;">${(c.ctr * 100).toFixed(2)}%</strong>
          </div>
          <div style="display: flex; justify-content: space-between; margin-bottom: 3px;">
            <span style="color: #64748b; font-weight: 500;">LEADS:</span>
            <strong style="color: #f37321;">${c.leads.toLocaleString()}</strong>
          </div>
          <div style="display: flex; justify-content: space-between;">
            <span style="color: #64748b; font-weight: 500;">CPL:</span>
            <strong style="color: #2563eb;">$${c.cpl.toFixed(1)}</strong>
          </div>
        </div>
      `;

      circle.bindTooltip(tooltipContent, {
        direction: 'top',
        offset: [0, -5],
        className: 'custom-map-tooltip'
      });

      // Interactive Click toggles selection
      circle.on('click', () => {
        onSelectCountry(isSelected ? '전체' : c.country);
      });

      circle.addTo(leafletMap.current);
      markersRef.current.push(circle);
    });

    // Handle smooth viewport pans depending on active filters
    if (selectedCountry !== '전체') {
      const activeCountry = countries.find(c => c.country === selectedCountry);
      if (activeCountry) {
        leafletMap.current.setView([activeCountry.lat, activeCountry.lng], 3, { animate: true });
      }
    } else {
      if (selectedRegion === 'global') {
        leafletMap.current.setView([20, 0], 1.5, { animate: true });
      } else if (selectedRegion === '미주') {
        leafletMap.current.setView([15, -75], 2.2, { animate: true });
      } else if (selectedRegion === 'APAC') {
        leafletMap.current.setView([15, 110], 2.5, { animate: true });
      } else if (selectedRegion === 'EU') {
        leafletMap.current.setView([50, 10], 3.4, { animate: true });
      }
    }
  }, [countries, selectedCountry, selectedRegion, activeMetric, isMapLoaded]);


  // Helper to extract clean English country name in uppercase (e.g., "미국 (United States)" -> "UNITED STATES")
  const getCleanEnglishName = (fullName: string) => {
    const match = fullName.match(/\(([^)]+)\)/);
    return match ? match[1].toUpperCase() : fullName.toUpperCase();
  };

  // Order countries by active metric for the "KPI by Country" list ranking panel
  const sortedCountryPerformance = useMemo(() => {
    return [...countries].sort((a, b) => b[activeMetric] - a[activeMetric]);
  }, [countries, activeMetric]);

  // Overall maximum value of the active metric to scale the ranking progress bars correctly
  const maxMetricVal = useMemo(() => {
    return Math.max(...countries.map((c) => c[activeMetric])) || 1;
  }, [countries, activeMetric]);

  return (
    <div className="bg-white rounded-sm border border-slate-200/65 shadow-2xs overflow-hidden flex flex-col">
      {/* 1. Header with dynamic metric selectors */}
      <div className="p-4 border-b border-slate-100 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-800 flex items-center gap-1.5 font-sans">
            <Globe className="text-[#f37321]" size={15} />
            Country Performance Summary
          </h3>
          <p className="text-[10px] text-slate-400 font-mono mt-0.5">
            * The size of each circle shows the total {activeMetric === 'spend' ? '"Spend"' : activeMetric === 'visits' ? '"Visits"' : '"Leads"'} for that country. Drag & pinch coordinates to zoom.
          </p>
        </div>

        {/* Metric selection tabs */}
        <div className="inline-flex rounded-sm border border-slate-200 p-0.5 bg-slate-50 text-[10px]">
          <button
            className={`px-3 py-1.5 rounded-xs transition-all cursor-pointer font-bold ${
              activeMetric === 'spend' ? 'bg-[#f37321] text-white shadow-xs' : 'text-slate-500 hover:text-slate-800'
            }`}
            onClick={() => setActiveMetric('spend')}
          >
            KPI: Spend (광고비)
          </button>
          <button
            className={`px-3 py-1.5 rounded-xs transition-all cursor-pointer font-bold ${
              activeMetric === 'visits' ? 'bg-[#f37321] text-white shadow-xs' : 'text-slate-500 hover:text-slate-800'
            }`}
            onClick={() => setActiveMetric('visits')}
          >
            KPI: Visits (방문 수)
          </button>
          <button
            className={`px-3 py-1.5 rounded-xs transition-all cursor-pointer font-bold ${
              activeMetric === 'leads' ? 'bg-[#f37321] text-white shadow-xs' : 'text-slate-500 hover:text-slate-800'
            }`}
            onClick={() => setActiveMetric('leads')}
          >
            KPI: Leads (리드 획득)
          </button>
        </div>
      </div>

      {/* 2. Primary 2-Column Layout (Map on Left, Ranking List on Right) */}
      <div className="grid grid-cols-1 xl:grid-cols-5 divide-y xl:divide-y-0 xl:divide-x divide-slate-100">
        
        {/* Left Column: True World Map Overlay Frame */}
        <div className="xl:col-span-3 p-4 flex flex-col justify-between">
          <div className="relative w-full aspect-[2/1] bg-slate-50 border border-slate-100 rounded-sm overflow-hidden select-none">
            
            {/* Elegant Interactive Dynamic Leaflet Viewport */}
            {isMapLoaded ? (
              <div ref={mapRef} className="w-full h-full z-0" />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center text-xs text-slate-400 font-mono gap-2.5">
                <div className="w-6 h-6 rounded-full border-2 border-slate-200 border-t-[#f37321] animate-spin" />
                <span className="tracking-wide text-2xs uppercase">Loading GIS World Map Engine...</span>
              </div>
            )}
          </div>

          {/* Elegant professional map footnotes & scaled sliders */}
          <div className="mt-4 flex flex-wrap items-center justify-between gap-4 border-t border-slate-100 pt-3 text-[10px] text-slate-500 font-mono">
            {/* Circle Volume Scale Indicator */}
            <div className="flex items-center gap-2">
              <span className="font-sans font-bold text-2xs uppercase text-slate-400">Metric Scale volume:</span>
              <div className="flex items-center gap-1.5">
                <span className="text-[9px] text-slate-400">Low</span>
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-blue-500/20 border border-blue-500/50" />
                <span className="inline-block w-3 h-3 rounded-full bg-blue-500/40 border border-blue-500/60" />
                <span className="inline-block w-4.5 h-4.5 rounded-full bg-blue-500/65 border border-blue-600/80" />
                <span className="text-[9px] text-slate-400">High</span>
              </div>
            </div>

            {/* Color Legend for Intensity */}
            <div className="flex items-center gap-2">
              <span className="font-sans font-bold text-2xs uppercase text-slate-400">Focus KPI state:</span>
              <span className="px-1.5 py-0.5 bg-blue-100 text-blue-800 rounded-2xs text-[9px] font-bold uppercase">Active Region</span>
              <span className="px-1.5 py-0.5 bg-slate-100 text-slate-400 rounded-2xs text-[9px] font-bold uppercase">Dimmed</span>
            </div>
          </div>
        </div>

        {/* Right Column: "KPI by Country" Interactive Ranking list as requested in template */}
        <div className="xl:col-span-2 p-4 flex flex-col h-full bg-slate-50/40">
          <div className="mb-3 flex items-center justify-between">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
              <TrendingUp className="text-blue-600" size={14} />
              KPI by Country
            </h4>
            <span className="text-[9px] text-slate-400 font-mono uppercase bg-slate-100 p-1 px-1.5 rounded-xs font-bold">
              Sorted by {activeMetric.toUpperCase()}
            </span>
          </div>

          {/* Scrollable list matching the original corporate dashboard mockup design perfectly */}
          <div className="flex-1 overflow-y-auto max-h-[345px] space-y-2 pr-1.5 scrollbar-thin scrollbar-thumb-slate-200">
            {sortedCountryPerformance.map((c) => {
              const isSelected = selectedCountry === c.country;
              const belongsToRegion = selectedRegion === 'global' || c.region === selectedRegion;
              const displayValue = c[activeMetric];
              
              const percentOfMax = (displayValue / maxMetricVal) * 100;

              return (
                <div
                  key={c.country}
                  onClick={() => onSelectCountry(isSelected ? '전체' : c.country)}
                  className={`p-2.5 rounded-xs border transition-all cursor-pointer flex flex-col gap-1.5 ${
                    isSelected
                      ? 'bg-white border-[#f37321] shadow-xs ring-1 ring-[#f37321]/30'
                      : !belongsToRegion
                      ? 'bg-slate-100/50 border-slate-200/40 opacity-40 hover:opacity-100 hover:bg-slate-100'
                      : 'bg-white border-slate-200/50 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center justify-between text-[11px]">
                    {/* Clear Country display */}
                    <span className="font-bold text-slate-800 font-sans tracking-tight">
                      {getCleanEnglishName(c.country)}
                    </span>
                    {/* Numeric KPI metrics label */}
                    <span className="font-mono font-bold text-slate-700">
                      {activeMetric === 'spend' 
                        ? `$ ${displayValue.toLocaleString()}`
                        : activeMetric === 'visits'
                        ? `${displayValue.toLocaleString()} VISITS`
                        : `${displayValue.toLocaleString()} LEADS`
                      }
                    </span>
                  </div>

                  {/* Horizontal visual progress bars */}
                  <div className="w-full h-2 bg-slate-100 rounded-3xs overflow-hidden">
                    <div
                      className={`h-full transition-all duration-500 rounded-3xs ${
                        isSelected 
                          ? 'bg-[#f37321]' 
                          : belongsToRegion 
                          ? 'bg-[#2563eb]' 
                          : 'bg-slate-400'
                      }`}
                      style={{ width: `${percentOfMax}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
};
