import React, { useState, useEffect } from 'react';
import { 
  X, 
  Send, 
  Copy, 
  Check, 
  Sparkles, 
  Clock, 
  AlertTriangle, 
  Building, 
  User, 
  DollarSign, 
  ShieldAlert,
  Loader2
} from 'lucide-react';
import { Invoice, ReminderLog } from '../../types';
import { formatCurrency, formatDate } from '../../utils/helpers';

interface PaymentReminderModalProps {
  invoice: Invoice;
  currency: string;
  onClose: () => void;
  onSaveReminder: (invoiceId: string, reminder: ReminderLog) => void;
}

export const PaymentReminderModal: React.FC<PaymentReminderModalProps> = ({
  invoice,
  currency,
  onClose,
  onSaveReminder,
}) => {
  const [tone, setTone] = useState<'gentle' | 'standard' | 'firm_overdue' | 'final_notice'>(
    invoice.status === 'overdue' ? 'firm_overdue' : 'gentle'
  );
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [sentSuccess, setSentSuccess] = useState(false);

  // Compute overdue days
  const today = new Date('2026-10-15');
  const due = new Date(invoice.dueDate);
  const diffDays = Math.ceil((today.getTime() - due.getTime()) / (1000 * 60 * 60 * 24));
  const daysOverdue = diffDays > 0 ? diffDays : 0;

  const generateReminder = async (selectedTone: 'gentle' | 'standard' | 'firm_overdue' | 'final_notice') => {
    setLoading(true);
    try {
      const response = await fetch('/api/ai/reminder-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          invoiceNumber: invoice.invoiceNumber,
          clientName: invoice.clientName,
          amount: invoice.totalAmount,
          dueDate: formatDate(invoice.dueDate),
          daysOverdue: daysOverdue,
          tone: selectedTone,
          currency: currency
        }),
      });
      const data = await response.json();
      setSubject(data.subject || `Payment Reminder: Invoice ${invoice.invoiceNumber}`);
      setBody(data.body || '');
    } catch (err) {
      console.error('Failed to generate reminder:', err);
      // Fallback
      setSubject(`Payment Reminder: Invoice ${invoice.invoiceNumber}`);
      setBody(`Dear ${invoice.clientName},\n\nThis is a reminder regarding Invoice #${invoice.invoiceNumber} for ${currency} ${invoice.totalAmount.toLocaleString()}, which was due on ${formatDate(invoice.dueDate)}.\n\nPlease let us know once payment has been released.\n\nBest regards,\nAccounts Team`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    generateReminder(tone);
  }, [tone]);

  const handleCopy = () => {
    navigator.clipboard.writeText(`Subject: ${subject}\n\n${body}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleSendAndLog = () => {
    const newLog: ReminderLog = {
      id: `rem-${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      tone: tone,
      sentTo: invoice.clientEmail,
      subject: subject,
      notes: `Sent ${tone} reminder for ${formatCurrency(invoice.totalAmount, currency)}.`
    };
    onSaveReminder(invoice.id, newLog);
    setSentSuccess(true);
    setTimeout(() => {
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-2xl w-full overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="px-6 py-5 bg-linear-to-r from-slate-900 to-indigo-950 text-white flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/20 border border-indigo-400/30 flex items-center justify-center text-indigo-300">
              <Sparkles className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="text-lg font-bold">1-Click AI Payment Reminder</h3>
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-indigo-500/40 text-indigo-200 border border-indigo-400/30">
                  Automated Chaser
                </span>
              </div>
              <p className="text-xs text-slate-300">
                Invoice #{invoice.invoiceNumber} • {invoice.clientCompany || invoice.clientName}
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Invoice Summary Pill Bar */}
        <div className="px-6 py-3 bg-slate-50 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-1.5">
              <DollarSign className="w-4 h-4 text-slate-400" />
              <span className="text-slate-500">Amount Due:</span>
              <span className="font-bold text-slate-900">{formatCurrency(invoice.totalAmount, currency)}</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <Clock className="w-4 h-4 text-slate-400" />
              <span className="text-slate-500">Due Date:</span>
              <span className="font-medium text-slate-700">{formatDate(invoice.dueDate)}</span>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            {daysOverdue > 0 ? (
              <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full bg-rose-100 text-rose-700 font-bold text-[11px] border border-rose-200">
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>{daysOverdue} Days Overdue</span>
              </span>
            ) : (
              <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full bg-amber-100 text-amber-700 font-medium text-[11px]">
                <span>Upcoming Due</span>
              </span>
            )}
            <span className="text-slate-500">To: {invoice.clientEmail}</span>
          </div>
        </div>

        {/* Tone Selector */}
        <div className="px-6 pt-4 pb-2">
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">
            Choose AI Reminder Tone:
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {[
              { id: 'gentle', label: 'Gentle Nudge', desc: 'Friendly & polite' },
              { id: 'standard', label: 'Standard Business', desc: 'Clear & professional' },
              { id: 'firm_overdue', label: 'Firm Overdue', desc: 'Direct deadline' },
              { id: 'final_notice', label: 'Final Notice', desc: 'Urgent collection' },
            ].map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => setTone(t.id as any)}
                className={`p-2.5 text-left rounded-xl border transition-all cursor-pointer ${
                  tone === t.id
                    ? 'border-indigo-600 bg-indigo-50/70 ring-1 ring-indigo-600 text-indigo-900'
                    : 'border-slate-200 hover:border-slate-300 text-slate-700 hover:bg-slate-50'
                }`}
              >
                <div className="font-semibold text-xs">{t.label}</div>
                <div className="text-[11px] text-slate-500">{t.desc}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Content Box */}
        <div className="px-6 py-4 space-y-3">
          {loading ? (
            <div className="py-16 text-center text-slate-500 flex flex-col items-center justify-center space-y-3">
              <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
              <p className="text-sm font-medium">AI is generating customized reminder in {tone.replace('_', ' ')} tone...</p>
            </div>
          ) : (
            <>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Subject Line:
                </label>
                <input
                  type="text"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-indigo-500 focus:bg-white font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Email Message Body:
                </label>
                <textarea
                  rows={8}
                  value={body}
                  onChange={(e) => setBody(e.target.value)}
                  className="w-full p-3 text-sm font-sans bg-slate-50 border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-indigo-500 focus:bg-white leading-relaxed resize-none"
                />
              </div>

              {/* Reminder Log history if any */}
              {invoice.reminderHistory.length > 0 && (
                <div className="p-3 bg-amber-50/70 border border-amber-200/80 rounded-xl text-xs text-amber-900">
                  <span className="font-bold">Prior Chaser History: </span>
                  {invoice.reminderHistory.length} previous reminder(s) sent. Last sent on{' '}
                  {formatDate(invoice.reminderHistory[invoice.reminderHistory.length - 1].date)} (
                  {invoice.reminderHistory[invoice.reminderHistory.length - 1].tone} tone).
                </div>
              )}
            </>
          )}
        </div>

        {/* Actions Footer */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <button
            type="button"
            onClick={handleCopy}
            className="inline-flex items-center space-x-1.5 px-3 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-300 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 text-emerald-600" />
                <span className="text-emerald-700">Copied to Clipboard!</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4 text-slate-500" />
                <span>Copy Text</span>
              </>
            )}
          </button>

          <div className="flex items-center space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-800 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSendAndLog}
              disabled={loading || sentSuccess}
              className="inline-flex items-center space-x-2 px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-xs transition-all cursor-pointer active:scale-95 disabled:opacity-50"
            >
              {sentSuccess ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>Logged & Sent!</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>Dispatch & Log Reminder</span>
                </>
              )}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
