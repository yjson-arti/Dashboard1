/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  CountryPerformance,
  MediaPerformance,
  SearchDailyPerformance,
  KeywordPerformance,
  KeywordGroupPerformance,
  DisplayDailyPerformance,
  DisplayItemPerformance,
  KPIOverview
} from './types';

// Raw base data representing Hanwha Vision performance by Country
export const rawCountryPerformance: Omit<CountryPerformance, 'qvisits' | 'cpqv'>[] = [
  // 미주 (Americas)
  {
    country: '미국 (United States)',
    region: '미주',
    spend: 215400,
    impressions: 4890000,
    clicks: 146700,
    visits: 95350,
    leads: 6200,
    cpc: 0, ctr: 0, cpvisit: 0, visitRate: 0, cpl: 0,
    lat: 38, lng: -97
  },
  {
    country: '캐나다 (Canada)',
    region: '미주',
    spend: 42300,
    impressions: 1120000,
    clicks: 31360,
    visits: 20380,
    leads: 1210,
    cpc: 0, ctr: 0, cpvisit: 0, visitRate: 0, cpl: 0,
    lat: 56, lng: -106
  },
  {
    country: '브라질 (Brazil)',
    region: '미주',
    spend: 31200,
    impressions: 980000,
    clicks: 29400,
    visits: 19100,
    leads: 680,
    cpc: 0, ctr: 0, cpvisit: 0, visitRate: 0, cpl: 0,
    lat: -14, lng: -51
  },
  {
    country: '멕시코 (Mexico)',
    region: '미주',
    spend: 22800,
    impressions: 810000,
    clicks: 20250,
    visits: 13160,
    leads: 510,
    cpc: 0, ctr: 0, cpvisit: 0, visitRate: 0, cpl: 0,
    lat: 23, lng: -102
  },

  // APAC (Asia-Pac & Korea)
  {
    country: '한국 (South Korea)',
    region: 'APAC',
    spend: 185000,
    impressions: 5120000,
    clicks: 153600,
    visits: 107520,
    leads: 5890,
    cpc: 0, ctr: 0, cpvisit: 0, visitRate: 0, cpl: 0,
    lat: 36, lng: 127
  },
  {
    country: '호주 (Australia)',
    region: 'APAC',
    spend: 38500,
    impressions: 1050000,
    clicks: 26250,
    visits: 17060,
    leads: 980,
    cpc: 0, ctr: 0, cpvisit: 0, visitRate: 0, cpl: 0,
    lat: -25, lng: 133
  },
  {
    country: '일본 (Japan)',
    region: 'APAC',
    spend: 64200,
    impressions: 1650000,
    clicks: 39600,
    visits: 25740,
    leads: 1380,
    cpc: 0, ctr: 0, cpvisit: 0, visitRate: 0, cpl: 0,
    lat: 36, lng: 138
  },
  {
    country: '베트남 (Vietnam)',
    region: 'APAC',
    spend: 21900,
    impressions: 740000,
    clicks: 22200,
    visits: 14430,
    leads: 490,
    cpc: 0, ctr: 0, cpvisit: 0, visitRate: 0, cpl: 0,
    lat: 14, lng: 108
  },
  {
    country: '인도 (India)',
    region: 'APAC',
    spend: 39100,
    impressions: 1480000,
    clicks: 44400,
    visits: 28860,
    leads: 1100,
    cpc: 0, ctr: 0, cpvisit: 0, visitRate: 0, cpl: 0,
    lat: 20, lng: 78
  },
  {
    country: '싱가포르 (Singapore)',
    region: 'APAC',
    spend: 18500,
    impressions: 480000,
    clicks: 14400,
    visits: 9360,
    leads: 540,
    cpc: 0, ctr: 0, cpvisit: 0, visitRate: 0, cpl: 0,
    lat: 1.3, lng: 103.8
  },

  // EU (Europe)
  {
    country: '영국 (United Kingdom)',
    region: 'EU',
    spend: 92400,
    impressions: 2150000,
    clicks: 64500,
    visits: 41920,
    leads: 2450,
    cpc: 0, ctr: 0, cpvisit: 0, visitRate: 0, cpl: 0,
    lat: 55, lng: -3
  },
  {
    country: '독일 (Germany)',
    region: 'EU',
    spend: 112000,
    impressions: 2650000,
    clicks: 79500,
    visits: 51670,
    leads: 3100,
    cpc: 0, ctr: 0, cpvisit: 0, visitRate: 0, cpl: 0,
    lat: 51, lng: 9
  },
  {
    country: '프랑스 (France)',
    region: 'EU',
    spend: 68300,
    impressions: 1720000,
    clicks: 51600,
    visits: 33540,
    leads: 1790,
    cpc: 0, ctr: 0, cpvisit: 0, visitRate: 0, cpl: 0,
    lat: 46, lng: 2
  },
  {
    country: '이탈리아 (Italy)',
    region: 'EU',
    spend: 34500,
    impressions: 1150000,
    clicks: 31050,
    visits: 20180,
    leads: 810,
    cpc: 0, ctr: 0, cpvisit: 0, visitRate: 0, cpl: 0,
    lat: 41, lng: 12
  },
  {
    country: '스페인 (Spain)',
    region: 'EU',
    spend: 29500,
    impressions: 980000,
    clicks: 26460,
    visits: 17190,
    leads: 710,
    cpc: 0, ctr: 0, cpvisit: 0, visitRate: 0, cpl: 0,
    lat: 40, lng: -3
  },
  {
    country: '네덜란드 (Netherlands)',
    region: 'EU',
    spend: 22800,
    impressions: 650000,
    clicks: 19500,
    visits: 12670,
    leads: 580,
    cpc: 0, ctr: 0, cpvisit: 0, visitRate: 0, cpl: 0,
    lat: 52.3, lng: 4.9
  }
];

