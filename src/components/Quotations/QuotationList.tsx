import React, { useState } from 'react';
import { 
  FileSpreadsheet, 
  Plus, 
  Sparkles, 
  Search, 
  CheckCircle2, 
  Send, 
  Eye, 
  Trash2, 
  Clock, 
  ArrowRight,
  TrendingUp,
  FileCheck,
  AlertCircle
} from 'lucide-react';
import { BusinessProfile, Quotation } from '../../types';
import { formatCurrency, formatDate } from '../../utils/helpers';
import { AIQuoteGeneratorModal } from './AIQuoteGeneratorModal';
import { QuotationDetailModal } from './QuotationDetailModal';

interface QuotationListProps {
  quotations: Quotation[];
  profile: BusinessProfile;
  onSaveQuotation: (quote: Quotation) => void;
  onDeleteQuotation: (quoteId: string) => void;
  onUpdateStatus: (quoteId: string, status: Quotation['status']) => void;
  onConvertToInvoice: (quote: Quotation) => void;
}

export const QuotationList: React.FC<QuotationListProps> = ({
  quotations,
  profile,
  onSaveQuotation,
  onDeleteQuotation,
  onUpdateStatus,
  onConvertToInvoice,
}) => {
  const [filter, setFilter] = useState<'all' | 'accepted' | 'sent' | 'draft' | 'converted'>('all');
  const [search, setSearch] = useState('');
  const [isAIGenOpen, setIsAIGenOpen] = useState(false);
  const [selectedQuoteForDetail, setSelectedQuoteForDetail] = useState<Quotation | null>(null);

  const acceptedQuotes = quotations.filter(q => q.status === 'accepted');
  const pendingQuotes = quotations.filter(q => q.status === 'sent');
  const totalPipeline = quotations.reduce((sum, q) => sum + (q.status !== 'declined' ? q.totalAmount : 0), 0);

  const filteredQuotes = quotations.filter(q => {
    if (filter !== 'all' && q.status !== filter) return false;
    if (search.trim()) {
      const qry = search.toLowerCase();
      const matchesClient = q.clientName.toLowerCase().includes(qry);
      const matchesProject = q.projectTitle.toLowerCase().includes(qry);
      const matchesNum = q.quoteNumber.toLowerCase().includes(qry);
      if (!matchesClient && !matchesProject && !matchesNum) return false;
    }
    return true;
  });

  return (
    <div className="space-y-6">
      
      {/* Top Banner & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight flex items-center space-x-2">
            <span>Quotations & Commercial Proposals</span>
            <span className="text-xs font-normal text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
              {quotations.length} Proposals
            </span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Turn client briefs into structured proposals, track client approvals, and convert directly to invoices
          </p>
        </div>

        <div className="flex items-center space-x-2.5">
          <button
            onClick={() => setIsAIGenOpen(true)}
            className="inline-flex items-center space-x-1.5 px-4 py-2 text-xs font-semibold text-white bg-linear-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 rounded-xl shadow-xs transition-all cursor-pointer active:scale-95"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI Proposal Generator</span>
          </button>
        </div>
      </div>

      {/* Accepted Proposals Alert: Ready to Convert to Invoice! */}
      {acceptedQuotes.length > 0 && (
        <div className="bg-linear-to-r from-emerald-50 via-emerald-100/50 to-teal-50 border border-emerald-300 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center space-x-3.5">
            <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-md shadow-emerald-200">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-sm font-bold text-emerald-950">
                  {acceptedQuotes.length} Proposal(s) Accepted & Ready to Bill!
                </span>
                <span className="text-xs font-mono font-bold bg-emerald-200 text-emerald-900 px-2 py-0.5 rounded-full">
                  {formatCurrency(acceptedQuotes.reduce((acc, q) => acc + q.totalAmount, 0), profile.currency)}
                </span>
              </div>
              <p className="text-xs text-emerald-800 mt-0.5">
                The client approved the scope. Convert them to official billing invoices with 1 click without re-typing line items.
              </p>
            </div>
          </div>

          <button
            onClick={() => onConvertToInvoice(acceptedQuotes[0])}
            className="inline-flex items-center space-x-1.5 px-4 py-2 text-xs font-bold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-xl shadow-xs transition-all cursor-pointer shrink-0"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Convert '{acceptedQuotes[0].clientName}' to Invoice</span>
          </button>
        </div>
      )}

      {/* Snapshot Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="text-xs text-slate-500 font-medium">Total Pipeline Value</div>
          <div className="text-lg sm:text-xl font-bold font-mono text-slate-900 mt-1">
            {formatCurrency(totalPipeline, profile.currency)}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">All active quotes</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-emerald-200 bg-emerald-50/20 shadow-xs">
          <div className="text-xs text-emerald-600 font-semibold">Accepted (Ready to Bill)</div>
          <div className="text-lg sm:text-xl font-bold font-mono text-emerald-700 mt-1">
            {acceptedQuotes.length}
          </div>
          <div className="text-[11px] text-emerald-600/80 mt-1">Awaiting invoice generation</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-sky-200 bg-sky-50/20 shadow-xs">
          <div className="text-xs text-sky-600 font-medium">Sent & Under Review</div>
          <div className="text-lg sm:text-xl font-bold font-mono text-sky-700 mt-1">
            {pendingQuotes.length}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">Awaiting client sign-off</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="text-xs text-slate-500 font-medium">Converted Invoices</div>
          <div className="text-lg sm:text-xl font-bold font-mono text-indigo-700 mt-1">
            {quotations.filter(q => q.status === 'converted').length}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">Successfully billed</div>
        </div>
      </div>

      {/* Toolbar */}
      <div className="bg-white p-3 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center space-x-1 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
          {[
            { id: 'all', label: 'All', count: quotations.length },
            { id: 'accepted', label: 'Accepted', count: acceptedQuotes.length },
            { id: 'sent', label: 'Sent', count: pendingQuotes.length },
            { id: 'draft', label: 'Drafts', count: quotations.filter(q => q.status === 'draft').length },
            { id: 'converted', label: 'Converted', count: quotations.filter(q => q.status === 'converted').length },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilter(tab.id as any)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
                filter === tab.id
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <span>{tab.label}</span>
              <span className={`ml-1.5 px-1.5 py-0.2 rounded-full text-[10px] ${filter === tab.id ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-500'}`}>
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search client, project title..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:outline-hidden focus:bg-white focus:ring-2 focus:ring-amber-500"
          />
        </div>
      </div>

      {/* Quotation Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredQuotes.map((quote) => {
          return (
            <div
              key={quote.id}
              className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-4"
            >
              {/* Top Row */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                    {quote.quoteNumber}
                  </span>
                  
                  {quote.status === 'accepted' ? (
                    <span className="inline-flex items-center space-x-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                      <CheckCircle2 className="w-3 h-3" />
                      <span>Accepted</span>
                    </span>
                  ) : quote.status === 'converted' ? (
                    <span className="inline-flex items-center space-x-1 text-[11px] font-medium px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-800">
                      <FileCheck className="w-3 h-3" />
                      <span>Invoiced</span>
                    </span>
                  ) : quote.status === 'sent' ? (
                    <span className="inline-flex items-center space-x-1 text-[11px] font-medium px-2 py-0.5 rounded-full bg-sky-100 text-sky-800">
                      <Send className="w-3 h-3" />
                      <span>Sent</span>
                    </span>
                  ) : (
                    <span className="inline-flex items-center space-x-1 text-[11px] font-medium px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                      <span>Draft</span>
                    </span>
                  )}
                </div>

                <div>
                  <h3 className="font-bold text-slate-900 text-sm leading-snug line-clamp-1">
                    {quote.projectTitle}
                  </h3>
                  <div className="text-xs text-slate-600 mt-0.5 font-medium">
                    {quote.clientCompany || quote.clientName}
                  </div>
                </div>

                <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                  {quote.scopeSummary}
                </p>
              </div>

              {/* Price & Meta */}
              <div className="pt-3 border-t border-slate-100 space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400">Total Quote:</span>
                  <span className="font-mono font-bold text-base text-slate-900">
                    {formatCurrency(quote.totalAmount, profile.currency)}
                  </span>
                </div>

                <div className="flex items-center justify-between text-[11px] text-slate-400">
                  <span>Valid until: {formatDate(quote.validUntil)}</span>
                  <span>{quote.items.length} deliverables</span>
                </div>

                {/* Card Action Buttons */}
                <div className="flex items-center space-x-2 pt-1">
                  {quote.status === 'accepted' ? (
                    <button
                      type="button"
                      onClick={() => onConvertToInvoice(quote)}
                      className="flex-1 inline-flex items-center justify-center space-x-1.5 py-2 px-3 text-xs font-bold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-xl transition-all shadow-xs cursor-pointer active:scale-95"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Convert to Invoice</span>
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setSelectedQuoteForDetail(quote)}
                      className="flex-1 inline-flex items-center justify-center space-x-1.5 py-2 px-3 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors cursor-pointer"
                    >
                      <Eye className="w-3.5 h-3.5 text-slate-500" />
                      <span>View Proposal</span>
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={() => setSelectedQuoteForDetail(quote)}
                    title="View Proposal Details"
                    className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
                  >
                    <Eye className="w-4 h-4" />
                  </button>

                  <button
                    type="button"
                    onClick={() => onDeleteQuotation(quote.id)}
                    title="Delete Quote"
                    className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

            </div>
          );
        })}
      </div>

      {/* Modals */}
      {isAIGenOpen && (
        <AIQuoteGeneratorModal
          currency={profile.currency}
          defaultTaxRate={profile.taxRate}
          onClose={() => setIsAIGenOpen(false)}
          onQuoteGenerated={onSaveQuotation}
        />
      )}

      {selectedQuoteForDetail && (
        <QuotationDetailModal
          quote={selectedQuoteForDetail}
          profile={profile}
          onClose={() => setSelectedQuoteForDetail(null)}
          onUpdateStatus={(id, st) => {
            onUpdateStatus(id, st);
            setSelectedQuoteForDetail({ ...selectedQuoteForDetail, status: st });
          }}
          onConvertToInvoice={onConvertToInvoice}
        />
      )}

    </div>
  );
};
