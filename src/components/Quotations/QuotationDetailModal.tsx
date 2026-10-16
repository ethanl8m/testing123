import React, { useState } from 'react';
import { 
  X, 
  Printer, 
  CheckCircle2, 
  ArrowRight, 
  FileSpreadsheet, 
  Calendar, 
  Clock, 
  Layers, 
  Sparkles, 
  Send,
  Building
} from 'lucide-react';
import { BusinessProfile, Quotation } from '../../types';
import { formatCurrency, formatDate } from '../../utils/helpers';

interface QuotationDetailModalProps {
  quote: Quotation;
  profile: BusinessProfile;
  onClose: () => void;
  onUpdateStatus: (quoteId: string, status: Quotation['status']) => void;
  onConvertToInvoice: (quote: Quotation) => void;
}

export const QuotationDetailModal: React.FC<QuotationDetailModalProps> = ({
  quote,
  profile,
  onClose,
  onUpdateStatus,
  onConvertToInvoice,
}) => {
  const [copiedLink, setCopiedLink] = useState(false);

  const handlePrint = () => {
    window.print();
  };

  const handleAcceptSimulation = () => {
    onUpdateStatus(quote.id, 'accepted');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-3xl w-full overflow-hidden animate-in fade-in zoom-in-95 duration-200 my-6">
        
        {/* Action Header */}
        <div className="no-print px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="font-mono text-xs uppercase tracking-wider text-slate-400">Quotation View</span>
            <span className="text-sm font-bold text-white">#{quote.quoteNumber}</span>
          </div>

          <div className="flex items-center space-x-2">
            {quote.status === 'draft' && (
              <button
                type="button"
                onClick={() => onUpdateStatus(quote.id, 'sent')}
                className="inline-flex items-center space-x-1 px-3 py-1.5 text-xs font-semibold bg-sky-600 hover:bg-sky-700 text-white rounded-lg transition-colors cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Mark as Sent</span>
              </button>
            )}

            {(quote.status === 'sent' || quote.status === 'draft') && (
              <button
                type="button"
                onClick={handleAcceptSimulation}
                className="inline-flex items-center space-x-1 px-3 py-1.5 text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors cursor-pointer"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Simulate Client Approval</span>
              </button>
            )}

            {quote.status === 'accepted' && (
              <button
                type="button"
                onClick={() => {
                  onConvertToInvoice(quote);
                  onClose();
                }}
                className="inline-flex items-center space-x-1.5 px-3.5 py-1.5 text-xs font-semibold bg-amber-500 hover:bg-amber-600 text-slate-950 rounded-lg shadow-xs transition-colors cursor-pointer font-bold animate-pulse"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Convert to Official Invoice (1-Click)</span>
              </button>
            )}

            <button
              type="button"
              onClick={handlePrint}
              className="inline-flex items-center space-x-1 px-3 py-1.5 text-xs font-semibold bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / PDF</span>
            </button>

            <button
              type="button"
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Quotation Content */}
        <div className="p-8 sm:p-10 bg-white print:p-0">
          
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start gap-6 border-b border-slate-200 pb-8">
            <div>
              <h1 className="text-2xl font-black tracking-tight text-slate-900">{profile.companyName}</h1>
              <p className="text-xs text-slate-500 mt-1">{profile.address}</p>
              <p className="text-xs text-slate-500">{profile.email} • {profile.phone}</p>
            </div>

            <div className="sm:text-right">
              <div className="text-3xl font-black text-slate-900 tracking-tight">PROPOSAL & QUOTE</div>
              <div className="text-sm font-mono font-bold text-amber-600 mt-0.5">#{quote.quoteNumber}</div>

              <div className="mt-3 inline-block">
                {quote.status === 'accepted' ? (
                  <span className="px-3 py-1 rounded-md bg-emerald-100 text-emerald-800 font-extrabold text-xs uppercase tracking-wider border border-emerald-300">
                    APPROVED BY CLIENT
                  </span>
                ) : quote.status === 'converted' ? (
                  <span className="px-3 py-1 rounded-md bg-indigo-100 text-indigo-800 font-extrabold text-xs uppercase tracking-wider border border-indigo-300">
                    CONVERTED TO INVOICE
                  </span>
                ) : quote.status === 'sent' ? (
                  <span className="px-3 py-1 rounded-md bg-sky-100 text-sky-800 font-extrabold text-xs uppercase tracking-wider border border-sky-300">
                    SENT TO CLIENT
                  </span>
                ) : (
                  <span className="px-3 py-1 rounded-md bg-slate-100 text-slate-700 font-extrabold text-xs uppercase tracking-wider border border-slate-300">
                    DRAFT ESTIMATE
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Project Title & Client Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 py-6 border-b border-slate-200 text-xs">
            <div>
              <span className="font-semibold uppercase tracking-wider text-slate-400 block mb-1">
                Prepared For:
              </span>
              <div className="font-bold text-slate-900 text-sm">{quote.clientCompany || quote.clientName}</div>
              <div className="text-slate-600 font-medium">{quote.clientName}</div>
              <div className="text-slate-500">{quote.clientEmail}</div>
            </div>

            <div className="sm:text-right space-y-1 text-slate-600">
              <div>
                <span className="text-slate-400 mr-2">Issue Date:</span>
                <span className="font-semibold text-slate-800">{formatDate(quote.issueDate)}</span>
              </div>
              <div>
                <span className="text-slate-400 mr-2">Valid Until:</span>
                <span className="font-semibold text-amber-800">{formatDate(quote.validUntil)}</span>
              </div>
              <div>
                <span className="text-slate-400 mr-2">Est. Delivery:</span>
                <span className="font-medium text-slate-800">{quote.timeline}</span>
              </div>
            </div>
          </div>

          {/* Project Overview */}
          <div className="py-5 border-b border-slate-200">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-1">
              Project: {quote.projectTitle}
            </span>
            <p className="text-xs text-slate-700 leading-relaxed bg-slate-50 p-3.5 rounded-xl border border-slate-200">
              {quote.scopeSummary}
            </p>
          </div>

          {/* Deliverables Table */}
          <div className="py-6">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 text-slate-400 uppercase font-semibold">
                  <th className="py-2">Deliverable / Scope Item</th>
                  <th className="py-2 text-center w-16">Qty</th>
                  <th className="py-2 text-right w-24">Rate</th>
                  <th className="py-2 text-right w-28">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {quote.items.map((item, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/50">
                    <td className="py-3 font-medium text-slate-800">{item.description}</td>
                    <td className="py-3 text-center text-slate-600">{item.quantity}</td>
                    <td className="py-3 text-right font-mono text-slate-600">
                      {formatCurrency(item.unitPrice, profile.currency)}
                    </td>
                    <td className="py-3 text-right font-mono font-semibold text-slate-900">
                      {formatCurrency(item.amount, profile.currency)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Totals */}
          <div className="flex justify-end pt-4 border-t border-slate-200">
            <div className="w-64 space-y-2 text-xs">
              <div className="flex justify-between text-slate-600">
                <span>Subtotal:</span>
                <span className="font-mono font-medium">{formatCurrency(quote.subtotal, profile.currency)}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Estimated Tax ({quote.taxRate}%):</span>
                <span className="font-mono">{formatCurrency((quote.subtotal * quote.taxRate) / 100, profile.currency)}</span>
              </div>
              <div className="flex justify-between text-slate-900 font-extrabold text-sm pt-2 border-t border-slate-200">
                <span>Total Quotation:</span>
                <span className="font-mono text-amber-700">{formatCurrency(quote.totalAmount, profile.currency)}</span>
              </div>
            </div>
          </div>

          {/* Payment Terms & Commercial Conditions */}
          <div className="mt-8 pt-6 border-t border-slate-200 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-slate-600">
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
              <span className="font-bold text-slate-800 block mb-1">Payment Schedule & Milestones:</span>
              <p className="text-slate-700">{quote.paymentTerms}</p>
              <p className="text-[11px] text-slate-400 mt-2">
                Bank account remittance details will be provided on the official invoice upon proposal acceptance.
              </p>
            </div>

            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
              <span className="font-bold text-slate-800 block mb-1">Terms & Revisions:</span>
              <p className="text-slate-700">{quote.notes || 'Valid for 30 calendar days from issue date.'}</p>
            </div>
          </div>

          {/* Signature Placeholder */}
          <div className="mt-8 pt-6 border-t border-dashed border-slate-200 grid grid-cols-2 gap-8 text-xs text-slate-500">
            <div>
              <div className="h-12 border-b border-slate-300"></div>
              <div className="mt-1 font-semibold text-slate-700">Authorized Gleamcore Signature</div>
              <div className="text-[11px] text-slate-400">{profile.ownerName} • {formatDate(quote.issueDate)}</div>
            </div>

            <div>
              <div className="h-12 border-b border-slate-300"></div>
              <div className="mt-1 font-semibold text-slate-700">Client Acceptance Signature</div>
              <div className="text-[11px] text-slate-400">{quote.clientName} • {quote.clientCompany}</div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
