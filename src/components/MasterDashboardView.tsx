/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import {
  countriesData,
  calculateMasterKPIs,
  getFilteredMediaPerformance
} from '../data';
import { WorldMap } from './WorldMap';
import {
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import { Filter, DollarSign, MousePointer, Percent, Eye, FileText, Landmark } from 'lucide-react';

export const MasterDashboardView: React.FC = () => {
  // Region & Country States
  const [selectedRegion, setSelectedRegion] = useState<string>('global');
  const [selectedCountry, setSelectedCountry] = useState<string>('전체');
  const [activeLineMetric, setActiveLineMetric] = useState<'leads' | 'visits'>('leads');

  // Available countries filtered by selected region
  const availableCountries = useMemo(() => {
    const list = countriesData.filter(c => selectedRegion === 'global' || c.region === selectedRegion);
    return ['전체', ...list.map(c => c.country)];
  }, [selectedRegion]);

  // Adjust selected country if region change makes it invalid
  const handleRegionChange = (region: string) => {
    setSelectedRegion(region);
    setSelectedCountry('전체'); // Reset country filter when region shifts
  };

  // KPIs
  const kpis = useMemo(() => {
    return calculateMasterKPIs(selectedRegion, selectedCountry);
  }, [selectedRegion, selectedCountry]);

  // Table Data - Country List (Filtered)
  const filteredCountryPerformanceList = useMemo(() => {
    let list = countriesData;
    if (selectedRegion !== 'global') {
      list = list.filter(c => c.region === selectedRegion);
    }
    if (selectedCountry !== '전체') {
      list = list.filter(c => c.country === selectedCountry);
    }
    return list;
  }, [selectedRegion, selectedCountry]);

  // Media Data (Filtered)
  const mediaPerformanceList = useMemo(() => {
    return getFilteredMediaPerformance(selectedRegion, selectedCountry);
  }, [selectedRegion, selectedCountry]);

  // Media chart formatting
  const mediaChartData = useMemo(() => {
    return mediaPerformanceList.map(m => ({
      name: m.media,
      광고비: Math.round(m.spend),
      획득리드: m.leads,
      방문수: m.visits
    }));
  }, [mediaPerformanceList]);

  return (
    <div className="space-y-5">
      {/* Dynamic Filter Section */}
      <div className="bg-white p-3.5 rounded-sm border border-slate-200/65 shadow-2xs flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <div className="p-1 px-2.5 bg-[#f37321] text-white rounded-sm font-bold text-xs font-mono">
            FILTERS
          </div>
          <div>
            <span className="text-[10px] text-slate-400 block font-mono leading-none">GLOBAL METRIC FILTERS</span>
            <span className="text-xs font-bold text-slate-800">통합 마스터 대시보드 실적 필터</span>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-4">
          {/* Region filter */}
          <div className="flex items-center gap-2 text-xs">
            <span className="font-bold text-slate-500 font-sans text-2xs uppercase">Location:</span>
            <div className="inline-flex rounded-sm border border-slate-200 p-0.5 bg-slate-50 text-[11px]">
              {[
                { label: 'Global (All)', value: 'global' },
                { label: 'Americas', value: '미주' },
                { label: 'APAC', value: 'APAC' },
                { label: 'Europe (EU)', value: 'EU' }
              ].map(opt => (
                <button
                  key={opt.value}
                  className={`px-2.5 py-1 rounded-xs font-bold transition-all cursor-pointer ${
                    selectedRegion === opt.value
                      ? 'bg-[#f37321] text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-800'
                  }`}
                  onClick={() => handleRegionChange(opt.value)}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Country filter */}
          <div className="flex items-center gap-2 text-xs">
            <span className="font-bold text-slate-500 font-sans text-2xs uppercase">Country:</span>
            <select
              className="text-[11px] border border-slate-200 rounded-sm p-1 px-2 bg-white text-slate-700 focus:outline-none focus:border-[#f37321] font-sans font-bold"
              value={selectedCountry}
              onChange={(e) => setSelectedCountry(e.target.value)}
            >
              {availableCountries.map(c => (
                <option key={c} value={c}>{c === '전체' ? 'All Countries' : c}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-6 gap-3.5">
        {/* Card 1: Spend */}
        <div className="bg-white p-3.5 rounded-sm border border-slate-200/50 shadow-2xs flex flex-col justify-between">
          <div>
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mb-1">Total Ad Spend</p>
            <p className="text-lg font-mono font-bold text-slate-900">${kpis.totalSpend.toLocaleString()}</p>
          </div>
          <div className="text-[10px] text-emerald-600 font-bold mt-1.5 flex items-center gap-1">
            <span>↑ 12.4% vs LY</span>
          </div>
        </div>

        {/* Card 2: Clicks */}
        <div className="bg-white p-3.5 rounded-sm border border-slate-200/50 shadow-2xs flex flex-col justify-between">
          <div>
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mb-1">Total Clicks</p>
            <p className="text-lg font-mono font-bold text-slate-900">{kpis.clicks.toLocaleString()}</p>
          </div>
          <div className="text-[10px] text-emerald-600 font-bold mt-1.5 flex items-center gap-1">
            <span>↑ 8.2% vs LY</span>
          </div>
        </div>

        {/* Card 3: CTR */}
        <div className="bg-white p-3.5 rounded-sm border border-slate-200/50 shadow-2xs flex flex-col justify-between">
          <div>
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mb-1">Avg. CTR</p>
            <p className="text-lg font-mono font-bold text-slate-900">{(kpis.ctr * 100).toFixed(2)}%</p>
          </div>
          <div className="text-[10px] text-slate-400 font-bold mt-1.5 flex items-center gap-1">
            <span>Stable</span>
          </div>
        </div>

        {/* Card 4: Visits */}
        <div className="bg-white p-3.5 rounded-sm border border-slate-200/50 shadow-2xs flex flex-col justify-between">
          <div>
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mb-1">Total Visits</p>
            <p className="text-lg font-mono font-bold text-slate-900">{kpis.visits.toLocaleString()}</p>
          </div>
          <div className="text-[10px] text-emerald-600 font-bold mt-1.5 flex items-center gap-1">
            <span>↑ 15.1% vs LY</span>
          </div>
        </div>

        {/* Card 5: Leads */}
        <div className="bg-white p-3.5 rounded-sm border border-[#f37321]/30 bg-orange-50/5 shadow-2xs flex flex-col justify-between">
          <div>
            <p className="text-[10px] text-[#f37321] font-bold uppercase tracking-wider mb-1">Leads Acquired</p>
            <p className="text-lg font-mono font-bold text-[#f37321]">{kpis.leads.toLocaleString()}</p>
          </div>
          <div className="text-[10px] text-red-500 font-bold mt-1.5 flex items-center gap-1">
            <span>↓ 2.1% vs LY</span>
          </div>
        </div>

        {/* Card 6: CPL */}
        <div className="bg-white p-3.5 rounded-sm border border-slate-200/50 shadow-2xs flex flex-col justify-between">
          <div>
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mb-1">Cost Per Lead (CPL)</p>
            <p className="text-lg font-mono font-bold text-slate-900">${kpis.cpl.toFixed(2)}</p>
          </div>
          <div className="text-[10px] text-red-500 font-bold mt-1.5 flex items-center gap-1">
            <span>↑ 4.2% Cost Increase</span>
          </div>
        </div>
      </div>

      {/* World Map Section */}
      <WorldMap
        countries={countriesData}
        selectedCountry={selectedCountry}
        onSelectCountry={setSelectedCountry}
        selectedRegion={selectedRegion}
      />

      {/* Country Performance details table */}
      <div className="bg-white rounded-sm border border-slate-200/65 shadow-2xs overflow-hidden">
        <div className="px-4 py-2 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800">Country Performance Breakdown</h3>
          <div className="text-[9px] font-mono text-slate-400">Locked to active Location and Country configurations</div>
        </div>
        <div className="overflow-x-auto max-h-[320px] overflow-y-auto">
          <table className="min-w-full text-[11px] font-mono text-left text-slate-600 border-collapse">
            <thead className="text-[10px] uppercase bg-slate-100 text-slate-500 border-b border-slate-200 sticky top-0 z-10">
              <tr>
                <th className="px-4 py-2 font-bold font-sans">Region</th>
                <th className="px-4 py-2 font-bold font-sans">Country Name</th>
                <th className="px-4 py-2 font-bold font-sans text-right">Ad Spend</th>
                <th className="px-4 py-2 font-bold font-sans text-right">Impressions</th>
                <th className="px-4 py-2 font-bold font-sans text-right">Clicks</th>
                <th className="px-4 py-2 font-bold font-sans text-right">CTR</th>
                <th className="px-4 py-2 font-bold font-sans text-right">CPC</th>
                <th className="px-4 py-2 font-bold font-sans text-right">Visits</th>
                <th className="px-4 py-2 font-bold font-sans text-right">Visit Rate</th>
                <th className="px-4 py-2 font-bold font-sans text-right">CPVisit</th>
                <th className="px-4 py-2 font-bold font-sans text-right text-emerald-600">Qvisit</th>
                <th className="px-4 py-2 font-bold font-sans text-right text-teal-600">CPQV</th>
                <th className="px-4 py-2 font-bold font-sans text-right text-[#f37321]">Leads</th>
                <th className="px-4 py-2 font-bold font-sans text-right text-blue-600">CPL</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-150">
              {filteredCountryPerformanceList.map((row) => {
                const isSelected = selectedCountry === row.country;
                return (
                  <tr
                    key={row.country}
                    className={`hover:bg-slate-50 cursor-pointer ${
                      isSelected ? 'bg-orange-50/15' : ''
                    }`}
                    onClick={() => setSelectedCountry(isSelected ? '전체' : row.country)}
                  >
                    <td className="px-4 py-2 font-sans font-bold">{row.region}</td>
                    <td className="px-4 py-2 font-sans font-bold text-slate-800">{row.country}</td>
                    <td className="px-4 py-2 text-right text-slate-900">${row.spend.toLocaleString()}</td>
                    <td className="px-4 py-2 text-right">{(row.impressions / 1e6).toFixed(2)}M</td>
                    <td className="px-4 py-2 text-right">{(row.clicks / 1e3).toFixed(1)}K</td>
                    <td className="px-4 py-2 text-right text-[#f37321] font-bold">{(row.ctr * 100).toFixed(2)}%</td>
                    <td className="px-4 py-2 text-right">${row.cpc.toFixed(2)}</td>
                    <td className="px-4 py-2 text-right">{(row.visits / 1e3).toFixed(1)}K</td>
                    <td className="px-4 py-2 text-right">{(row.visitRate * 100).toFixed(1)}%</td>
                    <td className="px-4 py-2 text-right">${row.cpvisit.toFixed(2)}</td>
                    <td className="px-4 py-2 text-right font-bold text-emerald-600">{(row.qvisits / 1e3).toFixed(1)}K</td>
                    <td className="px-4 py-2 text-right font-bold text-teal-600">${row.cpqv.toFixed(2)}</td>
                    <td className="px-4 py-2 text-right text-[#f37321] font-bold">{row.leads.toLocaleString()}</td>
                    <td className="px-4 py-2 text-right font-bold text-blue-600">${row.cpl.toFixed(1)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Media Summary section: Graph on top, table below */}
      <div className="space-y-5">
        {/* Media Summary Chart */}
        <div className="bg-white p-4 rounded-sm border border-slate-200/65 shadow-2xs flex flex-col h-[360px]">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 border-b border-slate-100 pb-3">
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800">Media Performance Summary</h4>
              <p className="text-[10px] text-slate-400 font-mono mt-0.5">
                * Solid black bars represent Media Spend (left axis). Use the dropdown on the right to select the dynamic trend metric for the secondary scale (right axis).
              </p>
            </div>
            
            {/* Top-Right Dropdown selector for the secondary line metric */}
            <div className="flex flex-wrap items-center gap-2 self-start sm:self-center">
              <span className="text-[10px] font-bold text-slate-400 uppercase font-sans tracking-wider">Secondary Y-Axis Metric:</span>
              <select
                value={activeLineMetric}
                onChange={(e) => setActiveLineMetric(e.target.value as 'leads' | 'visits')}
                className="px-3 py-1.5 bg-white border border-slate-200 rounded-sm text-[11px] font-sans font-semibold text-slate-700 hover:border-slate-300 focus:outline-none focus:ring-1 focus:ring-[#f37321]/30 focus:border-[#f37321] shadow-2xs cursor-pointer select-none"
              >
                <option value="leads">Lead</option>
                <option value="visits">Visits</option>
              </select>
            </div>
          </div>
          <div className="flex-1 min-h-0">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart
                data={mediaChartData}
                margin={{ top: 10, right: 10, left: 10, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="2 2" vertical={false} stroke="#eaeaea" />
                <XAxis dataKey="name" stroke="#64748b" fontSize={9} tickLine={false} className="font-sans font-bold" />
                <YAxis yAxisId="left" stroke="#64748b" fontSize={9} tickFormatter={(val) => `$${(val / 1000)}k`} className="font-mono" />
                <YAxis 
                  yAxisId="right" 
                  orientation="right" 
                  stroke={activeLineMetric === 'leads' ? '#f37321' : '#0284c7'} 
                  fontSize={9} 
                  tickFormatter={(val) => `${val.toLocaleString()}`} 
                  className="font-mono" 
                />
                <Tooltip
                  formatter={(value: any, name: string) => {
                    if (name === '광고비' || name === 'Spend') return [`$${value.toLocaleString()}`, 'Spend (광고비)'];
                    if (name === '획득리드' || name === 'Leads' || name === 'Lead') return [`${value.toLocaleString()} 건`, 'Lead (리드 획득)'];
                    if (name === '방문수' || name === 'Visits') return [`${value.toLocaleString()} 회`, 'Visits (방문 수)'];
                    return [value, name];
                  }}
                  contentStyle={{ backgroundColor: '#1e293b', borderRadius: '2px', border: 'none', fontSize: '11px', color: 'white', fontFamily: 'monospace' }}
                />
                <Legend iconSize={8} wrapperStyle={{ fontSize: '10px', pt: 2 }} />
                <Bar yAxisId="left" dataKey="광고비" name="광고비" fill="#1e293b" radius={0} barSize={22} />
                <Line 
                  yAxisId="right" 
                  type="monotone" 
                  dataKey={activeLineMetric === 'leads' ? '획득리드' : '방문수'} 
                  name={activeLineMetric === 'leads' ? '획득리드' : '방문수'} 
                  stroke={activeLineMetric === 'leads' ? '#f37321' : '#0284c7'} 
                  strokeWidth={2.5} 
                  dot={activeLineMetric === 'leads' ? { r: 3 } : false}
                  activeDot={{ r: 5 }} 
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Media performance table with exact same columns as Regional Performance Breakdown */}
        <div className="bg-white rounded-sm border border-slate-200/65 shadow-2xs overflow-hidden flex flex-col">
          <div className="px-4 py-2 bg-slate-50 border-b border-slate-200">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800">Media Performance Breakdown</h3>
          </div>
          <div className="overflow-x-auto overflow-y-auto max-h-[320px]">
            <table className="min-w-full text-[11px] font-mono text-left text-slate-600 border-collapse">
              <thead className="text-[10px] uppercase bg-slate-100 text-slate-500 border-b border-slate-200 sticky top-0 z-10">
                <tr>
                  <th className="px-4 py-2 font-bold font-sans">Media Channel</th>
                  <th className="px-4 py-2 font-bold font-sans text-right">Ad Spend</th>
                  <th className="px-4 py-2 font-bold font-sans text-right">Impressions</th>
                  <th className="px-4 py-2 font-bold font-sans text-right">Clicks</th>
                  <th className="px-4 py-2 font-bold font-sans text-right">CTR</th>
                  <th className="px-4 py-2 font-bold font-sans text-right">CPC</th>
                  <th className="px-4 py-2 font-bold font-sans text-right">Visits</th>
                  <th className="px-4 py-2 font-bold font-sans text-right">Visit Rate</th>
                  <th className="px-4 py-2 font-bold font-sans text-right">CPVisit</th>
                  <th className="px-4 py-2 font-bold font-sans text-right text-emerald-600">Qvisit</th>
                  <th className="px-4 py-2 font-bold font-sans text-right text-teal-600">CPQV</th>
                  <th className="px-4 py-2 font-bold font-sans text-right text-[#f37321]">Leads</th>
                  <th className="px-4 py-2 font-bold font-sans text-right text-blue-600">CPL</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-150">
                {mediaPerformanceList.map((row) => (
                  <tr key={row.media} className="hover:bg-slate-50">
                    <td className="px-4 py-2 font-sans font-bold text-slate-800">{row.media}</td>
                    <td className="px-4 py-2 text-right text-slate-900">${Math.round(row.spend).toLocaleString()}</td>
                    <td className="px-4 py-2 text-right">{(row.impressions / 1e6).toFixed(2)}M</td>
                    <td className="px-4 py-2 text-right">{(row.clicks / 1e3).toFixed(1)}K</td>
                    <td className="px-4 py-2 text-right text-[#f37321] font-bold">{(row.ctr * 100).toFixed(2)}%</td>
                    <td className="px-4 py-2 text-right">${row.cpc.toFixed(2)}</td>
                    <td className="px-4 py-2 text-right">{(row.visits / 1e3).toFixed(1)}K</td>
                    <td className="px-4 py-2 text-right p-1 font-mono">{(row.visitRate * 100).toFixed(1)}%</td>
                    <td className="px-4 py-2 text-right">${row.cpvisit.toFixed(2)}</td>
                    <td className="px-4 py-2 text-right font-bold text-emerald-600">{(row.qvisits / 1e3).toFixed(1)}K</td>
                    <td className="px-4 py-2 text-right font-bold text-teal-600">${row.cpqv.toFixed(2)}</td>
                    <td className="px-4 py-2 text-right font-bold text-[#f37321]">{Math.round(row.leads).toLocaleString()}</td>
                    <td className="px-4 py-2 text-right font-bold text-blue-600">${row.cpl.toFixed(1)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
