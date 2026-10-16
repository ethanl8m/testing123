import React, { useState } from 'react';
import { 
  X, 
  Sparkles, 
  FileText, 
  ArrowRight, 
  Loader2, 
  Check, 
  HelpCircle 
} from 'lucide-react';
import { Invoice } from '../../types';

interface InvoiceParserModalProps {
  onClose: () => void;
  onInvoiceParsed: (parsedData: Partial<Invoice>) => void;
}

export const InvoiceParserModal: React.FC<InvoiceParserModalProps> = ({
  onClose,
  onInvoiceParsed,
}) => {
  const [rawText, setRawText] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sampleSnippets = [
    {
      title: 'WhatsApp Client Request',
      text: `Hey Ethan, can you bill our company Apex Ventures for 15 hours of backend automation at $140/hour, plus the $450 server setup fee? Send it to accounts@apexventures.co. Due in 14 days please!`
    },
    {
      title: 'Email Acceptance with Deliverables',
      text: `Hi Ethan, we approve the mobile responsive redesign ($2,800) and the extra 2 custom checkout integrations ($600 each). Please issue the invoice to Lumina Health Labs (billing@luminahealth.io) due by end of month.`
    }
  ];

  const handleParse = async () => {
    if (!rawText.trim()) {
      setError('Please enter or paste communication text to parse.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/ai/parse-invoice', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rawText }),
      });

      if (!response.ok) {
        throw new Error('Failed to parse text.');
      }

      const data = await response.json();
      
      const items = (data.items || []).map((item: any, idx: number) => ({
        id: `item-${Date.now()}-${idx}`,
        description: item.description || 'Deliverable',
        quantity: item.quantity || 1,
        unitPrice: item.unitPrice || 0,
        amount: (item.quantity || 1) * (item.unitPrice || 0)
      }));

      const subtotal = items.reduce((acc: number, curr: any) => acc + curr.amount, 0);
      const taxRate = data.taxRate !== undefined ? data.taxRate : 7;
      const taxAmount = (subtotal * taxRate) / 100;
      const totalAmount = subtotal + taxAmount;

      onInvoiceParsed({
        clientName: data.clientName || 'Client Name',
        clientEmail: data.clientEmail || '',
        clientCompany: data.clientName || '',
        dueDate: data.dueDate || new Date(Date.now() + 14 * 86400000).toISOString().split('T')[0],
        items: items.length > 0 ? items : [{ id: 'item-1', description: 'Services Rendered', quantity: 1, unitPrice: 500, amount: 500 }],
        subtotal,
        taxRate,
        taxAmount,
        totalAmount,
        notes: data.notes || 'Generated from communication transcript via AI Parser.',
        status: 'pending'
      });
      onClose();
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Error parsing invoice details.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-xl w-full overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="px-6 py-5 bg-linear-to-r from-indigo-900 via-indigo-800 to-sky-900 text-white flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-amber-300">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold">AI Invoice Smart Parser</h3>
              <p className="text-xs text-indigo-200">
                Paste any unstructured email, chat, or WhatsApp message to generate a structured invoice
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 rounded-lg text-indigo-300 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-600">
                Paste Raw Client Chat or Note:
              </label>
              <div className="flex items-center space-x-2">
                <span className="text-[11px] text-slate-400">Quick Try:</span>
                {sampleSnippets.map((s, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setRawText(s.text)}
                    className="text-[11px] font-medium text-indigo-600 hover:text-indigo-800 bg-indigo-50 px-2 py-0.5 rounded cursor-pointer"
                  >
                    Snippet {i + 1}
                  </button>
                ))}
              </div>
            </div>
            <textarea
              rows={6}
              value={rawText}
              onChange={(e) => setRawText(e.target.value)}
              placeholder="e.g. 'Hi Ethan, please invoice us for 10 hours at $150/hr for the API work plus $200 hosting. Send to billing@novatech.io. Net 14 days.'"
              className="w-full p-3 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-indigo-500 focus:bg-white font-mono"
            />
          </div>

          {error && (
            <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs">
              {error}
            </div>
          )}

          <div className="bg-sky-50 border border-sky-100 rounded-xl p-3 text-xs text-sky-900 space-y-1">
            <div className="font-semibold flex items-center space-x-1.5">
              <Sparkles className="w-3.5 h-3.5 text-sky-600" />
              <span>What AI will automatically extract:</span>
            </div>
            <ul className="list-disc pl-4 text-sky-800 space-y-0.5">
              <li>Client Name, Company & Billing Email</li>
              <li>Itemized line items, quantities, and rates</li>
              <li>Calculated subtotal, taxes, and total</li>
              <li>Payment due date and special notes</li>
            </ul>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-800 transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleParse}
            disabled={loading || !rawText.trim()}
            className="inline-flex items-center space-x-2 px-5 py-2.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-xs transition-all cursor-pointer disabled:opacity-50"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Extracting Line Items...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Extract & Create Invoice</span>
              </>
            )}
          </button>
        </div>

      </div>
    </div>
  );
};
