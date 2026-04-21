export function AuthView({ onLogin }: { onLogin: () => void }) {
  return (
    <main className="flex w-full min-h-screen flex-col lg:flex-row bg-[#020202] text-[#f8fafc] selection:bg-[#00f0ff] selection:text-[#001f21] font-sans overflow-hidden">
      {/* Left Section - Hero Visual */}
      <section className="hidden lg:flex lg:w-[55%] relative bg-[#050505] items-center justify-center overflow-hidden border-r border-white-[0.03]">
        {/* Deep background layers */}
        <div className="absolute inset-0 z-0 bg-black"></div>
        
        {/* Main Fingerprint Image with complex layering */}
        <div 
          className="absolute inset-0 z-10 bg-cover bg-center mix-blend-screen opacity-50 scale-105" 
          style={{ backgroundImage: "url('/fingerprint.png')" }}>
        </div>

        {/* Ambient Glows */}
        <div className="absolute inset-0 z-20 bg-gradient-to-r from-black via-transparent to-transparent"></div>
        <div className="absolute inset-0 z-20 bg-[radial-gradient(circle_at_40%_50%,rgba(0,240,255,0.08)_0%,transparent_60%)]"></div>
        
        {/* Content Container */}
        <div className="relative z-30 px-24 max-w-3xl">
          <div className="flex flex-col items-start gap-1">
            <div className="relative mb-12">
              <div className="absolute inset-0 bg-[#00f0ff]/20 blur-3xl rounded-full scale-150 animate-pulse"></div>
              <div className="relative flex items-center justify-center w-24 h-24 rounded-full bg-[#0a0a0a] border border-[#00f0ff]/30 shadow-[inset_0_0_20px_rgba(0,240,255,0.1),0_0_40px_rgba(0,240,255,0.2)]">
                <span className="material-symbols-outlined text-[48px] text-[#00f0ff] animate-pulse" style={{ fontVariationSettings: "'FILL' 1" }}>
                  shield
                </span>
              </div>
            </div>
            
            <h1 className="font-heading text-[64px] leading-[1] font-bold text-white mb-6 tracking-tight drop-shadow-2xl">
              Vigilance <br/> <span className="text-white/90">Starts Here</span>
            </h1>
            
            <p className="text-[20px] leading-relaxed text-slate-400 max-w-md font-medium tracking-wide">
              Access the Core Terminal to initialize advanced threat detection and neural anomaly scanning.
            </p>
          </div>
        </div>
        
        {/* Scanline Effect */}
        <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#00f0ff]/60 to-transparent opacity-30 z-40 shadow-[0_0_15px_rgba(0,240,255,0.5)]"></div>
      </section>

      {/* Right Section - Login Card */}
      <section className="flex-1 flex flex-col items-center justify-center p-8 bg-[#0a0a0a] relative overflow-hidden">
        {/* Background Noise/Texture */}
        <div className="absolute inset-0 opacity-[0.02] pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')]"></div>

        {/* Login Card */}
        <div className="w-full max-w-[460px] bg-[#0d0d0d] border border-white-[0.05] p-12 rounded-3xl shadow-[0_32px_64px_-16px_rgba(0,0,0,0.8),inset_0_1px_0_rgba(255,255,255,0.05)] relative z-10 backdrop-blur-sm">
          <div className="mb-12 text-center flex flex-col items-center">
            <h2 className="font-heading text-[28px] font-bold text-white mb-3 tracking-[0.1em] uppercase">
              SENTINEL FORGERY AI
            </h2>
            <div className="h-px w-12 bg-[#00f0ff]/50 mb-3"></div>
            <p className="text-[14px] font-semibold text-slate-500 uppercase tracking-widest">
              Authenticate to access Core Terminal
            </p>
          </div>

          {/* Social Auth */}
          <button 
            type="button" 
            className="w-full h-14 flex items-center justify-center gap-4 rounded-xl border border-white/10 bg-[#161616] text-white text-[13px] font-bold uppercase tracking-[0.1em] hover:bg-[#1a1a1a] hover:border-white/20 transition-all duration-200 shadow-lg active:scale-[0.99]"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"></path>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"></path>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"></path>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"></path>
            </svg>
            Continue with Google
          </button>

          <div className="flex items-center my-10">
            <div className="flex-grow border-t border-white-[0.03]"></div>
            <span className="mx-6 text-[10px] font-bold text-slate-600 uppercase tracking-[0.3em]">or</span>
            <div className="flex-grow border-t border-white-[0.03]"></div>
          </div>

          <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); onLogin(); }}>
            <div className="group">
              <input 
                id="email" 
                name="email" 
                type="email" 
                required 
                placeholder="Analyst ID / Email"
                className="w-full h-14 bg-black border border-white/5 rounded-xl px-5 font-sans text-[15px] text-white placeholder:text-slate-600 focus:outline-none focus:border-[#00f0ff]/40 focus:ring-1 focus:ring-[#00f0ff]/10 transition-all group-hover:border-white/10"
              />
            </div>

            <div className="relative group">
              <input 
                id="password" 
                name="password" 
                type="password" 
                required 
                placeholder="Passkey"
                className="w-full h-14 bg-black border border-white/5 rounded-xl px-5 font-sans text-[15px] text-white placeholder:text-slate-600 focus:outline-none focus:border-[#00f0ff]/40 focus:ring-1 focus:ring-[#00f0ff]/10 transition-all group-hover:border-white/10 pr-14"
              />
              <button type="button" className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-600 hover:text-[#00f0ff] transition-colors focus:outline-none">
                <span className="material-symbols-outlined text-[20px]">visibility_off</span>
              </button>
            </div>

            <div className="flex items-center justify-between pb-4">
              <label className="flex items-center cursor-pointer group">
                <div className="relative flex items-center justify-center w-5 h-5 rounded border border-white/10 bg-black group-hover:border-[#00f0ff]/50 transition-all">
                  <input type="checkbox" className="sr-only peer" />
                  <span className="material-symbols-outlined text-[16px] text-[#00f0ff] opacity-0 peer-checked:opacity-100 transition-opacity absolute pointer-events-none">check</span>
                </div>
                <span className="ml-3 text-[14px] font-semibold text-slate-500 group-hover:text-slate-400 transition-colors">Maintain Connection</span>
              </label>
              <a href="#" className="text-[14px] font-bold text-[#00f0ff]/80 hover:text-[#00f0ff] hover:drop-shadow-[0_0_8px_rgba(0,240,255,0.3)] transition-all">Reset Access</a>
            </div>

            <button 
              type="submit" 
              className="w-full h-14 bg-[#00f0ff] text-[#001f21] text-[14px] font-bold uppercase tracking-[0.2em] rounded-xl hover:bg-[#33f3ff] hover:shadow-[0_0_32px_rgba(0,240,255,0.5)] active:scale-[0.98] transition-all duration-300 transform"
            >
              Initialize Session
            </button>
          </form>

          <div className="mt-12 text-center">
            <p className="text-[14px] font-medium text-slate-500">
              New Operative? <a href="#" className="text-[#00f0ff] font-bold ml-1 hover:underline underline-offset-8 transition-all">Request Clearance</a>
            </p>
          </div>
        </div>

        {/* Footer Links */}
        <div className="absolute bottom-10 left-0 w-full flex justify-center gap-10 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-700">
          <a href="#" className="hover:text-[#00f0ff] transition-colors">Protocol</a>
          <a href="#" className="hover:text-[#00f0ff] transition-colors">Privacy Directive</a>
        </div>
      </section>
    </main>
  );
}


