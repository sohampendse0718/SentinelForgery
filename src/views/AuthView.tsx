export function AuthView({ onLogin }: { onLogin: () => void }) {
  return (
    <main className="flex w-full min-h-screen flex-col lg:flex-row bg-[#121414] text-[#e3e2e2] selection:bg-[#00f0ff] selection:text-[#006970]">
      <section className="hidden lg:flex lg:w-1/2 relative bg-[#121414] items-center justify-center overflow-hidden border-r border-white/10">
        <div 
          className="absolute inset-0 z-0 bg-cover bg-center mix-blend-screen opacity-50" 
          style={{ backgroundImage: "url('/fingerprint.jpg')" }}>
        </div>
        <div className="absolute inset-0 z-10 bg-gradient-to-tr from-[#121414] via-transparent to-[#00f0ff]/10"></div>
        <div className="absolute w-[600px] h-[600px] rounded-full bg-[#00f0ff]/5 blur-[120px] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-0"></div>
        
        <div className="relative z-20 px-12 max-w-xl text-center">
          <div className="inline-flex items-center justify-center p-4 rounded-full bg-[#1f2020]/50 border border-white/10 backdrop-blur-md mb-[32px] shadow-[inset_0_0_15px_rgba(0,240,255,0.1)]">
            <span className="material-symbols-outlined text-[48px] text-[#00f0ff] drop-shadow-[0_0_8px_rgba(0,240,255,0.8)]" style={{ fontVariationSettings: "'FILL' 1" }}>shield_lock</span>
          </div>
          <h1 className="font-heading text-[48px] leading-[1.1] font-bold text-[#e3e2e2] mb-[16px] tracking-tight">Vigilance Starts Here</h1>
          <p className="font-sans text-[18px] leading-[1.6] text-[#b9cacb] max-w-md mx-auto">Access the Core Terminal to initialize advanced threat detection and neural anomaly scanning.</p>
        </div>
        
        <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#00f0ff] to-transparent opacity-50 shadow-[0_0_10px_rgba(0,240,255,0.8)] z-20"></div>
      </section>

      <section className="flex-1 flex flex-col items-center justify-center p-[24px] bg-[#121414] relative">
        <div className="lg:hidden mb-[32px] flex flex-col items-center">
          <span className="material-symbols-outlined text-[32px] text-[#00f0ff] drop-shadow-[0_0_8px_rgba(0,240,255,0.8)] mb-2" style={{ fontVariationSettings: "'FILL' 1" }}>shield_lock</span>
          <span className="font-heading text-[24px] font-semibold text-[#00f0ff] tracking-widest drop-shadow-[0_0_8px_rgba(0,240,255,0.5)]">SENTINEL</span>
        </div>

        <div className="w-full max-w-[440px] bg-[#1f2020]/40 backdrop-blur-2xl border border-white/10 p-[32px] rounded-xl shadow-[0_8px_32px_rgba(0,0,0,0.5)] relative z-10">
          <div className="mb-[32px] text-center">
            <h2 className="font-heading text-[32px] leading-[1.2] font-semibold text-[#e3e2e2] mb-[8px] tracking-tight hidden lg:block">SENTINEL FORGERY AI</h2>
            <h2 className="font-heading text-[32px] leading-[1.2] font-semibold text-[#e3e2e2] mb-[8px] tracking-tight lg:hidden">Welcome Back</h2>
            <p className="font-sans text-[16px] text-[#b9cacb]">Authenticate to access Core Terminal</p>
          </div>

          <button type="button" className="w-full flex items-center justify-center gap-3 py-3 px-4 rounded border border-[#00f0ff]/30 bg-transparent text-[#e3e2e2] font-sans text-[12px] font-semibold uppercase tracking-widest hover:bg-[#00f0ff]/10 hover:border-[#00f0ff] hover:shadow-[0_0_15px_rgba(0,240,255,0.2)] transition-all duration-300 group">
            <svg className="w-5 h-5 text-[#e3e2e2] group-hover:text-[#00f0ff] transition-colors" fill="currentColor" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"></path>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"></path>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"></path>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"></path>
            </svg>
            Continue with Google
          </button>

          <div className="flex items-center my-[16px]">
            <div className="flex-grow border-t border-white/10"></div>
            <span className="mx-4 font-sans text-[12px] font-semibold text-[#b9cacb] uppercase tracking-widest">Or</span>
            <div className="flex-grow border-t border-white/10"></div>
          </div>

          <form className="space-y-[16px]" onSubmit={(e) => { e.preventDefault(); onLogin(); }}>
            <div className="relative bg-[#0a0a0a] rounded-t">
              <input 
                id="email" 
                name="email" 
                type="email" 
                required 
                placeholder="Email Address"
                className="peer w-full bg-transparent border-t-0 border-l-0 border-r-0 border-b border-white/10 px-4 pt-6 pb-2 font-mono text-[14px] font-medium text-[#e3e2e2] placeholder-transparent focus:ring-0 focus:outline-none focus:border-[#00f0ff] focus:shadow-[0_1px_0_0_rgba(0,240,255,1)] transition-all [&:-webkit-autofill]:shadow-[inset_0_0_0_30px_#0a0a0a] [&:-webkit-autofill]:text-[#e3e2e2]"
              />
              <label 
                htmlFor="email" 
                className="absolute left-4 top-2 font-sans text-[12px] font-semibold text-[#b9cacb] transition-all pointer-events-none peer-placeholder-shown:top-4 peer-placeholder-shown:font-normal peer-placeholder-shown:text-[16px] peer-focus:top-2 peer-focus:font-semibold peer-focus:text-[12px] peer-focus:text-[#00f0ff]"
              >
                Analyst ID / Email
              </label>
            </div>

            <div className="relative bg-[#0a0a0a] rounded-t">
              <input 
                id="password" 
                name="password" 
                type="password" 
                required 
                placeholder="Password"
                className="peer w-full bg-transparent border-t-0 border-l-0 border-r-0 border-b border-white/10 px-4 pt-6 pb-2 font-mono text-[14px] font-medium text-[#e3e2e2] placeholder-transparent focus:ring-0 focus:outline-none focus:border-[#00f0ff] focus:shadow-[0_1px_0_0_rgba(0,240,255,1)] transition-all pr-12 [&:-webkit-autofill]:shadow-[inset_0_0_0_30px_#0a0a0a] [&:-webkit-autofill]:text-[#e3e2e2]"
              />
              <label 
                htmlFor="password" 
                className="absolute left-4 top-2 font-sans text-[12px] font-semibold text-[#b9cacb] transition-all pointer-events-none peer-placeholder-shown:top-4 peer-placeholder-shown:font-normal peer-placeholder-shown:text-[16px] peer-focus:top-2 peer-focus:font-semibold peer-focus:text-[12px] peer-focus:text-[#00f0ff]"
              >
                Passkey
              </label>
              <button type="button" className="absolute right-4 top-1/2 -translate-y-1/2 text-[#b9cacb] hover:text-[#00f0ff] transition-colors focus:outline-none">
                <span className="material-symbols-outlined text-[20px]">visibility_off</span>
              </button>
            </div>

            <div className="flex items-center justify-between mt-[8px] mb-[32px]">
              <label className="flex items-center cursor-pointer group">
                <div className="relative flex items-center justify-center w-4 h-4 border border-white/20 rounded bg-[#0a0a0a] group-hover:border-[#00f0ff] transition-colors">
                  <input type="checkbox" className="sr-only peer" />
                  <span className="material-symbols-outlined text-[14px] text-[#00f0ff] opacity-0 peer-checked:opacity-100 transition-opacity absolute pointer-events-none" style={{ fontVariationSettings: "'FILL' 1" }}>check</span>
                </div>
                <span className="ml-2 font-sans text-[12px] font-semibold text-[#b9cacb] group-hover:text-[#e3e2e2] transition-colors">Maintain Connection</span>
              </label>
              <a href="#" className="font-sans text-[12px] font-semibold text-[#00f0ff] hover:text-[#7df4ff] hover:drop-shadow-[0_0_8px_rgba(0,240,255,0.5)] transition-all">Reset Access</a>
            </div>

            <button type="submit" className="w-full bg-[#00f0ff] text-[#006970] font-sans text-[12px] font-semibold uppercase tracking-widest py-4 rounded hover:bg-[#7df4ff] hover:shadow-[0_0_20px_rgba(0,240,255,0.4)] focus:outline-none focus:ring-2 focus:ring-[#00f0ff] focus:ring-offset-2 focus:ring-offset-[#121414] transition-all duration-300">
              Initialize Session
            </button>
          </form>

          <div className="mt-[32px] text-center">
            <p className="font-sans text-[12px] font-semibold text-[#b9cacb]">
              New Operative? <a href="#" className="text-[#00f0ff] hover:text-[#7df4ff] hover:drop-shadow-[0_0_8px_rgba(0,240,255,0.5)] transition-all ml-1">Request Clearance</a>
            </p>
          </div>
        </div>

        <div className="absolute bottom-6 left-0 w-full flex justify-center gap-6 z-10">
          <a href="#" className="font-sans text-[12px] font-semibold text-[#b9cacb] hover:text-[#e3e2e2] transition-colors">Protocol</a>
          <a href="#" className="font-sans text-[12px] font-semibold text-[#b9cacb] hover:text-[#e3e2e2] transition-colors">Privacy Directive</a>
        </div>
      </section>
    </main>
  );
}