// Enrich Country Performance calculated metrics (CPC, CTR, CPL, Cpvisit, Visit rate)
export const countriesData: CountryPerformance[] = rawCountryPerformance.map(c => {
  const ctr = c.impressions > 0 ? (c.clicks / c.impressions) : 0;
  const cpc = c.clicks > 0 ? (c.spend / c.clicks) : 0;
  const visitRate = c.clicks > 0 ? (c.visits / c.clicks) : 0;
  const cpvisit = c.visits > 0 ? (c.spend / c.visits) : 0;
  const cpl = c.leads > 0 ? (c.spend / c.leads) : 0;

  // A high-quality visit (Qvisit) is about 41.5% of regular visits
  const qvisits = Math.round(c.visits * 0.415);
  const cpqv = qvisits > 0 ? (c.spend / qvisits) : 0;

  return {
    ...c,
    ctr,
    cpc,
    visitRate,
    cpvisit,
    qvisits,
    cpqv,
    cpl
  };
});

// Master Dashboard -> Media Base Performance (Shares proportional values)
export const rawMediaPerformance = [
  { media: 'Google Ads (Search)', spendShare: 0.45, clicksShare: 0.42, visitsShare: 0.44, leadsShare: 0.48, impressionsShare: 0.38 },
  { media: 'Meta Ads (Display/Social)', spendShare: 0.22, clicksShare: 0.28, visitsShare: 0.25, leadsShare: 0.20, impressionsShare: 0.35 },
  { media: 'LinkedIn Campaign (B2B)', spendShare: 0.18, clicksShare: 0.10, visitsShare: 0.12, leadsShare: 0.16, impressionsShare: 0.08 },
  { media: 'YouTube Video Ads', spendShare: 0.10, clicksShare: 0.14, visitsShare: 0.13, leadsShare: 0.11, impressionsShare: 0.15 },
  { media: 'Baidu Search (APAC Direct)', spendShare: 0.05, clicksShare: 0.06, visitsShare: 0.06, leadsShare: 0.05, impressionsShare: 0.04 }
];

