import { useState, useRef, useCallback, DragEvent, ChangeEvent } from 'react';
import {
  UploadCloud, Image as ImageIcon, ZoomIn, ZoomOut,
  Download, AlertTriangle, CheckCircle2, Loader2,
  FileSearch2, Cpu, ShieldAlert, ShieldCheck, Info,
} from 'lucide-react';

// ─── Types ───────────────────────────────────────────────────────────────────

interface AIAnalysis {
  label: string;
  confidence_score: number;
  note?: string;
  raw_label?: string;
}

interface AnalysisResult {
  status: string;
  filename: string;
  content_type: string;
  metadata: Record<string, string>;
  ela_heatmap_base64: string;
  ai_analysis: AIAnalysis;
}

type LogEntry = { time: string; msg: string; type: 'info' | 'warn' | 'ok' };
type ActiveTab = 'ela' | 'metadata';

const API_BASE = 'http://localhost:8000';

// ─── Helpers ──────────────────────────────────────────────────────────────────

function nowStr(): string {
  return new Date().toLocaleTimeString('en-US', { hour12: false });
}

function confidenceToOffset(score: number): number {
  // SVG circle radius 40 → circumference ~251.2
  const circumference = 251.2;
  return circumference - score * circumference;
}

// ─── Component ────────────────────────────────────────────────────────────────

