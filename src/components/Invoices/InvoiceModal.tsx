import React, { useState } from 'react';
import { 
  X, 
  Plus, 
  Trash2, 
  DollarSign, 
  Calendar, 
  User, 
  Mail, 
  Building, 
  FileText,
  Check
} from 'lucide-react';
import { Invoice, InvoiceItem } from '../../types';
import { formatCurrency } from '../../utils/helpers';

interface InvoiceModalProps {
  invoice?: Invoice | null;
  currency: string;
  defaultTaxRate: number;
  onClose: () => void;
  onSave: (invoice: Invoice) => void;
}

export const InvoiceModal: React.FC<InvoiceModalProps> = ({
  invoice,
  currency,
  defaultTaxRate,
  onClose,
  onSave,
}) => {
  const isEditing = Boolean(invoice && invoice.id);

  const [invoiceNumber, setInvoiceNumber] = useState(
    invoice?.invoiceNumber || `INV-2026-${Math.floor(100 + Math.random() * 900)}`
  );
  const [clientName, setClientName] = useState(invoice?.clientName || '');
  const [clientEmail, setClientEmail] = useState(invoice?.clientEmail || '');
  const [clientCompany, setClientCompany] = useState(invoice?.clientCompany || '');
  const [issueDate, setIssueDate] = useState(
    invoice?.issueDate || new Date().toISOString().split('T')[0]
  );
  const [dueDate, setDueDate] = useState(
    invoice?.dueDate || new Date(Date.now() + 14 * 86400000).toISOString().split('T')[0]
  );
  const [taxRate, setTaxRate] = useState<number>(
    invoice?.taxRate !== undefined ? invoice.taxRate : defaultTaxRate
  );
  const [notes, setNotes] = useState(
    invoice?.notes || 'Payment terms: Net 14. Direct wire or card payment accepted.'
  );
  const [status, setStatus] = useState<Invoice['status']>(invoice?.status || 'pending');

  const [items, setItems] = useState<InvoiceItem[]>(
    invoice?.items?.length
      ? invoice.items
      : [{ id: 'item-1', description: 'Consulting & Implementation Services', quantity: 1, unitPrice: 1500, amount: 1500 }]
  );

  const handleItemChange = (index: number, field: keyof InvoiceItem, value: any) => {
    const updated = [...items];
    updated[index] = { ...updated[index], [field]: value };
    if (field === 'quantity' || field === 'unitPrice') {
      const q = field === 'quantity' ? Number(value) : updated[index].quantity;
      const p = field === 'unitPrice' ? Number(value) : updated[index].unitPrice;
      updated[index].amount = (isNaN(q) ? 0 : q) * (isNaN(p) ? 0 : p);
    }
    setItems(updated);
  };

  const handleAddItem = () => {
    setItems([
      ...items,
      {
        id: `item-${Date.now()}`,
        description: '',
        quantity: 1,
        unitPrice: 0,
        amount: 0,
      },
    ]);
  };

  const handleRemoveItem = (index: number) => {
    if (items.length <= 1) return;
    setItems(items.filter((_, i) => i !== index));
  };

  const subtotal = items.reduce((sum, item) => sum + (item.amount || 0), 0);
  const taxAmount = (subtotal * (taxRate || 0)) / 100;
  const totalAmount = subtotal + taxAmount;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientName.trim() || items.length === 0) return;

    const savedInvoice: Invoice = {
      id: invoice?.id || `inv-${Date.now()}`,
      invoiceNumber,
      clientName,
      clientEmail,
      clientCompany: clientCompany || clientName,
      issueDate,
      dueDate,
      items,
      subtotal,
      taxRate,
      taxAmount,
      totalAmount,
      paidAmount: invoice?.paidAmount || (status === 'paid' ? totalAmount : 0),
      status,
      notes,
      quotationRefId: invoice?.quotationRefId,
      reminderHistory: invoice?.reminderHistory || [],
      paymentMethod: invoice?.paymentMethod || 'Bank Wire'
    };

    onSave(savedInvoice);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-3xl w-full overflow-hidden animate-in fade-in zoom-in-95 duration-200 my-8">
        
        {/* Header */}
        <div className="px-6 py-5 bg-slate-900 text-white flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold">
              {isEditing ? `Edit Invoice #${invoiceNumber}` : 'Create New Invoice'}
            </h3>
            <p className="text-xs text-slate-400">
              Set billing details, itemized deliverables, and due date
            </p>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          
          {/* Row 1: Invoice Meta */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Invoice Number
              </label>
              <input
                type="text"
                required
                value={invoiceNumber}
                onChange={(e) => setInvoiceNumber(e.target.value)}
                className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-lg font-mono focus:bg-white focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Issue Date
              </label>
              <input
                type="date"
                required
                value={issueDate}
                onChange={(e) => setIssueDate(e.target.value)}
                className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-lg focus:bg-white focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Payment Due Date
              </label>
              <input
                type="date"
                required
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-lg focus:bg-white focus:ring-2 focus:ring-indigo-500 font-semibold text-indigo-900"
              />
            </div>
          </div>

          {/* Row 2: Client Info */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-200">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Client Contact Name *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Marcus Vance"
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
                className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Client Company / Brand
              </label>
              <input
                type="text"
                placeholder="e.g. Apex Ventures"
                value={clientCompany}
                onChange={(e) => setClientCompany(e.target.value)}
                className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Client Billing Email
              </label>
              <input
                type="email"
                placeholder="billing@apexventures.co"
                value={clientEmail}
                onChange={(e) => setClientEmail(e.target.value)}
                className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          {/* Line Items Table */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-700">
                Itemized Line Items
              </label>
              <button
                type="button"
                onClick={handleAddItem}
                className="inline-flex items-center space-x-1 text-xs font-semibold text-indigo-600 hover:text-indigo-800 bg-indigo-50 px-2.5 py-1 rounded-lg transition-colors cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Item</span>
              </button>
            </div>

            <div className="space-y-2">
              {items.map((item, idx) => (
                <div key={item.id || idx} className="flex items-center space-x-2">
                  <div className="flex-1">
                    <input
                      type="text"
                      required
                      placeholder="Description of deliverable / service"
                      value={item.description}
                      onChange={(e) => handleItemChange(idx, 'description', e.target.value)}
                      className="w-full px-3 py-1.5 text-xs sm:text-sm bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                  <div className="w-20">
                    <input
                      type="number"
                      min="1"
                      placeholder="Qty"
                      value={item.quantity}
                      onChange={(e) => handleItemChange(idx, 'quantity', e.target.value)}
                      className="w-full px-2 py-1.5 text-xs sm:text-sm bg-white border border-slate-300 rounded-lg text-center focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                  <div className="w-28">
                    <input
                      type="number"
                      min="0"
                      step="any"
                      placeholder="Rate"
                      value={item.unitPrice}
                      onChange={(e) => handleItemChange(idx, 'unitPrice', e.target.value)}
                      className="w-full px-2 py-1.5 text-xs sm:text-sm bg-white border border-slate-300 rounded-lg text-right font-mono focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                  <div className="w-28 text-right font-mono text-xs sm:text-sm font-semibold text-slate-800 px-2">
                    {formatCurrency(item.amount, currency)}
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemoveItem(idx)}
                    disabled={items.length <= 1}
                    className="p-1.5 text-slate-400 hover:text-rose-600 rounded disabled:opacity-30 cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Totals & Tax Calculation */}
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pt-4 border-t border-slate-200">
            <div className="w-full sm:w-1/2 space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Payment Status
                </label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as any)}
                  className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-lg focus:bg-white"
                >
                  <option value="pending">Pending (Unpaid)</option>
                  <option value="overdue">Overdue</option>
                  <option value="paid">Paid</option>
                  <option value="draft">Draft</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Payment Instructions & Notes
                </label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full p-2.5 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:bg-white"
                />
              </div>
            </div>

            <div className="w-full sm:w-80 bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2 text-xs">
              <div className="flex justify-between text-slate-600">
                <span>Subtotal:</span>
                <span className="font-mono font-medium">{formatCurrency(subtotal, currency)}</span>
              </div>
              <div className="flex items-center justify-between text-slate-600">
                <div className="flex items-center space-x-1.5">
                  <span>Tax Rate (%):</span>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={taxRate}
                    onChange={(e) => setTaxRate(Number(e.target.value))}
                    className="w-14 px-1.5 py-0.5 text-xs border border-slate-300 rounded text-center bg-white"
                  />
                </div>
                <span className="font-mono">{formatCurrency(taxAmount, currency)}</span>
              </div>
              <div className="flex justify-between text-slate-900 font-bold text-sm pt-2 border-t border-slate-300">
                <span>Total Amount:</span>
                <span className="font-mono text-indigo-700">{formatCurrency(totalAmount, currency)}</span>
              </div>
            </div>
          </div>

          {/* Footer actions */}
          <div className="flex items-center justify-end space-x-3 pt-4 border-t border-slate-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-800 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="inline-flex items-center space-x-2 px-5 py-2.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-xs transition-all cursor-pointer active:scale-95"
            >
              <Check className="w-4 h-4" />
              <span>{isEditing ? 'Save Changes' : 'Create Invoice'}</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