// Function to dynamically compute Master Dashboard KPI cards based on selected filter
export function calculateMasterKPIs(region: string, country: string): KPIOverview {
  let filtered = countriesData;
  if (region !== 'global') {
    filtered = filtered.filter(c => c.region === region);
  }
  if (country !== '전체') {
    filtered = filtered.filter(c => c.country === country);
  }

  const totalSpend = filtered.reduce((sum, c) => sum + c.spend, 0);
  const totalClicks = filtered.reduce((sum, c) => sum + c.clicks, 0);
  const totalImpressions = filtered.reduce((sum, c) => sum + c.impressions, 0);
  const totalVisits = filtered.reduce((sum, c) => sum + c.visits, 0);
  const totalQvisits = filtered.reduce((sum, c) => sum + c.qvisits, 0);
  const totalLeads = filtered.reduce((sum, c) => sum + c.leads, 0);

  const ctr = totalImpressions > 0 ? (totalClicks / totalImpressions) : 0;
  const cpl = totalLeads > 0 ? (totalSpend / totalLeads) : 0;
  const cpqv = totalQvisits > 0 ? (totalSpend / totalQvisits) : 0;

  return {
    totalSpend,
    clicks: totalClicks,
    ctr,
    visits: totalVisits,
    qvisits: totalQvisits,
    leads: totalLeads,
    cpl,
    cpqv
  };
}

// Dynamic Media Performance generation based on Region and Country Filters
export function getFilteredMediaPerformance(region: string, country: string): MediaPerformance[] {
  const kpis = calculateMasterKPIs(region, country);
  const totalImpressions = countriesData
    .filter(c => (region === 'global' || c.region === region) && (country === '전체' || c.country === country))
    .reduce((sum, c) => sum + c.impressions, 0);

  return rawMediaPerformance.map(m => {
    const spend = kpis.totalSpend * m.spendShare;
    const impressions = totalImpressions * m.impressionsShare;
    const clicks = kpis.clicks * m.clicksShare;
    const visits = kpis.visits * m.visitsShare;
    const qvisits = Math.round(visits * 0.415);
    const leads = kpis.leads * m.leadsShare;

    const ctr = impressions > 0 ? (clicks / impressions) : 0;
    const cpc = clicks > 0 ? (spend / clicks) : 0;
    const cpvisit = visits > 0 ? (spend / visits) : 0;
    const cpqv = qvisits > 0 ? (spend / qvisits) : 0;
    const visitRate = clicks > 0 ? (visits / clicks) : 0;
    const cpl = leads > 0 ? (spend / leads) : 0;

    return {
      media: m.media,
      spend,
      impressions,
      clicks,
      visits,
      qvisits,
      leads,
      cpc,
      ctr,
      cpvisit,
      cpqv,
      visitRate,
      cpl
    };
  });
}

// ----------------------------------------------------
// (2) 검색광고 (Search Ad) 30-Day Daily Data
// ----------------------------------------------------

export function generateSearchDailyData(region: string, country: string): SearchDailyPerformance[] {
  let filtered = countriesData;
  if (region !== 'global' && region !== '전체') {
    filtered = filtered.filter(c => c.region === region);
  }
  if (country !== '전체') {
    filtered = filtered.filter(c => c.country === country);
  }
  const totalSpendGlobal = countriesData.reduce((sum, c) => sum + c.spend, 0);
  const totalSpendFiltered = filtered.reduce((sum, c) => sum + c.spend, 0);
  const factor = totalSpendGlobal > 0 ? (totalSpendFiltered / totalSpendGlobal) : 1.0;

  const dailyData: SearchDailyPerformance[] = [];

  // Generate 30 days of data leading up to May 20, 2026
  const baseDate = new Date('2026-04-21');

  for (let i = 0; i < 30; i++) {
    const dateObj = new Date(baseDate);
    dateObj.setDate(baseDate.getDate() + i);
    const dateStr = dateObj.toISOString().slice(5, 10); // MM-DD

    // Dynamic wave with weekend drop representation
    const dayOfWeek = dateObj.getDay();
    const dayFactor = (dayOfWeek === 0 || dayOfWeek === 6) ? 0.45 : 1.1; // lower spend on weekends
    const randomVariation = 0.85 + Math.random() * 0.3; // +- 15% random noise

    const baseSpend = 3200 * factor * dayFactor * randomVariation;
    const impressions = Math.floor(baseSpend * (15 + Math.random() * 4));
    const clicks = Math.floor(impressions * (0.025 + Math.random() * 0.012));
    const visits = Math.floor(clicks * (0.65 + Math.random() * 0.1));
    const qvisits = Math.floor(visits * (0.38 + Math.random() * 0.08));
    const leads = Math.floor(visits * (0.045 + Math.random() * 0.02));

    const spend = Math.round(baseSpend);
    const ctr = impressions > 0 ? clicks / impressions : 0;
    const cpc = clicks > 0 ? spend / clicks : 0;
    const cpvisit = visits > 0 ? spend / visits : 0;
    const cpqv = qvisits > 0 ? spend / qvisits : 0;
    const visitRate = clicks > 0 ? visits / clicks : 0;
    const cpl = leads > 0 ? spend / leads : 0;

    dailyData.push({
      date: dateStr,
      spend,
      impressions,
      clicks,
      visits,
      qvisits,
      leads,
      cpc,
      ctr,
      cpvisit,
      cpqv,
      visitRate,
      cpl
    });
  }

  return dailyData;
}

