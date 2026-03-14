import React, { useState } from 'react';
import Dashboard from './components/Dashboard';
import EmotionProfile from './components/EmotionProfile';

function App() {
  const [analysisResult, setAnalysisResult] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  return (
    <div className="min-h-screen bg-background text-foreground overflow-hidden relative">
      {/* Background decorations */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-600/20 rounded-full blur-[120px] pointer-events-none" />

      <header className="pt-8 pb-4 px-6 max-w-7xl mx-auto relative z-10 flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
            Trisense
          </h1>
          <p className="text-slate-400 mt-1 text-sm tracking-wide uppercase">Multi-Modal Emotion Sensing</p>
        </div>
        <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse" />
            <span className="text-sm text-slate-300">System Ready</span>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column: Input Dashboard */}
          <div className="lg:col-span-5 flex flex-col gap-6 animate-slide-up">
            <Dashboard 
              onResult={setAnalysisResult} 
              isProcessing={isProcessing} 
              setProcessing={setIsProcessing} 
            />
          </div>
          
          {/* Right Column: Visualization */}
          <div className="lg:col-span-7 animate-slide-up" style={{animationDelay: '0.1s'}}>
             <div className="h-full min-h-[500px] glass-panel rounded-2xl p-6 flex flex-col relative overflow-hidden">
                <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                  <span className="inline-block w-8 h-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full" />
                  Emotion Profile Analysis
                </h2>
                
                <div className="flex-1 flex items-center justify-center">
                  {!isProcessing && !analysisResult && (
                    <div className="text-center text-slate-500 max-w-sm">
                      <div className="w-16 h-16 mx-auto mb-4 opacity-50">
                        <svg fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg>
                      </div>
                      <p>Upload a media file or enter text to view the multi-modal fusion analysis.</p>
                    </div>
                  )}
                  
                  {isProcessing && (
                    <div className="flex flex-col items-center">
                      <div className="w-16 h-16 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin mb-4" />
                      <p className="text-blue-400 animate-pulse">Running Neural Models...</p>
                    </div>
                  )}

                  {!isProcessing && analysisResult && (
                    <EmotionProfile data={analysisResult} />
                  )}
                </div>
             </div>
          </div>

        </div>
      </main>
    </div>
  );
}

export default App;
