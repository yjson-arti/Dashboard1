/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { MasterDashboardView } from './components/MasterDashboardView';
import { SearchAdDashboardView } from './components/SearchAdDashboardView';
import { DisplayDashboardView } from './components/DisplayDashboardView';
import { BarChart3, Search, Image as ImageIcon, HelpCircle, RefreshCw } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<'master' | 'search' | 'display'>('master');

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-800 font-sans antialiased flex flex-col">
      {/* Upper Navigation Corporate Header */}
      <header className="sticky top-0 z-40 bg-[#222222] text-white border-b-2 border-[#f37321] shrink-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-14 items-center">
            {/* Left branding */}
            <div className="flex items-center gap-3">
              {/* Hanwha Vision Styled Logo */}
              <div className="flex items-center gap-2">
                {/* 3 characteristic Hanwha orange rings in premium vector (Tricircle) */}
                <svg className="w-10 h-10 flex-shrink-0 animate-none translate-y-[1px]" viewBox="0 0 55 45" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <g transform="translate(4, 2)">
                    {/* Primary top-left outer tilted ellipse */}
                    <ellipse 
                      cx="19" 
                      cy="19" 
                      rx="14" 
                      ry="9.5" 
                      transform="rotate(-28 19 19)" 
                      stroke="#f3e5db" 
                      strokeWidth="1.2" 
                      strokeOpacity="0.35"
                    />
                    <ellipse 
                      cx="19" 
                      cy="19" 
                      rx="14" 
                      ry="9.5" 
                      transform="rotate(-28 19 19)" 
                      stroke="#f37321" 
                      strokeWidth="3.2" 
                    />
                    {/* Middle overlapping ellipse */}
                    <ellipse 
                      cx="25" 
                      cy="23" 
                      rx="12.5" 
                      ry="8.5" 
                      transform="rotate(-23 25 23)" 
                      stroke="#f3e5db" 
                      strokeWidth="1" 
                      strokeOpacity="0.25"
                    />
                    <ellipse 
                      cx="25" 
                      cy="23" 
                      rx="12.5" 
                      ry="8.5" 
                      transform="rotate(-23 25 23)" 
                      stroke="#f3843a" 
                      strokeWidth="2.0" 
                      strokeOpacity="0.9"
                    />
                    {/* Inner/Right smallest ellipse */}
                    <ellipse 
                      cx="29" 
                      cy="19" 
                      rx="11.5" 
                      ry="7.8" 
                      transform="rotate(-18 29 19)" 
                      stroke="#f3e5db" 
                      strokeWidth="0.8" 
                      strokeOpacity="0.15"
                    />
                    <ellipse 
                      cx="29" 
                      cy="19" 
                      rx="11.5" 
                      ry="7.8" 
                      transform="rotate(-18 29 19)" 
                      stroke="#f39554" 
                      strokeWidth="1.4" 
                      strokeOpacity="0.85"
                    />
                  </g>
                </svg>
                <div className="flex flex-col">
                  <span className="text-[13px] font-black tracking-tight text-white leading-none font-sans">
                    Hanwha <span className="text-[#f37321]">Vision</span>
                  </span>
                  <span className="text-[7.5px] font-extrabold text-white/50 uppercase tracking-widest mt-1">
                    Global Marketing
                  </span>
                </div>
              </div>

              {/* Vertical divider */}
              <div className="h-6 w-[1px] bg-white/20 mx-1"></div>

              {/* Title */}
              <div className="hidden sm:block">
                <h1 className="text-xs font-bold text-white tracking-tight uppercase">
                  글로벌 마케팅 성과 통합 대시보드
                </h1>
                <p className="text-[9px] text-white/50 font-mono leading-none mt-0.5">
                  Corporate Performance & Lead Acquisition Center
                </p>
              </div>
            </div>

            {/* Right meta information */}
            <div className="flex items-center gap-4">
              <div className="text-right hidden md:block">
                <div className="text-[9px] text-white/40 font-mono">데이터 기준일</div>
                <div className="text-xs font-semibold text-white/90 flex items-center gap-1 justify-end font-mono">
                  <span>As of 2026.05.24</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                </div>
              </div>

              <div className="flex items-center gap-1 text-white/60 hover:text-white cursor-pointer">
                <HelpCircle size={15} />
              </div>
            </div>
          </div>
        </div>

        {/* Tab Buttons bar */}
        <div className="bg-white border-t border-white/10 text-slate-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex space-x-1 scrollbar-none overflow-x-auto">
              {/* Tab 1: Master Dashboard */}
              <button
                onClick={() => setActiveTab('master')}
                className={`flex items-center gap-2 px-5 py-3 text-xs font-bold font-sans transition-all duration-150 cursor-pointer border-b-2 ${
                  activeTab === 'master'
                    ? 'border-[#f37321] text-[#f37321]'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                <BarChart3 size={13} className={activeTab === 'master' ? 'text-[#f37321]' : 'text-slate-400'} />
                <span>Master Dashboard</span>
              </button>

              {/* Tab 2: Search Ads Dashboard */}
              <button
                onClick={() => setActiveTab('search')}
                className={`flex items-center gap-2 px-5 py-3 text-xs font-bold font-sans transition-all duration-150 cursor-pointer border-b-2 ${
                  activeTab === 'search'
                    ? 'border-[#f37321] text-[#f37321]'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                <Search size={13} className={activeTab === 'search' ? 'text-[#f37321]' : 'text-slate-400'} />
                <span>Search Ads Performance</span>
              </button>

              {/* Tab 3: Display Ads Dashboard */}
              <button
                onClick={() => setActiveTab('display')}
                className={`flex items-center gap-2 px-5 py-3 text-xs font-bold font-sans transition-all duration-150 cursor-pointer border-b-2 ${
                  activeTab === 'display'
                    ? 'border-[#f37321] text-[#f37321]'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                <ImageIcon size={13} className={activeTab === 'display' ? 'text-[#f37321]' : 'text-slate-400'} />
                <span>Display Ads Performance</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Dynamic Viewport Container */}
      <main className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-5 flex-1">
        {/* Intro Info Banner */}
        <div className="bg-white p-3 rounded-sm border border-slate-200/60 shadow-sm mb-5 flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
          <div className="space-y-0.5">
            <h2 className="text-sm font-bold text-slate-900">
              {activeTab === 'master' && '글로벌 통합 관리 마스터 대시보드 (Global Marketing Master Dashboard)'}
              {activeTab === 'search' && '법인 정보 분석 검색광고 (Search Ads Performance Overview)'}
              {activeTab === 'display' && '글로벌 디스플레이 캠페인 및 타겟 성과 분석 (Display Campaign Performance)'}
            </h2>
            <p className="text-xs text-slate-500">
              {activeTab === 'master' && '글로벌 권역별 소진 금액(Spend) 대비 핵심 KPI 획득 효율성을 모니터링하여 지속 가능한 채널 결정을 지원합니다.'}
              {activeTab === 'search' && '검색 유저 반응성 분석: 한화 비전 주력 AD Group 별 카테고리와 키워드의 영국의 검색 볼륨 및 글로벌 실적을 대입합니다.'}
              {activeTab === 'display' && '오디언스 관심사별 매칭 및 크리에이티브 소재 성과 투명성을 높이기 위한 다각 정량 분석 보고서입니다.'}
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <span className="text-[9px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-sm font-semibold font-mono">
              STATUS: LIVE_REPORT
            </span>
            <button
              onClick={() => window.location.reload()}
              className="p-1 px-2 border border-slate-200 hover:bg-slate-50 text-slate-500 hover:text-slate-700 rounded-sm text-2xs flex items-center gap-1 font-mono transition"
            >
              <RefreshCw size={10} /> REFRESH
            </button>
          </div>
        </div>

        {/* Dynamic Dashboard View */}
        <div>
          {activeTab === 'master' && <MasterDashboardView />}
          {activeTab === 'search' && <SearchAdDashboardView />}
          {activeTab === 'display' && <DisplayDashboardView />}
        </div>
      </main>

      {/* Footer Status Bar */}
      <footer className="px-6 py-3 bg-[#222222] text-[10px] text-white flex flex-col sm:flex-row justify-between items-center shrink-0 border-t-2 border-[#f37321] mt-12">
        <div className="flex flex-wrap justify-center sm:justify-start gap-4 sm:gap-6 font-mono mb-2 sm:mb-0">
          <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> SYSTEM: ACTIVE</span>
          <span>DATA SOURCE: GOOGLE ADS API, CRM CONNECT</span>
          <span>SECURITY: ENCRYPTED PORTAL</span>
        </div>
        <div className="opacity-60 uppercase tracking-wider font-mono">
          HANWHA VISION © 2026 ALL RIGHTS RESERVED
        </div>
      </footer>
    </div>
  );
}