// Raw keywords of Hanwha Vision provided by user
export const providedKeywords = [
  // Access Control
  { adGroup: 'Access Control', keyword: 'access control system', searchVolume: '1K-10K', baseLeads: 24, baseSpend: 820 },
  { adGroup: 'Access Control', keyword: 'ip access controller', searchVolume: '10-100', baseLeads: 2, baseSpend: 68 },
  { adGroup: 'Access Control', keyword: 'access control reader', searchVolume: '100-1K', baseLeads: 11, baseSpend: 310 },
  // Camera
  { adGroup: 'Camera', keyword: 'ip camera', searchVolume: '1K-10K', baseLeads: 31, baseSpend: 1150 },
  { adGroup: 'Camera', keyword: 'network camera', searchVolume: '100-1K', baseLeads: 12, baseSpend: 420 },
  { adGroup: 'Camera', keyword: 'ip security camera', searchVolume: '100-1K', baseLeads: 15, baseSpend: 460 },
  { adGroup: 'Camera', keyword: 'ip cctv camera', searchVolume: '100-1K', baseLeads: 14, baseSpend: 410 },
  { adGroup: 'Camera', keyword: 'ip surveillance camera', searchVolume: '10-100', baseLeads: 3, baseSpend: 95 },
  { adGroup: 'Camera', keyword: 'ptz camera', searchVolume: '1K-10K', baseLeads: 28, baseSpend: 940 },
  { adGroup: 'Camera', keyword: 'dome security camera', searchVolume: '100-1K', baseLeads: 16, baseSpend: 390 },
  { adGroup: 'Camera', keyword: 'bullet ip camera', searchVolume: '10-100', baseLeads: 2, baseSpend: 80 },
  { adGroup: 'Camera', keyword: 'thermal security camera', searchVolume: '100-1K', baseLeads: 19, baseSpend: 540 },
  { adGroup: 'Camera', keyword: 'multi sensor security camera', searchVolume: '10-100', baseLeads: 3, baseSpend: 110 },
  // Camera AI
  { adGroup: 'Camera AI', keyword: 'ai security camera', searchVolume: '100-1K', baseLeads: 22, baseSpend: 620 },
  { adGroup: 'Camera AI', keyword: 'ai cctv', searchVolume: '100-1K', baseLeads: 25, baseSpend: 690 },
  { adGroup: 'Camera AI', keyword: 'ai cctv camera', searchVolume: '100-1K', baseLeads: 23, baseSpend: 630 },
  { adGroup: 'Camera AI', keyword: 'ai surveillance camera', searchVolume: '10-100', baseLeads: 5, baseSpend: 130 },
  // Camera Industrial
  { adGroup: 'Camera Industrial', keyword: 'explosion proof security camera', searchVolume: '10-100', baseLeads: 8, baseSpend: 240 },
  // Camera LPR
  { adGroup: 'Camera LPR', keyword: 'anpr camera', searchVolume: '10K-100K', baseLeads: 68, baseSpend: 1950 },
  { adGroup: 'Camera LPR', keyword: 'anpr police camera', searchVolume: '100-1K', baseLeads: 12, baseSpend: 380 },
  { adGroup: 'Camera LPR', keyword: 'lpr camera', searchVolume: '100-1K', baseLeads: 18, baseSpend: 470 },
  { adGroup: 'Camera LPR', keyword: 'license plate camera', searchVolume: '100-1K', baseLeads: 13, baseSpend: 420 },
  { adGroup: 'Camera LPR', keyword: 'license plate detection camera', searchVolume: '100-1K', baseLeads: 10, baseSpend: 350 },
  { adGroup: 'Camera LPR', keyword: 'license plate recognition camera', searchVolume: '100-1K', baseLeads: 14, baseSpend: 430 },
  // NVR
  { adGroup: 'NVR', keyword: 'network video recorder', searchVolume: '1K-10K', baseLeads: 22, baseSpend: 750 },
  { adGroup: 'NVR', keyword: 'nvr 16 channel', searchVolume: '10-100', baseLeads: 3, baseSpend: 90 },
  { adGroup: 'NVR', keyword: 'nvr 32 channel', searchVolume: '10-100', baseLeads: 4, baseSpend: 110 },
  { adGroup: 'NVR', keyword: 'ai nvr', searchVolume: '10-100', baseLeads: 6, baseSpend: 160 },
  { adGroup: 'NVR', keyword: 'ip camera nvr system', searchVolume: '10-100', baseLeads: 4, baseSpend: 100 },
  // NVR Enterprise
  { adGroup: 'NVR Enterprise', keyword: 'nvr 64 channel', searchVolume: '10-100', baseLeads: 5, baseSpend: 150 },
  // VMS
  { adGroup: 'VMS', keyword: 'video management software', searchVolume: '10-100', baseLeads: 8, baseSpend: 210 },
  { adGroup: 'VMS', keyword: 'enterprise video management software', searchVolume: '10-100', baseLeads: 9, baseSpend: 260 },
  { adGroup: 'VMS', keyword: 'video surveillance software', searchVolume: '10-100', baseLeads: 7, baseSpend: 180 },
  { adGroup: 'VMS', keyword: 'video analytics software', searchVolume: '10-100', baseLeads: 11, baseSpend: 290 }
];

