
import React, { useState, useEffect } from 'react';
import { 
  History, 
  FileText, 
  ShieldCheck, 
  Database,
  CheckSquare,
  Square,
  Zap,
  Plus,
  // Added X icon import
  X
} from 'lucide-react';
import { DocumentFile, Rule, ComplianceJob, AnalysisResult } from '../../types';
import { analyzeCompliance } from '../../services/geminiService';
import RepositoryManager from './RepositoryManager';
import ResultPanel from './ResultPanel';
import AuditHistory from './AuditHistory';

interface Props {
  rules: Rule[];
  documents: DocumentFile[];
  setDocuments: React.Dispatch<React.SetStateAction<DocumentFile[]>>;
}

const ComplianceAuditor: React.FC<Props> = ({ rules, documents, setDocuments }) => {
  const [view, setView] = useState<'workspace' | 'history' | 'results'>('workspace');
  const [selectedDocs, setSelectedDocs] = useState<string[]>([]);
  const [selectedRules, setSelectedRules] = useState<string[]>([]);
  const [jobs, setJobs] = useState<ComplianceJob[]>([]);
  const [activeJobId, setActiveJobId] = useState<string | null>(null);
  const [isUploadOpen, setIsUploadOpen] = useState(false);

  useEffect(() => {
    const runningJob = jobs.find(j => j.status === 'running');
    if (!runningJob) {
      const nextPending = jobs.find(j => j.status === 'pending');
      if (nextPending) processJob(nextPending.id);
    }
  }, [jobs]);

  const processJob = async (jobId: string) => {
    setJobs(prev => prev.map(j => j.id === jobId ? { ...j, status: 'running' } : j));
    const currentJob = jobs.find(j => j.id === jobId);
    if (!currentJob) return;

    const totalTasks = currentJob.selectedDocIds.length * currentJob.selectedRuleIds.length;
    let completedTasks = 0;
    const newResults: Record<string, AnalysisResult[]> = {};

    for (const docId of currentJob.selectedDocIds) {
      const doc = documents.find(d => d.id === docId);
      if (!doc) continue;
      newResults[docId] = [];

      for (const ruleId of currentJob.selectedRuleIds) {
        const rule = rules.find(r => r.id === ruleId);
        if (!rule) continue;
        const template = documents.find(d => d.id === rule.referenceDocId);
        
        try {
          const res = await analyzeCompliance(doc, rule, template);
          newResults[docId].push(res);
        } catch (error) { 
          console.error(error); 
        }

        completedTasks++;
        setJobs(prev => prev.map(j => j.id === jobId ? { 
          ...j, 
          progress: Math.round((completedTasks / totalTasks) * 100),
          results: { ...newResults } 
        } : j));
      }
    }
    setJobs(prev => prev.map(j => j.id === jobId ? { ...j, status: 'completed', progress: 100 } : j));
  };

  const createJob = () => {
    const newJob: ComplianceJob = {
      id: Math.random().toString(36).substr(2, 9),
      name: `Audit Run ${new Date().toLocaleTimeString()}`,
      createdAt: new Date(),
      status: 'pending',
      progress: 0,
      results: {},
      selectedDocIds: [...selectedDocs],
      selectedRuleIds: [...selectedRules]
    };
    setJobs([newJob, ...jobs]);
    setSelectedDocs([]);
    setSelectedRules([]);
    setView('history');
  };

  return (
    <div className="flex flex-col h-full bg-gray-50">
      {/* View Switcher */}
      <div className="bg-white px-8 py-3 border-b flex items-center justify-between">
        <div className="flex bg-gray-100 p-1 rounded-lg">
          <button 
            onClick={() => setView('workspace')}
            className={`px-6 py-1.5 rounded-md text-xs font-bold transition-all ${view === 'workspace' ? 'bg-white text-red-700 shadow-sm' : 'text-gray-400'}`}
          >
            Run Audit
          </button>
          <button 
            onClick={() => setView('history')}
            className={`px-6 py-1.5 rounded-md text-xs font-bold transition-all flex items-center space-x-2 ${view === 'history' || view === 'results' ? 'bg-white text-red-700 shadow-sm' : 'text-gray-400'}`}
          >
            <History size={14} />
            <span>Audit History</span>
          </button>
        </div>

        {view === 'workspace' && (
          <button 
            disabled={selectedDocs.length === 0 || selectedRules.length === 0}
            onClick={createJob}
            className="bg-red-700 text-white font-bold text-xs uppercase px-6 py-2 rounded-lg shadow-sm hover:bg-red-800 disabled:bg-gray-200 disabled:text-gray-400 transition-all flex items-center space-x-2"
          >
            <Zap size={14} />
            <span>Analyze Selected</span>
          </button>
        )}
      </div>

      <div className="flex-1 overflow-hidden relative">
        {view === 'workspace' && (
          <div className="h-full flex px-8 py-6 space-x-6">
            {/* Documents Column */}
            <div className="w-1/2 flex flex-col bg-white rounded-xl border border-gray-200 overflow-hidden">
              <div className="px-5 py-4 border-b flex items-center justify-between">
                <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Select Documents</span>
                <button 
                  onClick={() => setIsUploadOpen(true)}
                  className="flex items-center space-x-1 text-xs font-bold text-red-700 hover:text-red-800"
                >
                  <Plus size={14} />
                  <span>Upload Files</span>
                </button>
              </div>
              
              <div className="flex-1 overflow-y-auto p-4 space-y-1">
                {documents.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center opacity-30">
                    <Database size={40} className="mb-2" />
                    <p className="text-sm">No documents uploaded yet.</p>
                  </div>
                ) : (
                  documents.map(doc => (
                    <div 
                      key={doc.id}
                      onClick={() => setSelectedDocs(prev => prev.includes(doc.id) ? prev.filter(id => id !== doc.id) : [...prev, doc.id])}
                      className={`p-3 rounded-lg flex items-center justify-between cursor-pointer border transition-all ${selectedDocs.includes(doc.id) ? 'bg-red-50 border-red-200' : 'hover:bg-gray-50 border-transparent'}`}
                    >
                      <div className="flex items-center space-x-3">
                        <FileText size={16} className="text-gray-400" />
                        <div>
                          <p className="text-xs font-bold text-gray-800">{doc.name}</p>
                          <p className="text-[10px] text-gray-500 uppercase">{doc.source}</p>
                        </div>
                      </div>
                      {selectedDocs.includes(doc.id) ? <CheckSquare size={16} className="text-red-700" /> : <Square size={16} className="text-gray-200" />}
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Rules Column */}
            <div className="w-1/2 flex flex-col bg-white rounded-xl border border-gray-200 overflow-hidden">
              <div className="px-5 py-4 border-b flex items-center justify-between">
                <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Select Rules</span>
                <button 
                  onClick={() => setSelectedRules(selectedRules.length === rules.length ? [] : rules.map(r => r.id))}
                  className="text-xs font-bold text-red-700 hover:underline"
                >
                  Select All
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-4 space-y-2">
                {rules.map(rule => (
                  <div 
                    key={rule.id}
                    onClick={() => setSelectedRules(prev => prev.includes(rule.id) ? prev.filter(id => id !== rule.id) : [...prev, rule.id])}
                    className={`p-4 rounded-lg border cursor-pointer transition-all ${selectedRules.includes(rule.id) ? 'bg-red-50 border-red-200 shadow-sm' : 'bg-white border-gray-100 hover:border-gray-300'}`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-xs font-bold text-gray-900">{rule.name}</h3>
                      {selectedRules.includes(rule.id) ? <CheckSquare size={16} className="text-red-700" /> : <Square size={16} className="text-gray-200" />}
                    </div>
                    <p className="text-[10px] text-gray-500 line-clamp-2">{rule.instruction}</p>
                    {rule.referenceDocId && (
                      <div className="mt-2 text-[9px] font-bold text-blue-600 bg-blue-50 inline-block px-2 py-0.5 rounded">
                        Has Reference Template
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {view === 'history' && (
          <AuditHistory jobs={jobs} onViewResults={(id) => { setActiveJobId(id); setView('results'); }} />
        )}

        {view === 'results' && activeJobId && (
          <ResultPanel job={jobs.find(j => j.id === activeJobId)!} documents={documents} rules={rules} onBack={() => setView('history')} />
        )}

        {/* Big Upload Modal */}
        {isUploadOpen && (
          <div className="absolute inset-0 z-50 flex items-center justify-center bg-white/90 backdrop-blur-sm p-10 animate-in fade-in duration-200">
            <div className="bg-white w-full max-w-4xl border border-gray-200 rounded-2xl shadow-2xl p-8">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-bold">Add Documents</h2>
                <button onClick={() => setIsUploadOpen(false)} className="p-2 hover:bg-gray-100 rounded-full">
                  <X size={24} className="text-gray-400" />
                </button>
              </div>
              <RepositoryManager 
                onAddDoc={(d) => setDocuments(prev => [...prev, d])} 
                documents={documents} 
                onClose={() => setIsUploadOpen(false)}
              />
              <div className="mt-10 pt-6 border-t flex justify-end">
                <button 
                  onClick={() => setIsUploadOpen(false)}
                  className="px-8 py-3 bg-red-700 text-white font-bold rounded-xl hover:bg-red-800 transition-all"
                >
                  Done
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ComplianceAuditor;
