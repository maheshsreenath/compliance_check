
import React, { useState, useRef } from 'react';
import { 
  Plus, 
  ShieldCheck, 
  FileText, 
  Trash2, 
  Upload,
  ChevronDown
} from 'lucide-react';
import { Rule, RuleSet, DocumentFile } from '../../types';

interface Props {
  onAddRule: (rule: Rule) => void;
  onAddRuleSet: (rs: RuleSet) => void;
  rules: Rule[];
  ruleSets: RuleSet[];
  documents: DocumentFile[];
  onDeleteRule?: (id: string) => void;
  onUploadDoc?: (doc: DocumentFile) => void;
}

const RuleBuilder: React.FC<Props> = ({ onAddRule, rules, documents, onDeleteRule, onUploadDoc }) => {
  const [showAdd, setShowAdd] = useState(false);
  const [name, setName] = useState('');
  const [instruction, setInstruction] = useState('');
  const [refDocId, setRefDocId] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSave = () => {
    if (!name || !instruction) return;
    onAddRule({
      id: Math.random().toString(36).substr(2, 9),
      name,
      instruction,
      referenceDocId: refDocId || undefined
    });
    setName(''); setInstruction(''); setRefDocId('');
    setShowAdd(false);
  };

  const handleTemplateUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !onUploadDoc) return;

    const reader = new FileReader();
    reader.onload = (ev) => {
      const newDoc: DocumentFile = {
        id: Math.random().toString(36).substr(2, 9),
        name: `TEMPLATE: ${file.name}`,
        type: file.type,
        size: file.size,
        content: ev.target?.result as string || '',
        uploadedAt: new Date(),
        source: 'local'
      };
      onUploadDoc(newDoc);
      setRefDocId(newDoc.id);
    };
    reader.readAsText(file);
  };

  return (
    <div className="space-y-8">
      {/* Create Rule Form */}
      <div className="bg-white p-8 rounded-2xl border border-gray-200">
        {!showAdd ? (
          <button 
            onClick={() => setShowAdd(true)}
            className="w-full py-4 border-2 border-dashed border-gray-200 rounded-xl text-gray-500 font-bold hover:border-red-700 hover:text-red-700 transition-all flex items-center justify-center space-x-2"
          >
            <Plus size={18} />
            <span>Create New Rule</span>
          </button>
        ) : (
          <div className="space-y-6 animate-in slide-in-from-top-2 duration-300">
            <h3 className="text-lg font-bold">New Rule Definition</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Rule Name</label>
                <input 
                  type="text" 
                  placeholder="e.g., NDA Confidentiality Term" 
                  className="w-full text-sm border-gray-200 rounded-xl py-3 px-4 focus:ring-red-700/20 focus:border-red-700 font-semibold"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-bold text-gray-500 uppercase">Reference Template (Optional)</label>
                  <button 
                    onClick={() => fileInputRef.current?.click()}
                    className="text-[10px] font-bold text-red-700 hover:underline flex items-center space-x-1"
                  >
                    <Upload size={12} />
                    <span>Upload Template</span>
                  </button>
                  <input type="file" className="hidden" ref={fileInputRef} onChange={handleTemplateUpload} />
                </div>
                <div className="relative">
                  <select 
                    className="w-full text-sm border-gray-200 rounded-xl py-3 px-4 appearance-none focus:ring-red-700/20 focus:border-red-700 font-semibold pr-10"
                    value={refDocId}
                    onChange={(e) => setRefDocId(e.target.value)}
                  >
                    <option value="">AI Analysis Only</option>
                    {documents.map(doc => (<option key={doc.id} value={doc.id}>{doc.name}</option>))}
                  </select>
                  <ChevronDown className="absolute right-4 top-3.5 text-gray-400 pointer-events-none" size={16} />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Audit Instructions</label>
              <textarea 
                placeholder="Describe exactly what the AI should look for or compare..."
                className="w-full text-sm border-gray-200 rounded-xl h-24 p-4 focus:ring-red-700/20 focus:border-red-700 resize-none font-medium leading-relaxed"
                value={instruction}
                onChange={(e) => setInstruction(e.target.value)}
              />
            </div>

            <div className="flex justify-end space-x-3">
              <button 
                onClick={() => setShowAdd(false)}
                className="px-6 py-2 text-sm font-bold text-gray-500 hover:bg-gray-100 rounded-lg"
              >
                Cancel
              </button>
              <button 
                disabled={!name || !instruction}
                onClick={handleSave}
                className="px-8 py-2 bg-red-700 text-white font-bold rounded-lg hover:bg-red-800 disabled:bg-gray-100 disabled:text-gray-300 shadow-sm"
              >
                Save Rule
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Rules List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-10">
        {rules.map(rule => (
          <div key={rule.id} className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm flex flex-col group transition-all hover:border-red-200">
            <div className="flex items-start justify-between mb-4">
              <div className="p-2 bg-red-50 rounded-lg text-red-700">
                <ShieldCheck size={20} />
              </div>
              <button 
                onClick={() => onDeleteRule?.(rule.id)}
                className="p-2 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all opacity-0 group-hover:opacity-100"
              >
                <Trash2 size={16} />
              </button>
            </div>
            <h4 className="font-bold text-gray-900 mb-2">{rule.name}</h4>
            <p className="text-xs text-gray-500 font-medium leading-relaxed italic border-l-2 border-gray-100 pl-4 mb-4 line-clamp-3">
              "{rule.instruction}"
            </p>
            {rule.referenceDocId && (
              <div className="mt-auto flex items-center text-[10px] font-bold text-blue-600 bg-blue-50 px-3 py-1.5 rounded-lg border border-blue-100">
                <FileText size={12} className="mr-2" />
                <span className="truncate">Ref: {documents.find(d => d.id === rule.referenceDocId)?.name}</span>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default RuleBuilder;
