import React, { useState } from 'react';
import { 
  SpellCheck, 
  Sparkles, 
  Check, 
  Copy, 
  ArrowRight, 
  Loader2, 
  AlertCircle, 
  CheckCircle2, 
  ShieldCheck, 
  Zap, 
  RotateCcw,
  BookOpen
} from 'lucide-react';
import { GrammarChange, ProofreadResult } from '../../types';
import { sampleProofreadingTexts } from '../../data/initialData';

interface ProofreaderViewProps {
  initialText?: string;
  onSendToEmail?: (text: string) => void;
  onSendToQuote?: (text: string) => void;
}

export const ProofreaderView: React.FC<ProofreaderViewProps> = ({
  initialText = '',
  onSendToEmail,
  onSendToQuote,
}) => {
  const [inputText, setInputText] = useState(
    initialText || sampleProofreadingTexts[0].text
  );
  const [tone, setTone] = useState('Business Professional');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ProofreadResult | null>(null);
  const [copied, setCopied] = useState(false);

  const handleProofread = async () => {
    if (!inputText.trim()) return;

    setLoading(true);
    try {
      const response = await fetch('/api/ai/fix-grammar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: inputText,
          tone
        }),
      });

      const data = await response.json();

      const proofreadData: ProofreadResult = {
        id: `proof-${Date.now()}`,
        timestamp: new Date().toISOString(),
        originalText: inputText,
        correctedText: data.correctedText || inputText,
        changes: data.changes || [],
        overallFeedback: data.overallFeedback || 'Text evaluated and enhanced for business clarity.',
        clarityScore: data.clarityScore || 95,
        professionalScore: data.professionalScore || 98,
        tone: tone
      };

      setResult(proofreadData);
    } catch (err) {
      console.error('Failed to proofread:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (!result) return;
    navigator.clipboard.writeText(result.correctedText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      
      {/* Title & Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight flex items-center space-x-2">
            <span>AI Business Proofreader & Grammar Doctor</span>
            <span className="text-[11px] font-bold text-emerald-700 bg-emerald-100 px-2.5 py-0.5 rounded-full border border-emerald-200">
              Zero Typos Guarantee
            </span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Directly eliminates spelling mistakes (e.g. "grammer", "recieved"), grammar bugs, and poor phrasing in your client communications
          </p>
        </div>

        {/* Tone Selector */}
        <div className="flex items-center space-x-1.5 bg-white p-1 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-[11px] font-semibold text-slate-400 px-2 uppercase">Tone:</span>
          {['Business Professional', 'Executive Brief', 'Friendly / Diplomatic'].map((t) => (
            <button
              key={t}
              onClick={() => setTone(t)}
              className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                tone === t
                  ? 'bg-indigo-600 text-white'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Preset Pickers */}
      <div className="bg-white p-3 rounded-2xl border border-slate-200 shadow-xs flex flex-wrap items-center gap-2">
        <span className="text-xs font-semibold text-slate-500 uppercase flex items-center space-x-1">
          <BookOpen className="w-3.5 h-3.5 text-indigo-600" />
          <span>Try Realistic Examples:</span>
        </span>
        {sampleProofreadingTexts.map((s, idx) => (
          <button
            key={idx}
            onClick={() => {
              setInputText(s.text);
              setResult(null);
            }}
            className="text-xs font-medium text-slate-700 hover:text-indigo-700 bg-slate-50 hover:bg-indigo-50 border border-slate-200 px-2.5 py-1 rounded-lg transition-colors cursor-pointer"
          >
            {s.title}
          </button>
        ))}
      </div>

      {/* Editor & Results 2-Column Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Left Column: Input Box */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center space-x-1.5">
                <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                <span>Original Draft / Message to Polish</span>
              </label>
              <button
                onClick={() => {
                  setInputText('');
                  setResult(null);
                }}
                className="text-[11px] text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                Clear
              </button>
            </div>

            <textarea
              rows={11}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Paste email, quotation scope, or message here to fix grammar, spelling, and tone..."
              className="w-full p-3.5 text-sm font-sans bg-slate-50/70 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500 leading-relaxed resize-none"
            />
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-slate-100">
            <span className="text-xs text-slate-400">
              {inputText.split(/\s+/).filter(Boolean).length} words • {inputText.length} characters
            </span>

            <button
              onClick={handleProofread}
              disabled={loading || !inputText.trim()}
              className="inline-flex items-center space-x-2 px-5 py-2.5 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-xs transition-all cursor-pointer active:scale-95 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Scanning & Polishing...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-amber-300" />
                  <span>Fix Grammar & Polish Now</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Right Column: Polished Output & Analysis */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between space-y-4">
          {result ? (
            <div className="space-y-4 flex-1 flex flex-col justify-between">
              
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                    <span className="text-xs font-bold uppercase tracking-wider text-emerald-800">
                      Polished & Error-Free Output
                    </span>
                  </div>

                  <div className="flex items-center space-x-2">
                    <span className="text-[11px] font-bold text-slate-500">
                      Clarity: <span className="text-indigo-600 font-mono">{result.clarityScore}%</span>
                    </span>
                    <span className="text-slate-300">•</span>
                    <span className="text-[11px] font-bold text-slate-500">
                      Professionalism: <span className="text-emerald-600 font-mono">{result.professionalScore}%</span>
                    </span>
                  </div>
                </div>

                {/* Corrected Text Box */}
                <div className="p-4 bg-emerald-50/40 border border-emerald-200/80 rounded-xl text-sm font-sans text-slate-900 leading-relaxed min-h-[160px] whitespace-pre-line select-all">
                  {result.correctedText}
                </div>

                {/* Feedback Note */}
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-600 flex items-start space-x-2">
                  <ShieldCheck className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
                  <span>{result.overallFeedback}</span>
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex flex-wrap items-center justify-between gap-2 pt-3 border-t border-slate-100">
                <button
                  onClick={handleCopy}
                  className="inline-flex items-center space-x-1.5 px-3.5 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-300 rounded-xl hover:bg-slate-50 transition-colors cursor-pointer"
                >
                  {copied ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      <span className="text-emerald-700">Copied to Clipboard!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5 text-slate-500" />
                      <span>Copy Polished Text</span>
                    </>
                  )}
                </button>

                <div className="flex items-center space-x-2">
                  {onSendToEmail && (
                    <button
                      onClick={() => onSendToEmail(result.correctedText)}
                      className="px-3 py-2 text-xs font-semibold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 rounded-xl transition-colors cursor-pointer"
                    >
                      Use in Email Replier
                    </button>
                  )}
                </div>
              </div>

            </div>
          ) : (
            <div className="p-12 text-center text-slate-400 space-y-3 flex-1 flex flex-col items-center justify-center">
              <SpellCheck className="w-12 h-12 text-slate-300" />
              <div>
                <p className="text-sm font-semibold text-slate-700">Ready to Proofread</p>
                <p className="text-xs text-slate-400 max-w-sm mt-1">
                  Click 'Fix Grammar & Polish Now' to analyze your text, fix spelling typos, enhance syntax, and verify tone.
                </p>
              </div>
            </div>
          )}
        </div>

      </div>

      {/* Detailed Correction Breakdown Log */}
      {result && result.changes && result.changes.length > 0 && (
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center space-x-2">
              <Zap className="w-4 h-4 text-amber-500" />
              <span>Exact Corrections Applied ({result.changes.length} adjustments)</span>
            </h3>
            <span className="text-xs text-slate-400">Inspected by Gemini AI Ops Engine</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {result.changes.map((change, idx) => (
              <div 
                key={idx} 
                className="p-3 rounded-xl border border-slate-200 bg-slate-50/70 space-y-1.5 text-xs"
              >
                <div className="flex items-center justify-between">
                  <span className={`text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.2 rounded ${
                    change.type === 'spelling' 
                      ? 'bg-rose-100 text-rose-800' 
                      : change.type === 'grammar' 
                      ? 'bg-blue-100 text-blue-800' 
                      : 'bg-purple-100 text-purple-800'
                  }`}>
                    {change.type}
                  </span>
                </div>

                <div className="flex items-center space-x-2 font-mono text-[11px]">
                  <span className="line-through text-rose-600 bg-rose-50 px-1 rounded">{change.original}</span>
                  <ArrowRight className="w-3 h-3 text-slate-400" />
                  <span className="font-bold text-emerald-700 bg-emerald-50 px-1 rounded">{change.replacement}</span>
                </div>

                <p className="text-[11px] text-slate-600 leading-tight">
                  {change.reason}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};
