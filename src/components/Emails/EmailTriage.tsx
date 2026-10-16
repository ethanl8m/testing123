import React, { useState } from 'react';
import { 
  Mail, 
  Send, 
  Sparkles, 
  Clock, 
  Check, 
  Copy, 
  ArrowRight, 
  Loader2, 
  Plus, 
  User, 
  Building, 
  AlertCircle, 
  CheckCircle2, 
  MessageSquare,
  SpellCheck,
  RefreshCw,
  Search,
  X
} from 'lucide-react';
import { BusinessProfile, DraftReply, EmailThread } from '../../types';

interface EmailTriageProps {
  emails: EmailThread[];
  profile: BusinessProfile;
  onUpdateEmail: (email: EmailThread) => void;
  onAddEmail: (email: EmailThread) => void;
  onOpenProofreaderWithText?: (text: string) => void;
}

export const EmailTriage: React.FC<EmailTriageProps> = ({
  emails,
  profile,
  onUpdateEmail,
  onAddEmail,
  onOpenProofreaderWithText,
}) => {
  const [selectedEmailId, setSelectedEmailId] = useState<string>(emails[0]?.id || '');
  const [search, setSearch] = useState('');
  
  // AI Reply Config
  const [replyGoal, setReplyGoal] = useState('Acknowledge inquiry and provide clear next steps');
  const [replyTone, setReplyTone] = useState('Professional');
  const [extraNotes, setExtraNotes] = useState('');
  const [generating, setGenerating] = useState(false);
  const [copied, setCopied] = useState(false);
  const [copiedShort, setCopiedShort] = useState(false);

  // New incoming email modal
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [newSenderName, setNewSenderName] = useState('');
  const [newSenderEmail, setNewSenderEmail] = useState('');
  const [newSenderCompany, setNewSenderCompany] = useState('');
  const [newSubject, setNewSubject] = useState('');
  const [newBody, setNewBody] = useState('');

  const selectedEmail = emails.find(e => e.id === selectedEmailId) || emails[0];

  const filteredEmails = emails.filter(e => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return (
      e.senderName.toLowerCase().includes(q) ||
      e.subject.toLowerCase().includes(q) ||
      (e.senderCompany || '').toLowerCase().includes(q)
    );
  });

  const handleGenerateReply = async () => {
    if (!selectedEmail) return;

    setGenerating(true);
    try {
      const response = await fetch('/api/ai/reply-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          incomingEmail: `From: ${selectedEmail.senderName} (${selectedEmail.senderEmail})\nSubject: ${selectedEmail.subject}\n\n${selectedEmail.body}`,
          replyGoal,
          tone: replyTone,
          senderName: profile.ownerName,
          businessName: profile.companyName,
          extraNotes: extraNotes.trim()
        }),
      });

      const data = await response.json();

      const newDraft: DraftReply = {
        subject: data.subject || `Re: ${selectedEmail.subject}`,
        body: data.body || '',
        date: new Date().toISOString(),
        tone: replyTone,
        goal: replyGoal,
        keyPointsCovered: data.keyPointsCovered || [],
        alternativeShortReply: data.alternativeShortReply || ''
      };

      const updated: EmailThread = {
        ...selectedEmail,
        status: 'drafted',
        draftReply: newDraft
      };

      onUpdateEmail(updated);
    } catch (err) {
      console.error('Error generating reply:', err);
    } finally {
      setGenerating(false);
    }
  };

  const handleMarkReplied = () => {
    if (!selectedEmail) return;
    const updated: EmailThread = {
      ...selectedEmail,
      status: 'replied'
    };
    onUpdateEmail(updated);
  };

  const handleCopy = (text: string, isShort = false) => {
    navigator.clipboard.writeText(text);
    if (isShort) {
      setCopiedShort(true);
      setTimeout(() => setCopiedShort(false), 2000);
    } else {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleCreateIncomingEmail = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSenderName.trim() || !newBody.trim()) return;

    const email: EmailThread = {
      id: `email-${Date.now()}`,
      senderName: newSenderName,
      senderEmail: newSenderEmail || 'client@company.com',
      senderCompany: newSenderCompany || newSenderName,
      subject: newSubject || 'Client Inquiry',
      receivedAt: 'Just now',
      preview: newBody.slice(0, 100) + '...',
      body: newBody,
      category: 'general',
      status: 'unreplied',
      priority: 'high'
    };

    onAddEmail(email);
    setSelectedEmailId(email.id);
    setIsAddOpen(false);
    setNewSenderName('');
    setNewSenderEmail('');
    setNewSenderCompany('');
    setNewSubject('');
    setNewBody('');
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight flex items-center space-x-2">
            <span>Smart Email Replier & Client Triage</span>
            <span className="text-xs font-normal text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
              {emails.filter(e => e.status !== 'replied').length} Unanswered
            </span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Automate personalized, error-free replies for client questions, quotes, and payment follow-ups
          </p>
        </div>

        <button
          onClick={() => setIsAddOpen(true)}
          className="inline-flex items-center space-x-1.5 px-3.5 py-2 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-300 rounded-xl transition-all cursor-pointer shadow-xs"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Paste New Client Email</span>
        </button>
      </div>

      {/* Main 2-Pane Inbox View */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-[640px]">
        
        {/* Left Column: Email Thread List */}
        <div className="lg:col-span-4 bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs flex flex-col">
          
          {/* Search Bar */}
          <div className="p-3 border-b border-slate-200 bg-slate-50">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search emails..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 text-xs bg-white border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-sky-500"
              />
            </div>
          </div>

          {/* List items */}
          <div className="divide-y divide-slate-100 overflow-y-auto max-h-[650px] flex-1">
            {filteredEmails.map((email) => {
              const isSelected = email.id === selectedEmailId;
              return (
                <button
                  key={email.id}
                  onClick={() => setSelectedEmailId(email.id)}
                  className={`w-full text-left p-4 transition-all cursor-pointer flex flex-col space-y-1.5 ${
                    isSelected
                      ? 'bg-sky-50/80 border-l-4 border-sky-600'
                      : 'hover:bg-slate-50/70 border-l-4 border-transparent'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-slate-900 truncate">
                      {email.senderCompany || email.senderName}
                    </span>
                    <span className="text-[10px] text-slate-400">{email.receivedAt}</span>
                  </div>

                  <div className="text-xs font-medium text-slate-800 line-clamp-1">
                    {email.subject}
                  </div>

                  <div className="text-[11px] text-slate-500 line-clamp-2 leading-relaxed">
                    {email.preview}
                  </div>

                  <div className="flex items-center space-x-2 pt-1">
                    {email.status === 'replied' ? (
                      <span className="inline-flex items-center space-x-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.2 rounded-full border border-emerald-200">
                        <CheckCircle2 className="w-2.5 h-2.5" />
                        <span>Replied</span>
                      </span>
                    ) : email.status === 'drafted' ? (
                      <span className="inline-flex items-center space-x-1 text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-0.2 rounded-full border border-amber-200">
                        <Sparkles className="w-2.5 h-2.5" />
                        <span>AI Draft Ready</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center space-x-1 text-[10px] font-bold text-sky-700 bg-sky-50 px-2 py-0.2 rounded-full border border-sky-200">
                        <Clock className="w-2.5 h-2.5" />
                        <span>Needs Reply</span>
                      </span>
                    )}

                    {email.priority === 'high' && (
                      <span className="text-[10px] font-bold text-rose-600 bg-rose-50 px-1.5 py-0.2 rounded">
                        High Priority
                      </span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>

        </div>

        {/* Right Column: Email Reader & AI Auto-Reply Composer */}
        <div className="lg:col-span-8 flex flex-col space-y-4">
          
          {selectedEmail ? (
            <>
              {/* Incoming Email Card */}
              <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
                
                <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-2">
                  <div>
                    <h3 className="text-base font-bold text-slate-900 leading-snug">
                      {selectedEmail.subject}
                    </h3>
                    <div className="text-xs text-slate-500 mt-1 flex items-center space-x-2">
                      <span className="font-semibold text-slate-800">{selectedEmail.senderName}</span>
                      <span>&lt;{selectedEmail.senderEmail}&gt;</span>
                      <span>•</span>
                      <span>{selectedEmail.receivedAt}</span>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    {selectedEmail.status === 'replied' ? (
                      <span className="px-2.5 py-1 text-xs font-bold rounded-lg bg-emerald-100 text-emerald-800">
                        Replied
                      </span>
                    ) : (
                      <button
                        onClick={handleMarkReplied}
                        className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer"
                      >
                        Mark as Replied
                      </button>
                    )}
                  </div>
                </div>

                {/* Email Body */}
                <div className="text-xs sm:text-sm text-slate-700 whitespace-pre-line leading-relaxed bg-slate-50/70 p-4 rounded-xl border border-slate-200 font-sans">
                  {selectedEmail.body}
                </div>

              </div>

              {/* AI Reply Generator Box */}
              <div className="bg-white rounded-2xl border border-indigo-200 shadow-sm p-6 space-y-4">
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2.5">
                    <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center shadow-xs">
                      <Sparkles className="w-4 h-4 text-amber-300" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-900">AI Personal Reply Assistant</h4>
                      <p className="text-[11px] text-slate-500">Zero grammar errors • Tailored business tone</p>
                    </div>
                  </div>

                  <button
                    onClick={handleGenerateReply}
                    disabled={generating}
                    className="inline-flex items-center space-x-1.5 px-4 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-xs transition-all cursor-pointer active:scale-95 disabled:opacity-50"
                  >
                    {generating ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        <span>Crafting Response...</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>{selectedEmail.draftReply ? 'Regenerate Draft' : 'Generate AI Reply'}</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Preset Controls */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 uppercase mb-1">
                      Response Goal / Objective:
                    </label>
                    <select
                      value={replyGoal}
                      onChange={(e) => setReplyGoal(e.target.value)}
                      className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:bg-white focus:ring-2 focus:ring-indigo-500"
                    >
                      <option value="Acknowledge inquiry and provide clear next steps">Acknowledge & Confirm Next Steps</option>
                      <option value="Accept project request and schedule onboarding call">Accept Project & Send Call Link</option>
                      <option value="Politely decline request due to capacity constraints">Polite & Diplomatic Decline</option>
                      <option value="Provide requested wire bank instructions for invoice">Send Bank Wire / AP Instructions</option>
                      <option value="Offer slight discount (10%) with fast 3-day upfront payment terms">Negotiate Discount Terms with Upfront Rule</option>
                      <option value="Apologize sincerely for timeline delay and provide firm new date">Apologize for Delay with Concrete Solution</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 uppercase mb-1">
                      Tone & Style:
                    </label>
                    <div className="grid grid-cols-3 gap-1.5">
                      {['Professional', 'Warm & Friendly', 'Executive Concise'].map((t) => (
                        <button
                          key={t}
                          type="button"
                          onClick={() => setReplyTone(t)}
                          className={`py-1.5 px-2 text-[11px] font-semibold rounded-lg border text-center transition-all cursor-pointer ${
                            replyTone === t
                              ? 'border-indigo-600 bg-indigo-50 text-indigo-900 ring-1 ring-indigo-600'
                              : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                          }`}
                        >
                          {t}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Optional Custom Instructions */}
                <div>
                  <input
                    type="text"
                    placeholder="Specific detail to include (optional, e.g. 'Meeting available Tuesday 2pm or 4pm')"
                    value={extraNotes}
                    onChange={(e) => setExtraNotes(e.target.value)}
                    className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                {/* Draft Output Area */}
                {selectedEmail.draftReply && (
                  <div className="mt-4 pt-4 border-t border-slate-200 space-y-3 animate-in fade-in duration-200">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <span className="text-xs font-bold text-slate-800">Generated Email Draft</span>
                        <span className="text-[10px] bg-indigo-100 text-indigo-800 font-semibold px-2 py-0.5 rounded-full">
                          {selectedEmail.draftReply.tone}
                        </span>
                      </div>

                      <div className="flex items-center space-x-2">
                        {onOpenProofreaderWithText && (
                          <button
                            type="button"
                            onClick={() => onOpenProofreaderWithText(selectedEmail.draftReply!.body)}
                            className="inline-flex items-center space-x-1 text-xs text-indigo-600 hover:text-indigo-800 px-2 py-1 rounded bg-indigo-50 hover:bg-indigo-100 cursor-pointer"
                          >
                            <SpellCheck className="w-3.5 h-3.5" />
                            <span>Inspect Grammar</span>
                          </button>
                        )}

                        <button
                          type="button"
                          onClick={() => handleCopy(`Subject: ${selectedEmail.draftReply!.subject}\n\n${selectedEmail.draftReply!.body}`, false)}
                          className="inline-flex items-center space-x-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer"
                        >
                          {copied ? (
                            <>
                              <Check className="w-3.5 h-3.5 text-emerald-600" />
                              <span className="text-emerald-700">Copied!</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3.5 h-3.5 text-slate-500" />
                              <span>Copy Full Email</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>

                    {/* Subject Line */}
                    <div className="text-xs bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                      <span className="text-slate-400 font-semibold mr-2">Subject:</span>
                      <span className="font-bold text-slate-800">{selectedEmail.draftReply.subject}</span>
                    </div>

                    {/* Body */}
                    <textarea
                      rows={7}
                      value={selectedEmail.draftReply.body}
                      onChange={(e) => {
                        const updated: EmailThread = {
                          ...selectedEmail,
                          draftReply: {
                            ...selectedEmail.draftReply!,
                            body: e.target.value
                          }
                        };
                        onUpdateEmail(updated);
                      }}
                      className="w-full p-3 text-xs sm:text-sm bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500 font-sans leading-relaxed"
                    />

                    {/* Short Message / Slack / WhatsApp version */}
                    {selectedEmail.draftReply.alternativeShortReply && (
                      <div className="bg-sky-50/70 border border-sky-200 rounded-xl p-3 text-xs space-y-1.5">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-sky-900 flex items-center space-x-1">
                            <MessageSquare className="w-3.5 h-3.5 text-sky-600" />
                            <span>Quick Chat / WhatsApp Alternate (2-3 Sentences):</span>
                          </span>
                          <button
                            type="button"
                            onClick={() => handleCopy(selectedEmail.draftReply!.alternativeShortReply!, true)}
                            className="text-[11px] font-semibold text-sky-700 hover:text-sky-900 cursor-pointer"
                          >
                            {copiedShort ? 'Copied!' : 'Copy Quick Chat'}
                          </button>
                        </div>
                        <p className="text-sky-950 font-medium">
                          {selectedEmail.draftReply.alternativeShortReply}
                        </p>
                      </div>
                    )}

                    <div className="flex items-center justify-between pt-2">
                      <div className="flex items-center space-x-2 text-[11px] text-slate-500">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                        <span>Grammar & spelling validated automatically</span>
                      </div>

                      <button
                        type="button"
                        onClick={handleMarkReplied}
                        className="inline-flex items-center space-x-1.5 px-4 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-xs transition-all cursor-pointer"
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>Mark Replied & Archive</span>
                      </button>
                    </div>

                  </div>
                )}

              </div>
            </>
          ) : (
            <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center text-slate-400">
              <Mail className="w-10 h-10 mx-auto text-slate-300 mb-2" />
              <p className="text-sm font-medium">No email selected.</p>
            </div>
          )}

        </div>

      </div>

      {/* Modal to paste incoming email */}
      {isAddOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-lg w-full overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
              <h3 className="text-base font-bold">Paste New Client Email</h3>
              <button 
                onClick={() => setIsAddOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateIncomingEmail} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Sender Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. John Doe"
                    value={newSenderName}
                    onChange={(e) => setNewSenderName(e.target.value)}
                    className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Company (Optional)</label>
                  <input
                    type="text"
                    placeholder="e.g. Acme Inc"
                    value={newSenderCompany}
                    onChange={(e) => setNewSenderCompany(e.target.value)}
                    className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-lg"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Subject Line</label>
                <input
                  type="text"
                  placeholder="e.g. Inquiry regarding Q4 development quote"
                  value={newSubject}
                  onChange={(e) => setNewSubject(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-lg"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Email Body Content *</label>
                <textarea
                  rows={6}
                  required
                  placeholder="Paste what the client wrote..."
                  value={newBody}
                  onChange={(e) => setNewBody(e.target.value)}
                  className="w-full p-3 text-xs bg-slate-50 border border-slate-300 rounded-lg"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-2 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsAddOpen(false)}
                  className="px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-800 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl cursor-pointer"
                >
                  Add to Triage
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
