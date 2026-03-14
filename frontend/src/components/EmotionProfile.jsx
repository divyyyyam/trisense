import React, { useMemo } from 'react';
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale
} from 'chart.js';
import { Radar, Bar } from 'react-chartjs-2';

ChartJS.register(
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale
);

export default function EmotionProfile({ data }) {
  const { fused, overall_emotion, face, voice, text } = data;
  
  const labels = Object.keys(fused || {}).filter(k => k !== 'overall');

  // Colors for different modalities
  const colors = {
    fused: { border: 'rgba(139, 92, 246, 1)', bg: 'rgba(139, 92, 246, 0.4)' }, // Purple
    face:  { border: 'rgba(59, 130, 246, 0.8)', bg: 'rgba(59, 130, 246, 0.2)' }, // Blue
    voice: { border: 'rgba(16, 185, 129, 0.8)', bg: 'rgba(16, 185, 129, 0.2)' }, // Green
    text:  { border: 'rgba(245, 158, 11, 0.8)', bg: 'rgba(245, 158, 11, 0.2)' }, // Amber
  };

  const radarData = useMemo(() => {
    const datasets = [];
    
    // Add Individual Modalities if present
    if (face) datasets.push({
      label: 'Face Model',
      data: labels.map(l => face[l] * 100),
      backgroundColor: colors.face.bg,
      borderColor: colors.face.border,
      borderWidth: 1,
      pointRadius: 0,
      hidden: true, // Hidden by default to not clutter
    });
    
    if (voice) datasets.push({
      label: 'Voice Model',
      data: labels.map(l => voice[l] * 100),
      backgroundColor: colors.voice.bg,
      borderColor: colors.voice.border,
      borderWidth: 1,
      pointRadius: 0,
      hidden: true,
    });

    if (text) datasets.push({
      label: 'Text Model',
      data: labels.map(l => text[l] * 100),
      backgroundColor: colors.text.bg,
      borderColor: colors.text.border,
      borderWidth: 1,
      pointRadius: 0,
      hidden: true,
    });

    // Add Fused as main visible set
    if (fused) datasets.push({
      label: 'Late Fusion (Trisense)',
      data: labels.map(l => fused[l] * 100),
      backgroundColor: colors.fused.bg,
      borderColor: colors.fused.border,
      borderWidth: 2,
      pointBackgroundColor: colors.fused.border,
    });

    return { labels, datasets };
  }, [data, labels]);

  const radarOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      r: {
        angleLines: { color: 'rgba(255, 255, 255, 0.1)' },
        grid: { color: 'rgba(255, 255, 255, 0.1)' },
        pointLabels: { color: 'rgba(255, 255, 255, 0.7)', font: { size: 12, family: 'Outfit' } },
        ticks: { display: false, min: 0, max: 100 }
      }
    },
    plugins: {
      legend: {
        position: 'bottom',
        labels: { color: 'rgba(255, 255, 255, 0.8)', font: { family: 'Outfit' } }
      },
      tooltip: {
        backgroundColor: 'rgba(15, 23, 42, 0.9)',
        titleFont: { family: 'Outfit' },
        bodyFont: { family: 'Outfit' },
        callbacks: {
          label: (context) => `${context.dataset.label}: ${context.raw.toFixed(1)}%`
        }
      }
    }
  };

  // Sort fused data for the bar chart sidecard
  const sortedEmotions = useMemo(() => {
     if(!fused) return [];
     return Object.entries(fused)
       .sort((a, b) => b[1] - a[1])
       .map(([label, val]) => ({ label, value: val * 100 }));
  }, [fused]);

  return (
    <div className="w-full h-full flex flex-col pt-4 animate-fade-in">
      
      {/* Top Banner showing primary emotion */}
      {overall_emotion && (
        <div className="bg-gradient-to-r from-blue-900/40 to-purple-900/40 border border-purple-500/30 rounded-xl p-4 mb-6 flex items-center justify-between">
          <div>
            <p className="text-slate-400 text-sm">Primary Detected Emotion</p>
            <h3 className="text-3xl font-bold text-white capitalize">{overall_emotion}</h3>
          </div>
          <div className="w-16 h-16 rounded-full bg-purple-500/20 flex items-center justify-center border border-purple-500/50">
             <span className="text-2xl">
               {overall_emotion === 'Happy' ? '😊' : 
                overall_emotion === 'Sad' ? '😢' : 
                overall_emotion === 'Angry' ? '😠' : 
                overall_emotion === 'Surprise' ? '😲' : '😐'}
             </span>
          </div>
        </div>
      )}

      {/* Main Charts Area */}
      <div className="flex-1 min-h-[350px] relative mt-2 flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative min-h-[300px]">
           <Radar data={radarData} options={radarOptions} />
        </div>
        
        {/* Top 3 Breakdown */}
        <div className="w-full md:w-1/3 flex flex-col justify-center gap-4 border-t md:border-t-0 md:border-l border-slate-700/50 pt-4 md:pt-0 md:pl-4">
           <h4 className="text-sm font-medium text-slate-400 uppercase tracking-widest text-center">Top Signals</h4>
           <div className="flex flex-col gap-3 mt-2">
             {sortedEmotions.slice(0, 3).map((item, idx) => (
                <div key={item.label} className="bg-slate-800/50 p-3 rounded-lg flex flex-col gap-2">
                   <div className="flex justify-between items-center text-sm">
                      <span className="text-slate-200 font-medium capitalize">{item.label}</span>
                      <span className="text-purple-400 font-bold">{item.value.toFixed(1)}%</span>
                   </div>
                   <div className="w-full bg-slate-900 rounded-full h-2 overflow-hidden">
                      <div 
                        className={`h-full rounded-full bg-gradient-to-r ${idx === 0 ? 'from-purple-500 to-blue-500' : 'from-slate-500 to-slate-400'}`} 
                        style={{ width: `${item.value}%` }}
                      />
                   </div>
                </div>
             ))}
           </div>
        </div>
      </div>
    </div>
  );
}