export function AnalysisLabView() {
  const [sliderPos, setSliderPos]   = useState(50);
  const [activeTab, setActiveTab]   = useState<ActiveTab>('ela');
  const [dragging, setDragging]     = useState(false);
  const [loading, setLoading]       = useState(false);
  const [result, setResult]         = useState<AnalysisResult | null>(null);
  const [error, setError]           = useState<string | null>(null);
  const [originalUrl, setOriginalUrl] = useState<string | null>(null);
  const [log, setLog]               = useState<LogEntry[]>([]);
  const fileInputRef                = useRef<HTMLInputElement>(null);
  const logEndRef                   = useRef<HTMLDivElement>(null);

  const pushLog = useCallback((msg: string, type: LogEntry['type'] = 'info') => {
    setLog(prev => {
      const next = [...prev, { time: nowStr(), msg, type }];
      setTimeout(() => logEndRef.current?.scrollIntoView({ behavior: 'smooth' }), 50);
      return next;
    });
  }, []);

  // ── Core upload handler ───────────────────────────────────────────────────

  const analyzeFile = useCallback(async (file: File) => {
    if (!file.type.startsWith('image/')) {
      setError('Only image files are supported (JPEG, PNG, WEBP, TIFF).');
      return;
    }

    // Reset state
    setResult(null);
    setError(null);
    setLog([]);
    setOriginalUrl(URL.createObjectURL(file));
    setLoading(true);

    pushLog(`Artifact received: ${file.name} (${(file.size / 1024).toFixed(1)} KB)`, 'info');
    pushLog('Initialising forensic scan protocol…', 'info');

    const formData = new FormData();
    formData.append('file', file);

    try {
      pushLog('Dispatching payload to Tathya.io Forensics API…', 'info');
      const res = await fetch(`${API_BASE}/api/analyze/image`, {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) {
        const detail = await res.json().catch(() => ({ detail: res.statusText }));
        throw new Error(detail.detail ?? `HTTP ${res.status}`);
      }

      const data: AnalysisResult = await res.json();

      pushLog('ELA heatmap generated successfully.', 'ok');
      pushLog(`EXIF tags extracted: ${Object.keys(data.metadata).length} fields.`, 'info');

      const aiLabel = data.ai_analysis.label;
      const aiScore = (data.ai_analysis.confidence_score * 100).toFixed(1);

      if (aiLabel === 'AI Scan Unavailable') {
        pushLog('AI scan skipped — no HuggingFace token configured.', 'warn');
      } else if (aiLabel === 'manipulated') {
        pushLog(`⚠ AI verdict: MANIPULATED (${aiScore}% confidence)`, 'warn');
      } else {
        pushLog(`✓ AI verdict: AUTHENTIC (${aiScore}% confidence)`, 'ok');
      }

      pushLog('Scan complete. Final verdict matrix ready.', 'ok');
      setResult(data);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      pushLog(`ERROR: ${msg}`, 'warn');
      setError(`Analysis failed: ${msg}`);
    } finally {
      setLoading(false);
    }
  }, [pushLog]);

  // ── Drag & drop ──────────────────────────────────────────────────────────

  const onDrop = useCallback((e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) analyzeFile(file);
  }, [analyzeFile]);

  const onFileChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) analyzeFile(file);
    e.target.value = '';
  }, [analyzeFile]);

  // ── Derived UI values ────────────────────────────────────────────────────

  const isManipulated = result?.ai_analysis.label === 'manipulated';
  const isUnavailable = result?.ai_analysis.label === 'AI Scan Unavailable';
  const confidence    = result ? result.ai_analysis.confidence_score : 0;
  const verdictColor  = isUnavailable ? '#64748b' : isManipulated ? '#FF2A2A' : '#00FF66';
  const verdictLabel  = isUnavailable ? 'Scan Unavailable' : isManipulated ? 'Tampering Detected' : 'Authentic';
  const VerdictIcon   = isUnavailable ? Info : isManipulated ? ShieldAlert : ShieldCheck;

  return (
    <div className="flex flex-col gap-6 max-w-7xl mx-auto w-full pb-8 h-full">

      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <div className="flex items-end justify-between border-b border-white/10 pb-4 shrink-0">
        <div>
          <h1 className="font-heading text-4xl font-bold text-white mb-2">Analysis Lab</h1>
          <p className="font-mono text-xs text-zinc-500 uppercase tracking-widest">
            Core Upload · ELA · EXIF · AI Verdict
          </p>
        </div>
        <div className="flex gap-3 items-center">
          {loading && (
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded bg-[#121212] border border-primary/40 text-primary font-sans text-xs font-semibold animate-pulse">
              <Loader2 size={12} className="animate-spin" /> Scanning…
            </span>
          )}
          {!loading && (
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded bg-[#121212] border border-white/10 text-white font-sans text-xs font-semibold">
              <span className="w-2 h-2 rounded-full bg-success"></span>
              API Online
            </span>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 w-full flex-1">

        {/* ── Left Column ──────────────────────────────────────────────────── */}
        <div className="xl:col-span-8 flex flex-col gap-6">

          {/* Drop Zone */}
          <div
            className={`relative bg-[#121212] rounded-lg border-2 border-dashed p-12 text-center group transition-colors duration-300 shrink-0 cursor-pointer
              ${dragging ? 'border-primary bg-primary/5' : 'border-primary/40 hover:border-primary'}`}
            onDragOver={e => { e.preventDefault(); setDragging(true); }}
            onDragLeave={() => setDragging(false)}
            onDrop={onDrop}
            onClick={() => fileInputRef.current?.click()}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="sr-only"
              onChange={onFileChange}
            />
            <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none inner-glow-cyan rounded-lg"></div>

            {loading ? (
              <div className="flex flex-col items-center gap-4">
                <Loader2 className="text-primary animate-spin" size={48} strokeWidth={1.5} />
                <p className="font-mono text-sm text-primary uppercase tracking-widest">Running forensic scan…</p>
              </div>
            ) : (
              <>
                <UploadCloud className="text-primary mx-auto mb-4 opacity-80" size={48} strokeWidth={1.5} />
                <h3 className="font-heading text-2xl font-semibold text-white mb-2">
                  {result ? 'Drop another artifact' : 'Initialize Artifact Analysis'}
                </h3>
                <p className="font-sans text-zinc-400 mb-6">
                  {dragging ? 'Release to upload…' : 'Drag & drop an image, or click to browse'}
                </p>
                <button
                  type="button"
                  className="bg-transparent border border-primary text-primary px-6 py-2 rounded font-mono text-sm uppercase tracking-widest hover:bg-primary hover:text-black transition-all duration-300 shadow-[0_0_10px_rgba(0,240,255,0.1)] hover:shadow-[0_0_15px_rgba(0,240,255,0.4)] outline-none bg-black/20"
                  onClick={e => { e.stopPropagation(); fileInputRef.current?.click(); }}
                >
                  Select Artifact
                </button>
              </>
            )}
          </div>

          {/* Error Banner */}
          {error && (
            <div className="flex items-start gap-3 p-4 bg-error/10 border border-error/30 rounded-lg text-error font-mono text-sm">
              <AlertTriangle size={18} className="shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {/* Image Viewer — only visible once result arrives */}
          <div className={`bg-[#121212] border border-white/10 rounded-lg flex flex-col flex-1 relative overflow-hidden min-h-[400px] transition-opacity duration-500 ${result || loading ? 'opacity-100' : 'opacity-40 pointer-events-none'}`}>
            {/* Toolbar */}
            <div className="h-12 bg-[#1A1A1A] flex items-center px-4 border-b border-white/10 justify-between shrink-0">
              <div className="flex items-center gap-2 font-mono text-xs text-white">
                <ImageIcon size={16} />
                <span>{result?.filename ?? 'No artifact loaded'}</span>
              </div>
              <div className="flex items-center gap-4 font-mono text-[10px] text-zinc-500">
                {result && <span>FMT: {result.content_type.split('/')[1]?.toUpperCase()}</span>}
              </div>
            </div>

            {/* ELA / Metadata Panels */}
            {activeTab === 'ela' && (
              <div className="relative flex-1 bg-[#0A0A0A] overflow-hidden">
                {/* Original */}
                {originalUrl && (
                  <div className="absolute inset-0 w-full h-full">
                    <img src={originalUrl} alt="original" className="w-full h-full object-contain" />
                  </div>
                )}

                {/* ELA Heatmap overlay */}
                {result?.ela_heatmap_base64 && (
                  <div
                    className="absolute inset-0 w-full h-full"
                    style={{ clipPath: `inset(0 ${100 - sliderPos}% 0 0)` }}
                  >
                    <img src={result.ela_heatmap_base64} alt="ELA heatmap" className="w-full h-full object-contain" />
                  </div>
                )}

                {/* Slider divider line */}
                {result?.ela_heatmap_base64 && (
                  <div
                    className="absolute inset-y-0 w-[2px] bg-primary -translate-x-1/2 shadow-[0_0_10px_rgba(0,240,255,0.8)] z-20 pointer-events-none"
                    style={{ left: `${sliderPos}%` }}
                  >
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-[#121212] border-2 border-primary rounded-full flex items-center justify-center shadow-[0_0_15px_rgba(0,240,255,0.5)]">
                      <span className="text-primary text-[10px] tracking-tighter font-bold">||</span>
                    </div>
                  </div>
                )}

                {result?.ela_heatmap_base64 && (
                  <>
                    <div className="absolute bottom-4 left-4 bg-surface/80 backdrop-blur-md px-3 py-1 border border-white/10 rounded font-mono text-[10px] text-primary z-10">ELA Heatmap</div>
                    <div className="absolute bottom-4 right-4 bg-surface/80 backdrop-blur-md px-3 py-1 border border-white/10 rounded font-mono text-[10px] text-white z-10">Source Artifact</div>
                    <input
                      type="range" min="0" max="100" value={sliderPos}
                      onChange={e => setSliderPos(Number(e.target.value))}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-ew-resize z-30"
                    />
                  </>
                )}

                {!originalUrl && !loading && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="font-mono text-xs text-zinc-600 uppercase tracking-widest">Upload an artifact to begin</span>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'metadata' && (
              <div className="flex-1 overflow-y-auto custom-scrollbar p-4">
                {result?.metadata && Object.keys(result.metadata).length > 0 ? (
                  <table className="w-full text-xs font-mono">
                    <tbody>
                      {Object.entries(result.metadata).map(([key, value]) => (
                        <tr key={key} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors">
                          <td className="py-2 pr-4 text-primary/70 whitespace-nowrap w-1/3">{key}</td>
                          <td className="py-2 text-zinc-300 break-all">{value}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <div className="h-full flex items-center justify-center">
                    <p className="font-mono text-xs text-zinc-600 uppercase tracking-widest">
                      {result ? 'No EXIF metadata found in this artifact.' : 'Run a scan first.'}
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Bottom toolbar */}
            <div className="h-14 bg-[#121212] flex items-center px-4 border-t border-white/10 gap-2 shrink-0">
              <button className="p-2 text-zinc-500 hover:text-primary hover:bg-white/5 rounded transition-colors outline-none"><ZoomIn size={18}/></button>
              <button className="p-2 text-zinc-500 hover:text-primary hover:bg-white/5 rounded transition-colors outline-none"><ZoomOut size={18}/></button>
              <div className="w-px h-6 bg-white/10 mx-2"></div>
              <button
                onClick={() => setActiveTab('ela')}
                className={`px-3 py-1 rounded text-xs font-mono outline-none transition-colors ${activeTab === 'ela' ? 'bg-white/5 border border-white/10 text-white' : 'bg-transparent border border-transparent text-zinc-500 hover:bg-white/5'}`}
              >
                ELA
              </button>
              <button
                onClick={() => setActiveTab('metadata')}
                className={`px-3 py-1 rounded text-xs font-mono outline-none transition-colors ${activeTab === 'metadata' ? 'bg-white/5 border border-white/10 text-white' : 'bg-transparent border border-transparent text-zinc-500 hover:bg-white/5'}`}
              >
                Metadata
              </button>
              {result?.ela_heatmap_base64 && (
                <a
                  href={result.ela_heatmap_base64}
                  download={`ela_${result.filename}`}
                  className="ml-auto p-2 text-zinc-500 hover:text-primary hover:bg-white/5 rounded transition-colors outline-none"
                  title="Download ELA heatmap"
                >
                  <Download size={18} />
                </a>
              )}
            </div>
          </div>
        </div>

        {/* ── Right Column ─────────────────────────────────────────────────── */}
        <div className="xl:col-span-4 flex flex-col gap-6">

          {/* Verdict Card */}
          <div className="bg-[#121212] border border-white/10 rounded-lg p-6 relative overflow-hidden shrink-0">
            <div
              className="absolute top-0 left-0 w-full h-1 transition-colors duration-500"
              style={{ backgroundColor: verdictColor }}
            ></div>
            <h3 className="font-heading text-2xl font-semibold text-white mb-6">Analysis Verdict</h3>

            {/* Radial confidence meter */}
            <div className="flex flex-col items-center justify-center mb-8">
              <div className="relative w-48 h-48 flex items-center justify-center">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" fill="transparent" r="40" stroke="#292a2a" strokeWidth="8"></circle>
                  <circle
                    cx="50" cy="50" fill="transparent" r="40"
                    stroke={verdictColor} strokeWidth="8"
                    strokeDasharray="251.2"
                    strokeDashoffset={result ? confidenceToOffset(confidence) : 251.2}
                    className="transition-all duration-700 ease-out"
                    style={{ filter: `drop-shadow(0 0 8px ${verdictColor}90)` }}
                  ></circle>
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                  {loading ? (
                    <Loader2 size={32} className="animate-spin" style={{ color: verdictColor }} />
                  ) : result ? (
                    <>
                      <span className="font-heading text-5xl font-bold transition-colors duration-500" style={{ color: verdictColor }}>
                        {(confidence * 100).toFixed(0)}%
                      </span>
                      <span className="font-mono text-[10px] mt-1 uppercase tracking-wider" style={{ color: verdictColor }}>
                        Confidence
                      </span>
                    </>
                  ) : (
                    <span className="font-mono text-xs text-zinc-600 uppercase tracking-wider text-center px-4">Awaiting<br/>Artifact</span>
                  )}
                </div>
              </div>

              {result && (
                <div
                  className="mt-4 px-4 py-1.5 rounded font-mono text-sm flex items-center gap-2 transition-all duration-500"
                  style={{ backgroundColor: `${verdictColor}15`, border: `1px solid ${verdictColor}40`, color: verdictColor }}
                >
                  <VerdictIcon size={16} />
                  {verdictLabel}
                </div>
              )}
            </div>

            {/* Signal breakdown */}
            <div className="space-y-3">
              {[
                {
                  label: 'ELA Signal',
                  icon: FileSearch2,
                  value: result ? (result.ela_heatmap_base64 ? 'Heatmap Generated' : 'Failed') : '—',
                  ok: !!result?.ela_heatmap_base64,
                },
                {
                  label: 'EXIF Integrity',
                  icon: Info,
                  value: result
                    ? Object.keys(result.metadata).length > 0
                      ? `${Object.keys(result.metadata).length} tags found`
                      : 'No metadata'
                    : '—',
                  ok: !!(result && Object.keys(result.metadata).length > 0),
                },
                {
                  label: 'AI Classification',
                  icon: Cpu,
                  value: result
                    ? result.ai_analysis.label === 'AI Scan Unavailable'
                      ? 'No Token'
                      : result.ai_analysis.label.charAt(0).toUpperCase() + result.ai_analysis.label.slice(1)
                    : '—',
                  ok: result ? result.ai_analysis.label === 'authentic' : null,
                },
              ].map(({ label, icon: Icon, value, ok }) => (
                <div key={label} className="bg-[#1A1A1A] rounded p-3 border border-white/5 flex justify-between items-center">
                  <span className="font-sans text-sm text-zinc-400 flex items-center gap-2">
                    <Icon size={14} className="text-zinc-600" />
                    {label}
                  </span>
                  <span
                    className="font-mono text-sm"
                    style={{
                      color: ok === null ? '#64748b' : ok ? '#00FF66' : (isManipulated ? '#FF2A2A' : '#64748b'),
                    }}
                  >
                    {value}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Execution Log */}
          <div className="bg-[#121212] border border-white/10 rounded-lg p-6 flex flex-col min-h-0 flex-1">
            <div className="flex items-center justify-between mb-4 shrink-0">
              <h3 className="font-heading text-lg font-semibold text-white">Execution Log</h3>
              <button
                onClick={() => setLog([])}
                className="text-zinc-600 hover:text-primary transition-colors outline-none cursor-pointer font-mono text-[10px] uppercase tracking-wider"
              >
                clear
              </button>
            </div>
            <div className="space-y-2 font-mono text-xs overflow-y-auto custom-scrollbar pr-1 max-h-64">
              {log.length === 0 && (
                <span className="text-zinc-700">{'>'} Awaiting artifact upload…</span>
              )}
              {log.map((entry, i) => (
                <div key={i} className="flex gap-3">
                  <span className="text-primary/40 shrink-0">{entry.time}</span>
                  <span className={
                    entry.type === 'warn' ? 'text-error' :
                    entry.type === 'ok'   ? 'text-success' :
                    'text-zinc-500'
                  }>
                    {'>'} {entry.msg}
                  </span>
                </div>
              ))}
              <div ref={logEndRef} />
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
