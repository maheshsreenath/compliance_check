
import React, { useRef } from 'react';
import { Upload, Cloud, Database, HardDrive } from 'lucide-react';
import { DocumentFile } from '../../types';

interface Props {
  onAddDoc: (doc: DocumentFile) => void;
  documents: DocumentFile[];
  onClose?: () => void;
}

const RepositoryManager: React.FC<Props> = ({ onAddDoc, onClose }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    Array.from(files).forEach((file: File) => {
      const reader = new FileReader();
      reader.onload = (ev) => {
        onAddDoc({
          id: Math.random().toString(36).substr(2, 9),
          name: file.name,
          type: file.type,
          size: file.size,
          content: ev.target?.result as string || '',
          uploadedAt: new Date(),
          source: 'local'
        });
      };
      reader.readAsText(file);
    });
    if (fileInputRef.current) fileInputRef.current.value = '';
    if (onClose) onClose();
  };

  const connectSource = (name: string, source: 'dropbox' | 'db' | 'drive') => {
    onAddDoc({
      id: Math.random().toString(36).substr(2, 9),
      name,
      type: 'text/plain',
      size: 1024 * 5,
      content: `Content retrieved from ${source} for document: ${name}`,
      uploadedAt: new Date(),
      source
    });
    if (onClose) onClose();
  };

  return (
    <div className="grid grid-cols-2 gap-6">
      <div 
        onClick={() => fileInputRef.current?.click()}
        className="flex flex-col items-center justify-center p-12 bg-white border-2 border-dashed border-gray-200 rounded-2xl hover:border-red-700 hover:bg-red-50/50 cursor-pointer transition-all group"
      >
        <Upload size={48} className="text-gray-300 group-hover:text-red-700 mb-4" />
        <h3 className="font-bold text-gray-800">Upload from Device</h3>
        <p className="text-xs text-gray-400 mt-2">PDF, DOCX, TXT supported</p>
        <input type="file" multiple className="hidden" ref={fileInputRef} onChange={handleFileUpload} />
      </div>

      <div className="grid grid-cols-1 gap-4">
        <button 
          onClick={() => connectSource('Cloud_Agreement_01.txt', 'dropbox')}
          className="flex items-center space-x-4 p-5 bg-gray-50 border border-gray-200 rounded-xl hover:border-blue-500 hover:bg-blue-50 transition-all text-left"
        >
          <div className="p-3 bg-white rounded-lg shadow-sm text-blue-600"><Cloud size={24} /></div>
          <div>
            <h4 className="font-bold text-sm">Connect Dropbox</h4>
            <p className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">Cloud Storage</p>
          </div>
        </button>

        <button 
          onClick={() => connectSource('Database_Report_X.txt', 'db')}
          className="flex items-center space-x-4 p-5 bg-gray-50 border border-gray-200 rounded-xl hover:border-emerald-500 hover:bg-emerald-50 transition-all text-left"
        >
          <div className="p-3 bg-white rounded-lg shadow-sm text-emerald-600"><Database size={24} /></div>
          <div>
            <h4 className="font-bold text-sm">Query Database</h4>
            <p className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">Enterprise DB</p>
          </div>
        </button>

        <button 
          onClick={() => connectSource('Shared_Document_Drive.txt', 'drive')}
          className="flex items-center space-x-4 p-5 bg-gray-50 border border-gray-200 rounded-xl hover:border-amber-500 hover:bg-amber-50 transition-all text-left"
        >
          <div className="p-3 bg-white rounded-lg shadow-sm text-amber-600"><HardDrive size={24} /></div>
          <div>
            <h4 className="font-bold text-sm">Connect Google Drive</h4>
            <p className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">Workspace</p>
          </div>
        </button>
      </div>
    </div>
  );
};

export default RepositoryManager;
