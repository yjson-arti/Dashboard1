/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface KPIOverview {
  totalSpend: number;
  clicks: number;
  ctr: number;
  visits: number;
  qvisits: number;
  leads: number;
  cpl: number; // Cost Per Lead
  cpqv: number; // Cost Per Qualified Visit
}

export interface CountryPerformance {
  country: string;
  region: '미주' | 'APAC' | 'EU' | 'global';
  spend: number;
  impressions: number;
  clicks: number;
  visits: number;
  qvisits: number;
  leads: number;
  cpc: number;
  ctr: number;
  cpvisit: number;
  cpqv: number;
  visitRate: number;
  cpl: number;
  lat: number;   // For mapping visualization coordinate placement
  lng: number;
}

export interface MediaPerformance {
  media: string;
  spend: number;
  impressions: number;
  clicks: number;
  visits: number;
  qvisits: number;
  leads: number;
  cpc: number;
  ctr: number;
  cpvisit: number;
  cpqv: number;
  visitRate: number;
  cpl: number;
}

export interface SearchDailyPerformance {
  date: string;
  spend: number;
  impressions: number;
  clicks: number;
  visits: number;
  qvisits: number;
  leads: number;
  cpc: number;
  ctr: number;
  cpvisit: number;
  cpqv: number;
  visitRate: number;
  cpl: number;
}

export interface KeywordPerformance {
  keyword: string;
  adGroup: string;
  spend: number;
  impressions: number;
  clicks: number;
  visits: number;
  qvisits: number;
  leads: number;
  cpc: number;
  ctr: number;
  cpvisit: number;
  cpqv: number;
  visitRate: number;
  cpl: number;
  searchVolume: string;
}

export interface KeywordGroupPerformance {
  adGroup: string;
  spend: number;
  impressions: number;
  clicks: number;
  visits: number;
  qvisits: number;
  leads: number;
  cpc: number;
  ctr: number;
  cpvisit: number;
  cpqv: number;
  visitRate: number;
  cpl: number;
}

export interface DisplayDailyPerformance {
  date: string;
  spend: number;
  impressions: number;
  clicks: number;
  visits: number;
  qvisits: number;
  leads: number;
  cpc: number;
  ctr: number;
  cpvisit: number;
  cpqv: number;
  visitRate: number;
  cpl: number;
}

export interface DisplayItemPerformance {
  name: string;        // Can represent a media name, target name, or creative asset code
  spend: number;
  impressions: number;
  clicks: number;
  visits: number;
  qvisits: number;
  leads: number;
  cpc: number;
  ctr: number;
  cpvisit: number;
  cpqv: number;
  visitRate: number;
  cpl: number;
}
