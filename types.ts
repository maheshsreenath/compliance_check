
export interface DocumentFile {
  id: string;
  name: string;
  type: string;
  content: string;
  size: number;
  uploadedAt: Date;
  source: 'local' | 'dropbox' | 'drive' | 'db';
}

export interface Rule {
  id: string;
  name: string;
  instruction: string;
  referenceDocId?: string; // ID of the template document
}

export interface RuleSet {
  id: string;
  name: string;
  ruleIds: string[];
}

export interface AnalysisResult {
  docId: string;
  ruleId: string;
  hasDeviation: boolean;
  summary: string;
  details: string[];
  severity: 'low' | 'medium' | 'high';
}

export interface ComplianceJob {
  id: string;
  name: string;
  createdAt: Date;
  status: 'pending' | 'running' | 'completed' | 'failed';
  progress: number;
  results: Record<string, AnalysisResult[]>; // Map docId to results
  selectedDocIds: string[];
  selectedRuleIds: string[];
}

export type TabType = 'Default' | 'Limited' | 'AI Document Analyzer' | 'Compliance Auditor';

export interface AppState {
  activeTab: TabType;
  documents: DocumentFile[];
  rules: Rule[];
  ruleSets: RuleSet[];
  jobs: ComplianceJob[];
}
