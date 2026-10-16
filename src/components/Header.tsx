import React from 'react';
import { 
  Sparkles, 
  Bot, 
  Settings, 
  AlertCircle, 
  Mail, 
  FileText, 
  Layers, 
  DollarSign 
} from 'lucide-react';
import { BusinessProfile } from '../types';

interface HeaderProps {
  profile: BusinessProfile;
  overdueCount: number;
  overdueAmount: number;
  pendingQuotesCount: number;
  unrepliedEmailsCount: number;
  onOpenAssistant: () => void;
  onOpenSettings: () => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  profile,
  overdueCount,
  overdueAmount,
  pendingQuotesCount,
  unrepliedEmailsCount,
  onOpenAssistant,
  onOpenSettings,
  activeTab,
  setActiveTab
}) => {
  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Brand Logo & Name */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-linear-to-tr from-rose-500 via-pink-600 to-indigo-700 flex items-center justify-center text-white shadow-md shadow-pink-200">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xl font-black tracking-tight text-slate-900 flex items-center space-x-1.5">
                  <span>NexusOps</span>
                  <span className="text-base">🌸</span>
                </span>
                <span className="text-[11px] font-bold uppercase tracking-wider bg-rose-50 text-rose-700 px-2 py-0.5 rounded-full border border-rose-200/80">
                  Botanical Cockpit
                </span>
              </div>
              <div className="flex items-center space-x-1.5 text-xs text-slate-500">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                <span>AI Automation Assistant Active</span>
                <span className="text-slate-300">•</span>
                <span className="font-medium text-slate-700">{profile.companyName}</span>
              </div>
            </div>
          </div>

          {/* Quick Metrics Ticker */}
          <div className="hidden lg:flex items-center space-x-3 bg-slate-50 p-1.5 rounded-xl border border-slate-200 text-xs">
            {overdueCount > 0 ? (
              <button 
                onClick={() => setActiveTab('invoices')}
                className="flex items-center space-x-1.5 px-2.5 py-1 rounded-lg bg-rose-50 text-rose-700 border border-rose-200 hover:bg-rose-100 transition-colors cursor-pointer"
              >
                <AlertCircle className="w-3.5 h-3.5 text-rose-600" />
                <span className="font-semibold">{overdueCount} Overdue</span>
                <span className="text-rose-500">(${overdueAmount.toLocaleString()})</span>
              </button>
            ) : (
              <div className="flex items-center space-x-1 px-2.5 py-1 text-emerald-700">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                <span>Invoices on track</span>
              </div>
            )}

            <button 
              onClick={() => setActiveTab('quotes')}
              className="flex items-center space-x-1.5 px-2.5 py-1 rounded-lg text-slate-600 hover:bg-white hover:shadow-xs transition-all cursor-pointer"
            >
              <FileText className="w-3.5 h-3.5 text-amber-600" />
              <span>Quotes:</span>
              <span className="font-semibold text-slate-900">{pendingQuotesCount} Active</span>
            </button>

            <button 
              onClick={() => setActiveTab('emails')}
              className="flex items-center space-x-1.5 px-2.5 py-1 rounded-lg text-slate-600 hover:bg-white hover:shadow-xs transition-all cursor-pointer"
            >
              <Mail className="w-3.5 h-3.5 text-sky-600" />
              <span>Inbox:</span>
              <span className="font-semibold text-slate-900">{unrepliedEmailsCount} Unreplied</span>
            </button>
          </div>

          {/* Right Action Controls */}
          <div className="flex items-center space-x-2.5">
            {/* AI Assistant Quick Trigger */}
            <button
              onClick={onOpenAssistant}
              className="group relative inline-flex items-center space-x-2 px-3.5 py-2 text-xs font-semibold rounded-xl bg-linear-to-r from-indigo-600 to-indigo-700 text-white shadow-sm hover:from-indigo-700 hover:to-indigo-800 transition-all cursor-pointer active:scale-95"
            >
              <Bot className="w-4 h-4 text-indigo-200 group-hover:rotate-12 transition-transform" />
              <span>Ops AI Assistant</span>
              <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-spin" style={{ animationDuration: '6s' }} />
            </button>

            {/* Profile / Settings Button */}
            <button
              onClick={onOpenSettings}
              title="Business Settings"
              className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
            >
              <Settings className="w-5 h-5" />
            </button>
          </div>

        </div>
      </div>
    </header>
  );
};
