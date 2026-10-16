import React, { useState, useRef, useEffect } from 'react';
import { 
  X, 
  Send, 
  Bot, 
  Sparkles, 
  Loader2, 
  ArrowRight, 
  AlertCircle, 
  Receipt, 
  FileSpreadsheet, 
  Mail, 
  SpellCheck,
  Check
} from 'lucide-react';
import { AssistantMessage, BusinessProfile, EmailThread, Invoice, Quotation } from '../../types';
import { formatCurrency, getDaysOverdue } from '../../utils/helpers';

interface AssistantDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  invoices: Invoice[];
  quotations: Quotation[];
  emails: EmailThread[];
  profile: BusinessProfile;
  onNavigateTab: (tab: string) => void;
  onTriggerQuoteGen?: () => void;
  onTriggerInvoiceCreate?: () => void;
}

export const AssistantDrawer: React.FC<AssistantDrawerProps> = ({
  isOpen,
  onClose,
  invoices,
  quotations,
  emails,
  profile,
  onNavigateTab,
  onTriggerQuoteGen,
  onTriggerInvoiceCreate,
}) => {
  const [messages, setMessages] = useState<AssistantMessage[]>([
    {
      id: 'msg-1',
      sender: 'assistant',
      text: `Hello ${profile.ownerName || 'Ethan'}! I am your centralized Ops Assistant. I am monitoring your business operations in real-time. What would you like to automate right now?`,
      timestamp: 'Just now',
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const overdueInvoices = invoices.filter(
    (inv) => inv.status === 'overdue' || (inv.status === 'pending' && getDaysOverdue(inv.dueDate) > 0)
  );
  const overdueAmount = overdueInvoices.reduce((sum, inv) => sum + inv.totalAmount, 0);
  const unrepliedEmails = emails.filter((e) => e.status !== 'replied');

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const quickPrompts = [
    'Which invoices are overdue and need chasing?',
    'Create a quote for a $3,500 booking portal',
    'How do I reply to a client requesting a discount?',
    'What operations need my attention today?'
  ];

  const handleSendMessage = async (textToSend?: string) => {
    const text = textToSend || input;
    if (!text.trim() || loading) return;

    const userMsg: AssistantMessage = {
      id: `msg-${Date.now()}`,
      sender: 'user',
      text: text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const response = await fetch('/api/ai/assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          context: {
            invoicesCount: invoices.length,
            overdueCount: overdueInvoices.length,
            overdueAmount: overdueAmount,
            quotesCount: quotations.length,
            pendingEmailsCount: unrepliedEmails.length,
          },
        }),
      });

      const data = await response.json();

      const assistantMsg: AssistantMessage = {
        id: `msg-${Date.now() + 1}`,
        sender: 'assistant',
        text: data.reply || 'Task evaluated. Let me know if you would like me to proceed.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        suggestedAction: data.suggestedAction,
      };

      setMessages((prev) => [...prev, assistantMsg]);
    } catch (err) {
      console.error(err);
      setMessages((prev) => [
        ...prev,
        {
          id: `msg-${Date.now() + 1}`,
          sender: 'assistant',
          text: `You have ${overdueInvoices.length} overdue invoices totaling ${formatCurrency(overdueAmount, profile.currency)}, and ${unrepliedEmails.length} unreplied emails. Let me know where to direct your focus.`,
          timestamp: 'Just now',
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleActionClick = (action: any) => {
    if (!action) return;
    if (action.type === 'navigate_invoices') {
      onNavigateTab('invoices');
      onClose();
    } else if (action.type === 'navigate_quotes') {
      onNavigateTab('quotes');
      onClose();
    } else if (action.type === 'navigate_emails') {
      onNavigateTab('emails');
      onClose();
    } else if (action.type === 'navigate_proofreader') {
      onNavigateTab('proofreader');
      onClose();
    } else if (action.type === 'create_quote') {
      onNavigateTab('quotes');
      onClose();
      onTriggerQuoteGen?.();
    } else if (action.type === 'send_reminders') {
      onNavigateTab('invoices');
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-900/40 backdrop-blur-xs flex justify-end">
      <div className="bg-white w-full max-w-md h-full shadow-2xl flex flex-col justify-between animate-in slide-in-from-right duration-250 border-l border-slate-200">
        
        {/* Drawer Header */}
        <div className="px-5 py-4 bg-linear-to-r from-slate-900 via-indigo-950 to-indigo-900 text-white flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-indigo-500/30 border border-indigo-400/40 flex items-center justify-center text-indigo-300">
              <Bot className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <div className="flex items-center space-x-1.5">
                <h3 className="text-sm font-bold">Ops AI Assistant</h3>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              </div>
              <p className="text-[11px] text-slate-300">
                Personal automation pilot for {profile.companyName}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Real-time Business Context Pill */}
        <div className="bg-slate-50 px-4 py-2 border-b border-slate-200 flex items-center justify-between text-[11px]">
          <span className="text-slate-500 font-medium">Business Sync Status:</span>
          <div className="flex items-center space-x-2 text-slate-700 font-semibold">
            <span className={overdueInvoices.length > 0 ? 'text-rose-600' : 'text-slate-600'}>
              {overdueInvoices.length} Overdue
            </span>
            <span>•</span>
            <span>{quotations.length} Quotes</span>
            <span>•</span>
            <span>{unrepliedEmails.length} Emails</span>
          </div>
        </div>

        {/* Messages Stream */}
        <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-slate-50/50">
          {messages.map((msg) => {
            const isUser = msg.sender === 'user';
            return (
              <div
                key={msg.id}
                className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-xs sm:text-sm leading-relaxed shadow-xs ${
                    isUser
                      ? 'bg-indigo-600 text-white rounded-br-xs'
                      : 'bg-white text-slate-800 border border-slate-200 rounded-bl-xs'
                  }`}
                >
                  <p className="whitespace-pre-line">{msg.text}</p>
                  
                  {/* Suggested Action Button */}
                  {msg.suggestedAction && msg.suggestedAction.type !== 'none' && (
                    <button
                      onClick={() => handleActionClick(msg.suggestedAction)}
                      className="mt-2.5 inline-flex items-center space-x-1.5 px-3 py-1.5 text-xs font-bold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 rounded-xl transition-colors cursor-pointer border border-indigo-200"
                    >
                      <span>{msg.suggestedAction.label || 'Take Action'}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
                <span className="text-[10px] text-slate-400 mt-1 px-1">
                  {msg.timestamp}
                </span>
              </div>
            );
          })}

          {loading && (
            <div className="flex items-center space-x-2 text-slate-500 text-xs py-2 bg-white px-3 py-2 rounded-xl border border-slate-200 w-fit">
              <Loader2 className="w-4 h-4 animate-spin text-indigo-600" />
              <span>Analyzing business context and reasoning...</span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Quick Prompts */}
        <div className="px-4 py-2 bg-white border-t border-slate-100 flex items-center space-x-1.5 overflow-x-auto no-scrollbar">
          {quickPrompts.map((q, idx) => (
            <button
              key={idx}
              onClick={() => handleSendMessage(q)}
              className="text-[11px] whitespace-nowrap text-slate-600 bg-slate-100 hover:bg-indigo-50 hover:text-indigo-700 px-2.5 py-1 rounded-full transition-colors cursor-pointer"
            >
              {q}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <div className="p-3 bg-white border-t border-slate-200">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex items-center space-x-2"
          >
            <input
              type="text"
              placeholder="Ask your Ops Assistant or give a command..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="flex-1 px-3.5 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-300 rounded-xl focus:outline-hidden focus:bg-white focus:ring-2 focus:ring-indigo-500"
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="p-2 text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl transition-all disabled:opacity-40 cursor-pointer"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>

      </div>
    </div>
  );
};
