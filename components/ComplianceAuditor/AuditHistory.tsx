
import React from 'react';
import { 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  Loader2, 
  ChevronRight,
  ShieldCheck,
  FileText
} from 'lucide-react';
import { ComplianceJob, AnalysisResult } from '../../types';

interface Props {
  jobs: ComplianceJob[];
  onViewResults: (id: string) => void;
}

const AuditHistory: React.FC<Props> = ({ jobs, onViewResults }) => {
  if (jobs.length === 0) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-10 bg-white m-6 rounded-2xl border border-dashed">
        <Clock size={48} className="text-gray-200 mb-4" />
        <h3 className="text-lg font-bold text-gray-800">No Audits Yet</h3>
        <p className="text-gray-500 text-center max-w-sm">When you run a compliance audit, it will appear here. You can run multiple audits in the background simultaneously.</p>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 overflow-y-auto h-full">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-gray-800">Compliance Audit History</h2>
        <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">{jobs.length} Total Sessions</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {jobs.map(job => {
          // Explicitly casting Object.values to AnalysisResult[][] to fix 'unknown' type error on nested .some() call
          const hasDeviations = (Object.values(job.results) as AnalysisResult[][]).some(resList => resList.some(r => r.hasDeviation));
          const totalChecks = job.selectedDocIds.length * job.selectedRuleIds.length;
          
          return (
            <div 
              key={job.id} 
              className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow flex flex-col overflow-hidden"
            >
              <div className="p-4 border-b border-gray-50 flex items-start justify-between">
                <div>
                  <h3 className="font-bold text-gray-800 truncate">{job.name}</h3>
                  <div className="flex items-center text-[10px] text-gray-400 font-bold mt-1 uppercase tracking-tighter">
                    <Clock size={10} className="mr-1" />
                    {job.createdAt.toLocaleDateString()} at {job.createdAt.toLocaleTimeString()}
                  </div>
                </div>
                <div className={`px-2 py-1 rounded text-[10px] font-bold uppercase ${
                  job.status === 'completed' ? 'bg-green-100 text-green-700' : 
                  job.status === 'running' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-500'
                }`}>
                  {job.status}
                </div>
              </div>

              <div className="p-4 flex-1 space-y-4">
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-gray-500">Progress</span>
                  <span className="font-bold text-gray-800">{job.progress}%</span>
                </div>
                <div className="w-full bg-gray-100 h-1.5 rounded-full overflow-hidden">
                  <div 
                    className={`h-full transition-all duration-500 ${job.status === 'running' ? 'bg-blue-500 animate-pulse' : 'bg-green-500'}`} 
                    style={{ width: `${job.progress}%` }} 
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-gray-50 rounded flex items-center justify-center">
                      <FileText size={14} className="text-gray-400" />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-gray-400 uppercase">Documents</p>
                      <p className="text-xs font-bold text-gray-800">{job.selectedDocIds.length}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-gray-50 rounded flex items-center justify-center">
                      <ShieldCheck size={14} className="text-gray-400" />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-gray-400 uppercase">Rules</p>
                      <p className="text-xs font-bold text-gray-800">{job.selectedRuleIds.length}</p>
                    </div>
                  </div>
                </div>

                {job.status === 'completed' && (
                  <div className={`p-3 rounded-lg flex items-center space-x-3 ${hasDeviations ? 'bg-red-50' : 'bg-green-50'}`}>
                    {hasDeviations ? (
                      <AlertCircle className="text-red-500" size={18} />
                    ) : (
                      <CheckCircle2 className="text-green-500" size={18} />
                    )}
                    <span className={`text-xs font-bold ${hasDeviations ? 'text-red-700' : 'text-green-700'}`}>
                      {hasDeviations ? 'Deviations Detected' : 'All Compliant'}
                    </span>
                  </div>
                )}
              </div>

              <div className="p-4 bg-gray-50 border-t">
                <button 
                  disabled={job.status === 'pending'}
                  onClick={() => onViewResults(job.id)}
                  className="w-full bg-white border border-gray-200 text-gray-700 py-2 rounded-lg text-sm font-bold flex items-center justify-center space-x-2 hover:bg-gray-100 disabled:opacity-50"
                >
                  {job.status === 'running' ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />
                      <span>Processing...</span>
                    </>
                  ) : (
                    <>
                      <span>View Detailed Report</span>
                      <ChevronRight size={16} />
                    </>
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AuditHistory;