export function getKeywordPerformanceData(region: string, country: string): KeywordPerformance[] {
  let filtered = countriesData;
  if (region !== 'global' && region !== '전체') {
    filtered = filtered.filter(c => c.region === region);
  }
  if (country !== '전체') {
    filtered = filtered.filter(c => c.country === country);
  }
  const totalSpendGlobal = countriesData.reduce((sum, c) => sum + c.spend, 0);
  const totalSpendFiltered = filtered.reduce((sum, c) => sum + c.spend, 0);
  const factor = totalSpendGlobal > 0 ? (totalSpendFiltered / totalSpendGlobal) : 1.0;

  return providedKeywords.map((k, idx) => {
    // Inject deterministic elements depending on keyword letters to create realistic KPIs
    const charSum = k.keyword.split('').reduce((sum, char) => sum + char.charCodeAt(0), 0);
    const randomMod = 0.85 + (charSum % 30) / 100; // +- 15% deterministic randomness
    
    const spend = Math.round(k.baseSpend * factor * randomMod * 1.5);
    const leads = Math.round(k.baseLeads * factor * randomMod * 1.2) || 1; // At least 1 lead to avoid NaN
    const clicks = Math.round(spend * (2.8 + (charSum % 5) / 5));
    const impressions = Math.round(clicks * (25 + (charSum % 15)));
    const vFactor = 0.65 + (charSum % 10) / 100;
    const visits = Math.round(clicks * vFactor);
    const qvisits = Math.round(visits * 0.415);

    const ctr = impressions > 0 ? clicks / impressions : 0;
    const cpc = clicks > 0 ? spend / clicks : 0;
    const cpvisit = visits > 0 ? spend / visits : 0;
    const cpqv = qvisits > 0 ? spend / qvisits : 0;
    const visitRate = clicks > 0 ? visits / clicks : 0;
    const cpl = leads > 0 ? spend / leads : 0;

    return {
      keyword: k.keyword,
      adGroup: k.adGroup,
      spend,
      impressions,
      clicks,
      visits,
      qvisits,
      leads,
      cpc,
      ctr,
      cpvisit,
      cpqv,
      visitRate,
      cpl,
      searchVolume: k.searchVolume
    };
  });
}

