import React, { useState } from 'react';
import { HardHat, Clock, Users, Calendar, Layers, FileText } from 'lucide-react';
import { FACILITATOR_GUIDES } from '../../data/initialData';

export const FacilitatorGuidesView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('guide-pull');

  const currentGuide = FACILITATOR_GUIDES.find((g) => g.id === activeTab) || FACILITATOR_GUIDES[0];

  return (
    <div id="facilitator-guides-view" className="space-y-6 max-w-5xl mx-auto pb-12 animate-fade-in">
      {/* Header */}
      <div className="p-6 rounded-lg bg-[#1e293b] border border-[#334155] shadow-md flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <HardHat className="w-5 h-5 text-[#f59e0b]" />
            <h2 className="text-lg font-bold text-[#f8fafc]">LPS Meeting Facilitator & Lean Champion Guides</h2>
          </div>
          <p className="text-xs text-[#94a3b8] mt-1">
            Standard operating procedures, timing structures, and step-by-step facilitation agendas for the 4 core LPS ceremonies.
          </p>
        </div>
      </div>

      {/* 4 Tabs Bar */}
      <div className="flex flex-wrap gap-2 border-b border-[#334155] pb-2">
        {FACILITATOR_GUIDES.map((guide) => {
          const isActive = guide.id === activeTab;
          return (
            <button
              key={guide.id}
              id={`tab-${guide.id}`}
              onClick={() => setActiveTab(guide.id)}
              className={`px-4 py-2.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                isActive
                  ? 'bg-[#f59e0b] text-[#0f172a] shadow-md shadow-amber-500/20'
                  : 'bg-[#1e293b] text-[#94a3b8] hover:text-[#f8fafc] hover:bg-[#1e293b]/80 border border-[#334155]'
              }`}
            >
              {guide.title}
            </button>
          );
        })}
      </div>

      {/* Guide Content Card */}
      <div id="guide-detail-card" className="p-6 rounded-lg bg-[#1e293b] border border-[#334155] shadow-lg space-y-6">
        <div>
          <h3 className="text-xl font-extrabold text-[#f8fafc]">{currentGuide.title}</h3>
          <p className="text-xs text-[#94a3b8] mt-1">{currentGuide.description}</p>
        </div>

        {/* Meeting Stats Row (4 stats in a row) */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="p-3.5 rounded-lg bg-[#0f172a] border border-[#334155] flex items-center gap-3">
            <Calendar className="w-5 h-5 text-[#f59e0b] shrink-0" />
            <div>
              <div className="text-[10px] uppercase font-bold text-[#94a3b8]">Frequency</div>
              <div className="text-xs font-bold text-[#f8fafc] mt-0.5">{currentGuide.frequency}</div>
            </div>
          </div>

          <div className="p-3.5 rounded-lg bg-[#0f172a] border border-[#334155] flex items-center gap-3">
            <Clock className="w-5 h-5 text-[#38bdf8] shrink-0" />
            <div>
              <div className="text-[10px] uppercase font-bold text-[#94a3b8]">Typical Duration</div>
              <div className="text-xs font-bold text-[#f8fafc] mt-0.5">{currentGuide.duration}</div>
            </div>
          </div>

          <div className="p-3.5 rounded-lg bg-[#0f172a] border border-[#334155] flex items-center gap-3">
            <Users className="w-5 h-5 text-[#10b981] shrink-0" />
            <div>
              <div className="text-[10px] uppercase font-bold text-[#94a3b8]">Required Participants</div>
              <div className="text-xs font-bold text-[#f8fafc] mt-0.5 truncate" title={currentGuide.participants}>
                {currentGuide.participants}
              </div>
            </div>
          </div>
        </div>

        {/* Step-by-Step Agenda Table */}
        <div className="space-y-3">
          <h4 className="text-xs uppercase font-bold tracking-wider text-[#94a3b8] flex items-center gap-1.5">
            <FileText className="w-4 h-4 text-[#f59e0b]" />
            <span>Facilitation Meeting Flow & Agenda</span>
          </h4>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-[#334155] text-[#94a3b8] font-bold">
                  <th className="py-2.5 px-3 w-1/4">Step</th>
                  <th className="py-2.5 px-3 w-20">Time</th>
                  <th className="py-2.5 px-3">Facilitator Notes & Best Practices</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#334155]/60">
                {currentGuide.agenda.map((row, idx) => (
                  <tr key={idx} className="hover:bg-[#0f172a]/40 transition-colors">
                    <td className="py-3 px-3 font-bold text-[#f8fafc] align-top">{row.step}</td>
                    <td className="py-3 px-3 font-mono text-[#f59e0b] align-top whitespace-nowrap">{row.time}</td>
                    <td className="py-3 px-3 text-[#94a3b8] leading-relaxed align-top">{row.notes}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
