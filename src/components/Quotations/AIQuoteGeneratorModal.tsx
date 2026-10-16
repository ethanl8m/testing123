import React, { useState } from 'react';
import { 
  X, 
  Sparkles, 
  Loader2, 
  Check, 
  Layers, 
  DollarSign, 
  Calendar,
  FileSpreadsheet
} from 'lucide-react';
import { Quotation } from '../../types';

interface AIQuoteGeneratorModalProps {
  currency: string;
  defaultTaxRate: number;
  onClose: () => void;
  onQuoteGenerated: (quote: Quotation) => void;
}

export const AIQuoteGeneratorModal: React.FC<AIQuoteGeneratorModalProps> = ({
  currency,
  defaultTaxRate,
  onClose,
  onQuoteGenerated,
}) => {
  const [clientName, setClientName] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [projectTitle, setProjectTitle] = useState('');
  const [description, setDescription] = useState('');
  const [estimatedBudget, setEstimatedBudget] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const samplePresets = [
    {
      title: 'Web Portal & Booking System',
      client: 'Summit Peak Lodge',
      email: 'reservations@summitpeak.com',
      project: 'Bespoke Lodge Booking & Guest Portal',
      desc: 'Build an automated web application for direct room bookings, guest intake forms, automatic deposit payments via Stripe, and SMS check-in reminders. Estimated budget $4,000 - $5,500.'
    },
    {
      title: 'Workflow Automation & CRM',
      client: 'Vanguard Realty Group',
      email: 'ops@vanguardrealty.com',
      project: 'Real Estate Lead Distribution & Document Automation',
      desc: 'Automate incoming buyer leads from web forms to agents via WhatsApp notifications, plus auto-generate PDF lease agreements and digital signature tracking. Estimated timeline 3 weeks.'
    }
  ];

  const handleGenerate = async () => {
    if (!clientName.trim() || !description.trim()) {
      setError('Please provide at least a client name and project description.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/ai/generate-quote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          clientName,
          projectTitle,
          description,
          currency,
          estimatedBudget
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate quotation.');
      }

      const data = await response.json();

      const items = (data.items || []).map((it: any, idx: number) => ({
        id: `q-item-${Date.now()}-${idx}`,
        description: it.description || 'Deliverable',
        quantity: it.quantity || 1,
        unitPrice: it.unitPrice || 1000,
        amount: (it.quantity || 1) * (it.unitPrice || 1000)
      }));

      const subtotal = items.reduce((acc: number, curr: any) => acc + curr.amount, 0);
      const taxRate = defaultTaxRate;
      const totalAmount = subtotal + (subtotal * taxRate) / 100;

      const newQuote: Quotation = {
        id: `qt-${Date.now()}`,
        quoteNumber: `QT-2026-${Math.floor(100 + Math.random() * 900)}`,
        clientName: clientName,
        clientEmail: clientEmail || `billing@${clientName.toLowerCase().replace(/\s+/g, '')}.com`,
        clientCompany: clientName,
        issueDate: new Date().toISOString().split('T')[0],
        validUntil: new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0],
        projectTitle: data.projectTitle || projectTitle || 'Client Services Proposal',
        scopeSummary: data.scopeSummary || description,
        items: items,
        subtotal: subtotal,
        taxRate: taxRate,
        totalAmount: totalAmount,
        status: 'draft',
        timeline: data.timeline || '2 to 3 weeks upon commencement',
        paymentTerms: data.paymentTerms || '50% deposit upon acceptance, 50% upon final handover',
        notes: data.notes || 'Quotation valid for 30 days. Includes 2 revision cycles.'
      };

      onQuoteGenerated(newQuote);
      onClose();
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Error creating quote.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-xl w-full overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="px-6 py-5 bg-linear-to-r from-amber-600 via-orange-600 to-indigo-900 text-white flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-amber-200">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold">AI Instant Proposal & Quotation Generator</h3>
              <p className="text-xs text-amber-100">
                Turn informal project briefs into commercial-grade proposals in seconds
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 rounded-lg text-amber-200 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content form */}
        <div className="p-6 space-y-4">
          
          {/* Quick Preset Buttons */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <span className="text-[11px] font-semibold text-slate-500 uppercase">Quick Pre-fills:</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {samplePresets.map((preset, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    setClientName(preset.client);
                    setClientEmail(preset.email);
                    setProjectTitle(preset.project);
                    setDescription(preset.desc);
                  }}
                  className="text-xs font-medium text-amber-800 bg-amber-50 hover:bg-amber-100 border border-amber-200 px-2.5 py-1 rounded-lg transition-colors cursor-pointer"
                >
                  {preset.title}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Client / Company Name *
              </label>
              <input
                type="text"
                placeholder="e.g. Acme Corp"
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
                className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-lg focus:bg-white focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Client Email
              </label>
              <input
                type="email"
                placeholder="billing@acmecorp.com"
                value={clientEmail}
                onChange={(e) => setClientEmail(e.target.value)}
                className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-lg focus:bg-white focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Project Title / Service Type
            </label>
            <input
              type="text"
              placeholder="e.g. Automated E-commerce Checkout System"
              value={projectTitle}
              onChange={(e) => setProjectTitle(e.target.value)}
              className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-lg focus:bg-white focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Project Brief / What needs to be done *
            </label>
            <textarea
              rows={4}
              placeholder="Describe what the client requested in plain English. AI will structure this into detailed milestone deliverables, pricing breakdown, timeline, and terms."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-3 text-sm bg-slate-50 border border-slate-300 rounded-lg focus:bg-white focus:ring-2 focus:ring-indigo-500 leading-relaxed"
            />
          </div>

          {error && (
            <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs">
              {error}
            </div>
          )}

          <div className="bg-amber-50/70 border border-amber-200/80 rounded-xl p-3 text-xs text-amber-900 space-y-1">
            <span className="font-semibold block">⚡ What AI Automates For You:</span>
            <p className="text-amber-800">
              Itemizes technical scope into deliverables with market rates, calculates milestones, defines payment terms (e.g. 50/50), sets validity, and drafts an executive proposal.
            </p>
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
            onClick={handleGenerate}
            disabled={loading || !clientName.trim() || !description.trim()}
            className="inline-flex items-center space-x-2 px-5 py-2.5 text-xs font-semibold text-white bg-linear-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 rounded-xl shadow-xs transition-all cursor-pointer disabled:opacity-50"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Generating Proposal Scope...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Generate Quotation</span>
              </>
            )}
          </button>
        </div>

      </div>
    </div>
  );
};