// Compute Keyword Group metrics by aggregating individual keywords
export function getKeywordGroupData(region: string, country: string): KeywordGroupPerformance[] {
  const keywords = getKeywordPerformanceData(region, country);
  const groupsMap: Record<string, {
    spend: number;
    impressions: number;
    clicks: number;
    visits: number;
    qvisits: number;
    leads: number;
  }> = {};

  keywords.forEach(k => {
    if (!groupsMap[k.adGroup]) {
      groupsMap[k.adGroup] = { spend: 0, impressions: 0, clicks: 0, visits: 0, qvisits: 0, leads: 0 };
    }
    groupsMap[k.adGroup].spend += k.spend;
    groupsMap[k.adGroup].impressions += k.impressions;
    groupsMap[k.adGroup].clicks += k.clicks;
    groupsMap[k.adGroup].visits += k.visits;
    groupsMap[k.adGroup].qvisits += k.qvisits;
    groupsMap[k.adGroup].leads += k.leads;
  });

  return Object.keys(groupsMap).map(group => {
    const item = groupsMap[group];
    const ctr = item.impressions > 0 ? item.clicks / item.impressions : 0;
    const cpc = item.clicks > 0 ? item.spend / item.clicks : 0;
    const cpvisit = item.visits > 0 ? item.spend / item.visits : 0;
    const cpqv = item.qvisits > 0 ? item.spend / item.qvisits : 0;
    const visitRate = item.clicks > 0 ? item.visits / item.clicks : 0;
    const cpl = item.leads > 0 ? item.spend / item.leads : 0;

    return {
      adGroup: group,
      spend: item.spend,
      impressions: item.impressions,
      clicks: item.clicks,
      visits: item.visits,
      qvisits: item.qvisits,
      leads: item.leads,
      cpc,
      ctr,
      cpvisit,
      cpqv,
      visitRate,
      cpl
    };
  }).sort((a, b) => b.spend - a.spend);
}


// ----------------------------------------------------
// (3) Display 탭 (Display Ad Tab) Data
// ----------------------------------------------------

export function generateDisplayDailyData(region: string, country: string): DisplayDailyPerformance[] {
  let filtered = countriesData;
  if (region !== 'global' && region !== '전체') {
    filtered = filtered.filter(c => c.region === region);
  }
  if (country !== '전체') {
    filtered = filtered.filter(c => c.country === country);
  }
  const totalSpendGlobal = countriesData.reduce((sum, c) => sum + c.spend, 0);
  const totalSpendFiltered = filtered.reduce((sum, c) => sum + c.spend, 0);
  const factor = totalSpendGlobal > 0 ? (totalSpendFiltered / totalSpendGlobal) : 1.0;

  const dailyData: DisplayDailyPerformance[] = [];
  const baseDate = new Date('2026-04-21');

  for (let i = 0; i < 30; i++) {
    const dateObj = new Date(baseDate);
    dateObj.setDate(baseDate.getDate() + i);
    const dateStr = dateObj.toISOString().slice(5, 10); // MM-DD

    const dayFactor = (dateObj.getDay() === 0 || dateObj.getDay() === 6) ? 0.8 : 1.1;
    const rand = 0.90 + Math.random() * 0.20;

    const baseSpend = 3600 * factor * dayFactor * rand;
    const impressions = Math.floor(baseSpend * (35 + Math.random() * 10)); // Display has much higher impressions
    const clicks = Math.floor(impressions * (0.008 + Math.random() * 0.004)); // lower CTR for display
    const visits = Math.floor(clicks * (0.50 + Math.random() * 0.08));
    const qvisits = Math.floor(visits * (0.38 + Math.random() * 0.06));
    const leads = Math.floor(visits * (0.025 + Math.random() * 0.015));

    const spend = Math.round(baseSpend);
    const ctr = impressions > 0 ? clicks / impressions : 0;
    const cpc = clicks > 0 ? spend / clicks : 0;
    const cpvisit = visits > 0 ? spend / visits : 0;
    const cpqv = qvisits > 0 ? spend / qvisits : 0;
    const visitRate = clicks > 0 ? visits / clicks : 0;
    const cpl = leads > 0 ? spend / leads : 0;

    dailyData.push({
      date: dateStr,
      spend,
      impressions,
      clicks,
      visits,
      qvisits,
      leads,
      cpc,
      ctr,
      cpvisit,
      cpqv,
      visitRate,
      cpl
    });
  }

  return dailyData;
}

