import React, { useState } from 'react';
import { Users, MapPin, Plus, Trash2, CheckCircle2 } from 'lucide-react';
import { LPSData, TradeItem } from '../../types';

interface TradesAreasViewProps {
  data: LPSData;
  onUpdateTrades: (trades: TradeItem[]) => void;
  onUpdateAreas: (areas: string[]) => void;
}

export const TradesAreasView: React.FC<TradesAreasViewProps> = ({
  data,
  onUpdateTrades,
  onUpdateAreas
}) => {
  // Trade Form State
  const [newTradeCode, setNewTradeCode] = useState('');
  const [newTradeName, setNewTradeName] = useState('');
  const [newTradeLead, setNewTradeLead] = useState('');
  const [newTradeColor, setNewTradeColor] = useState('#38bdf8');

  // Area Form State
  const [newArea, setNewArea] = useState('');

  const handleAddTrade = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTradeCode.trim() || !newTradeName.trim()) return;

    const newTrade: TradeItem = {
      code: newTradeCode.trim().toUpperCase(),
      name: newTradeName.trim(),
      lead: newTradeLead.trim() || 'Foreman',
      color: newTradeColor
    };

    onUpdateTrades([...data.trades, newTrade]);
    setNewTradeCode('');
    setNewTradeName('');
    setNewTradeLead('');
  };

  const handleDeleteTrade = (code: string) => {
    onUpdateTrades(data.trades.filter((t) => t.code !== code));
  };

  const handleAddArea = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newArea.trim()) return;
    if (data.areas.includes(newArea.trim())) return;

    onUpdateAreas([...data.areas, newArea.trim()]);
    setNewArea('');
  };

  const handleDeleteArea = (area: string) => {
    onUpdateAreas(data.areas.filter((a) => a !== area));
  };

  return (
    <div id="trades-areas-view" className="space-y-8 max-w-5xl mx-auto pb-12 animate-fade-in">
      {/* Header */}
      <div className="p-6 rounded-lg bg-[#1e293b] border border-[#334155] shadow-md flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-[#f59e0b]" />
            <h2 className="text-lg font-bold text-[#f8fafc]">Subcontractor Trades & Project Work Zones</h2>
          </div>
          <p className="text-xs text-[#94a3b8] mt-1">
            Maintain the registry of responsible trade partners, craft leaders, and physical construction zones.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Trades Management Column */}
        <div className="p-6 rounded-lg bg-[#1e293b] border border-[#334155] shadow-lg space-y-4 flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-[#f8fafc] flex items-center justify-between pb-3 border-b border-[#334155]">
              <span className="flex items-center gap-2">
                <Users className="w-4 h-4 text-[#38bdf8]" />
                <span>Trade Partners ({data.trades.length})</span>
              </span>
            </h3>

            {/* List of Trades */}
            <div className="space-y-2 max-h-80 overflow-y-auto py-3">
              {data.trades.map((t) => (
                <div
                  key={t.code}
                  className="p-3 rounded-lg bg-[#0f172a] border border-[#334155] flex items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-2.5">
                    <span
                      className="w-3 h-3 rounded-full shrink-0"
                      style={{ backgroundColor: t.color || '#38bdf8' }}
                    />
                    <div>
                      <div className="text-xs font-bold text-[#f8fafc] flex items-center gap-1.5">
                        <span className="font-mono text-[#f59e0b]">[{t.code}]</span>
                        <span>{t.name}</span>
                      </div>
                      <div className="text-[10px] text-[#94a3b8]">Lead: {t.lead}</div>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleDeleteTrade(t.code)}
                    className="p-1.5 text-slate-500 hover:text-red-400 rounded transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Add Trade Form */}
          <form onSubmit={handleAddTrade} className="pt-4 border-t border-[#334155] space-y-3">
            <div className="text-xs font-bold text-[#94a3b8] uppercase tracking-wider">+ Register New Trade</div>
            <div className="grid grid-cols-2 gap-2">
              <input
                type="text"
                required
                placeholder="Code (e.g. ELEC)"
                value={newTradeCode}
                onChange={(e) => setNewTradeCode(e.target.value)}
                className="px-2.5 py-1.5 bg-[#0f172a] border border-[#334155] rounded text-xs text-[#f8fafc] focus:border-[#f59e0b] focus:outline-none"
              />
              <input
                type="text"
                required
                placeholder="Trade Name (e.g. Electrical)"
                value={newTradeName}
                onChange={(e) => setNewTradeName(e.target.value)}
                className="px-2.5 py-1.5 bg-[#0f172a] border border-[#334155] rounded text-xs text-[#f8fafc] focus:border-[#f59e0b] focus:outline-none"
              />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <input
                type="text"
                placeholder="Foreman Name"
                value={newTradeLead}
                onChange={(e) => setNewTradeLead(e.target.value)}
                className="px-2.5 py-1.5 bg-[#0f172a] border border-[#334155] rounded text-xs text-[#f8fafc] focus:border-[#f59e0b] focus:outline-none"
              />
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={newTradeColor}
                  onChange={(e) => setNewTradeColor(e.target.value)}
                  className="w-8 h-8 rounded bg-transparent border-0 cursor-pointer"
                />
                <button
                  type="submit"
                  className="flex-1 py-1.5 bg-[#38bdf8] hover:bg-sky-500 text-[#0f172a] font-bold text-xs rounded transition-colors cursor-pointer"
                >
                  Add Trade
                </button>
              </div>
            </div>
          </form>
        </div>

        {/* Areas / Zones Management Column */}
        <div className="p-6 rounded-lg bg-[#1e293b] border border-[#334155] shadow-lg space-y-4 flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-[#f8fafc] flex items-center justify-between pb-3 border-b border-[#334155]">
              <span className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[#10b981]" />
                <span>Work Zones & Levels ({data.areas.length})</span>
              </span>
            </h3>

            {/* List of Areas */}
            <div className="space-y-2 max-h-80 overflow-y-auto py-3">
              {data.areas.map((area) => (
                <div
                  key={area}
                  className="p-3 rounded-lg bg-[#0f172a] border border-[#334155] flex items-center justify-between gap-3"
                >
                  <div className="text-xs font-semibold text-[#f8fafc] flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5 text-[#10b981]" />
                    <span>{area}</span>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleDeleteArea(area)}
                    className="p-1.5 text-slate-500 hover:text-red-400 rounded transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Add Area Form */}
          <form onSubmit={handleAddArea} className="pt-4 border-t border-[#334155] space-y-3">
            <div className="text-xs font-bold text-[#94a3b8] uppercase tracking-wider">+ Add Work Zone / Area</div>
            <div className="flex gap-2">
              <input
                type="text"
                required
                placeholder="e.g. Level 05 East Tower"
                value={newArea}
                onChange={(e) => setNewArea(e.target.value)}
                className="flex-1 px-2.5 py-1.5 bg-[#0f172a] border border-[#334155] rounded text-xs text-[#f8fafc] focus:border-[#f59e0b] focus:outline-none"
              />
              <button
                type="submit"
                className="px-4 py-1.5 bg-[#10b981] hover:bg-emerald-600 text-[#0f172a] font-bold text-xs rounded transition-colors cursor-pointer"
              >
                Add Zone
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
