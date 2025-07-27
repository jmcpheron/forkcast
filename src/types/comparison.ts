export interface ComparisonMeta {
  title: string;
  author: string;
  created: string;
  description: string;
}

export interface ComparisonValue {
  text: string;
  severity?: 'low' | 'medium' | 'high';
  icon?: 'warning' | 'info' | 'check' | 'x';
}

export interface ComparisonRow {
  label: string;
  values: Record<string, string | ComparisonValue>;
}

export interface ComparisonTableSection {
  type: 'comparison-table';
  rows: ComparisonRow[];
}

export interface HeaderSection {
  type: 'header';
  content: string;
  level?: 1 | 2 | 3;
}

export interface VisualSection {
  type: 'visual';
  label: string;
  images: Record<string, {
    url: string;
    thumbnail?: string;
    alt: string;
  }>;
}

export interface CalloutSection {
  type: 'callout';
  style: 'warning' | 'info' | 'success' | 'error';
  title: string;
  content: string;
}

export interface SummarySection {
  type: 'summary';
  content: string;
}

export interface TextSection {
  type: 'text';
  content: string;
}

export interface ArgumentSection {
  type: 'argument';
  position: string; // e.g., "The free option is overblown because..."
  points: string[]; // Supporting points
  counterpoints?: string[]; // Acknowledged counterarguments
  evidence?: string[]; // Links or references
}

export interface DebateSection {
  type: 'debate';
  topic: string;
  perspectives: {
    label: string;
    author?: string;
    argument: string;
    evidence?: string[];
  }[];
}

export interface TimelineSection {
  type: 'timeline';
  events: {
    time: string;
    description: string;
    eip?: number;
  }[];
}

export interface QuickStatsSection {
  type: 'quick-stats';
  stats: Record<string, {
    icon: string;
    label: string;
    value: string;
    color?: 'green' | 'yellow' | 'red';
  }[]>;
}

export interface NorthStarComparison {
  type: 'northstar-comparison';
  northStars: string[];
  alignment: Record<string, Record<string, {
    impact: 'High' | 'Medium' | 'Low';
    icon: string;
    description: string;
  }>>;
}

export interface StakeholderImpacts {
  type: 'stakeholder-impacts';
  stakeholders: string[];
  impacts: Record<string, Record<string, {
    impact: 'High' | 'Medium' | 'Low';
    icon: string;
    description: string;
  }>>;
}

export interface BenefitsTradeoffs {
  type: 'benefits-tradeoffs';
  data: Record<string, {
    benefits: { text: string; icon: string; }[];
    tradeoffs: { text: string; severity: 'low' | 'medium' | 'high'; icon: string; }[];
  }>;
}

export interface ForkContext {
  type: 'fork-context';
  fork: string;
  headlinerStatus: Record<string, {
    status: string;
    layer: string;
    discussionLink?: string;
  }>;
  constraint?: string;
}

export interface TradeoffMatrix {
  type: 'tradeoff-matrix';
  dimensions: {
    name: string;
    description?: string;
    scores: Record<string, { score: number; icon: string; }>;
  }[];
}

export interface RiskAnalysis {
  type: 'risk-analysis';
  risks: {
    eip: number;
    risk: string;
    severity: number; // 0-100
    mitigation: string;
    monetaryValue?: string;
  }[];
}

export interface DecisionMatrix {
  type: 'decision-matrix';
  criteria: {
    name: string;
    weight: number;
    scores: Record<string, number>;
  }[];
  recommendation?: string;
}

export interface TimelineComparison {
  type: 'timeline-comparison';
  timelines: Record<string, {
    time: string;
    event: string;
    icon: string;
    highlight?: boolean;
  }[]>;
}

export interface ComplexityRadar {
  type: 'complexity-radar';
  dimensions: string[];
  scores: Record<string, number[]>;
}

export interface AuthorPreference {
  type: 'author-preference';
  preferredEip: number;
  reasoning: string;
  strength: 'strong' | 'moderate' | 'slight';
}

export type ComparisonSection = 
  | ComparisonTableSection
  | HeaderSection
  | VisualSection
  | CalloutSection
  | SummarySection
  | TextSection
  | ArgumentSection
  | DebateSection
  | TimelineSection
  | QuickStatsSection
  | NorthStarComparison
  | StakeholderImpacts
  | BenefitsTradeoffs
  | ForkContext
  | TradeoffMatrix
  | RiskAnalysis
  | DecisionMatrix
  | TimelineComparison
  | ComplexityRadar
  | AuthorPreference;

export interface EIPComparison {
  meta: ComparisonMeta;
  eips: number[];
  sections: ComparisonSection[];
}