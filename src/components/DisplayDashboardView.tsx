/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import {
  countriesData,
  generateDisplayDailyData,
  getDisplayMediaPerformance,
  getDisplayTargetPerformance,
  getDisplayMaterialPerformance
} from '../data';
import {
  ComposedChart,
  Area,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar
} from 'recharts';
import { Filter, Play, Layers, Target, Eye, LineChart } from 'lucide-react';

export const DisplayDashboardView: React.FC = () => {
  // Region & Country States
  const [selectedRegion, setSelectedRegion] = useState<string>('global');
  const [selectedCountry, setSelectedCountry] = useState<string>('전체');
  const [displayMetric, setDisplayMetric] = useState<'leads' | 'visits'>('leads');
  const [secondaryMetric, setSecondaryMetric] = useState<'cpvisit' | 'cpl' | 'leads'>('leads');

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

  // Daily performance timeline
  const dailyPerformance = useMemo(() => {
    return generateDisplayDailyData(selectedRegion, selectedCountry);
  }, [selectedRegion, selectedCountry]);

  // Media, Target, Materials Performance list
  const mediaPerformance = useMemo(() => {
    return getDisplayMediaPerformance(selectedRegion, selectedCountry);
  }, [selectedRegion, selectedCountry]);

  const targetPerformance = useMemo(() => {
    return getDisplayTargetPerformance(selectedRegion, selectedCountry);
  }, [selectedRegion, selectedCountry]);

  const materialPerformance = useMemo(() => {
    return getDisplayMaterialPerformance(selectedRegion, selectedCountry);
  }, [selectedRegion, selectedCountry]);

  // Format Top charts values
  const formattedMediaTop = useMemo(() => {
    return mediaPerformance.map(m => ({
      name: m.name,
      실적: m[displayMetric],
      광고비: m.spend
    })).slice(0, 5);
  }, [mediaPerformance, displayMetric]);

  const formattedTargetTop = useMemo(() => {
    return targetPerformance.map(t => ({
      name: t.name.split(' (')[0], // Extract main Korean text
      실적: t[displayMetric],
      광고비: t.spend
    })).slice(0, 5);
  }, [targetPerformance, displayMetric]);

  const formattedMaterialTop = useMemo(() => {
    return materialPerformance.map(c => ({
      name: c.name.split(' (')[0], // Extract main asset label
      실적: c[displayMetric],
      광고비: c.spend
    })).slice(0, 5);
  }, [materialPerformance, displayMetric]);

  return (
    <div className="space-y-5">
      {/* Display Ads Filter */}
      <div className="bg-white p-3.5 rounded-sm border border-slate-200/65 shadow-2xs flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <div className="p-1 px-2.5 bg-[#f37321] text-white rounded-sm font-bold text-xs font-mono">
            DISPLAY
          </div>
          <div>
            <span className="text-[10px] text-slate-400 block font-mono leading-none">DISPLAY & BRAND CAMPAIGN AGGREGATES</span>
            <span className="text-xs font-bold text-slate-800">디스플레이 광고 통합 실적 대시보드</span>
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

      {/* Daily Display performance chart */}
      <div className="bg-white p-4 rounded-sm border border-slate-200/65 shadow-2xs flex flex-col h-[380px]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800 text-left">
              Daily Display Trend
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

      {/* Top Media / Target / Creative Summaries */}
      <div className="bg-white p-4 rounded-sm border border-slate-200/65 shadow-2xs">
        <div className="flex items-center justify-between mb-4 border-b border-slate-100 pb-3 flex-wrap gap-2">
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800">Performance Segment Rankings</h4>
            <p className="text-[10px] text-slate-400 font-mono mt-0.5">최고 성과를 낸 매체 / 타겟 오디언스 세그먼트 / 크리에이티브 소재 순위</p>
          </div>

          {/* Metric selector */}
          <div className="inline-flex rounded-sm border border-slate-200 p-0.5 bg-slate-50 text-[10px]">
            <button
              className={`px-3 py-1.5 rounded-xs transition-all cursor-pointer font-bold ${
                displayMetric === 'leads' ? 'bg-[#f37321] text-white shadow-xs' : 'text-slate-500 hover:text-slate-800'
              }`}
              onClick={() => setDisplayMetric('leads')}
            >
              리드 획득 순 (Leads)
            </button>
            <button
              className={`px-3 py-1.5 rounded-xs transition-all cursor-pointer font-bold ${
                displayMetric === 'visits' ? 'bg-[#f37321] text-white shadow-xs' : 'text-slate-500 hover:text-slate-800'
              }`}
              onClick={() => setDisplayMetric('visits')}
            >
              웹 방문수 기준 (Visits)
            </button>
          </div>
        </div>

        {/* 3 Columns charts side-by-side */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Col 1: Top Media */}
          <div className="space-y-4">
            <div className="flex items-center gap-1.5 border-l-2 border-[#1e293b] pl-2">
              <span className="text-[11px] font-bold uppercase text-slate-800">Top 5 Media Efficiency</span>
            </div>
            <div className="h-[210px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={formattedMediaTop} layout="vertical" margin={{ top: 5, right: 15, left: -20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="2 2" horizontal={false} stroke="#eaeaea" />
                  <XAxis type="number" stroke="#64748b" fontSize={8} className="font-mono" />
                  <YAxis type="category" dataKey="name" stroke="#1e293b" fontSize={8} width={90} className="font-sans font-bold" />
                  <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '2px', fontSize: '10px', color: 'white', fontFamily: 'monospace' }} />
                  <Bar dataKey="실적" fill="#1e293b" radius={0} barSize={10} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Col 2: Top Target */}
          <div className="space-y-4">
            <div className="flex items-center gap-1.5 border-l-2 border-[#f37321] pl-2">
              <span className="text-[11px] font-bold uppercase text-slate-800">Top 5 Target Group Specs</span>
            </div>
            <div className="h-[210px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={formattedTargetTop} layout="vertical" margin={{ top: 5, right: 15, left: -20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="2 2" horizontal={false} stroke="#eaeaea" />
                  <XAxis type="number" stroke="#64748b" fontSize={8} className="font-mono" />
                  <YAxis type="category" dataKey="name" stroke="#1e293b" fontSize={8} width={90} className="font-sans font-bold" />
                  <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '2px', fontSize: '10px', color: 'white', fontFamily: 'monospace' }} />
                  <Bar dataKey="실적" fill="#f37321" radius={0} barSize={10} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Col 3: Top Material */}
          <div className="space-y-4">
            <div className="flex items-center gap-1.5 border-l-2 border-[#0066cc] pl-2">
              <span className="text-[11px] font-bold uppercase text-slate-800">Top 5 Creative Assets</span>
            </div>
            <div className="h-[210px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={formattedMaterialTop} layout="vertical" margin={{ top: 5, right: 15, left: -20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="2 2" horizontal={false} stroke="#eaeaea" />
                  <XAxis type="number" stroke="#64748b" fontSize={8} className="font-mono" />
                  <YAxis type="category" dataKey="name" stroke="#1e293b" fontSize={8} width={90} className="font-sans font-bold" />
                  <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '2px', fontSize: '10px', color: 'white', fontFamily: 'monospace' }} />
                  <Bar dataKey="실적" fill="#0066cc" radius={0} barSize={10} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>

      {/* Grid List for 3 Detailed Performance Tables (Media, Target, Creative Material) */}
      <div className="space-y-5">

        {/* 1. Media performance TABLE */}
        <div className="bg-white rounded-sm border border-slate-200/65 shadow-2xs overflow-hidden">
          <div className="px-4 py-2 bg-slate-50 border-b border-slate-200">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800">Media Performance Breakdown</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full text-[11px] font-mono text-left text-slate-600 border-collapse">
              <thead className="text-[10px] uppercase bg-slate-100 text-slate-500 border-b border-slate-200 font-sans">
                <tr>
                  <th className="px-4 py-2.5 font-bold text-slate-800">Display Media Channel</th>
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
                {mediaPerformance.map((row) => (
                  <tr key={row.name} className="hover:bg-slate-50">
                    <td className="px-4 py-2 font-sans font-bold text-slate-800">{row.name}</td>
                    <td className="px-4 py-2 text-right text-slate-900">${row.spend.toLocaleString()}</td>
                    <td className="px-4 py-2 text-right text-slate-400">{(row.impressions / 1e3).toFixed(0)}K</td>
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

        {/* 2. Target Performance TABLE */}
        <div className="bg-white rounded-sm border border-slate-200/65 shadow-2xs overflow-hidden">
          <div className="px-4 py-2 bg-slate-50 border-b border-slate-200">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800">Target Segment Performance Breakdown</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full text-[11px] font-mono text-left text-slate-600 border-collapse">
              <thead className="text-[10px] uppercase bg-slate-100 text-slate-500 border-b border-slate-200 font-sans">
                <tr>
                  <th className="px-4 py-2.5 font-bold text-slate-800">Audience Segment</th>
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
                {targetPerformance.map((row) => (
                  <tr key={row.name} className="hover:bg-slate-50">
                    <td className="px-4 py-2 font-sans font-bold text-slate-800">{row.name}</td>
                    <td className="px-4 py-2 text-right text-slate-900">${row.spend.toLocaleString()}</td>
                    <td className="px-4 py-2 text-right text-slate-400">{(row.impressions / 1e3).toFixed(0)}K</td>
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

        {/* 3. Materials/Creative Asset TABLE */}
        <div className="bg-white rounded-sm border border-slate-200/65 shadow-2xs overflow-hidden">
          <div className="px-4 py-2 bg-slate-50 border-b border-slate-200">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800">Creative Asset Performance Breakdown</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full text-[11px] font-mono text-left text-slate-600 border-collapse">
              <thead className="text-[10px] uppercase bg-slate-100 text-slate-500 border-b border-slate-200 font-sans">
                <tr>
                  <th className="px-4 py-2.5 font-bold text-slate-800">Creative Asset Code</th>
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
                {materialPerformance.map((row) => (
                  <tr key={row.name} className="hover:bg-slate-50">
                    <td className="px-4 py-2 font-sans font-bold text-slate-800">{row.name}</td>
                    <td className="px-4 py-2 text-right text-slate-900">${row.spend.toLocaleString()}</td>
                    <td className="px-4 py-2 text-right text-slate-400">{(row.impressions / 1e3).toFixed(0)}K</td>
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

      </div>
    </div>
  );
};