// Media Performance under Display
export function getDisplayMediaPerformance(region: string, country: string): DisplayItemPerformance[] {
  let filtered = countriesData;
  if (region !== 'global' && region !== '전체') {
    filtered = filtered.filter(c => c.region === region);
  }
  if (country !== '전체') {
    filtered = filtered.filter(c => c.country === country);
  }
  const totalSpendGlobal = countriesData.reduce((sum, c) => sum + c.spend, 0);
  const totalSpendFiltered = filtered.reduce((sum, c) => sum + c.spend, 0);
  const factor = totalSpendGlobal > 0 ? (totalSpendFiltered / totalSpendGlobal) : 1.0;

  const medias = [
    { name: 'GDN (Google Display Network)', baseSpend: 25000, baseLeads: 180, impressionsMultiplier: 80 },
    { name: 'Meta Core Target Display', baseSpend: 18000, baseLeads: 160, impressionsMultiplier: 70 },
    { name: 'LinkedIn Sponsored Content', baseSpend: 22000, baseLeads: 210, impressionsMultiplier: 35 },
    { name: 'Outbrain Native Ads', baseSpend: 8500, baseLeads: 45, impressionsMultiplier: 50 },
    { name: 'AdTech Media Local Networks', baseSpend: 5400, baseLeads: 32, impressionsMultiplier: 60 }
  ];

  return medias.map(m => {
    const spend = Math.round(m.baseSpend * factor);
    const leads = Math.round(m.baseLeads * factor) || 1;
    const clicks = Math.round(spend * 1.5);
    const impressions = clicks * m.impressionsMultiplier;
    const visits = Math.round(clicks * 0.62);
    const qvisits = Math.round(visits * 0.415);

    const ctr = impressions > 0 ? clicks / impressions : 0;
    const cpc = clicks > 0 ? spend / clicks : 0;
    const cpvisit = visits > 0 ? spend / visits : 0;
    const cpqv = qvisits > 0 ? spend / qvisits : 0;
    const visitRate = clicks > 0 ? visits / clicks : 0;
    const cpl = leads > 0 ? spend / leads : 0;

    return {
      name: m.name,
      spend,
      impressions,
      clicks,
      visits,
      qvisits,
      leads,
      cpc,
      ctr,
      cpvisit,
      cpqv,
      visitRate,
      cpl
    };
  }).sort((a,b) => b.leads - a.leads);
}

