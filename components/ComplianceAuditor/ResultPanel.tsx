
import React, { useState } from 'react';
import { 
  ArrowLeft, 
  FileText, 
  CheckCircle2, 
  AlertCircle, 
  X,
  FileSearch,
  ChevronRight
} from 'lucide-react';
import { ComplianceJob, AnalysisResult, DocumentFile, Rule } from '../../types';

interface Props {
  job: ComplianceJob;
  documents: DocumentFile[];
  rules: Rule[];
  onBack: () => void;
}

const ResultPanel: React.FC<Props> = ({ job, documents, rules, onBack }) => {
  const [selectedDocId, setSelectedDocId] = useState<string | null>(null);

  const getDocName = (id: string) => documents.find(d => d.id === id)?.name || 'Unknown Document';
  const getRuleName = (id: string) => rules.find(r => r.id === id)?.name || 'Applied Rule';

  const docResultsEntries = Object.entries(job.results) as [string, AnalysisResult[]][];
  const totalDocs = job.selectedDocIds.length;
  const compliantDocs = docResultsEntries.filter(([_, resList]) => !resList.some(r => r.hasDeviation)).length;
  const deviationCount = totalDocs - compliantDocs;

  return (
    <div className="h-full flex flex-col bg-gray-50">
      {/* Result Header */}
      <div className="px-8 py-4 border-b bg-white flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button onClick={onBack} className="p-2 hover:bg-gray-100 rounded-lg text-gray-500">
            <ArrowLeft size={20} />
          </button>
          <div>
            <h2 className="text-lg font-bold">Audit Results</h2>
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{job.name}</p>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-1.5 px-3 py-1 bg-green-50 text-green-700 rounded-full border border-green-100 text-[10px] font-bold uppercase">
             <CheckCircle2 size={12} />
             <span>{compliantDocs} Pass</span>
          </div>
          <div className="flex items-center space-x-1.5 px-3 py-1 bg-red-50 text-red-700 rounded-full border border-red-100 text-[10px] font-bold uppercase">
             <AlertCircle size={12} />
             <span>{deviationCount} Deviations</span>
          </div>
        </div>
      </div>

      {/* Main Results Area */}
      <div className="flex-1 overflow-y-auto p-8 bg-gray-50/50 space-y-6">
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b bg-gray-50/80 text-[10px] font-bold text-gray-500 uppercase tracking-widest">
                <th className="px-6 py-4">Document</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Summary</th>
                <th className="px-6 py-4 text-right">View Detail</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {job.selectedDocIds.map(docId => {
                const docRes = job.results[docId] || [];
                const hasDeviation = docRes.some(r => r.hasDeviation);
                const isProcessed = docRes.length > 0;
                const topRes = docRes.find(r => r.hasDeviation) || docRes[0];
                
                return (
                  <tr key={docId} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-3">
                        <FileText size={16} className={hasDeviation ? 'text-red-500' : 'text-green-500'} />
                        <span className="text-xs font-bold text-gray-800">{getDocName(docId)}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {isProcessed ? (
                        <span className={`text-[10px] font-bold uppercase px-2 py-1 rounded-md ${
                          hasDeviation ? 'bg-red-50 text-red-700' : 'bg-green-50 text-green-700'
                        }`}>
                          {hasDeviation ? 'Deviation Found' : 'Compliant'}
                        </span>
                      ) : (
                        <span className="text-[10px] text-gray-300 font-bold uppercase">Processing...</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                       <p className="text-[11px] text-gray-500 italic truncate max-w-xs">
                         {topRes ? topRes.summary : 'Awaiting data...'}
                       </p>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button 
                        onClick={() => setSelectedDocId(docId)}
                        className="text-red-700 text-xs font-bold hover:underline inline-flex items-center"
                      >
                        Details <ChevronRight size={14} className="ml-1" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detailed Analysis View - Takes full screen overlay */}
      {selectedDocId && (
        <div className="inset-0 z-[100] bg-white animate-in slide-in-from-right duration-300 overflow-hidden flex flex-col">
          <div className="px-10 py-6 border-b flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button onClick={() => setSelectedDocId(null)} className="p-2 hover:bg-gray-100 rounded-lg text-gray-400 transition-colors">
                <ArrowLeft size={24} />
              </button>
              <div>
                <h3 className="text-xl font-bold">{getDocName(selectedDocId)}</h3>
                <p className="text-xs text-gray-500 font-medium uppercase tracking-widest mt-1">Detailed Deviation Report</p>
              </div>
            </div>
            <button onClick={() => setSelectedDocId(null)} className="p-2 hover:bg-gray-100 rounded-full text-gray-400">
              <X size={28} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-12 bg-gray-50/30">
            <div className="max-w-4xl mx-auto space-y-8">
              {(job.results[selectedDocId] || []).map((res, idx) => (
                <div key={idx} className={`p-8 rounded-2xl bg-white border-2 ${res.hasDeviation ? 'border-red-100 shadow-lg shadow-red-50' : 'border-green-100 shadow-lg shadow-green-50'}`}>
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center space-x-3">
                       <FileSearch size={24} className={res.hasDeviation ? 'text-red-500' : 'text-green-500'} />
                       <h4 className="text-lg font-bold text-gray-900">{getRuleName(res.ruleId)}</h4>
                    </div>
                    <span className={`text-xs font-bold uppercase px-4 py-1.5 rounded-full ${
                      res.hasDeviation ? 'bg-red-700 text-white' : 'bg-green-700 text-white'
                    }`}>
                      {res.hasDeviation ? 'Deviation Found' : 'No Deviation'}
                    </span>
                  </div>
                  
                  <div className="bg-gray-50 rounded-xl p-6 border border-gray-100 mb-6 italic text-sm text-gray-700 leading-relaxed font-semibold">
                     "{res.summary}"
                  </div>
                  
                  {res.details.length > 0 && (
                    <div className="space-y-4">
                      <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Observations</p>
                      <ul className="space-y-3">
                        {res.details.map((detail, dIdx) => (
                          <li key={dIdx} className="text-sm text-gray-600 flex items-start bg-gray-50/30 p-4 rounded-xl border border-gray-100">
                            <div className={`w-2 h-2 rounded-full mt-1.5 mr-4 flex-shrink-0 ${res.hasDeviation ? 'bg-red-400' : 'bg-green-400'}`}></div>
                            <span className="font-medium leading-relaxed">{detail}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
          
          <div className="px-10 py-6 border-t flex justify-end">
             <button onClick={() => setSelectedDocId(null)} className="px-8 py-3 bg-gray-900 text-white rounded-xl font-bold text-sm shadow-xl active:scale-95 transition-all">
               Close Detailed Report
             </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ResultPanel;
