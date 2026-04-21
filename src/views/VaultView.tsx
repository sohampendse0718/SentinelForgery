import { useState } from 'react';
import { Search, Filter, ArrowUpDown, Video, Mic, FileText, X, AlertTriangle } from 'lucide-react';

const mockVaultData = [
  { id: '1', name: 'ID-7729-A_SRC.mp4', hash: '8f4a2b9e...', date: '2023.10.24 14:32Z', type: 'Audio/Video', status: 'Authentic', img: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80' },
  { id: '2', name: 'Q3_EARNINGS_LEAK.wav', hash: 'c49f10da...', date: '2023.10.24 11:05Z', type: 'Voice Cloning', status: 'Manipulated', img: 'https://images.unsplash.com/photo-1541819380-00d3aa4cb5ff?auto=format&fit=crop&q=80', isCritical: true },
  { id: '3', name: 'PASSPORT_SCAN_092.pdf', hash: '11a0d3f8...', date: '2023.10.23 08:14Z', type: 'Document Forgery', status: 'Inconclusive', img: null },
];

export function VaultView() {
  const [selectedId, setSelectedId] = useState<string | null>('2');

  const selectedItem = mockVaultData.find(item => item.id === selectedId);

  return (
    <div className="flex w-full h-[calc(100vh-6rem)] gap-6">
      <div className="flex-1 flex flex-col gap-6 min-w-0">
        <div className="flex flex-col gap-4">
          <div>
            <h1 className="font-heading text-4xl font-bold text-white mb-2">The Vault</h1>
            <p className="font-sans text-sm text-zinc-400">Repository of past forensic scans and deepfake analysis records.</p>
          </div>
          
          <div className="flex items-center justify-between gap-4 bg-[#1A1A1A] p-2 rounded border border-white/5">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" size={16} />
              <input 
                type="text" 
                placeholder="Search records by hash or filename..." 
                className="w-full bg-[#0A0A0A]/50 border-0 border-b border-[#3b494b] focus:border-primary focus:ring-0 text-white font-mono text-sm pl-10 pr-4 py-2 placeholder-zinc-600 outline-none transition-colors"
              />
            </div>
            <div className="flex items-center gap-2">
              <button className="flex items-center gap-2 px-4 py-2 bg-[#1A1A1A] border border-[#3b494b] rounded text-zinc-400 hover:text-primary hover:border-primary/50 transition-colors font-sans text-xs uppercase font-bold tracking-wider outline-none">
                <Filter size={14} /> Filter
              </button>
              <button className="flex items-center gap-2 px-4 py-2 bg-[#1A1A1A] border border-[#3b494b] rounded text-zinc-400 hover:text-primary hover:border-primary/50 transition-colors font-sans text-xs uppercase font-bold tracking-wider outline-none">
                <ArrowUpDown size={14} /> Date
              </button>
            </div>
          </div>
        </div>

        <div className="flex flex-col flex-1 overflow-hidden">
          <div className="grid grid-cols-[64px_2fr_1fr_1fr_120px] gap-4 px-6 py-3 border-b border-white/10 font-sans text-xs text-zinc-500 uppercase font-bold tracking-widest shrink-0">
            <div>Visual</div>
            <div>Identity Hash / Filename</div>
            <div>Timestamp</div>
            <div>Vector Type</div>
            <div className="text-right">Status</div>
          </div>

          <div className="flex flex-col gap-2 pt-2 overflow-y-auto custom-scrollbar pb-8">
            {mockVaultData.map(item => {
              const isSelected = item.id === selectedId;
              
              return (
                <div 
                  key={item.id}
                  onClick={() => setSelectedId(item.id)}
                  className={`grid grid-cols-[64px_2fr_1fr_1fr_120px] gap-4 px-6 py-4 items-center rounded cursor-pointer transition-all ${
                    isSelected 
                      ? 'bg-[#1A1A1A]/80 backdrop-blur-md border border-white/10 border-l-2 border-l-error shadow-[inset_0_0_20px_rgba(255,42,42,0.05)]' 
                      : 'bg-[#121212]/50 backdrop-blur-md border border-white/5 hover:bg-[#1A1A1A] hover:border-white/10'
                  }`}
                >
                  <div className={`w-12 h-12 rounded overflow-hidden border ${isSelected ? (item.isCritical ? 'border-error/50' : 'border-primary/50') : 'border-white/10'} bg-[#292a2a] flex items-center justify-center shrink-0`}>
                    {item.img ? (
                      <img src={item.img} alt="Preview" className={`w-full h-full object-cover ${isSelected ? '' : 'grayscale opacity-80 mix-blend-luminosity'}`} />
                    ) : (
                      <FileText className="text-zinc-500" size={24} />
                    )}
                  </div>
                  
                  <div className="flex flex-col justify-center min-w-0 pr-4">
                    <span className={`font-mono text-sm truncate ${isSelected ? (item.isCritical ? 'text-error drop-shadow-[0_0_4px_rgba(255,42,42,0.5)]' : 'text-primary') : 'text-white'}`}>
                      {item.name}
                    </span>
                    <span className="font-sans text-[10px] uppercase font-semibold text-zinc-500 truncate mt-1">Hash: {item.hash}</span>
                  </div>
                  
                  <div className="font-mono text-xs text-zinc-400">
                    {item.date}
                  </div>
                  
                  <div className="flex items-center gap-2 text-zinc-400 text-sm">
                    {item.type === 'Audio/Video' && <Video size={16} />}
                    {item.type === 'Voice Cloning' && <Mic size={16} />}
                    {item.type === 'Document Forgery' && <FileText size={16} />}
                    <span className="text-xs">{item.type}</span>
                  </div>
                  
                  <div className="flex justify-end">
                    {item.status === 'Authentic' && (
                      <div className="px-3 py-1 rounded-full border border-primary/30 bg-primary/10 text-primary font-sans text-xs font-semibold flex items-center gap-2 shadow-[inset_0_0_8px_rgba(0,240,255,0.2)]">
                        <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></div> Authentic
                      </div>
                    )}
                    {item.status === 'Manipulated' && (
                      <div className="px-3 py-1 rounded-full border border-error/50 bg-error/10 text-error font-sans text-xs font-semibold flex items-center gap-1 shadow-[inset_0_0_8px_rgba(255,42,42,0.2)]">
                         <AlertTriangle size={12}/> Manipulated
                      </div>
                    )}
                    {item.status === 'Inconclusive' && (
                      <div className="px-3 py-1 rounded-full border border-zinc-600/50 bg-[#1A1A1A] text-zinc-400 font-sans text-xs font-semibold flex items-center gap-1">
                         <span className="text-xs font-bold">?</span> Inconclusive
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {selectedId && selectedItem && (
        <aside className="w-[360px] shrink-0 bg-[#121212]/95 backdrop-blur-2xl border border-white/10 rounded-lg hidden xl:flex flex-col h-full overflow-hidden shadow-[0_8px_32px_rgba(0,0,0,0.4)]">
          {selectedItem.isCritical && (
             <div className="h-1 w-full bg-gradient-to-r from-transparent via-error to-transparent opacity-80"></div>
          )}
          
          <div className="p-6 flex flex-col h-full overflow-y-auto custom-scrollbar">
            <div className="flex justify-between items-start mb-6">
              {selectedItem.isCritical ? (
                <div className="px-3 py-1 rounded-full border border-error/50 bg-error/10 text-error font-sans text-[10px] font-bold uppercase tracking-widest flex items-center gap-1 shadow-[0_0_10px_rgba(255,42,42,0.2)]">
                    Critical Breach Detected
                </div>
              ) : <div></div>}
              <button className="text-zinc-500 hover:text-white transition-colors outline-none cursor-pointer" onClick={() => setSelectedId(null)}>
                <X size={20} />
              </button>
            </div>

            <div className="aspect-video w-full rounded border border-white/10 bg-[#1A1A1A] overflow-hidden relative mb-6">
              {selectedItem.img ? (
                 <img src={selectedItem.img} alt="Analysis Target" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-zinc-600"><FileText size={48}/></div>
              )}
              {selectedItem.isCritical && (
                 <div className="absolute inset-0 border border-error/30 m-2 pointer-events-none flex flex-col justify-between p-2">
                    <div className="flex justify-between w-full">
                      <div className="w-2 h-2 border-t-2 border-l-2 border-error"></div>
                      <div className="w-2 h-2 border-t-2 border-r-2 border-error"></div>
                    </div>
                    <div className="absolute top-1/2 left-0 w-full h-[1px] bg-error/40 shadow-[0_0_8px_rgba(255,42,42,0.8)]"></div>
                    <div className="flex justify-between w-full">
                      <div className="w-2 h-2 border-b-2 border-l-2 border-error"></div>
                      <div className="w-2 h-2 border-b-2 border-r-2 border-error"></div>
                    </div>
                 </div>
              )}
            </div>

            <div className="flex flex-col gap-4 mb-8">
              <div>
                <h3 className={`font-heading text-xl font-semibold break-all ${selectedItem.isCritical ? 'text-error' : 'text-white'}`}>{selectedItem.name}</h3>
                <p className="font-mono text-xs text-zinc-500 mt-1">HASH: {selectedItem.hash}...</p>
              </div>
              <div className="grid grid-cols-2 gap-4 border-y border-white/10 py-4">
                <div>
                  <span className="font-sans text-[10px] font-bold text-zinc-500 block mb-1 uppercase tracking-wider">Source</span>
                  <span className="font-sans text-xs text-white">Dark Web Monitor</span>
                </div>
                <div>
                   <span className="font-sans text-[10px] font-bold text-zinc-500 block mb-1 uppercase tracking-wider">Model Detected</span>
                   <span className="font-mono text-xs text-white">ElevenLabs v2.1</span>
                </div>
              </div>
            </div>

            <h4 className="font-sans text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-3">Forensic Vectors</h4>
            <div className="flex flex-col gap-3">
               <div className="bg-[#1A1A1A] p-3 rounded border border-white/5 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                     <span className="text-error font-bold font-mono">≈</span>
                     <span className="font-sans text-xs text-white">Spectral Artifacts</span>
                  </div>
                  <span className="font-mono text-xs text-error">98.2%</span>
               </div>
               <div className="bg-[#1A1A1A] p-3 rounded border border-white/5 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                     <span className="text-error font-bold font-heading">~</span>
                     <span className="font-sans text-xs text-white">Phase Coherence</span>
                  </div>
                  <span className="font-mono text-xs text-error">94.7%</span>
               </div>
               <div className="bg-[#1A1A1A] p-3 rounded border border-white/5 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                     <Mic size={14} className="text-zinc-500" />
                     <span className="font-sans text-xs text-white">Mic Impulse Resp.</span>
                  </div>
                  <span className="font-mono text-xs text-zinc-500">12.1%</span>
               </div>
            </div>

            <div className="mt-auto pt-6 flex gap-3 pb-2">
               <button className="flex-1 border border-primary text-primary hover:bg-primary/10 py-2 rounded font-sans text-[10px] font-bold uppercase tracking-wider transition-colors outline-none cursor-pointer">
                  Export Report
               </button>
               <button className="flex-1 bg-[#292a2a] border border-[#3b494b] text-white hover:bg-[#343535] py-2 rounded font-sans text-[10px] font-bold uppercase tracking-wider transition-colors outline-none cursor-pointer">
                  Quarantine
               </button>
            </div>
          </div>
        </aside>
      )}
    </div>
  );
}
