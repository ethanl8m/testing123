import React from 'react';
import { 
  X, 
  Printer, 
  Download, 
  Building, 
  Mail, 
  Calendar, 
  CheckCircle2, 
  Clock, 
  AlertTriangle,
  Send,
  CreditCard
} from 'lucide-react';
import { BusinessProfile, Invoice } from '../../types';
import { formatCurrency, formatDate, getDaysOverdue } from '../../utils/helpers';

interface InvoiceDetailModalProps {
  invoice: Invoice;
  profile: BusinessProfile;
  onClose: () => void;
  onOpenReminder: (invoice: Invoice) => void;
  onMarkPaid: (invoiceId: string) => void;
}

export const InvoiceDetailModal: React.FC<InvoiceDetailModalProps> = ({
  invoice,
  profile,
  onClose,
  onOpenReminder,
  onMarkPaid,
}) => {
  const daysOverdue = getDaysOverdue(invoice.dueDate);
  const isOverdue = invoice.status === 'overdue' || (invoice.status === 'pending' && daysOverdue > 0);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-3xl w-full overflow-hidden animate-in fade-in zoom-in-95 duration-200 my-6">
        
        {/* Top Action Bar (hidden when printing) */}
        <div className="no-print px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="font-mono text-xs uppercase tracking-wider text-slate-400">Invoice View</span>
            <span className="text-sm font-bold text-white">#{invoice.invoiceNumber}</span>
          </div>

          <div className="flex items-center space-x-2">
            {invoice.status !== 'paid' && (
              <>
                <button
                  type="button"
                  onClick={() => onOpenReminder(invoice)}
                  className="inline-flex items-center space-x-1.5 px-3 py-1.5 text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Send AI Reminder</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    onMarkPaid(invoice.id);
                    onClose();
                  }}
                  className="inline-flex items-center space-x-1.5 px-3 py-1.5 text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors cursor-pointer"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Mark as Paid</span>
                </button>
              </>
            )}

            <button
              type="button"
              onClick={handlePrint}
              className="inline-flex items-center space-x-1.5 px-3 py-1.5 text-xs font-semibold bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors cursor-pointer"
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

        {/* Invoice Printable Sheet */}
        <div className="p-8 sm:p-10 bg-white print:p-0">
          
          {/* Header Row */}
          <div className="flex flex-col sm:flex-row justify-between items-start gap-6 border-b border-slate-200 pb-8">
            <div>
              <h1 className="text-2xl font-black tracking-tight text-slate-900">{profile.companyName}</h1>
              <p className="text-xs text-slate-500 mt-1">{profile.address}</p>
              <p className="text-xs text-slate-500">{profile.email} • {profile.phone}</p>
            </div>

            <div className="sm:text-right">
              <div className="text-3xl font-black text-slate-900 tracking-tight">INVOICE</div>
              <div className="text-sm font-mono font-bold text-indigo-700 mt-0.5">#{invoice.invoiceNumber}</div>
              
              <div className="mt-3 inline-block">
                {invoice.status === 'paid' ? (
                  <span className="px-3 py-1 rounded-md bg-emerald-100 text-emerald-800 font-extrabold text-xs uppercase tracking-wider border border-emerald-300">
                    PAID IN FULL
                  </span>
                ) : isOverdue ? (
                  <span className="px-3 py-1 rounded-md bg-rose-100 text-rose-800 font-extrabold text-xs uppercase tracking-wider border border-rose-300">
                    OVERDUE ({daysOverdue} DAYS)
                  </span>
                ) : (
                  <span className="px-3 py-1 rounded-md bg-amber-100 text-amber-800 font-extrabold text-xs uppercase tracking-wider border border-amber-300">
                    PAYMENT DUE
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Bill To & Dates */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 py-6 border-b border-slate-200 text-xs">
            <div>
              <span className="font-semibold uppercase tracking-wider text-slate-400 block mb-1">
                Billed To:
              </span>
              <div className="font-bold text-slate-900 text-sm">{invoice.clientCompany || invoice.clientName}</div>
              <div className="text-slate-600 font-medium">{invoice.clientName}</div>
              <div className="text-slate-500">{invoice.clientEmail}</div>
            </div>

            <div className="sm:text-right space-y-1 text-slate-600">
              <div>
                <span className="text-slate-400 mr-2">Issue Date:</span>
                <span className="font-semibold text-slate-800">{formatDate(invoice.issueDate)}</span>
              </div>
              <div>
                <span className="text-slate-400 mr-2">Payment Due Date:</span>
                <span className="font-semibold text-indigo-900">{formatDate(invoice.dueDate)}</span>
              </div>
              {invoice.paymentMethod && (
                <div>
                  <span className="text-slate-400 mr-2">Preferred Method:</span>
                  <span className="font-medium text-slate-700">{invoice.paymentMethod}</span>
                </div>
              )}
            </div>
          </div>

          {/* Line Items Table */}
          <div className="py-6">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 text-slate-400 uppercase font-semibold">
                  <th className="py-2">Description</th>
                  <th className="py-2 text-center w-16">Qty</th>
                  <th className="py-2 text-right w-24">Rate</th>
                  <th className="py-2 text-right w-28">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {invoice.items.map((item, idx) => (
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

          {/* Calculation Summary */}
          <div className="flex justify-end pt-4 border-t border-slate-200">
            <div className="w-64 space-y-2 text-xs">
              <div className="flex justify-between text-slate-600">
                <span>Subtotal:</span>
                <span className="font-mono font-medium">{formatCurrency(invoice.subtotal, profile.currency)}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Tax ({invoice.taxRate}%):</span>
                <span className="font-mono">{formatCurrency(invoice.taxAmount, profile.currency)}</span>
              </div>
              <div className="flex justify-between text-slate-900 font-extrabold text-sm pt-2 border-t border-slate-200">
                <span>Total Amount:</span>
                <span className="font-mono text-indigo-800">{formatCurrency(invoice.totalAmount, profile.currency)}</span>
              </div>
              {invoice.status === 'paid' && (
                <div className="flex justify-between text-emerald-700 font-bold text-xs pt-1">
                  <span>Amount Paid:</span>
                  <span className="font-mono">-{formatCurrency(invoice.totalAmount, profile.currency)}</span>
                </div>
              )}
            </div>
          </div>

          {/* Payment & Bank Remittance Instructions */}
          <div className="mt-8 pt-6 border-t border-slate-200 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-slate-600">
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
              <span className="font-bold text-slate-800 block mb-1">Bank Remittance Instructions:</span>
              <p><span className="text-slate-400">Bank:</span> {profile.bankDetails.bankName}</p>
              <p><span className="text-slate-400">Account Name:</span> {profile.bankDetails.accountName}</p>
              <p><span className="text-slate-400">Account #:</span> {profile.bankDetails.accountNumber}</p>
              <p><span className="text-slate-400">Routing / IBAN:</span> {profile.bankDetails.routingOrIban}</p>
            </div>

            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 flex flex-col justify-between">
              <div>
                <span className="font-bold text-slate-800 block mb-1">Notes & Terms:</span>
                <p className="text-slate-600">{invoice.notes || 'Payment due within terms indicated. Thank you for your business!'}</p>
              </div>
              <div className="text-[11px] text-slate-400 mt-3">
                Questions? Contact {profile.email}
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
