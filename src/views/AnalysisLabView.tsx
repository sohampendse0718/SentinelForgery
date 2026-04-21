import { useState } from 'react';
import { UploadCloud, Image as ImageIcon, ZoomIn, ZoomOut, Download, AlertTriangle } from 'lucide-react';

export function AnalysisLabView() {
  const [sliderPos, setSliderPos] = useState(50);

  return (
    <div className="flex flex-col gap-6 max-w-7xl mx-auto w-full pb-8 h-full">
      <div className="flex items-end justify-between border-b border-white/10 pb-4 shrink-0">
        <div>
          <h1 className="font-heading text-4xl font-bold text-white mb-2">Analysis Lab</h1>
          <p className="font-mono text-xs text-zinc-500 uppercase tracking-widest">Core Upload & Interactive View</p>
        </div>
        <div className="flex gap-4">
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded bg-[#121212] border border-white/10 text-white font-sans text-xs font-semibold">
            <span className="w-2 h-2 rounded-full bg-success"></span>
            System Nominal
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 w-full flex-1">
        <div className="xl:col-span-8 flex flex-col gap-6">
          <div className="relative bg-[#121212] rounded-lg border-2 border-dashed border-primary/40 p-12 text-center group hover:border-primary transition-colors duration-300 shrink-0">
            <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none inner-glow-cyan rounded-lg"></div>
            <UploadCloud className="text-primary mx-auto mb-4 opacity-80" size={48} strokeWidth={1.5} />
            <h3 className="font-heading text-2xl font-semibold text-white mb-2">Initialize Artifact Analysis</h3>
            <p className="font-sans text-zinc-400 mb-6">Drag and drop suspected forged documents or media here</p>
            <button className="bg-transparent border border-primary text-primary px-6 py-2 rounded font-mono text-sm uppercase tracking-widest hover:bg-primary hover:text-black transition-all duration-300 shadow-[0_0_10px_rgba(0,240,255,0.1)] hover:shadow-[0_0_15px_rgba(0,240,255,0.4)] outline-none bg-black/20">
              Select Artifact
            </button>
          </div>

          <div className="bg-[#121212] border border-white/10 rounded-lg flex flex-col flex-1 relative overflow-hidden min-h-[400px]">
            <div className="h-12 bg-[#1A1A1A] flex items-center px-4 border-b border-white/10 justify-between shrink-0">
              <div className="flex items-center gap-2 font-mono text-xs text-white">
                <ImageIcon size={16} />
                <span>passport_scan_v2.jpg</span>
              </div>
              <div className="flex items-center gap-4 font-mono text-[10px] text-zinc-500">
                <span>RES: 2400x1600</span>
                <span>FMT: JPEG</span>
                <span>SIZE: 4.2MB</span>
              </div>
            </div>

            <div className="relative flex-1 bg-[#0A0A0A] overflow-hidden group">
              <div className="absolute inset-0 w-full h-full grayscale opacity-80">
                <img src="https://images.unsplash.com/photo-1544717297-fa95b6ee9643?auto=format&fit=crop&q=80" alt="original" className="w-full h-full object-cover" />
              </div>

              <div className="absolute inset-0 w-full h-full filter mix-blend-color-dodge opacity-90 hue-rotate-180 contrast-150 saturate-200" style={{ clipPath: `inset(0 ${100 - sliderPos}% 0 0)` }}>
                <img src="https://images.unsplash.com/photo-1544717297-fa95b6ee9643?auto=format&fit=crop&q=80" alt="ela map" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-tr from-indigo-900/40 via-transparent to-red-600/40 mix-blend-overlay"></div>
              </div>

              <div className="absolute bottom-4 left-4 bg-surface/80 backdrop-blur-md px-3 py-1 border border-white/10 rounded font-mono text-[10px] text-white z-10">ELA Heatmap</div>
              <div className="absolute bottom-4 right-4 bg-surface/80 backdrop-blur-md px-3 py-1 border border-white/10 rounded font-mono text-[10px] text-white z-10">Source Artifact</div>

              <div className="absolute inset-y-0 w-1 bg-primary -translate-x-1/2 shadow-[0_0_10px_rgba(0,240,255,0.8)] z-20 pointer-events-none" style={{ left: `${sliderPos}%` }}>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-[#121212] border-2 border-primary rounded-full flex items-center justify-center shadow-[0_0_15px_rgba(0,240,255,0.5)]">
                  <span className="text-primary text-[10px] tracking-tighter font-bold">||</span>
                </div>
              </div>

              <input type="range" min="0" max="100" value={sliderPos} onChange={e => setSliderPos(Number(e.target.value))} className="absolute inset-0 w-full h-full opacity-0 cursor-ew-resize z-30" />
            </div>

            <div className="h-14 bg-[#121212] flex items-center px-4 border-t border-white/10 gap-2 shrink-0">
              <button className="p-2 text-zinc-500 hover:text-primary hover:bg-white/5 rounded transition-colors outline-none"><ZoomIn size={18}/></button>
              <button className="p-2 text-zinc-500 hover:text-primary hover:bg-white/5 rounded transition-colors outline-none"><ZoomOut size={18}/></button>
              <div className="w-px h-6 bg-white/10 mx-2"></div>
              <button className="px-3 py-1 bg-white/5 border border-white/10 rounded text-xs font-mono text-white outline-none">ELA</button>
              <button className="px-3 py-1 bg-transparent border border-transparent rounded text-xs font-mono text-zinc-500 hover:bg-white/5 outline-none">Metadata</button>
              <button className="px-3 py-1 bg-transparent border border-transparent rounded text-xs font-mono text-zinc-500 hover:bg-white/5 outline-none">Luminance</button>
            </div>
          </div>
        </div>

        <div className="xl:col-span-4 flex flex-col gap-6">
           <div className="bg-[#121212] border border-white/10 rounded-lg p-6 relative overflow-hidden shrink-0">
              <div className="absolute top-0 left-0 w-full h-1 bg-error"></div>
              <h3 className="font-heading text-2xl font-semibold text-white mb-6">Analysis Verdict</h3>
              
              <div className="flex flex-col items-center justify-center mb-8">
                 <div className="relative w-48 h-48 flex items-center justify-center">
                    <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                      <circle cx="50" cy="50" fill="transparent" r="40" stroke="#292a2a" strokeWidth="8"></circle>
                      <circle cx="50" cy="50" fill="transparent" r="40" stroke="#FF2A2A" strokeWidth="8" strokeDasharray="251.2" strokeDashoffset="40" className="drop-shadow-[0_0_8px_rgba(255,42,42,0.6)]"></circle>
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                      <span className="font-heading text-5xl font-bold text-error">84%</span>
                      <span className="font-mono text-[10px] text-error mt-1 uppercase tracking-wider">Probability</span>
                    </div>
                 </div>
                 <div className="mt-4 px-4 py-1.5 bg-error/10 border border-error/30 rounded text-error font-mono text-sm flex items-center gap-2">
                    <AlertTriangle size={16} />
                    Tampering Detected
                 </div>
              </div>

              <div className="space-y-4">
                 <div className="bg-[#1A1A1A] rounded p-3 border border-white/5 flex justify-between items-center">
                    <span className="font-sans text-sm text-zinc-400">Compression Signatures</span>
                    <span className="font-mono text-sm text-error">Anomalous</span>
                 </div>
                 <div className="bg-[#1A1A1A] rounded p-3 border border-white/5 flex justify-between items-center">
                    <span className="font-sans text-sm text-zinc-400">EXIF Data Integrity</span>
                    <span className="font-mono text-sm text-error">Mismatch</span>
                 </div>
                 <div className="bg-[#1A1A1A] rounded p-3 border border-white/5 flex justify-between items-center">
                    <span className="font-sans text-sm text-zinc-400">Pixel Level Noise</span>
                    <span className="font-mono text-sm text-primary">Consistent</span>
                 </div>
              </div>
           </div>

           <div className="bg-[#121212] border border-white/10 rounded-lg p-6 flex flex-col min-h-0">
              <div className="flex items-center justify-between mb-4 shrink-0">
                <h3 className="font-heading text-lg font-semibold text-white">Execution Log</h3>
                <button className="text-zinc-500 hover:text-primary transition-colors outline-none cursor-pointer"><Download size={20}/></button>
              </div>
              <div className="space-y-3 font-mono text-xs text-zinc-500 overflow-y-auto custom-scrollbar pr-2">
                <div className="flex gap-3"><span className="text-primary/50 shrink-0">14:02:11</span><span>{'>'} Initializing scan protocol Alpha</span></div>
                <div className="flex gap-3"><span className="text-primary/50 shrink-0">14:02:12</span><span>{'>'} Calculating Error Level Analysis</span></div>
                <div className="flex gap-3"><span className="text-primary/50 shrink-0">14:02:14</span><span className="text-error">{'>'} WARNING: High variance in sector 4</span></div>
                <div className="flex gap-3"><span className="text-primary/50 shrink-0">14:02:15</span><span>{'>'} Checking metadata checksums</span></div>
                <div className="flex gap-3"><span className="text-primary/50 shrink-0">14:02:16</span><span className="text-primary">{'>'} Scan complete. Generating final verdict matrix...</span></div>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}
