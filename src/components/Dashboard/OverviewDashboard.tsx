import React, { useState } from 'react';
import { 
  Receipt, 
  FileSpreadsheet, 
  Mail, 
  SpellCheck, 
  Sparkles, 
  AlertTriangle, 
  CheckCircle2, 
  ArrowRight, 
  TrendingUp, 
  Clock, 
  Send, 
  Bot,
  Zap,
  DollarSign,
  Flower2,
  Leaf,
  Sun
} from 'lucide-react';
import { BusinessProfile, EmailThread, Invoice, Quotation } from '../../types';
import { formatCurrency, formatDate, getDaysOverdue } from '../../utils/helpers';
import { RevenueTrendChart } from './RevenueTrendChart';
import { 
  BloomingPeony, 
  CherryBlossomBranch, 
  BotanicalLaurel, 
  FloatingPetalsLayer 
} from '../Floral/FloralMotifs';

interface OverviewDashboardProps {
  invoices: Invoice[];
  quotations: Quotation[];
  emails: EmailThread[];
  profile: BusinessProfile;
  setActiveTab: (tab: string) => void;
  onOpenAssistant: () => void;
  onOpenInvoiceReminder: (invoice: Invoice) => void;
  onConvertToInvoice: (quote: Quotation) => void;
  onViewInvoice?: (invoice: Invoice) => void;
}