// Target Audience Performance under Display
export function getDisplayTargetPerformance(region: string, country: string): DisplayItemPerformance[] {
  let filtered = countriesData;
  if (region !== 'global' && region !== '전체') {
    filtered = filtered.filter(c => c.region === region);
  }
  if (country !== '전체') {
    filtered = filtered.filter(c => c.country === country);
  }
  const totalSpendGlobal = countriesData.reduce((sum, c) => sum + c.spend, 0);
  const totalSpendFiltered = filtered.reduce((sum, c) => sum + c.spend, 0);
  const factor = totalSpendGlobal > 0 ? (totalSpendFiltered / totalSpendGlobal) : 1.0;

  const targets = [
    { name: '보안 이사회 및 CISO (Security Directors & CS)', baseSpend: 22000, baseLeads: 220, clickRate: 0.012 },
    { name: '빌딩 및 건물 관리자 (Facility Managers)', baseSpend: 18400, baseLeads: 145, clickRate: 0.009 },
    { name: 'IT 기술/구매 의사결정권자 (IT Decision Makers)', baseSpend: 26000, baseLeads: 190, clickRate: 0.015 },
    { name: '인공지능 보안 솔루션 관심사 (AI Tech Enthusiasts)', baseSpend: 11000, baseLeads: 85, clickRate: 0.011 },
    { name: '스마트 시티 및 도시 기획 엔지니어 (Smart City Engineers)', baseSpend: 9500, baseLeads: 55, clickRate: 0.010 }
  ];

  return targets.map(t => {
    const spend = Math.round(t.baseSpend * factor);
    const leads = Math.round(t.baseLeads * factor) || 1;
    const clicks = Math.round(spend * (t.clickRate * 120));
    const impressions = Math.round(clicks / t.clickRate);
    const visits = Math.round(clicks * 0.58);
    const qvisits = Math.round(visits * 0.415);

    const ctr = impressions > 0 ? clicks / impressions : 0;
    const cpc = clicks > 0 ? spend / clicks : 0;
    const cpvisit = visits > 0 ? spend / visits : 0;
    const cpqv = qvisits > 0 ? spend / qvisits : 0;
    const visitRate = clicks > 0 ? visits / clicks : 0;
    const cpl = leads > 0 ? spend / leads : 0;

    return {
      name: t.name,
      spend,
      impressions,
      clicks,
      visits,
      qvisits,
      leads,
      cpc,
      ctr,
      cpvisit,
      cpqv,
      visitRate,
      cpl
    };
  }).sort((a,b) => b.leads - a.leads);
}

// Creative performance under Display
export function getDisplayMaterialPerformance(region: string, country: string): DisplayItemPerformance[] {
  let filtered = countriesData;
  if (region !== 'global' && region !== '전체') {
    filtered = filtered.filter(c => c.region === region);
  }
  if (country !== '전체') {
    filtered = filtered.filter(c => c.country === country);
  }
  const totalSpendGlobal = countriesData.reduce((sum, c) => sum + c.spend, 0);
  const totalSpendFiltered = filtered.reduce((sum, c) => sum + c.spend, 0);
  const factor = totalSpendGlobal > 0 ? (totalSpendFiltered / totalSpendGlobal) : 1.0;

  const creatives = [
    { name: 'Banner_AI_Camera_SmartDetect (AI 지능형 카메라)', baseSpend: 24000, baseLeads: 230 },
    { name: 'Video_SolidEdge_Dome_Feature (돔 카메라 프로모션)', baseSpend: 19000, baseLeads: 135 },
    { name: 'Banner_LPR_LicensePlate_Solution (차량 번호판 탐지)', baseSpend: 16500, baseLeads: 155 },
    { name: 'Card_NVR_Enterprise_64ch (엔터프라이즈 하드웨어)', baseSpend: 12000, baseLeads: 88 },
    { name: 'CaseStudy_VMS_Industrial_ExplosionProof (산업용 방폭 카메라)', baseSpend: 7400, baseLeads: 62 }
  ];

  return creatives.map(c => {
    const spend = Math.round(c.baseSpend * factor);
    const leads = Math.round(c.baseLeads * factor) || 1;
    const clicks = Math.round(spend * 1.6);
    const impressions = clicks * 60;
    const visits = Math.round(clicks * 0.60);
    const qvisits = Math.round(visits * 0.415);

    const ctr = impressions > 0 ? clicks / impressions : 0;
    const cpc = clicks > 0 ? spend / clicks : 0;
    const cpvisit = visits > 0 ? spend / visits : 0;
    const cpqv = qvisits > 0 ? spend / qvisits : 0;
    const visitRate = clicks > 0 ? visits / clicks : 0;
    const cpl = leads > 0 ? spend / leads : 0;

    return {
      name: c.name,
      spend,
      impressions,
      clicks,
      visits,
      qvisits,
      leads,
      cpc,
      ctr,
      cpvisit,
      cpqv,
      visitRate,
      cpl
    };
  }).sort((a,b) => b.leads - a.leads);
}
