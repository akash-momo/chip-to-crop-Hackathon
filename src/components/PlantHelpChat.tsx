import React, { useState } from 'react';
import { Sprout, X, Send, Bot } from 'lucide-react';

export const PlantHelpChat: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [inputVal, setInputVal] = useState('');
  const [messages, setMessages] = useState<Array<{ sender: 'bot' | 'user'; text: string }>>([
    {
      sender: 'bot',
      text: 'Hello! You can ask me about crop symptoms, pests, or field care.',
    },
  ]);

  const quickChips = [
    'Why are my leaves yellow?',
    'How do I check for pests?',
    'When should I water my plants?',
  ];

  const handleSend = () => {
    if (!inputVal.trim()) return;
    const userText = inputVal;
    setInputVal('');
    setMessages((prev) => [...prev, { sender: 'user', text: userText }]);

    // Simulated doctor response
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          sender: 'bot',
          text: 'Thank you for your question. Early leaf discoloration can indicate nutrient deficiency or early pest pressure. Inspect the underside of leaves for miner trails.',
        },
      ]);
    }, 800);
  };

  // Grabs the exact translated text rendered on screen
  const handleChipClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    const renderedText = e.currentTarget.innerText;
    setInputVal(renderedText);
  };

  return (
    <>
      {/* Floating Chat Bubble */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-5 right-5 z-40 bg-emerald-700 hover:bg-emerald-800 text-white p-3.5 rounded-full shadow-xl flex items-center justify-center transition-transform hover:scale-105"
          title="Ask Plant Doctor"
        >
          <Sprout className="w-6 h-6" />
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-5 right-5 z-40 w-[90vw] sm:w-96 bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-emerald-100 dark:border-slate-800 overflow-hidden flex flex-col max-h-[550px]">
          {/* Header */}
          <div className="bg-emerald-50 dark:bg-slate-800/80 px-4 py-3 flex items-center justify-between border-b border-emerald-100 dark:border-slate-700">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700">
                <Sprout className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100">Plant Doctor Help</h3>
                <p className="text-[11px] text-slate-500">Ask questions regarding crops and care</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Messages Area */}
          <div className="p-4 flex-1 overflow-y-auto space-y-3 text-xs sm:text-sm">
            {messages.map((m, idx) => (
              <div
                key={idx}
                className={`flex gap-2 ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {m.sender === 'bot' && <Bot className="w-4 h-4 text-emerald-600 mt-1 shrink-0" />}
                <div
                  className={`p-3 rounded-xl max-w-[80%] ${
                    m.sender === 'user'
                      ? 'bg-emerald-600 text-white rounded-br-none'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-100 rounded-bl-none'
                  }`}
                >
                  {m.text}
                </div>
              </div>
            ))}

            {/* Quick Suggestion Chips */}
            <div className="flex flex-col gap-1.5 pt-2">
              {quickChips.map((chip, i) => (
                <button
                  key={i}
                  onClick={handleChipClick}
                  className="text-left text-xs bg-emerald-50/80 hover:bg-emerald-100/90 text-emerald-800 border border-emerald-200/80 rounded-full px-3 py-1.5 transition-colors w-fit"
                >
                  {chip}
                </button>
              ))}
            </div>
          </div>

          {/* Input Area */}
          <div className="p-3 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={inputVal}
                onChange={(e) => setInputVal(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Ask about symptoms, pests..."
                className="flex-1 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-800 dark:text-slate-100 outline-none focus:border-emerald-500"
              />
              <button
                onClick={handleSend}
                className="bg-emerald-700 hover:bg-emerald-800 text-white p-2.5 rounded-xl transition-colors shrink-0"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </div>
            <p className="text-[10px] text-slate-400 mt-1.5 text-center">
              For emergency pest outbreaks, contact your local Krishi Vigyan Kendra.
            </p>
          </div>
        </div>
      )}
    </>
  );
};