export interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  amount: number;
}

export type InvoiceStatus = 'draft' | 'pending' | 'overdue' | 'paid';

export interface ReminderLog {
  id: string;
  date: string;
  tone: 'gentle' | 'standard' | 'firm_overdue' | 'final_notice';
  sentTo: string;
  subject: string;
  notes?: string;
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  clientName: string;
  clientEmail: string;
  clientCompany: string;
  issueDate: string; // YYYY-MM-DD
  dueDate: string;   // YYYY-MM-DD
  items: InvoiceItem[];
  subtotal: number;
  taxRate: number; // percentage, e.g. 8 for 8%
  taxAmount: number;
  totalAmount: number;
  paidAmount: number;
  status: InvoiceStatus;
  notes?: string;
  quotationRefId?: string; // If converted from quote
  reminderHistory: ReminderLog[];
  paymentMethod?: string;
}

export type QuotationStatus = 'draft' | 'sent' | 'accepted' | 'declined' | 'converted';

export interface Quotation {
  id: string;
  quoteNumber: string;
  clientName: string;
  clientEmail: string;
  clientCompany: string;
  issueDate: string;
  validUntil: string;
  projectTitle: string;
  scopeSummary: string;
  items: InvoiceItem[];
  subtotal: number;
  taxRate: number;
  totalAmount: number;
  status: QuotationStatus;
  timeline: string;
  paymentTerms: string;
  notes?: string;
  convertedInvoiceId?: string;
}

export type EmailPriority = 'high' | 'medium' | 'low';
export type EmailStatus = 'unreplied' | 'drafted' | 'replied';

export interface DraftReply {
  subject: string;
  body: string;
  date: string;
  tone: string;
  goal: string;
  keyPointsCovered: string[];
  alternativeShortReply?: string;
}

export interface EmailThread {
  id: string;
  senderName: string;
  senderEmail: string;
  senderCompany?: string;
  subject: string;
  receivedAt: string;
  preview: string;
  body: string;
  category: 'quote_request' | 'invoice_inquiry' | 'urgent_revision' | 'general' | 'discount_request';
  status: EmailStatus;
  priority: EmailPriority;
  draftReply?: DraftReply;
}

export interface GrammarChange {
  original: string;
  replacement: string;
  reason: string;
  type: 'spelling' | 'grammar' | 'tone' | 'clarity';
}

export interface ProofreadResult {
  id: string;
  timestamp: string;
  originalText: string;
  correctedText: string;
  changes: GrammarChange[];
  overallFeedback: string;
  clarityScore: number;
  professionalScore: number;
  tone: string;
}

export interface AssistantMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  suggestedAction?: {
    type: string;
    label: string;
    payload?: any;
  } | null;
}

export interface BusinessProfile {
  companyName: string;
  ownerName: string;
  email: string;
  phone: string;
  address: string;
  currency: string;
  taxRate: number;
  bankDetails: {
    bankName: string;
    accountName: string;
    accountNumber: string;
    routingOrIban: string;
  };
}
