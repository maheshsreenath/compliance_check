
import React, { useState } from 'react';
import { 
  Settings, 
  User, 
  Power, 
  X,
  ShieldCheck,
  FileText,
  Search
} from 'lucide-react';
import { TabType, DocumentFile, Rule } from './types';
import ComplianceAuditor from './components/ComplianceAuditor/ComplianceAuditor';
import RuleBuilder from './components/ComplianceAuditor/RuleBuilder';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('Compliance Auditor');
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  
  const [documents, setDocuments] = useState<DocumentFile[]>([]);
  const [rules, setRules] = useState<Rule[]>([
    { id: '1', name: 'NDA Verification', instruction: 'Check if the confidentiality period is at least 5 years.' },
    { id: '2', name: 'Liability Clause', instruction: 'Ensure liability is capped appropriately.' }
  ]);

  const handleAddRule = (r: Rule) => setRules(prev => [...prev, r]);
  const handleDeleteRule = (id: string) => setRules(prev => prev.filter(r => r.id !== id));
  const handleAddDocument = (d: DocumentFile) => setDocuments(prev => [...prev, d]);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans text-gray-900">
      {/* Simple Header */}
      <header className="bg-white border-b border-gray-200 px-8 py-4 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center space-x-8">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-red-700 flex items-center justify-center text-white font-bold rounded">M</div>
            <span className="text-lg font-bold tracking-tight">MIT Suite</span>
          </div>
          
          <nav className="flex items-center space-x-1 bg-gray-100 p-1 rounded-lg">
            {(['Default', 'Limited', 'AI Document Analyzer', 'Compliance Auditor'] as TabType[]).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-1.5 text-xs font-semibold rounded-md transition-all ${
                  activeTab === tab 
                    ? 'bg-white text-red-700 shadow-sm' 
                    : 'text-gray-500 hover:text-gray-800'
                }`}
              >
                {tab}
              </button>
            ))}
          </nav>
        </div>

        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-3 pr-4 border-r border-gray-200">
            <div className="text-right">
              <p className="text-xs font-bold text-gray-900">Ijas M.</p>
              <p className="text-[10px] text-gray-500">Administrator</p>
            </div>
            <button 
              onClick={() => setIsSettingsOpen(true)}
              className="p-2 bg-gray-50 border border-gray-200 rounded-lg text-gray-600 hover:border-red-700 hover:text-red-700 transition-all"
              title="Manage Rules"
            >
              <Settings size={16} />
            </button>
          </div>
          <button className="text-gray-400 hover:text-red-600">
            <Power size={20} />
          </button>
        </div>
      </header>

      {/* Rule Management Modal */}
      {isSettingsOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-6">
          <div className="bg-white w-full max-w-5xl max-h-[90vh] rounded-2xl shadow-2xl flex flex-col overflow-hidden">
            <div className="px-8 py-5 border-b flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <ShieldCheck size={24} className="text-red-700" />
                <h2 className="text-xl font-bold">Manage Audit Rules</h2>
              </div>
              <button onClick={() => setIsSettingsOpen(false)} className="p-2 hover:bg-gray-100 rounded-full">
                <X size={24} className="text-gray-400" />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-8 bg-gray-50/50">
              <RuleBuilder 
                onAddRule={handleAddRule} 
                onAddRuleSet={() => {}} 
                rules={rules} 
                ruleSets={[]} 
                documents={documents}
                onDeleteRule={handleDeleteRule}
                onUploadDoc={handleAddDocument}
              />
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1">
        {activeTab === 'Compliance Auditor' ? (
          <ComplianceAuditor 
            rules={rules} 
            documents={documents} 
            setDocuments={setDocuments} 
          />
        ) : activeTab === 'AI Document Analyzer' ? (
          <div className="p-20 text-center">
            <FileText size={48} className="mx-auto text-gray-300 mb-4" />
            <h2 className="text-2xl font-bold mb-2">AI Document Analyzer</h2>
            <p className="text-gray-500">Upload documents and ask questions in a conversational manner.</p>
          </div>
        ) : (
          <div className="p-20 text-center">
            <Search size={48} className="mx-auto text-gray-300 mb-4" />
            <h2 className="text-2xl font-bold mb-2">{activeTab} Awards Search</h2>
            <p className="text-gray-500">Search through the award database.</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default App;
