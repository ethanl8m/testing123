/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Navigation } from './components/Navigation';
import { OverviewDashboard } from './components/Dashboard/OverviewDashboard';
import { InvoiceList } from './components/Invoices/InvoiceList';
import { QuotationList } from './components/Quotations/QuotationList';
import { EmailTriage } from './components/Emails/EmailTriage';
import { ProofreaderView } from './components/Proofreader/ProofreaderView';
import { AssistantDrawer } from './components/Assistant/AssistantDrawer';
import { SettingsModal } from './components/Settings/SettingsModal';
import { PaymentReminderModal } from './components/Invoices/PaymentReminderModal';
import { InvoiceDetailModal } from './components/Invoices/InvoiceDetailModal';

import { BusinessProfile, EmailThread, Invoice, Quotation, ReminderLog } from './types';
import { initialEmails, initialInvoices, initialProfile, initialQuotations } from './data/initialData';
import { getDaysOverdue, loadFromStorage, saveToStorage } from './utils/helpers';
import { Check, Sparkles } from 'lucide-react';

export default function App() {
  // State with LocalStorage persistence
  const [profile, setProfile] = useState<BusinessProfile>(() => 
    loadFromStorage('nexusops_profile', initialProfile)
  );
  const [invoices, setInvoices] = useState<Invoice[]>(() => 
    loadFromStorage('nexusops_invoices', initialInvoices)
  );
  const [quotations, setQuotations] = useState<Quotation[]>(() => 
    loadFromStorage('nexusops_quotes', initialQuotations)
  );
  const [emails, setEmails] = useState<EmailThread[]>(() => 
    loadFromStorage('nexusops_emails', initialEmails)
  );

  // Navigation & Modals
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [isAssistantOpen, setIsAssistantOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [proofreaderText, setProofreaderText] = useState<string>('');
  const [reminderInvoice, setReminderInvoice] = useState<Invoice | null>(null);
  const [selectedDetailInvoice, setSelectedDetailInvoice] = useState<Invoice | null>(null);
  const [notification, setNotification] = useState<string | null>(null);

  // Save changes to localStorage
  useEffect(() => {
    saveToStorage('nexusops_profile', profile);
  }, [profile]);

  useEffect(() => {
    saveToStorage('nexusops_invoices', invoices);
  }, [invoices]);

  useEffect(() => {
    saveToStorage('nexusops_quotes', quotations);
  }, [quotations]);

  useEffect(() => {
    saveToStorage('nexusops_emails', emails);
  }, [emails]);

  const showNotification = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3500);
  };

  // Metrics
  const overdueInvoices = invoices.filter(
    (inv) => inv.status === 'overdue' || (inv.status === 'pending' && getDaysOverdue(inv.dueDate) > 0)
  );
  const overdueAmount = overdueInvoices.reduce((acc, inv) => acc + inv.totalAmount, 0);
  const acceptedQuotesCount = quotations.filter((q) => q.status === 'accepted').length;
  const unrepliedEmailsCount = emails.filter((e) => e.status !== 'replied').length;

  // Invoice Handlers
  const handleSaveInvoice = (savedInvoice: Invoice) => {
    setInvoices((prev) => {
      const idx = prev.findIndex((i) => i.id === savedInvoice.id);
      if (idx >= 0) {
        const next = [...prev];
        next[idx] = savedInvoice;
        return next;
      }
      return [savedInvoice, ...prev];
    });
    showNotification(`Invoice #${savedInvoice.invoiceNumber} saved.`);
  };

  const handleDeleteInvoice = (id: string) => {
    setInvoices((prev) => prev.filter((i) => i.id !== id));
    showNotification('Invoice removed.');
  };

  const handleMarkPaid = (id: string) => {
    setInvoices((prev) =>
      prev.map((i) =>
        i.id === id ? { ...i, status: 'paid', paidAmount: i.totalAmount } : i
      )
    );
    showNotification('Invoice marked as Paid in full!');
  };

  const handleSaveReminder = (invoiceId: string, reminder: ReminderLog) => {
    setInvoices((prev) =>
      prev.map((i) =>
        i.id === invoiceId
          ? { ...i, reminderHistory: [...i.reminderHistory, reminder] }
          : i
      )
    );
    showNotification('Payment reminder recorded and logged.');
  };

  // Quotation Handlers
  const handleSaveQuotation = (quote: Quotation) => {
    setQuotations((prev) => {
      const idx = prev.findIndex((q) => q.id === quote.id);
      if (idx >= 0) {
        const next = [...prev];
        next[idx] = quote;
        return next;
      }
      return [quote, ...prev];
    });
    showNotification(`Quotation #${quote.quoteNumber} created.`);
  };

  const handleDeleteQuotation = (id: string) => {
    setQuotations((prev) => prev.filter((q) => q.id !== id));
    showNotification('Quotation removed.');
  };

  const handleUpdateQuoteStatus = (id: string, status: Quotation['status']) => {
    setQuotations((prev) =>
      prev.map((q) => (q.id === id ? { ...q, status } : q))
    );
    showNotification(`Proposal status updated to ${status}.`);
  };

  // Convert Quotation directly to Official Invoice
  const handleConvertToInvoice = (quote: Quotation) => {
    const newInvoice: Invoice = {
      id: `inv-from-qt-${Date.now()}`,
      invoiceNumber: `INV-2026-${Math.floor(100 + Math.random() * 900)}`,
      clientName: quote.clientName,
      clientEmail: quote.clientEmail,
      clientCompany: quote.clientCompany || quote.clientName,
      issueDate: new Date().toISOString().split('T')[0],
      dueDate: new Date(Date.now() + 14 * 86400000).toISOString().split('T')[0],
      items: quote.items.map((it, idx) => ({
        ...it,
        id: `item-${Date.now()}-${idx}`,
      })),
      subtotal: quote.subtotal,
      taxRate: quote.taxRate,
      taxAmount: (quote.subtotal * quote.taxRate) / 100,
      totalAmount: quote.totalAmount,
      paidAmount: 0,
      status: 'pending',
      notes: `Converted from Quotation #${quote.quoteNumber}. Project: ${quote.projectTitle}. Payment Terms: ${quote.paymentTerms}`,
      quotationRefId: quote.id,
      reminderHistory: [],
      paymentMethod: 'Bank Wire / Card',
    };

    // Update quotation status to 'converted'
    setQuotations((prev) =>
      prev.map((q) =>
        q.id === quote.id
          ? { ...q, status: 'converted', convertedInvoiceId: newInvoice.id }
          : q
      )
    );

    // Append to invoices
    setInvoices((prev) => [newInvoice, ...prev]);

    // Switch view to invoices tab
    setActiveTab('invoices');
    showNotification(`Success! Proposal converted to Invoice #${newInvoice.invoiceNumber}.`);
  };

  // Email Handlers
  const handleUpdateEmail = (updated: EmailThread) => {
    setEmails((prev) => prev.map((e) => (e.id === updated.id ? updated : e)));
  };

  const handleAddEmail = (email: EmailThread) => {
    setEmails((prev) => [email, ...prev]);
    showNotification('New email added to inbox.');
  };

  const handleOpenProofreaderWithText = (text: string) => {
    setProofreaderText(text);
    setActiveTab('proofreader');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      
      {/* Toast Notification */}
      {notification && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-4 py-2.5 rounded-2xl shadow-xl flex items-center space-x-2 text-xs font-semibold animate-in slide-in-from-bottom duration-200 border border-slate-700">
          <Sparkles className="w-4 h-4 text-amber-300" />
          <span>{notification}</span>
        </div>
      )}

      {/* Header */}
      <Header
        profile={profile}
        overdueCount={overdueInvoices.length}
        overdueAmount={overdueAmount}
        pendingQuotesCount={quotations.filter((q) => q.status !== 'converted').length}
        unrepliedEmailsCount={unrepliedEmailsCount}
        onOpenAssistant={() => setIsAssistantOpen(true)}
        onOpenSettings={() => setIsSettingsOpen(true)}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      {/* Navigation Tabs */}
      <Navigation
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        overdueCount={overdueInvoices.length}
        acceptedQuotesCount={acceptedQuotesCount}
        unrepliedEmailsCount={unrepliedEmailsCount}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {activeTab === 'dashboard' && (
          <OverviewDashboard
            invoices={invoices}
            quotations={quotations}
            emails={emails}
            profile={profile}
            setActiveTab={setActiveTab}
            onOpenAssistant={() => setIsAssistantOpen(true)}
            onOpenInvoiceReminder={(inv) => setReminderInvoice(inv)}
            onConvertToInvoice={handleConvertToInvoice}
            onViewInvoice={(inv) => setSelectedDetailInvoice(inv)}
          />
        )}

        {activeTab === 'invoices' && (
          <InvoiceList
            invoices={invoices}
            profile={profile}
            onSaveInvoice={handleSaveInvoice}
            onDeleteInvoice={handleDeleteInvoice}
            onMarkPaid={handleMarkPaid}
            onSaveReminder={handleSaveReminder}
          />
        )}

        {activeTab === 'quotes' && (
          <QuotationList
            quotations={quotations}
            profile={profile}
            onSaveQuotation={handleSaveQuotation}
            onDeleteQuotation={handleDeleteQuotation}
            onUpdateStatus={handleUpdateQuoteStatus}
            onConvertToInvoice={handleConvertToInvoice}
          />
        )}

        {activeTab === 'emails' && (
          <EmailTriage
            emails={emails}
            profile={profile}
            onUpdateEmail={handleUpdateEmail}
            onAddEmail={handleAddEmail}
            onOpenProofreaderWithText={handleOpenProofreaderWithText}
          />
        )}

        {activeTab === 'proofreader' && (
          <ProofreaderView
            initialText={proofreaderText}
            onSendToEmail={(txt) => {
              // Create a draft with this text or switch to email tab
              setActiveTab('emails');
              showNotification('Text copied to email composer clipboard.');
            }}
            onSendToQuote={(txt) => {
              setActiveTab('quotes');
            }}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-4 text-center text-xs text-slate-400 no-print">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>NexusOps • Centralized Business Automation Cockpit</span>
          <div className="flex items-center space-x-3 text-slate-500">
            <span>Automated Invoicing</span>
            <span>•</span>
            <span>Instant Quotations</span>
            <span>•</span>
            <span>Smart Email Triage</span>
            <span>•</span>
            <span>Zero-Error Grammar</span>
          </div>
        </div>
      </footer>

      {/* Global Personal AI Assistant Drawer */}
      <AssistantDrawer
        isOpen={isAssistantOpen}
        onClose={() => setIsAssistantOpen(false)}
        invoices={invoices}
        quotations={quotations}
        emails={emails}
        profile={profile}
        onNavigateTab={(tab) => setActiveTab(tab)}
        onTriggerQuoteGen={() => {
          setActiveTab('quotes');
        }}
        onTriggerInvoiceCreate={() => {
          setActiveTab('invoices');
        }}
      />

      {/* Settings Modal */}
      {isSettingsOpen && (
        <SettingsModal
          profile={profile}
          onClose={() => setIsSettingsOpen(false)}
          onSaveProfile={(updatedProfile) => {
            setProfile(updatedProfile);
            showNotification('Business profile updated.');
          }}
        />
      )}

      {/* Dashboard Quick Reminder Modal */}
      {reminderInvoice && (
        <PaymentReminderModal
          invoice={reminderInvoice}
          currency={profile.currency}
          onClose={() => setReminderInvoice(null)}
          onSaveReminder={handleSaveReminder}
        />
      )}

      {/* Invoice Detail Modal from Revenue Breakdown */}
      {selectedDetailInvoice && (
        <InvoiceDetailModal
          invoice={selectedDetailInvoice}
          profile={profile}
          onClose={() => setSelectedDetailInvoice(null)}
          onOpenReminder={(inv) => {
            setSelectedDetailInvoice(null);
            setReminderInvoice(inv);
          }}
          onMarkPaid={handleMarkPaid}
        />
      )}

    </div>
  );
}
