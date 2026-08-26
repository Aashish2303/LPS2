import React, { useState } from 'react';
import { ArrowRight, ShieldCheck } from 'lucide-react';

interface LoginViewProps {
  onLogin: (email: string) => void;
}

export const LoginView: React.FC<LoginViewProps> = ({ onLogin }) => {
  const [email, setEmail] = useState('ramesh.krishnan@horizonbuild.com');
  const [password, setPassword] = useState('demo1234');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      onLogin('guest.planner@lps-tool.com');
    } else {
      onLogin(email.trim());
    }
  };

  return (
    <div
      id="login-container"
      className="min-h-screen w-full bg-slate-900 flex items-center justify-center p-4 relative overflow-hidden font-sans text-slate-100"
    >
      {/* Background glow effects */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md bg-slate-800 border border-slate-700 rounded-xl shadow-2xl p-8 relative z-10">
        {/* Logo and Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-amber-500/20 text-amber-500 text-2xl mb-4 font-bold border border-amber-500/40 shadow-inner">
            📐
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-100 flex items-center justify-center gap-2">
            LPS Planning Tool
          </h1>
          <p className="text-xs font-semibold text-slate-400 mt-1 uppercase tracking-widest">
            Last Planner System — Big Room
          </p>
        </div>

        {/* Demo info banner */}
        <div className="mb-6 p-3.5 rounded-lg bg-amber-900/20 border border-amber-500/40 text-amber-300 text-xs flex items-center gap-2.5">
          <ShieldCheck className="w-4 h-4 shrink-0 text-amber-500" />
          <span>Demo credentials prefilled: click Sign In to continue</span>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5" htmlFor="login-email">
              Email Address
            </label>
            <input
              id="login-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g. planner@site.com"
              className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-lg text-slate-100 placeholder-slate-500 text-sm focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5" htmlFor="login-password">
              Password
            </label>
            <input
              id="login-password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-lg text-slate-100 placeholder-slate-500 text-sm focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all"
            />
          </div>

          <button
            id="btn-login-submit"
            type="submit"
            className="w-full mt-2 py-3 px-4 bg-amber-500 hover:bg-amber-600 active:scale-[0.98] text-slate-900 font-bold rounded-lg transition-all duration-200 flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 cursor-pointer"
          >
            <span>Sign In to Big Room</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-xs text-slate-400">
            Chittor Site — Block B Last Planner Environment
          </p>
        </div>
      </div>
    </div>
  );
};

