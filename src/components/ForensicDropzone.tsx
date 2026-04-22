"use client";

import React, { useState, useRef } from 'react';
import { ScanLine, UploadCloud, AlertCircle, ShieldCheck, Loader2 } from 'lucide-react';

export function ForensicDropzone() {
  const [isDragging, setIsDragging] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [result, setResult] = useState<{ type: 'success' | 'error'; message: string; fileName?: string } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const processFile = async (file: File) => {
    const validExtensions = ['.jpg', '.jpeg', '.png', '.pdf'];
    const extension = '.' + file.name.split('.').pop()?.toLowerCase();
    
    if (!validExtensions.includes(extension)) {
      setResult({ type: 'error', message: 'Invalid file type. Only JPG, PNG, and PDF are supported.' });
      return;
    }

    setIsScanning(true);
    setResult(null);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('http://localhost:8000/api/analyze', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        setResult({ type: 'success', message: 'Analysis complete. Protocol nominal.', fileName: file.name });
      } else {
        setResult({ type: 'error', message: `Scan failed: Server responded with status ${response.status}.` });
      }
    } catch (error) {
      setResult({ type: 'error', message: 'Network error: Failed to reach the forensic server.' });
    } finally {
      setIsScanning(false);
      // Reset input value so the same file could be selected again
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processFile(e.target.files[0]);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto space-y-4">
      <div 
        onClick={() => !isScanning && fileInputRef.current?.click()}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`relative overflow-hidden cursor-pointer rounded-lg border-2 border-dashed transition-all duration-300 flex flex-col items-center justify-center p-12 min-h-[300px] bg-[#0A0A0A] ${
          isScanning 
            ? 'border-primary/50 shadow-[0_0_30px_rgba(0,240,255,0.15)] pointer-events-none' 
            : isDragging 
              ? 'border-primary shadow-[0_0_40px_rgba(0,240,255,0.25)] bg-primary/5 scale-[1.02]' 
              : 'border-zinc-800 hover:border-zinc-600 hover:bg-zinc-900/50'
        }`}
      >
        <input 
          type="file" 
          ref={fileInputRef} 
          onChange={handleFileChange} 
          className="hidden" 
          accept=".jpg,.jpeg,.png,.pdf" 
        />
        
        {/* Animated grid background */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#00F0FF05_1px,transparent_1px),linear-gradient(to_bottom,#00F0FF05_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />

        {isScanning ? (
          <div className="relative z-10 flex flex-col items-center gap-6">
            <div className="relative flex items-center justify-center">
              <ScanLine className="text-primary animate-pulse drop-shadow-[0_0_15px_rgba(0,240,255,0.8)]" size={64} />
              <div className="absolute inset-0 border-[3px] border-transparent border-t-primary border-b-primary rounded-full animate-[spin_3s_linear_infinite] w-24 h-24 -m-4 opacity-50" />
            </div>
            <div className="flex flex-col items-center">
              <h3 className="font-mono text-xl font-bold text-primary tracking-widest uppercase">Scanning</h3>
              <p className="font-mono text-xs text-primary/60 mt-2 animate-pulse">Running Deepfake Detachment Protocol...</p>
            </div>
          </div>
        ) : (
          <div className="relative z-10 flex flex-col items-center gap-4 text-center">
            <div className={`p-4 rounded-full transition-colors duration-300 ${isDragging ? 'bg-primary/20 text-primary' : 'bg-zinc-900 border border-zinc-800 text-zinc-400'}`}>
              <UploadCloud size={48} className={isDragging ? 'animate-bounce drop-shadow-[0_0_10px_rgba(0,240,255,0.5)]' : ''} />
            </div>
            <div>
              <h3 className="font-mono text-lg font-bold text-white mb-2 uppercase tracking-wide">
                {isDragging ? 'Initiate Transfer' : 'Drag & Drop Asset'}
              </h3>
              <p className="font-sans text-sm text-zinc-500">
                or <span className="text-primary hover:text-cyan-300 transition-colors underline underline-offset-4 font-semibold">click to bypass security protocol</span>
              </p>
              <div className="mt-6 flex justify-center gap-3 font-mono text-[10px] text-zinc-600 uppercase tracking-widest">
                <span className="px-2 py-1 rounded bg-zinc-900 border border-zinc-800 tracking-wider">JPG</span>
                <span className="px-2 py-1 rounded bg-zinc-900 border border-zinc-800 tracking-wider">PNG</span>
                <span className="px-2 py-1 rounded bg-zinc-900 border border-zinc-800 tracking-wider">PDF</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {result && (
        <div className={`p-4 rounded-md border font-mono text-sm shadow-md transition-all animate-in fade-in slide-in-from-bottom-2 ${
          result.type === 'success' 
            ? 'bg-success/10 border-success/30 text-success' 
            : 'bg-error/10 border-error/30 text-error'
        }`}>
          <div className="flex items-start gap-3">
            {result.type === 'success' ? (
              <ShieldCheck className="mt-0.5 shrink-0" size={18} />
            ) : (
              <AlertCircle className="mt-0.5 shrink-0" size={18} />
            )}
            <div>
              <p className="font-bold uppercase tracking-wider mb-1">
                {result.type === 'success' ? 'Clearance Granted' : 'System Error'}
              </p>
              <p className={result.type === 'success' ? 'text-success/80' : 'text-error/80'}>
                {result.message}
              </p>
              {result.fileName && (
                <p className="mt-2 text-xs opacity-70">Target: {result.fileName}</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
