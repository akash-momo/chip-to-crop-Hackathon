import React, { FormEvent, useEffect, useRef, useState } from 'react';
import { Leaf, MessageCircle, Send, X } from 'lucide-react';

type ChatMessage = { role: 'assistant' | 'user'; text: string };

function getLocalPlantAnswer(question: string): string {
  const q = question.toLowerCase();
  const isPlantQuestion = /plant|crop|leaf|leaves|tomato|seed|soil|garden|pest|insect|fungus|disease|water|fertili[sz]er|farm|wilting|yellow|spot|hole|fruit|flower/.test(q);
  if (!isPlantQuestion) return 'I can only help with plants, crops, pests, soil, and plant care. Tell me the crop and what you can see on it.';
  if (/yellow|pale|discolou?r/.test(q)) return 'Yellow leaves can have several causes, including watering problems, pests, or nutrition. Check whether the soil is very wet or dry, and look under a few leaves for insects. Which crop is it, and are old or new leaves turning yellow?';
  if (/pest|insect|bug|caterpillar|worm|hole|chew/.test(q)) return 'Look on both sides of a few affected leaves for insects, eggs, or webbing. Check nearby plants too. Take a clear close-up photo; if damage is spreading, ask your local agriculture officer to identify the pest before spraying. Which crop is affected?';
  if (/water|watering|dry|soggy|wilting/.test(q)) return 'Feel the soil near the roots. If it is still wet, wait; if the top soil is dry, water slowly at the base. Avoid leaving the soil waterlogged. The right amount depends on the crop, soil, and weather. Which crop are you growing?';
  if (/spot|blotch|mark|rot|fungus|disease/.test(q)) return 'Spots can have different causes, and a photo alone may not confirm which one. Check whether they are spreading and look at the underside of the leaf. Avoid spraying until the cause is clearer. Which crop is this, and when did the spots start?';
  if (/fertili[sz]er|nutrient|manure/.test(q)) return 'Before adding fertilizer, check the crop, soil condition, and which leaves are affected. Too much fertilizer can also harm plants. What crop are you growing, and what change do you see?';
  return 'Tell me the crop, what you see, and when it started. A clear close-up photo of one affected leaf can help a local agriculture worker check it.';
}

export const PlantHelpChat: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [question, setQuestion] = useState('');
  const [busy, setBusy] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'assistant', text: 'Hello! Ask me about a crop, plant symptom, pest, or care step.' },
  ]);
  const messagesRef = useRef<HTMLDivElement>(null);
  const suggestedQuestions = ['Why are my leaves yellow?', 'How can I check for pests?', 'When should I water my plants?'];

  // Scroll the message pane only; scrollIntoView also moves the whole page on some browsers.
  useEffect(() => {
    const panel = messagesRef.current;
    if (panel) panel.scrollTo({ top: panel.scrollHeight, behavior: 'smooth' });
  }, [messages, open]);

  const sendQuestion = async (event: FormEvent) => {
    event.preventDefault();
    const text = question.trim();
    if (!text || busy) return;
    setMessages((current) => [...current, { role: 'user', text }]);
    setQuestion('');
    setBusy(true);
    try {
      const response = await fetch('/api/plant-help', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: text }),
        signal: AbortSignal.timeout(10000),
      });
      const responseText = await response.text();
      let data: { answer?: string; error?: string } = {};
      try {
        data = responseText ? JSON.parse(responseText) : {};
      } catch {
        throw new Error('Plant Help returned an unreadable reply. Please refresh and try again.');
      }
      if (!response.ok) throw new Error('Plant Help service is unavailable.');
      setMessages((current) => [...current, {
        role: 'assistant',
        text: data.answer || getLocalPlantAnswer(text),
      }]);
    } catch {
      setMessages((current) => [...current, {
        role: 'assistant',
        text: getLocalPlantAnswer(text),
      }]);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="fixed bottom-5 right-5 z-[100] font-sans">
      {open && (
        <section aria-label="Plant Help" className="mb-3 flex h-[min(480px,70vh)] w-[min(360px,calc(100vw-2rem))] flex-col overflow-hidden rounded-2xl border border-[#d5e3d0] bg-white shadow-2xl">
          <header className="flex items-center justify-between bg-[#edf5e9] px-4 py-3">
            <div className="flex items-center gap-2.5">
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-[#397a36]"><Leaf size={19} /></span>
              <div><h2 className="text-sm font-bold text-[#1d3023]">Plant Help</h2><p className="text-xs text-[#536756]">Questions about crops and plant care</p></div>
            </div>
            <button type="button" onClick={() => setOpen(false)} aria-label="Close Plant Help" className="rounded-lg p-2 text-[#536756] hover:bg-white"><X size={18} /></button>
          </header>

          <div ref={messagesRef} className="flex-1 space-y-3 overflow-y-auto bg-[#fbfdf9] p-3" aria-live="polite">
            {messages.map((message, index) => (
              <div key={`${index}-${message.role}`} className={`max-w-[88%] whitespace-pre-wrap rounded-2xl px-3 py-2.5 text-sm leading-relaxed ${message.role === 'user' ? 'plant-help-user-message ml-auto rounded-br-md bg-[#397a36] text-white' : 'rounded-bl-md border border-[#e1eadc] bg-white text-[#26382a]'}`}>
                {message.text}
              </div>
            ))}
            {messages.length === 1 && (
              <div className="flex flex-wrap gap-2 pt-1">
                {suggestedQuestions.map((suggestion) => (
                  <button key={suggestion} type="button" onClick={() => setQuestion(suggestion)} className="rounded-full border border-[#cbdcc5] bg-white px-2.5 py-1.5 text-left text-xs font-medium text-[#315b35] hover:bg-[#edf5e9]">
                    {suggestion}
                  </button>
                ))}
              </div>
            )}
            {busy && <p className="px-2 text-xs text-[#536756]">Preparing a plant care answer…</p>}
          </div>

          <form onSubmit={sendQuestion} className="flex items-center gap-2 border-t border-[#e1eadc] bg-white p-3">
            <label className="sr-only" htmlFor="plant-help-question">Ask a plant question</label>
            <input id="plant-help-question" value={question} onChange={(event) => setQuestion(event.target.value)} maxLength={500} placeholder="Ask about a plant…" className="min-w-0 flex-1 rounded-xl border border-[#ccdcca] bg-[#fbfdf9] px-3 py-2.5 text-sm text-[#1d3023] placeholder:text-[#718174] focus:border-[#397a36] focus:outline-none focus:ring-2 focus:ring-[#397a36]/20" />
            <button type="submit" disabled={!question.trim() || busy} aria-label="Send question" className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#397a36] text-white hover:bg-[#2c642f] disabled:cursor-not-allowed disabled:opacity-50"><Send size={17} /></button>
          </form>
          <p className="bg-white px-3 pb-2 text-[10px] text-[#617363]">For urgent crop problems, contact your local agriculture officer.</p>
        </section>
      )}
      <button type="button" onClick={() => setOpen((value) => !value)} aria-expanded={open} aria-label={open ? 'Close Plant Help' : 'Open Plant Help'} className="plant-help-toggle ml-auto flex items-center gap-2 rounded-full bg-[#397a36] px-4 py-3 text-sm font-bold text-white shadow-lg transition hover:bg-[#2c642f] focus:outline-none focus:ring-4 focus:ring-[#397a36]/30">
        {open ? <X size={19} /> : <MessageCircle size={19} />}
        <span>{open ? 'Close' : 'Plant Help'}</span>
      </button>
    </div>
  );
};
