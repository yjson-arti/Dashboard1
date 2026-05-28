/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import {
  countriesData,
  generateSearchDailyData,
  getKeywordPerformanceData,
  getKeywordGroupData
} from '../data';
import {
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ScatterChart,
  Scatter,
  ZAxis,
  ReferenceLine
} from 'recharts';
import { Filter, Search, Award, TrendingUp, Grid, ListCollapse } from 'lucide-react';

export const SearchAdDashboardView: React.FC = () => {
  // Region & Country States
  const [selectedRegion, setSelectedRegion] = useState<string>('global');
  const [selectedCountry, setSelectedCountry] = useState<string>('전체');
  const [sortMetric, setSortMetric] = useState<'leads' | 'visits'>('leads');
  const [keywordQuery, setKeywordQuery] = useState<string>('');
  const [secondaryMetric, setSecondaryMetric] = useState<'cpvisit' | 'cpl' | 'leads'>('leads');
  const [cloudMetric, setCloudMetric] = useState<'spend' | 'leads' | 'visits'>('spend');

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

  // Daily performance data
  const dailyPerformance = useMemo(() => {
    return generateSearchDailyData(selectedRegion, selectedCountry);
  }, [selectedRegion, selectedCountry]);

  // Keyword Performance data
  const rawKeywords = useMemo(() => {
    return getKeywordPerformanceData(selectedRegion, selectedCountry);
  }, [selectedRegion, selectedCountry]);

  // Keyword Group performance
  const keywordGroups = useMemo(() => {
    return getKeywordGroupData(selectedRegion, selectedCountry);
  }, [selectedRegion, selectedCountry]);

  // Top 10 Keywords Summary data (retained just in case)
  const topKeywords = useMemo(() => {
    return [...rawKeywords]
      .sort((a, b) => b[sortMetric] - a[sortMetric])
      .slice(0, 10);
  }, [rawKeywords, sortMetric]);

  // State for Quadrant filter selection: 1 | 2 | 3 | 4 | null (overall top 10)
  const [selectedQuadrant, setSelectedQuadrant] = useState<number | null>(null);

  // Median Leads computation (dynamically updates with filter selection)
  const medianLeads = useMemo(() => {
    if (rawKeywords.length === 0) return 0;
    const sortedLeads = rawKeywords.map(k => k.leads).sort((a, b) => a - b);
    const mid = Math.floor(sortedLeads.length / 2);
    if (sortedLeads.length % 2 !== 0) {
      return sortedLeads[mid];
    }
    return (sortedLeads[mid - 1] + sortedLeads[mid]) / 2;
  }, [rawKeywords]);

  // Median Visits computation (dynamically updates with filter selection)
  const medianVisits = useMemo(() => {
    if (rawKeywords.length === 0) return 0;
    const sortedVisits = rawKeywords.map(k => k.visits).sort((a, b) => a - b);
    const mid = Math.floor(sortedVisits.length / 2);
    if (sortedVisits.length % 2 !== 0) {
      return sortedVisits[mid];
    }
    return (sortedVisits[mid - 1] + sortedVisits[mid]) / 2;
  }, [rawKeywords]);

  // Assign quadrants to all keywords
  const keywordsWithQuadrant = useMemo(() => {
    return rawKeywords.map(k => {
      let quad = 3; // Default to Q3
      if (k.leads >= medianLeads && k.visits >= medianVisits) quad = 1;      // 1사분면 (Top-Right)
      else if (k.leads < medianLeads && k.visits >= medianVisits) quad = 2; // 2사분면 (Top-Left)
      else if (k.leads < medianLeads && k.visits < medianVisits) quad = 3;  // 3사분면 (Bottom-Left)
      else if (k.leads >= medianLeads && k.visits < medianVisits) quad = 4; // 4사분면 (Bottom-Right)
      return { ...k, quadrant: quad };
    });
  }, [rawKeywords, medianLeads, medianVisits]);

  // Count items per quadrant
  const quadrantCounts = useMemo(() => {
    const counts = { 1: 0, 2: 0, 3: 0, 4: 0 };
    keywordsWithQuadrant.forEach(k => {
      counts[k.quadrant as 1 | 2 | 3 | 4]++;
    });
    return counts;
  }, [keywordsWithQuadrant]);

  // Filter side list of keywords based on clicked quadrant or default to top 10
  const displayedSideKeywords = useMemo(() => {
    if (selectedQuadrant === null) {
      return [...rawKeywords]
        .sort((a, b) => b[sortMetric] - a[sortMetric])
        .slice(0, 10);
    }
    return keywordsWithQuadrant
      .filter(k => k.quadrant === selectedQuadrant)
      .sort((a, b) => b[sortMetric] - a[sortMetric]);
  }, [keywordsWithQuadrant, selectedQuadrant, sortMetric]);

  // Filtered detailed keyword table listing based on search box input
  const filteredKeywordTable = useMemo(() => {
    if (!keywordQuery) return rawKeywords;
    return rawKeywords.filter(
      k => k.keyword.toLowerCase().includes(keywordQuery.toLowerCase()) ||
           k.adGroup.toLowerCase().includes(keywordQuery.toLowerCase())
    );
  }, [rawKeywords, keywordQuery]);

  // Calculate high precision sums for searched keyword display
  const searchTotals = useMemo(() => {
    const totalSpend = dailyPerformance.reduce((sum, d) => sum + d.spend, 0);
    const totalLeads = dailyPerformance.reduce((sum, d) => sum + d.leads, 0);
    const totalVisits = dailyPerformance.reduce((sum, d) => sum + d.visits, 0);
    
    return {
      spend: totalSpend,
      leads: totalLeads,
      visits: totalVisits
    };
  }, [dailyPerformance]);

  // Search state for cloud keywords positioned to keep larger metrics in the center
  const cloudKeywords = useMemo(() => {
    // Sort descending first
    const sorted = [...rawKeywords].sort((a, b) => b[cloudMetric] - a[cloudMetric]);
    
    // Redistribute outwards from middle
    const redistributed: typeof rawKeywords = [];
    sorted.forEach((item, idx) => {
      if (idx % 2 === 0) {
        redistributed.push(item);
      } else {
        redistributed.unshift(item);
      }
    });
    return redistributed;
  }, [rawKeywords, cloudMetric]);

  const maxMetricVal = useMemo(() => {
    if (rawKeywords.length === 0) return 1;
    return Math.max(...rawKeywords.map(k => k[cloudMetric])) || 1;
  }, [rawKeywords, cloudMetric]);

  const minMetricVal = useMemo(() => {
    if (rawKeywords.length === 0) return 0;
    return Math.min(...rawKeywords.map(k => k[cloudMetric])) || 0;
  }, [rawKeywords, cloudMetric]);

  return (
    <div className="space-y-5">
      {/* Search Ad Filters */}
      <div className="bg-white p-3.5 rounded-sm border border-slate-200/65 shadow-2xs flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <div className="p-1 px-2.5 bg-[#f37321] text-white rounded-sm font-bold text-xs font-mono">
            SEARCH
          </div>
          <div>
            <span className="text-[10px] text-slate-400 block font-mono leading-none">SEARCH ENGINE CAMPAIGN PERFORMANCES</span>
            <span className="text-xs font-bold text-slate-800">검색광고 통합 퍼포먼스 관리 대시보드</span>
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

      {/* Daily Performance Timeline Visualization */}
      <div className="bg-white p-4 rounded-sm border border-slate-200/65 shadow-2xs flex flex-col h-[380px]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800">
              Daily Search ads Trend
            </h4>
            <p className="text-[10px] text-slate-400 font-mono mt-0.5">
              * Bars represent daily spend (fixed on left Y-axis). Choose a metric on the right to visualize on the secondary Y-axis (right).
            </p>
          </div>
          
          {/* Top-Right Filter selector for the Secondary Y-Axis */}
          <div className="flex flex-wrap items-center gap-2 self-start sm:self-center">
            <span className="text-[10px] font-bold text-slate-400 uppercase font-sans tracking-wider">Secondary Y-Axis Metric:</span>
            <select
              value={secondaryMetric}
              onChange={(e) => setSecondaryMetric(e.target.value as 'cpvisit' | 'cpl' | 'leads')}
              className="px-3 py-1.5 bg-white border border-slate-200 rounded-sm text-[11px] font-sans font-semibold text-slate-700 hover:border-slate-300 focus:outline-none focus:ring-1 focus:ring-[#f37321]/30 focus:border-[#f37321] shadow-2xs cursor-pointer select-none"
            >
              <option value="cpvisit">CPvisit</option>
              <option value="cpl">CPL visit</option>
              <option value="leads">Lead</option>
            </select>
          </div>
        </div>

        <div className="flex-1 min-h-0">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={dailyPerformance} margin={{ top: 10, right: 10, left: 10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="2 2" vertical={false} stroke="#eaeaea" />
              <XAxis dataKey="date" stroke="#64748b" fontSize={9} tickLine={false} className="font-mono" />
              
              {/* Primary Y-axis on the left, fixed to Spend ($) */}
              <YAxis 
                yAxisId="spend" 
                stroke="#1e293b" 
                fontSize={9} 
                tickFormatter={(val) => `$${val.toLocaleString()}`} 
                className="font-mono" 
              />
              
              {/* Secondary Y-axis on the right, dynamically formatted based on selected metric */}
              <YAxis 
                yAxisId="secondary" 
                orientation="right" 
                stroke={
                  secondaryMetric === 'cpvisit' ? '#0066cc' :
                  secondaryMetric === 'cpl' ? '#9333ea' : '#f37321'
                } 
                fontSize={9} 
                tickFormatter={(val) => {
                  if (secondaryMetric === 'leads') return val.toLocaleString();
                  return `$${val}`;
                }} 
                className="font-mono" 
              />
              
              <Tooltip
                contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '2px', fontSize: '11px', color: 'white', fontFamily: 'monospace' }}
                formatter={(value: any, name: string) => {
                  if (name === 'spend') return [`$${value.toLocaleString()}`, 'Ad Spend (광고비)'];
                  if (name === 'cpvisit' || name === 'CPvisit') return [`$${value.toFixed(2)}`, 'CPvisit (방문당 비용)'];
                  if (name === 'cpl' || name === 'CPL visit') return [`$${value.toFixed(1)}`, 'CPL visit (리드당 비용)'];
                  if (name === 'leads' || name === 'Lead') return [`${value.toLocaleString()} 건`, 'Lead (리드 획득)'];
                  return [value, name];
                }}
              />
              
              {/* Spend is always a fixed column on the left axis */}
              <Bar yAxisId="spend" dataKey="spend" name="spend" fill="#1e293b" radius={0} barSize={12} />
              
              {/* Selected Secondary metric plotted as a dynamic line on the right axis */}
              <Line 
                yAxisId="secondary" 
                type="monotone" 
                dataKey={secondaryMetric} 
                name={
                  secondaryMetric === 'cpvisit' ? 'CPvisit' :
                  secondaryMetric === 'cpl' ? 'CPL visit' : 'Lead'
                }
                stroke={
                  secondaryMetric === 'cpvisit' ? '#0066cc' :
                  secondaryMetric === 'cpl' ? '#9333ea' : '#f37321'
                } 
                strokeWidth={2.5} 
                dot={secondaryMetric === 'leads' ? { r: 3 } : false} 
                activeDot={{ r: 5 }}
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Daily Performance Grid (Table) */}
      <div className="bg-white rounded-sm border border-slate-200/65 shadow-2xs overflow-hidden">
        <div className="px-4 py-2 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800">Daily Performance Breakdown</h3>
          <span className="text-[9px] text-slate-400 font-mono">Last 30 Days Record</span>
        </div>
        <div className="overflow-x-auto max-h-[280px] overflow-y-auto">
          <table className="min-w-full text-[11px] font-mono text-left text-slate-600 border-collapse">
            <thead className="text-[10px] uppercase bg-slate-100 text-slate-500 border-b border-slate-200 sticky top-0 z-10 font-sans">
              <tr>
                <th className="px-4 py-2 font-bold text-slate-800">Date Log</th>
                <th className="px-4 py-2 font-bold text-right">Ad Spend</th>
                <th className="px-4 py-2 font-bold text-right">Impressions</th>
                <th className="px-4 py-2 font-bold text-right">Clicks</th>
                <th className="px-4 py-2 font-bold text-right">CTR</th>
                <th className="px-4 py-2 font-bold text-right">CPC</th>
                <th className="px-4 py-2 font-bold text-right text-slate-700">Visits</th>
                <th className="px-4 py-2 font-bold text-right font-mono">Visit Rate</th>
                <th className="px-4 py-2 font-bold text-right font-mono">CPVisit</th>
                <th className="px-4 py-2 font-bold text-right text-emerald-600 font-mono">Qvisit</th>
                <th className="px-4 py-2 font-bold text-right text-teal-600 font-mono">CPQV</th>
                <th className="px-4 py-2 font-bold text-right text-[#f37321]">Leads</th>
                <th className="px-4 py-2 font-bold text-right text-purple-600 font-semibold">CPL</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-150">
              {dailyPerformance.map((row) => (
                <tr key={row.date} className="hover:bg-slate-50">
                  <td className="px-4 py-1.5 font-bold text-slate-800">{row.date}</td>
                  <td className="px-4 py-1.5 text-right text-slate-900">${row.spend.toLocaleString()}</td>
                  <td className="px-4 py-1.5 text-right text-slate-400">{row.impressions.toLocaleString()}</td>
                  <td className="px-4 py-1.5 text-right">{row.clicks.toLocaleString()}</td>
                  <td className="px-4 py-1.5 text-right font-bold text-[#f37321]">{(row.ctr * 100).toFixed(2)}%</td>
                  <td className="px-4 py-1.5 text-right">${row.cpc.toFixed(2)}</td>
                  <td className="px-4 py-1.5 text-right text-slate-700 font-semibold">{row.visits.toLocaleString()}</td>
                  <td className="px-4 py-1.5 text-right">{(row.visitRate * 100).toFixed(1)}%</td>
                  <td className="px-4 py-1.5 text-right">${row.cpvisit.toFixed(2)}</td>
                  <td className="px-4 py-1.5 text-right text-emerald-600 font-bold">{row.qvisits.toLocaleString()}</td>
                  <td className="px-4 py-1.5 text-right text-teal-600 font-bold">${row.cpqv.toFixed(2)}</td>
                  <td className="px-4 py-1.5 text-right text-[#f37321] font-bold">{row.leads}</td>
                  <td className="px-4 py-1.5 text-right text-purple-600 font-bold">${row.cpl.toFixed(1)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Keyword Analysis (Word Cloud Visualizer) */}
      <div className="bg-white p-4 rounded-sm border border-slate-200/65 shadow-2xs flex flex-col min-h-[320px]">
        {/* Header with Title and Control Filter */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 border-b border-slate-100 pb-3">
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800">
              Keyword Analysis
            </h3>
            <p className="text-[10px] text-slate-400 font-mono mt-0.5">
              * The size of each word shows the volume relative to other keywords. Hover to inspect precise metrics.
            </p>
          </div>
          
          {/* Top-Right Dropdown selector for Word Cloud Metric */}
          <div className="flex flex-wrap items-center gap-2 self-start sm:self-center">
            <span className="text-[10px] font-bold text-slate-400 uppercase font-sans tracking-wider">Metric:</span>
            <select
              value={cloudMetric}
              onChange={(e) => setCloudMetric(e.target.value as 'spend' | 'leads' | 'visits')}
              className="px-3 py-1.5 bg-white border border-slate-200 rounded-sm text-[11px] font-sans font-semibold text-slate-700 hover:border-slate-300 focus:outline-none focus:ring-1 focus:ring-[#f37321]/30 focus:border-[#f37321] shadow-2xs cursor-pointer select-none"
            >
              <option value="spend">Spend (광고비)</option>
              <option value="leads">Lead (리드 획득)</option>
              <option value="visits">Visits (방문 수)</option>
            </select>
          </div>
        </div>

        {/* Dynamic Subheading matching the user's image */}
        <div className="text-center mb-4">
          <span className="text-[10.5px] font-extrabold font-sans text-slate-700 uppercase tracking-wide">
            Keywords ({cloudMetric === 'spend' ? 'Spend' : cloudMetric === 'leads' ? 'Leads' : 'Visits'})
          </span>
        </div>

        {/* Word Cloud Body with stable layout */}
        <div className="flex-1 flex flex-wrap items-center justify-center p-2 gap-x-3 gap-y-1.5 max-w-4xl mx-auto overflow-hidden min-h-[220px]">
          {cloudKeywords.map((k) => {
            const val = k[cloudMetric];
            const range = maxMetricVal - minMetricVal || 1;
            const normalized = (val - minMetricVal) / range;
            
            // Scaled font size from 11px up to 38px
            const fontSize = 11 + normalized * 27;

            // Deterministic coloring based on keyword character string
            const charSum = k.keyword.split('').reduce((sum, ch) => sum + ch.charCodeAt(0), 0);
            const fontColors = [
              'text-rose-500/85 hover:text-rose-600', 
              'text-sky-500/85 hover:text-sky-600', 
              'text-emerald-500/85 hover:text-emerald-600', 
              'text-amber-500/85 hover:text-amber-600', 
              'text-[#f37321]/90 hover:text-[#f37321]', 
              'text-purple-500/85 hover:text-purple-600', 
              'text-pink-500/85 hover:text-pink-600', 
              'text-blue-600/85 hover:text-blue-700', 
              'text-teal-600/85 hover:text-teal-700',
              'text-indigo-500/85 hover:text-indigo-600',
              'text-slate-500/75 hover:text-slate-600'
            ];
            const colorClass = fontColors[charSum % fontColors.length];

            return (
              <span 
                key={k.keyword}
                className="relative group inline-block font-sans font-bold tracking-tight select-none cursor-pointer transition-all hover:scale-105 active:scale-95 leading-tight"
                style={{ fontSize: `${fontSize}px`, padding: '1px 3px' }}
              >
                <span className={colorClass}>{k.keyword}</span>
                
                {/* Elegant Black Floating Tooltip */}
                <span className="pointer-events-none absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block z-50 bg-slate-900 border border-slate-700/60 text-white rounded-xs p-2.5 shadow-md text-[10px] w-48 font-mono leading-relaxed text-left normal-case tracking-normal">
                  <strong className="block text-[11px] font-sans font-bold text-[#f37321] border-b border-slate-700 pb-1 mb-1.5 uppercase tracking-tight">
                    {k.keyword}
                  </strong>
                  <span className="flex justify-between">
                    <span className="text-slate-400">Ad Spend:</span>
                    <span className="text-white font-bold">${k.spend.toLocaleString()}</span>
                  </span>
                  <span className="flex justify-between">
                    <span className="text-slate-400">Leads:</span>
                    <span className="text-[#f37321] font-bold">{k.leads.toLocaleString()} 건</span>
                  </span>
                  <span className="flex justify-between">
                    <span className="text-slate-400">Visits:</span>
                    <span className="text-blue-400 font-bold">{k.visits.toLocaleString()} 회</span>
                  </span>
                  <span className="flex justify-between border-t border-slate-800 pt-1 mt-1">
                    <span className="text-slate-400 font-sans text-[9px]">Ad Group:</span>
                    <span className="text-slate-300 font-sans font-medium text-[9px]">{k.adGroup}</span>
                  </span>
                </span>
              </span>
            );
          })}
        </div>
      </div>

      {/* Top Keyword Quadrant Visualization & Bar split */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Top Keywords quadrant or bar visualization */}
        <div className="bg-white p-4 rounded-sm border border-slate-200/65 shadow-2xs flex flex-col h-[490px] lg:col-span-7">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3 border-b border-slate-100 pb-2">
            <div>
              <div className="flex items-center gap-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800">Spend vs Leads (Efficiency Quadrant)</h4>
                {selectedQuadrant !== null && (
                  <button 
                    onClick={() => setSelectedQuadrant(null)}
                    className="text-[10px] text-red-500 hover:text-red-700 bg-red-50 px-1.5 py-0.5 rounded-sm font-bold font-sans cursor-pointer transition-colors"
                  >
                    필터 해제 X
                  </button>
                )}
              </div>
              <p className="text-[9px] text-slate-400 font-sans mt-0.5">
                X축: 리드수 / Y축: 방문수 / 버블 크기: 광고비 (각 중앙값: Leads {medianLeads}건, Visits {medianVisits.toLocaleString()}회)
              </p>
            </div>

            {/* Sorting toggle for side table and bubbles */}
            <div className="inline-flex rounded-sm border border-slate-200 p-0.5 bg-slate-50 text-[10px] self-start sm:self-auto">
              <button
                className={`px-2 py-1 rounded-xs transition-all cursor-pointer font-bold ${
                  sortMetric === 'leads' ? 'bg-[#f37321] text-white' : 'text-slate-500 hover:text-slate-800'
                }`}
                onClick={() => setSortMetric('leads')}
              >
                리드 우선
              </button>
              <button
                className={`px-2 py-1 rounded-xs transition-all cursor-pointer font-bold ${
                  sortMetric === 'visits' ? 'bg-[#f37321] text-white' : 'text-slate-500 hover:text-slate-800'
                }`}
                onClick={() => setSortMetric('visits')}
              >
                방문 우선
              </button>
            </div>
          </div>

          {/* 2x2 Quadrant Select Grid mimicking visual layout of mathematical quadrants */}
          <div className="grid grid-cols-2 gap-2 mb-3 select-none">
            {[
              { id: 2, label: '2사분면: 방문 우수 키워드', desc: `Leads < ${medianLeads}, Visits >= ${medianVisits}`, color: 'border-amber-200 text-amber-800 bg-amber-50/40 hover:bg-amber-50', activeColor: 'bg-amber-500 text-white border-amber-500 shadow-xs' },
              { id: 1, label: '1사분면: 고효율 키워드', desc: `Leads >= ${medianLeads}, Visits >= ${medianVisits}`, color: 'border-emerald-200 text-emerald-800 bg-emerald-50/40 hover:bg-emerald-50', activeColor: 'bg-emerald-500 text-white border-emerald-500 shadow-xs' },
              { id: 3, label: '3사분면: 저효율 키워드', desc: `Leads < ${medianLeads}, Visits < ${medianVisits}`, color: 'border-rose-200 text-rose-800 bg-rose-50/40 hover:bg-rose-50', activeColor: 'bg-rose-500 text-white border-rose-500 shadow-xs' },
              { id: 4, label: '4사분면: 리드 우수 키워드', desc: `Leads >= ${medianLeads}, Visits < ${medianVisits}`, color: 'border-indigo-200 text-indigo-800 bg-indigo-50/40 hover:bg-indigo-50', activeColor: 'bg-indigo-500 text-white border-indigo-500 shadow-xs' }
            ].map((q) => {
              const isActive = selectedQuadrant === q.id;
              const count = quadrantCounts[q.id as 1 | 2 | 3 | 4];
              return (
                <button
                  key={q.id}
                  onClick={() => setSelectedQuadrant(isActive ? null : q.id)}
                  className={`p-1.5 px-2.5 rounded-xs border text-left transition-all duration-150 cursor-pointer flex flex-col justify-between h-[48px] ${
                    isActive ? q.activeColor : `${q.color}`
                  }`}
                >
                  <div className="flex items-center justify-between w-full">
                    <span className="text-[10px] font-bold font-sans tracking-tight">{q.label}</span>
                    <span className={`text-[8.5px] px-1 font-bold rounded-xs ${isActive ? 'bg-white/30 text-white' : 'bg-slate-200/50 text-slate-600'}`}>
                      {count}개
                    </span>
                  </div>
                  <span className={`text-[7.5px] font-mono leading-none ${isActive ? 'text-white/80' : 'text-slate-400'}`}>
                    {q.desc}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Scatter Chart representing Leads vs Visits with bubble sizes matching Spend */}
          <div className="flex-1 min-h-0 relative">
            <ResponsiveContainer width="100%" height="100%">
              <ScatterChart margin={{ top: 15, right: 15, bottom: 20, left: -5 }}>
                <CartesianGrid strokeDasharray="1 1" stroke="#f1f5f9" />
                
                {/* Dynamically divide quadrants using lines corresponding to median coordinates */}
                <ReferenceLine x={medianLeads} stroke="#cbd5e1" strokeWidth={1} strokeDasharray="3 3" />
                <ReferenceLine y={medianVisits} stroke="#cbd5e1" strokeWidth={1} strokeDasharray="3 3" />

                <XAxis 
                  type="number" 
                  dataKey="leads" 
                  name="획득 리드" 
                  stroke="#94a3b8" 
                  fontSize={8} 
                  label={{ value: 'Leads (EA)', position: 'insideBottom', offset: -5, fontSize: '8px', fill: '#94a3b8', fontWeight: 'bold' }} 
                  className="font-mono" 
                  tickLine={false}
                />
                <YAxis 
                  type="number" 
                  dataKey="visits" 
                  name="방문수" 
                  stroke="#94a3b8" 
                  fontSize={8} 
                  label={{ value: 'Visits (EA)', angle: -90, position: 'insideLeft', offset: 5, fontSize: '8px', fill: '#94a3b8', fontWeight: 'bold' }} 
                  className="font-mono" 
                  tickLine={false}
                />
                <ZAxis type="number" dataKey="spend" range={[40, 480]} name="광고비" />
                
                <Tooltip
                  cursor={{ strokeDasharray: '2 2', stroke: '#cbd5e1' }}
                  contentStyle={{ backgroundColor: '#0f172a', border: 'none', borderRadius: '3px', fontSize: '10px', color: 'white', fontFamily: 'monospace', padding: '8px 12px' }}
                  formatter={(value, name) => {
                    if (name === '광고비' || name === 'spend') return [`$${value.toLocaleString()}`, 'Ad Spend'];
                    if (name === '획득 리드' || name === 'leads') return [`${value} 건`, 'Leads'];
                    if (name === '방문수' || name === 'visits') return [`${value.toLocaleString()} 회`, 'Visits'];
                    return [value, name];
                  }}
                />

                {/* Render keywords scatter bubbles */}
                <Scatter
                  name="Campaign Keywords"
                  data={keywordsWithQuadrant}
                  shape={(props: any) => {
                    const { cx, cy, payload } = props;
                    
                    // Radius dynamic mapping based on spend
                    const minSpend = Math.min(...rawKeywords.map(k => k.spend)) || 1;
                    const maxSpend = Math.max(...rawKeywords.map(k => k.spend)) || 1000;
                    const spendSpan = maxSpend - minSpend || 1;
                    const r = 5 + ((payload.spend - minSpend) / spendSpan) * 14; 
                    
                    // Dim elements not in active filtered quadrant
                    const isFilteredOut = selectedQuadrant !== null && payload.quadrant !== selectedQuadrant;
                    const fillOpacity = isFilteredOut ? 0.08 : 0.65;
                    const strokeOpacity = isFilteredOut ? 0.08 : 0.9;
                    
                    // Stylistic coloring matching quadrant
                    let color = '#3b82f6';
                    let strokeColor = '#1d4ed8';
                    if (payload.quadrant === 1) { color = '#10b981'; strokeColor = '#047857'; } // green/emerald (고효율)
                    else if (payload.quadrant === 2) { color = '#f59e0b'; strokeColor = '#b45309'; } // orange/amber (방문 우수)
                    else if (payload.quadrant === 3) { color = '#ef4444'; strokeColor = '#b91c1c'; } // red/rose (저효율)
                    else if (payload.quadrant === 4) { color = '#6366f1'; strokeColor = '#4338ca'; } // indigo (리드 우수)
                    
                    return (
                      <g 
                        className="cursor-pointer transition-all hover:scale-110 active:scale-95"
                        onClick={() => {
                          setSelectedQuadrant(payload.quadrant === selectedQuadrant ? null : payload.quadrant);
                        }}
                      >
                        <circle 
                          cx={cx} 
                          cy={cy} 
                          r={r} 
                          fill={color} 
                          fillOpacity={fillOpacity} 
                          stroke={strokeColor} 
                          strokeWidth={1.2} 
                          strokeOpacity={strokeOpacity}
                        />
                        {!isFilteredOut && (
                          <text 
                            x={cx} 
                            y={cy - r - 3} 
                            fontSize={7.5} 
                            textAnchor="middle" 
                            className="font-mono font-bold fill-slate-700 pointer-events-none drop-shadow-xs select-none"
                          >
                            {payload.keyword}
                          </text>
                        )}
                      </g>
                    );
                  }}
                />
              </ScatterChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Dynamic target keyword list box panel reflecting selected quadrant filter */}
        <div className="bg-white p-4 rounded-sm border border-slate-200/65 shadow-2xs flex flex-col h-[490px] lg:col-span-5 overflow-hidden">
          <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-100 flex-wrap gap-2">
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800">
                {selectedQuadrant === null ? 'Top 10 High-Performing Keywords' : (() => {
                  if (selectedQuadrant === 1) return '1사분면: 고효율 키워드 목록';
                  if (selectedQuadrant === 2) return '2사분면: 방문 우수 키워드 목록';
                  if (selectedQuadrant === 3) return '3사분면: 저효율 키워드 목록';
                  return '4사분면: 리드 우수 키워드 목록';
                })()}
              </h4>
              <p className="text-[9.5px] text-slate-400 font-sans mt-0.5">
                {selectedQuadrant === null ? '전체 키워드 중 우선 10개 키워드가 표시됩니다.' : '해당 사분면에 매칭된 키워드입니다.'}
              </p>
            </div>
            <span className={`text-[9px] px-1.5 py-0.5 font-bold rounded-sm uppercase font-mono ${
              selectedQuadrant === null ? 'bg-slate-100 text-slate-500' : 
              selectedQuadrant === 1 ? 'bg-emerald-100 text-emerald-700' :
              selectedQuadrant === 2 ? 'bg-amber-100 text-amber-700' :
              selectedQuadrant === 3 ? 'bg-rose-100 text-rose-700' : 'bg-indigo-100 text-indigo-700'
            }`}>
              {selectedQuadrant === null ? 'Rankings' : `${displayedSideKeywords.length}개`}
            </span>
          </div>

          <div className="flex-1 overflow-y-auto divide-y divide-slate-100 pr-1">
            {displayedSideKeywords.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-slate-400 py-10 font-sans">
                <p className="text-xs font-bold">선택된 분면에 소속된 키워드가 없습니다.</p>
                <p className="text-[10px] mt-1 text-slate-400">다른 국가/지역 필터 혹은 다른 사분면을 선택해보세요.</p>
              </div>
            ) : (
              displayedSideKeywords.map((k, index) => {
                // Determine bullet visual style matching quadrant color
                let bulletBg = 'bg-slate-400';
                if (k.quadrant === 1) bulletBg = 'bg-emerald-500';
                else if (k.quadrant === 2) bulletBg = 'bg-amber-500';
                else if (k.quadrant === 3) bulletBg = 'bg-rose-500';
                else if (k.quadrant === 4) bulletBg = 'bg-indigo-500';

                return (
                  <div key={k.keyword} className="py-2.5 flex items-center justify-between text-xs transition-colors hover:bg-slate-50/50">
                    <div className="flex items-center gap-2">
                      <span className={`w-2 h-2 rounded-full ${bulletBg} shrink-0`} />
                      {selectedQuadrant === null && (
                        <span className="font-bold text-slate-400 w-4 font-mono text-[10px]">{index + 1}</span>
                      )}
                      <div>
                        <span className="font-bold text-slate-800 block select-all">{k.keyword}</span>
                        <div className="flex items-center gap-1.5 text-[9.5px] text-slate-400 font-sans">
                          <span>{k.adGroup}</span>
                          <span className="text-slate-300">|</span>
                          <span className="font-mono text-[9px]">Q{k.quadrant}</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right font-mono">
                      <div className="font-bold text-slate-800">
                        {sortMetric === 'leads' ? `${k.leads} Leads` : `${k.visits.toLocaleString()} Visits`}
                      </div>
                      <div className="text-[9.5px] text-slate-400">
                        Spend: <span className="text-slate-600 font-bold">${k.spend.toLocaleString()}</span> / CPL: <span className="text-blue-600 font-medium">${Math.round(k.cpl)}</span>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>

      {/* Keyword Group table (Category) */}
      <div className="bg-white rounded-sm border border-slate-200/65 shadow-2xs overflow-hidden">
        <div className="px-4 py-2 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800">Keyword Group Performance Breakdown</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full text-[11px] font-mono text-left text-slate-600 border-collapse">
            <thead className="text-[10px] uppercase bg-slate-100 text-slate-500 border-b border-slate-200 font-sans">
              <tr>
                <th className="px-4 py-2.5 font-bold text-slate-800">Ad Group Name</th>
                <th className="px-4 py-2.5 font-bold text-right">Ad Spend</th>
                <th className="px-4 py-2.5 font-bold text-right">Impressions</th>
                <th className="px-4 py-2.5 font-bold text-right">Clicks</th>
                <th className="px-4 py-2.5 font-bold text-right">CTR</th>
                <th className="px-4 py-2.5 font-bold text-right">CPC</th>
                <th className="px-4 py-2.5 font-bold text-right">Visits</th>
                <th className="px-4 py-2.5 font-bold text-right">Visit Rate</th>
                <th className="px-4 py-2.5 font-bold text-right">CPVisit</th>
                <th className="px-4 py-2.5 font-bold text-right text-emerald-600 font-mono">Qvisit</th>
                <th className="px-4 py-2.5 font-bold text-right text-teal-600 font-mono">CPQV</th>
                <th className="px-4 py-2.5 font-bold text-right text-[#f37321]">Leads</th>
                <th className="px-4 py-2.5 font-bold text-right text-blue-600 font-semibold">CPL</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-150">
              {keywordGroups.map((row) => (
                <tr key={row.adGroup} className="hover:bg-slate-50">
                  <td className="px-4 py-2 font-sans font-bold text-slate-800">{row.adGroup}</td>
                  <td className="px-4 py-2 text-right text-slate-900">${row.spend.toLocaleString()}</td>
                  <td className="px-4 py-2 text-right text-slate-400">{row.impressions.toLocaleString()}</td>
                  <td className="px-4 py-2 text-right">{row.clicks.toLocaleString()}</td>
                  <td className="px-4 py-2 text-right font-bold text-[#f37321]">{(row.ctr * 100).toFixed(2)}%</td>
                  <td className="px-4 py-2 text-right">${row.cpc.toFixed(2)}</td>
                  <td className="px-4 py-2 text-right text-slate-700 font-bold">{row.visits.toLocaleString()}</td>
                  <td className="px-4 py-2 text-right">{(row.visitRate * 100).toFixed(1)}%</td>
                  <td className="px-4 py-2 text-right">${row.cpvisit.toFixed(2)}</td>
                  <td className="px-4 py-2 text-right text-emerald-600 font-bold">{row.qvisits.toLocaleString()}</td>
                  <td className="px-4 py-2 text-right text-teal-600 font-bold">${row.cpqv.toFixed(2)}</td>
                  <td className="px-4 py-2 text-right text-[#f37321] font-bold">{row.leads.toLocaleString()}</td>
                  <td className="px-4 py-2 text-right text-blue-600 font-bold">${row.cpl.toFixed(1)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Keyword 별 실적 (표) */}
      <div className="bg-white rounded-sm border border-slate-200/65 shadow-2xs overflow-hidden">
        <div className="px-4 py-2 bg-slate-50 border-b border-slate-200 flex flex-wrap items-center justify-between gap-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800">Keyword Performance Breakdown</h3>

          {/* Table Search bar */}
          <div className="relative">
            <input
              type="text"
              placeholder="Search keyword / ad group..."
              className="text-2xs border border-slate-200 rounded-sm pl-8 pr-3 py-1.5 bg-white text-slate-700 focus:outline-none focus:border-[#f37321] font-sans w-[220px]"
              value={keywordQuery}
              onChange={(e) => setKeywordQuery(e.target.value)}
            />
            <Search className="absolute left-2.5 top-2.5 text-slate-400" size={11} />
          </div>
        </div>

        <div className="overflow-x-auto max-h-[380px] overflow-y-auto">
          <table className="min-w-full text-[11px] font-mono text-left text-slate-600 border-collapse">
            <thead className="text-[10px] uppercase bg-slate-100 text-slate-500 border-b border-slate-200 sticky top-0 z-10 font-sans">
              <tr>
                <th className="px-4 py-2 font-bold text-slate-800">Keyword</th>
                <th className="px-4 py-2 font-bold">Ad Group</th>
                <th className="px-3 py-2 font-bold text-center">UK Vol</th>
                <th className="px-4 py-2 font-bold text-right">Ad Spend</th>
                <th className="px-4 py-2 font-bold text-right">Impressions</th>
                <th className="px-4 py-2 font-bold text-right">Clicks</th>
                <th className="px-4 py-2 font-bold text-right">CTR</th>
                <th className="px-4 py-2 font-bold text-right">CPC</th>
                <th className="px-4 py-2 font-bold text-right">Visits</th>
                <th className="px-4 py-2 font-bold text-right">Visit Rate</th>
                <th className="px-4 py-2 font-bold text-right">CPVisit</th>
                <th className="px-4 py-2 font-bold text-right text-emerald-600 font-mono">Qvisit</th>
                <th className="px-4 py-2 font-bold text-right text-teal-600 font-mono">CPQV</th>
                <th className="px-4 py-2 font-bold text-right text-[#f37321]">Leads</th>
                <th className="px-4 py-2 font-bold text-right text-blue-600 font-semibold">CPL</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-150">
              {filteredKeywordTable.map((row) => (
                <tr key={row.keyword} className="hover:bg-slate-50">
                  <td className="px-4 py-1.5 font-bold text-slate-800">{row.keyword}</td>
                  <td className="px-4 py-1.5 text-slate-500 font-sans">{row.adGroup}</td>
                  <td className="px-3 py-1.5 text-center text-slate-400 text-[10px]">{row.searchVolume}</td>
                  <td className="px-4 py-1.5 text-right text-slate-900">${row.spend.toLocaleString()}</td>
                  <td className="px-4 py-1.5 text-right text-slate-400">{(row.impressions / 1e3).toFixed(0)}K</td>
                  <td className="px-4 py-1.5 text-right">{row.clicks.toLocaleString()}</td>
                  <td className="px-4 py-1.5 text-right font-bold text-[#f37321]">{(row.ctr * 100).toFixed(2)}%</td>
                  <td className="px-4 py-1.5 text-right">${row.cpc.toFixed(2)}</td>
                  <td className="px-4 py-1.5 text-right text-slate-700">{row.visits.toLocaleString()}</td>
                  <td className="px-4 py-1.5 text-right">{(row.visitRate * 100).toFixed(1)}%</td>
                  <td className="px-4 py-1.5 text-right">${row.cpvisit.toFixed(2)}</td>
                  <td className="px-4 py-1.5 text-right text-emerald-600 font-bold">{row.qvisits.toLocaleString()}</td>
                  <td className="px-4 py-1.5 text-right text-teal-600 font-bold">${row.cpqv.toFixed(2)}</td>
                  <td className="px-4 py-1.5 text-right text-[#f37321] font-bold">{row.leads.toLocaleString()}</td>
                  <td className="px-4 py-1.5 text-right text-blue-600 font-bold">${row.cpl.toFixed(1)}</td>
                </tr>
              ))}
              {filteredKeywordTable.length === 0 && (
                <tr>
                  <td colSpan={13} className="px-4 py-8 text-center text-slate-400 font-sans">
                    No keywords found matching the query.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