export const OverviewDashboard: React.FC<OverviewDashboardProps> = ({
  invoices,
  quotations,
  emails,
  profile,
  setActiveTab,
  onOpenAssistant,
  onOpenInvoiceReminder,
  onConvertToInvoice,
  onViewInvoice,
}) => {
  const [showPetals, setShowPetals] = useState(true);

  const overdueInvoices = invoices.filter(
    (inv) => inv.status === 'overdue' || (inv.status === 'pending' && getDaysOverdue(inv.dueDate) > 0)
  );
  const overdueTotal = overdueInvoices.reduce((acc, inv) => acc + inv.totalAmount, 0);

  const acceptedQuotes = quotations.filter((q) => q.status === 'accepted');
  const unrepliedEmails = emails.filter((e) => e.status !== 'replied');
  const pendingCollectionTotal = invoices.filter(i => i.status !== 'paid' && i.status !== 'draft').reduce((acc, i) => acc + i.totalAmount, 0);
  const paidTotal = invoices.filter(i => i.status === 'paid').reduce((acc, i) => acc + (i.paidAmount || i.totalAmount), 0);

  return (
    <div className="space-y-7 relative">
      
      {/* Floating Botanical Petals Layer across Homepage */}
      {showPetals && <FloatingPetalsLayer />}

      {/* Hero Welcome & Botanical Floral Cockpit Banner */}
      <div className="bg-linear-to-r from-slate-950 via-indigo-950 to-slate-900 text-white rounded-3xl p-7 sm:p-9 shadow-xl border border-rose-900/40 relative overflow-hidden">
        
        {/* Soft Floral Backdrops */}
        <div className="absolute top-0 right-0 pointer-events-none opacity-20 sm:opacity-30">
          <CherryBlossomBranch className="w-80 h-36" />
        </div>
        <div className="absolute -bottom-8 -right-8 pointer-events-none opacity-25">
          <BloomingPeony size={180} />
        </div>

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            
            {/* Floral Badge Header */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-bold bg-linear-to-r from-rose-500/20 to-pink-500/20 text-rose-300 border border-rose-400/30 backdrop-blur-md">
                <Flower2 className="w-3.5 h-3.5 text-rose-400 animate-spin" style={{ animationDuration: '20s' }} />
                <span>Business in Full Bloom</span>
              </span>
              <span className="text-xs text-slate-500">•</span>
              <span className="text-xs font-medium text-emerald-400 flex items-center space-x-1">
                <Leaf className="w-3 h-3 text-emerald-400" />
                <span>Centralized Automated Operations</span>
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-white flex items-center space-x-2">
              <span>Flourish & Scale, {profile.ownerName || 'Ethan'}.</span>
            </h1>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Your botanical business cockpit is orchestrating <span className="text-emerald-300 font-bold font-mono">{formatCurrency(paidTotal, profile.currency)}</span> in realized revenue, with <span className="text-rose-300 font-bold">{overdueInvoices.length} invoices needing attention</span> and <span className="text-amber-300 font-bold">{acceptedQuotes.length} accepted proposal(s)</span> ready to bill.
            </p>

            {/* Quick Metrics Ticker inside Hero */}
            <div className="flex flex-wrap items-center gap-3 pt-1 text-xs">
              <div className="bg-white/10 px-3 py-1.5 rounded-xl border border-white/10 flex items-center space-x-2 backdrop-blur-sm">
                <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                <span className="text-slate-300">MoM Growth:</span>
                <span className="font-bold font-mono text-emerald-300">+19.2%</span>
              </div>
              <div className="bg-white/10 px-3 py-1.5 rounded-xl border border-white/10 flex items-center space-x-2 backdrop-blur-sm">
                <span className="w-2 h-2 rounded-full bg-rose-400"></span>
                <span className="text-slate-300">Overdue:</span>
                <span className="font-bold font-mono text-rose-300">{formatCurrency(overdueTotal, profile.currency)}</span>
              </div>
              <div className="bg-white/10 px-3 py-1.5 rounded-xl border border-white/10 flex items-center space-x-2 backdrop-blur-sm">
                <span className="w-2 h-2 rounded-full bg-sky-400"></span>
                <span className="text-slate-300">Email Queue:</span>
                <span className="font-bold text-sky-300">{unrepliedEmails.length} Pending</span>
              </div>
            </div>
          </div>

          {/* Action buttons & Petals toggle */}
          <div className="flex flex-col sm:flex-row lg:flex-col items-start sm:items-center lg:items-end gap-3 shrink-0">
            <button
              onClick={onOpenAssistant}
              className="inline-flex items-center space-x-2 px-5 py-3 text-xs font-bold rounded-2xl bg-linear-to-r from-rose-500 via-pink-600 to-indigo-600 hover:from-rose-600 hover:to-indigo-700 text-white shadow-lg shadow-rose-500/25 transition-all cursor-pointer active:scale-95 border border-rose-400/30"
            >
              <Bot className="w-4 h-4 text-amber-200" />
              <span>Launch Ops AI Assistant</span>
              <Sparkles className="w-3.5 h-3.5 text-amber-200" />
            </button>

            {/* Petals Breeze Toggle Button */}
            <button
              onClick={() => setShowPetals(!showPetals)}
              title="Toggle floating blossom petals"
              className="inline-flex items-center space-x-1.5 px-3 py-1.5 text-[11px] font-semibold text-rose-200 bg-white/10 hover:bg-white/20 rounded-xl transition-colors cursor-pointer border border-rose-400/20"
            >
              <Flower2 className="w-3 h-3 text-rose-300" />
              <span>Petals Breeze: {showPetals ? 'On' : 'Off'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* 4 Problem Pillar Cards (Adorned with Floral / Botanical Flourishes) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Sticky Note 1: many invoices to track */}
        <div 
          onClick={() => setActiveTab('invoices')}
          className="bg-white rounded-3xl border border-rose-100 p-5 shadow-xs hover:shadow-lg hover:border-rose-300 transition-all cursor-pointer flex flex-col justify-between space-y-4 group relative overflow-hidden"
        >
          {/* Subtle floral corner accent */}
          <div className="absolute -bottom-6 -right-6 opacity-10 pointer-events-none group-hover:opacity-20 transition-opacity">
            <BloomingPeony size={90} />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center border border-rose-200 shadow-2xs">
                <Receipt className="w-5 h-5" />
              </div>
              {overdueInvoices.length > 0 ? (
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-rose-100 text-rose-800 border border-rose-200">
                  {overdueInvoices.length} Overdue
                </span>
              ) : (
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                  Healthy
                </span>
              )}
            </div>

            <div>
              <div className="flex items-center space-x-1.5">
                <h3 className="font-bold text-slate-900 text-sm group-hover:text-rose-600 transition-colors">
                  Invoice Tracker
                </h3>
              </div>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Solves: "Many invoices to track"
              </p>
            </div>

            <div className="text-xl font-black font-mono text-slate-900">
              {formatCurrency(pendingCollectionTotal, profile.currency)}
            </div>
            <div className="text-[11px] text-slate-400">Total in billing cycle</div>
          </div>

          <div className="pt-2 border-t border-rose-50 flex items-center justify-between text-xs text-rose-600 font-bold">
            <span className="flex items-center space-x-1">
              <Leaf className="w-3 h-3 text-emerald-500" />
              <span>Auto-Remind & Track</span>
            </span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>

        {/* Sticky Note 2: send quotation */}
        <div 
          onClick={() => setActiveTab('quotes')}
          className="bg-white rounded-3xl border border-amber-100 p-5 shadow-xs hover:shadow-lg hover:border-amber-300 transition-all cursor-pointer flex flex-col justify-between space-y-4 group relative overflow-hidden"
        >
          <div className="absolute -bottom-6 -right-6 opacity-10 pointer-events-none group-hover:opacity-20 transition-opacity">
            <BloomingPeony size={90} />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center border border-amber-200 shadow-2xs">
                <FileSpreadsheet className="w-5 h-5" />
              </div>
              {acceptedQuotes.length > 0 && (
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200 animate-pulse">
                  {acceptedQuotes.length} Ready to Bill
                </span>
              )}
            </div>

            <div>
              <h3 className="font-bold text-slate-900 text-sm group-hover:text-amber-600 transition-colors">
                Quotations Engine
              </h3>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Solves: "Send quotation"
              </p>
            </div>

            <div className="text-xl font-black font-mono text-slate-900">
              {quotations.length} Active Quotes
            </div>
            <div className="text-[11px] text-slate-400">Itemized proposal pipeline</div>
          </div>

          <div className="pt-2 border-t border-amber-50 flex items-center justify-between text-xs text-amber-700 font-bold">
            <span className="flex items-center space-x-1">
              <Flower2 className="w-3 h-3 text-amber-500" />
              <span>Generate & Convert</span>
            </span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>

        {/* Sticky Note 3: reply email */}
        <div 
          onClick={() => setActiveTab('emails')}
          className="bg-white rounded-3xl border border-sky-100 p-5 shadow-xs hover:shadow-lg hover:border-sky-300 transition-all cursor-pointer flex flex-col justify-between space-y-4 group relative overflow-hidden"
        >
          <div className="absolute -bottom-6 -right-6 opacity-10 pointer-events-none group-hover:opacity-20 transition-opacity">
            <BloomingPeony size={90} />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-2xl bg-sky-50 text-sky-600 flex items-center justify-center border border-sky-200 shadow-2xs">
                <Mail className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-sky-100 text-sky-800 border border-sky-200">
                {unrepliedEmails.length} Pending
              </span>
            </div>

            <div>
              <h3 className="font-bold text-slate-900 text-sm group-hover:text-sky-600 transition-colors">
                Smart Email Replier
              </h3>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Solves: "Reply email"
              </p>
            </div>

            <div className="text-xl font-black font-mono text-slate-900">
              {unrepliedEmails.length} Unreplied
            </div>
            <div className="text-[11px] text-slate-400">1-click AI drafts ready</div>
          </div>

          <div className="pt-2 border-t border-sky-50 flex items-center justify-between text-xs text-sky-600 font-bold">
            <span className="flex items-center space-x-1">
              <Leaf className="w-3 h-3 text-sky-500" />
              <span>AI Draft & Dispatch</span>
            </span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>

        {/* Sticky Note 4: grammer and spelling error */}
        <div 
          onClick={() => setActiveTab('proofreader')}
          className="bg-white rounded-3xl border border-pink-100 p-5 shadow-xs hover:shadow-lg hover:border-pink-300 transition-all cursor-pointer flex flex-col justify-between space-y-4 group relative overflow-hidden"
        >
          <div className="absolute -bottom-6 -right-6 opacity-10 pointer-events-none group-hover:opacity-20 transition-opacity">
            <BloomingPeony size={90} />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-2xl bg-pink-50 text-pink-600 flex items-center justify-center border border-pink-200 shadow-2xs">
                <SpellCheck className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-pink-100 text-pink-800 border border-pink-200">
                Zero Typos
              </span>
            </div>

            <div>
              <h3 className="font-bold text-slate-900 text-sm group-hover:text-pink-600 transition-colors">
                Grammar & Polish
              </h3>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Solves: "Grammer and spelling error"
              </p>
            </div>

            <div className="text-xl font-black font-mono text-slate-900">
              100% Error-Free
            </div>
            <div className="text-[11px] text-slate-400">Executive tone verified</div>
          </div>

          <div className="pt-2 border-t border-pink-50 flex items-center justify-between text-xs text-pink-600 font-bold">
            <span className="flex items-center space-x-1">
              <Flower2 className="w-3 h-3 text-pink-500" />
              <span>Fix Errors & Tone</span>
            </span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>

      </div>

      {/* NEW: Monthly Revenue Trends Chart (Based on Paid Invoices) */}
      <RevenueTrendChart
        invoices={invoices}
        currency={profile.currency}
        onViewInvoice={onViewInvoice}
      />

      {/* Immediate Auto-Pilot Action Queue */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-7 shadow-xs space-y-4 relative overflow-hidden">
        
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center border border-amber-200">
              <Zap className="w-4 h-4 text-amber-500" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                Priority Automation Queue (Recommended Actions)
              </h3>
              <p className="text-[11px] text-slate-500">Auto-generated actions ready to execute in 1 click</p>
            </div>
          </div>
          <span className="text-xs font-semibold text-emerald-600 flex items-center space-x-1 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
            <Leaf className="w-3 h-3" />
            <span>AI Auto-Pilot Active</span>
          </span>
        </div>

        <div className="divide-y divide-slate-100">
          
          {/* Overdue Action Item */}
          {overdueInvoices.length > 0 && (
            <div className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50/70 rounded-2xl p-2.5 transition-colors">
              <div className="flex items-start space-x-3">
                <div className="w-9 h-9 rounded-xl bg-rose-100 text-rose-700 flex items-center justify-center shrink-0 mt-0.5 shadow-2xs">
                  <AlertTriangle className="w-4.5 h-4.5" />
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-900">
                    Overdue Payment Follow-Up for {overdueInvoices[0].clientCompany || overdueInvoices[0].clientName}
                  </div>
                  <div className="text-[11px] text-slate-500">
                    Invoice #{overdueInvoices[0].invoiceNumber} for {formatCurrency(overdueInvoices[0].totalAmount, profile.currency)} is {getDaysOverdue(overdueInvoices[0].dueDate)} days past due.
                  </div>
                </div>
              </div>

              <button
                onClick={() => onOpenInvoiceReminder(overdueInvoices[0])}
                className="inline-flex items-center space-x-1.5 px-3.5 py-2 text-xs font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-xl transition-colors cursor-pointer shrink-0"
              >
                <Send className="w-3.5 h-3.5" />
                <span>1-Click AI Reminder</span>
              </button>
            </div>
          )}

          {/* Accepted Quote Action Item */}
          {acceptedQuotes.length > 0 && (
            <div className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50/70 rounded-2xl p-2.5 transition-colors">
              <div className="flex items-start space-x-3">
                <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5 shadow-2xs">
                  <CheckCircle2 className="w-4.5 h-4.5" />
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-900">
                    Client Approved: {acceptedQuotes[0].projectTitle}
                  </div>
                  <div className="text-[11px] text-slate-500">
                    {acceptedQuotes[0].clientName} accepted Quote #{acceptedQuotes[0].quoteNumber} ({formatCurrency(acceptedQuotes[0].totalAmount, profile.currency)}).
                  </div>
                </div>
              </div>

              <button
                onClick={() => onConvertToInvoice(acceptedQuotes[0])}
                className="inline-flex items-center space-x-1.5 px-4 py-2 text-xs font-bold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-xl transition-colors cursor-pointer shrink-0 shadow-xs active:scale-95"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Convert to Official Invoice</span>
              </button>
            </div>
          )}

          {/* Unreplied Email Action Item */}
          {unrepliedEmails.length > 0 && (
            <div className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50/70 rounded-2xl p-2.5 transition-colors">
              <div className="flex items-start space-x-3">
                <div className="w-9 h-9 rounded-xl bg-sky-100 text-sky-700 flex items-center justify-center shrink-0 mt-0.5 shadow-2xs">
                  <Mail className="w-4.5 h-4.5" />
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-900">
                    Client Inquiry: {unrepliedEmails[0].subject}
                  </div>
                  <div className="text-[11px] text-slate-500 line-clamp-1">
                    From {unrepliedEmails[0].senderName}: "{unrepliedEmails[0].preview}"
                  </div>
                </div>
              </div>

              <button
                onClick={() => setActiveTab('emails')}
                className="inline-flex items-center space-x-1.5 px-3.5 py-2 text-xs font-semibold text-sky-700 bg-sky-50 hover:bg-sky-100 border border-sky-200 rounded-xl transition-colors cursor-pointer shrink-0"
              >
                <span>Draft AI Reply</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

        </div>
      </div>

      {/* Two Column Section: Recent Invoices & Recent Quotes */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Recent Invoices Widget */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-sm text-slate-900 flex items-center space-x-2">
              <Receipt className="w-4 h-4 text-rose-600" />
              <span>Invoices Watchlist</span>
            </h3>
            <button
              onClick={() => setActiveTab('invoices')}
              className="text-xs text-indigo-600 hover:text-indigo-800 font-semibold cursor-pointer"
            >
              View All ({invoices.length})
            </button>
          </div>

          <div className="divide-y divide-slate-100 text-xs">
            {invoices.slice(0, 4).map((inv) => {
              const daysOverdue = getDaysOverdue(inv.dueDate);
              const isOverdue = inv.status === 'overdue' || (inv.status === 'pending' && daysOverdue > 0);
              return (
                <div key={inv.id} className="py-2.5 flex items-center justify-between">
                  <div>
                    <div className="font-bold text-slate-800">{inv.clientCompany || inv.clientName}</div>
                    <div className="text-[11px] text-slate-400">
                      #{inv.invoiceNumber} • Due {formatDate(inv.dueDate)}
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="font-mono font-bold text-slate-900">
                      {formatCurrency(inv.totalAmount, profile.currency)}
                    </div>
                    {isOverdue ? (
                      <span className="text-[10px] font-bold text-rose-600">Overdue ({daysOverdue}d)</span>
                    ) : inv.status === 'paid' ? (
                      <span className="text-[10px] font-semibold text-emerald-600">Paid</span>
                    ) : (
                      <span className="text-[10px] text-amber-600 font-medium">Pending</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Recent Quotes Widget */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-sm text-slate-900 flex items-center space-x-2">
              <FileSpreadsheet className="w-4 h-4 text-amber-600" />
              <span>Active Quotations Pipeline</span>
            </h3>
            <button
              onClick={() => setActiveTab('quotes')}
              className="text-xs text-amber-700 hover:text-amber-800 font-semibold cursor-pointer"
            >
              View All ({quotations.length})
            </button>
          </div>

          <div className="divide-y divide-slate-100 text-xs">
            {quotations.slice(0, 4).map((q) => (
              <div key={q.id} className="py-2.5 flex items-center justify-between">
                <div>
                  <div className="font-bold text-slate-800">{q.projectTitle}</div>
                  <div className="text-[11px] text-slate-400">
                    {q.clientCompany || q.clientName} • #{q.quoteNumber}
                  </div>
                </div>

                <div className="text-right">
                  <div className="font-mono font-bold text-slate-900">
                    {formatCurrency(q.totalAmount, profile.currency)}
                  </div>
                  <span className={`text-[10px] font-semibold ${
                    q.status === 'accepted' ? 'text-emerald-600 font-bold' : 'text-slate-500'
                  }`}>
                    {q.status.toUpperCase()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
};
