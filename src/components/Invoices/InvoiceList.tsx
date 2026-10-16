import React, { useState, useMemo } from 'react';
import { 
  Receipt, 
  Plus, 
  Sparkles, 
  Search, 
  Filter, 
  AlertTriangle, 
  Clock, 
  CheckCircle2, 
  Send, 
  Eye, 
  MoreVertical, 
  DollarSign, 
  Edit3, 
  Trash2,
  Calendar,
  Layers,
  ArrowUpDown
} from 'lucide-react';
import { BusinessProfile, Invoice, ReminderLog } from '../../types';
import { formatCurrency, formatDate, getDaysOverdue } from '../../utils/helpers';
import { InvoiceModal } from './InvoiceModal';
import { InvoiceParserModal } from './InvoiceParserModal';
import { PaymentReminderModal } from './PaymentReminderModal';
import { InvoiceDetailModal } from './InvoiceDetailModal';

interface InvoiceListProps {
  invoices: Invoice[];
  profile: BusinessProfile;
  onSaveInvoice: (invoice: Invoice) => void;
  onDeleteInvoice: (invoiceId: string) => void;
  onMarkPaid: (invoiceId: string) => void;
  onSaveReminder: (invoiceId: string, reminder: ReminderLog) => void;
}

export const InvoiceList: React.FC<InvoiceListProps> = ({
  invoices,
  profile,
  onSaveInvoice,
  onDeleteInvoice,
  onMarkPaid,
  onSaveReminder,
}) => {
  const [filter, setFilter] = useState<'all' | 'overdue' | 'pending' | 'paid' | 'draft'>('all');
  const [search, setSearch] = useState('');
  
  // Modals state
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isParserOpen, setIsParserOpen] = useState(false);
  const [selectedInvoiceForEdit, setSelectedInvoiceForEdit] = useState<Invoice | null>(null);
  const [selectedInvoiceForReminder, setSelectedInvoiceForReminder] = useState<Invoice | null>(null);
  const [selectedInvoiceForDetail, setSelectedInvoiceForDetail] = useState<Invoice | null>(null);

  // Compute metrics
  const totalAmount = invoices.reduce((acc, inv) => acc + (inv.status !== 'draft' ? inv.totalAmount : 0), 0);
  
  const overdueInvoices = useMemo(() => {
    return invoices.filter(inv => inv.status === 'overdue' || (inv.status === 'pending' && getDaysOverdue(inv.dueDate) > 0));
  }, [invoices]);

  const overdueTotal = overdueInvoices.reduce((acc, inv) => acc + inv.totalAmount, 0);
  const paidTotal = invoices.filter(inv => inv.status === 'paid').reduce((acc, inv) => acc + inv.totalAmount, 0);
  const pendingTotal = invoices.filter(inv => inv.status === 'pending' && getDaysOverdue(inv.dueDate) <= 0).reduce((acc, inv) => acc + inv.totalAmount, 0);

  // Filter & Search
  const filteredInvoices = useMemo(() => {
    return invoices.filter((inv) => {
      const daysOverdue = getDaysOverdue(inv.dueDate);
      const isOverdue = inv.status === 'overdue' || (inv.status === 'pending' && daysOverdue > 0);

      if (filter === 'overdue' && !isOverdue) return false;
      if (filter === 'pending' && (inv.status !== 'pending' || daysOverdue > 0)) return false;
      if (filter === 'paid' && inv.status !== 'paid') return false;
      if (filter === 'draft' && inv.status !== 'draft') return false;

      if (search.trim()) {
        const query = search.toLowerCase();
        const matchesClient = inv.clientName.toLowerCase().includes(query);
        const matchesCompany = (inv.clientCompany || '').toLowerCase().includes(query);
        const matchesNumber = inv.invoiceNumber.toLowerCase().includes(query);
        if (!matchesClient && !matchesCompany && !matchesNumber) return false;
      }

      return true;
    });
  }, [invoices, filter, search]);

  const handleParsedResult = (parsed: Partial<Invoice>) => {
    setSelectedInvoiceForEdit({
      id: `inv-${Date.now()}`,
      invoiceNumber: `INV-2026-${Math.floor(100 + Math.random() * 900)}`,
      clientName: parsed.clientName || 'Client Name',
      clientEmail: parsed.clientEmail || '',
      clientCompany: parsed.clientCompany || parsed.clientName || '',
      issueDate: new Date().toISOString().split('T')[0],
      dueDate: parsed.dueDate || new Date(Date.now() + 14 * 86400000).toISOString().split('T')[0],
      items: parsed.items || [],
      subtotal: parsed.subtotal || 0,
      taxRate: parsed.taxRate || 7,
      taxAmount: parsed.taxAmount || 0,
      totalAmount: parsed.totalAmount || 0,
      paidAmount: 0,
      status: 'pending',
      notes: parsed.notes || 'Parsed automatically by AI assistant.',
      reminderHistory: [],
    });
    setIsCreateOpen(true);
  };

  return (
    <div className="space-y-6">
      
      {/* Top Banner & Action Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight flex items-center space-x-2">
            <span>Invoice Tracker & Accounts Receivable</span>
            <span className="text-xs font-normal text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
              {invoices.length} Invoices
            </span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Automate tracking, past-due chasing, AI text parsing, and payment reminders
          </p>
        </div>

        <div className="flex items-center space-x-2.5">
          {/* AI Parser Trigger */}
          <button
            onClick={() => setIsParserOpen(true)}
            className="inline-flex items-center space-x-1.5 px-3.5 py-2 text-xs font-semibold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 rounded-xl transition-all cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
            <span>AI Smart Parser</span>
          </button>

          {/* New Invoice Trigger */}
          <button
            onClick={() => {
              setSelectedInvoiceForEdit(null);
              setIsCreateOpen(true);
            }}
            className="inline-flex items-center space-x-1.5 px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-xs transition-all cursor-pointer active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>Create Invoice</span>
          </button>
        </div>
      </div>

      {/* KPI Overdue Alert Box */}
      {overdueInvoices.length > 0 && (
        <div className="bg-linear-to-r from-rose-500/10 via-rose-50 to-amber-50 border border-rose-200 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center space-x-3.5">
            <div className="w-10 h-10 rounded-xl bg-rose-500 text-white flex items-center justify-center shrink-0 shadow-md shadow-rose-200">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-sm font-bold text-rose-950">
                  {overdueInvoices.length} Overdue Invoices Requiring Follow-Up
                </span>
                <span className="text-xs font-mono font-bold bg-rose-200 text-rose-800 px-2 py-0.5 rounded-full">
                  {formatCurrency(overdueTotal, profile.currency)}
                </span>
              </div>
              <p className="text-xs text-rose-700 mt-0.5">
                Past due payments impact cash flow. Use 1-Click AI Reminders to politely chase payments without awkward emails.
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              // Pick the oldest overdue invoice to remind
              const oldest = [...overdueInvoices].sort((a, b) => getDaysOverdue(b.dueDate) - getDaysOverdue(a.dueDate))[0];
              setSelectedInvoiceForReminder(oldest);
            }}
            className="inline-flex items-center space-x-1.5 px-4 py-2 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-700 rounded-xl shadow-xs transition-all cursor-pointer shrink-0"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Chase Overdue (1-Click)</span>
          </button>
        </div>
      )}

      {/* Financial Health Snapshot Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="text-xs text-slate-500 font-medium">Total Billed</div>
          <div className="text-lg sm:text-xl font-bold font-mono text-slate-900 mt-1">
            {formatCurrency(totalAmount, profile.currency)}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">All active invoices</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-rose-200 bg-rose-50/20 shadow-xs">
          <div className="text-xs text-rose-600 font-semibold flex items-center space-x-1">
            <span className="w-2 h-2 rounded-full bg-rose-500"></span>
            <span>Overdue Amount</span>
          </div>
          <div className="text-lg sm:text-xl font-bold font-mono text-rose-700 mt-1">
            {formatCurrency(overdueTotal, profile.currency)}
          </div>
          <div className="text-[11px] text-rose-600/80 mt-1">{overdueInvoices.length} invoices late</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="text-xs text-amber-600 font-medium">Pending Current</div>
          <div className="text-lg sm:text-xl font-bold font-mono text-amber-700 mt-1">
            {formatCurrency(pendingTotal, profile.currency)}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">Due within terms</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-emerald-200 bg-emerald-50/20 shadow-xs">
          <div className="text-xs text-emerald-600 font-medium">Collected / Paid</div>
          <div className="text-lg sm:text-xl font-bold font-mono text-emerald-700 mt-1">
            {formatCurrency(paidTotal, profile.currency)}
          </div>
          <div className="text-[11px] text-emerald-600/80 mt-1">Paid in full</div>
        </div>
      </div>

      {/* Filters & Search Toolbar */}
      <div className="bg-white p-3 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
        {/* Status Filter Tabs */}
        <div className="flex items-center space-x-1 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
          {[
            { id: 'all', label: 'All', count: invoices.length },
            { id: 'overdue', label: 'Overdue', count: overdueInvoices.length, color: 'text-rose-600' },
            { id: 'pending', label: 'Pending', count: invoices.filter(i => i.status === 'pending' && getDaysOverdue(i.dueDate) <= 0).length },
            { id: 'paid', label: 'Paid', count: invoices.filter(i => i.status === 'paid').length },
            { id: 'draft', label: 'Drafts', count: invoices.filter(i => i.status === 'draft').length },
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

        {/* Search */}
        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search client, invoice #..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:outline-hidden focus:bg-white focus:ring-2 focus:ring-indigo-500"
          />
        </div>
      </div>

      {/* Invoice Table / Cards */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
        {filteredInvoices.length === 0 ? (
          <div className="p-12 text-center text-slate-400 space-y-2">
            <Receipt className="w-10 h-10 mx-auto text-slate-300" />
            <p className="text-sm font-medium text-slate-600">No invoices match your filter.</p>
            <p className="text-xs text-slate-400">Try adjusting your search or create a new invoice.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase">
                <tr>
                  <th className="py-3 px-4">Invoice / Client</th>
                  <th className="py-3 px-4">Due Date</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Amount</th>
                  <th className="py-3 px-4 text-right">Reminders</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredInvoices.map((inv) => {
                  const daysOverdue = getDaysOverdue(inv.dueDate);
                  const isOverdue = inv.status === 'overdue' || (inv.status === 'pending' && daysOverdue > 0);

                  return (
                    <tr key={inv.id} className="hover:bg-slate-50/70 transition-colors">
                      {/* Client & Number */}
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-slate-900 flex items-center space-x-2">
                          <span>{inv.clientCompany || inv.clientName}</span>
                          {inv.quotationRefId && (
                            <span className="text-[10px] font-semibold bg-emerald-50 text-emerald-700 px-1.5 py-0.2 rounded border border-emerald-200">
                              From Quote
                            </span>
                          )}
                        </div>
                        <div className="text-[11px] text-slate-500 flex items-center space-x-2 mt-0.5">
                          <span className="font-mono text-indigo-700 font-semibold">{inv.invoiceNumber}</span>
                          <span>•</span>
                          <span>{inv.clientName}</span>
                        </div>
                      </td>

                      {/* Due Date & Aging */}
                      <td className="py-3.5 px-4">
                        <div className="font-medium text-slate-800">{formatDate(inv.dueDate)}</div>
                        {isOverdue ? (
                          <div className="text-[11px] font-semibold text-rose-600 flex items-center space-x-1 mt-0.5">
                            <AlertTriangle className="w-3 h-3" />
                            <span>{daysOverdue} days late</span>
                          </div>
                        ) : inv.status === 'paid' ? (
                          <div className="text-[11px] text-emerald-600 font-medium">Settled</div>
                        ) : (
                          <div className="text-[11px] text-slate-400">
                            {daysOverdue < 0 ? `In ${Math.abs(daysOverdue)} days` : 'Due today'}
                          </div>
                        )}
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-4">
                        {inv.status === 'paid' ? (
                          <span className="inline-flex items-center space-x-1 px-2.5 py-0.8 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                            <CheckCircle2 className="w-3 h-3" />
                            <span>Paid</span>
                          </span>
                        ) : isOverdue ? (
                          <span className="inline-flex items-center space-x-1 px-2.5 py-0.8 rounded-full text-[11px] font-bold bg-rose-100 text-rose-800 border border-rose-200">
                            <AlertTriangle className="w-3 h-3" />
                            <span>Overdue</span>
                          </span>
                        ) : inv.status === 'draft' ? (
                          <span className="inline-flex items-center space-x-1 px-2.5 py-0.8 rounded-full text-[11px] font-medium bg-slate-100 text-slate-700">
                            <span>Draft</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center space-x-1 px-2.5 py-0.8 rounded-full text-[11px] font-semibold bg-amber-100 text-amber-800 border border-amber-200">
                            <Clock className="w-3 h-3" />
                            <span>Pending</span>
                          </span>
                        )}
                      </td>

                      {/* Amount */}
                      <td className="py-3.5 px-4 text-right">
                        <div className="font-mono font-bold text-sm text-slate-900">
                          {formatCurrency(inv.totalAmount, profile.currency)}
                        </div>
                        <div className="text-[10px] text-slate-400">
                          {inv.items.length} item(s) • Tax {inv.taxRate}%
                        </div>
                      </td>

                      {/* Reminder Logs */}
                      <td className="py-3.5 px-4 text-right">
                        {inv.reminderHistory.length > 0 ? (
                          <span className="inline-flex items-center space-x-1 text-[11px] font-medium text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-full border border-indigo-100">
                            <Send className="w-3 h-3" />
                            <span>{inv.reminderHistory.length} sent</span>
                          </span>
                        ) : (
                          <span className="text-[11px] text-slate-400">None</span>
                        )}
                      </td>

                      {/* Action buttons */}
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end space-x-1.5">
                          {inv.status !== 'paid' && (
                            <>
                              <button
                                type="button"
                                title="Send AI Payment Reminder"
                                onClick={() => setSelectedInvoiceForReminder(inv)}
                                className="p-1.5 text-indigo-600 hover:text-indigo-800 hover:bg-indigo-50 rounded-lg transition-colors cursor-pointer"
                              >
                                <Send className="w-4 h-4" />
                              </button>
                              <button
                                type="button"
                                title="Mark as Paid"
                                onClick={() => onMarkPaid(inv.id)}
                                className="p-1.5 text-emerald-600 hover:text-emerald-800 hover:bg-emerald-50 rounded-lg transition-colors cursor-pointer"
                              >
                                <CheckCircle2 className="w-4 h-4" />
                              </button>
                            </>
                          )}

                          <button
                            type="button"
                            title="View / Print Invoice"
                            onClick={() => setSelectedInvoiceForDetail(inv)}
                            className="p-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                          >
                            <Eye className="w-4 h-4" />
                          </button>

                          <button
                            type="button"
                            title="Edit Invoice"
                            onClick={() => {
                              setSelectedInvoiceForEdit(inv);
                              setIsCreateOpen(true);
                            }}
                            className="p-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>

                          <button
                            type="button"
                            title="Delete"
                            onClick={() => onDeleteInvoice(inv.id)}
                            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modals */}
      {isCreateOpen && (
        <InvoiceModal
          invoice={selectedInvoiceForEdit}
          currency={profile.currency}
          defaultTaxRate={profile.taxRate}
          onClose={() => {
            setIsCreateOpen(false);
            setSelectedInvoiceForEdit(null);
          }}
          onSave={onSaveInvoice}
        />
      )}

      {isParserOpen && (
        <InvoiceParserModal
          onClose={() => setIsParserOpen(false)}
          onInvoiceParsed={handleParsedResult}
        />
      )}

      {selectedInvoiceForReminder && (
        <PaymentReminderModal
          invoice={selectedInvoiceForReminder}
          currency={profile.currency}
          onClose={() => setSelectedInvoiceForReminder(null)}
          onSaveReminder={onSaveReminder}
        />
      )}

      {selectedInvoiceForDetail && (
        <InvoiceDetailModal
          invoice={selectedInvoiceForDetail}
          profile={profile}
          onClose={() => setSelectedInvoiceForDetail(null)}
          onOpenReminder={(inv) => setSelectedInvoiceForReminder(inv)}
          onMarkPaid={onMarkPaid}
        />
      )}

    </div>
  );
};
