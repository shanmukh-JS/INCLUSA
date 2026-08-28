'use client';

import React, { useState, useEffect } from 'react';
import { ChatMessage } from '../../../types';
import { aiService } from '../../../lib/ai/ai-service';
import { documentStore } from '../../../lib/storage/document-store';
import {
  Send,
  Bot,
  User,
  Quote,
  Loader2,
} from 'lucide-react';

interface InclusaAssistantProps {
  documentId: string;
  documentTitle: string;
  documentText: string;
}

export const InclusaAssistant: React.FC<InclusaAssistantProps> = ({
  documentId,
  documentTitle,
  documentText,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isThinking, setIsThinking] = useState(false);

  // Load existing chat history or set initial welcome
  useEffect(() => {
    const saved = documentStore.getChatMessages(documentId);
    if (saved && saved.length > 0) {
      setMessages(saved);
    } else {
      const welcome: ChatMessage = {
        id: `msg_init_${Date.now()}`,
        documentId,
        sender: 'assistant',
        content: `Hello! I am **INCLUSA Assistant**. I have analyzed **"${documentTitle}"** and can explain complex sections, describe charts, answer questions in simple language, or translate insights into Telugu and Hindi. How can I assist you?`,
        timestamp: new Date().toISOString(),
      };
      setMessages([welcome]);
      documentStore.saveChatMessage(welcome);
    }
  }, [documentId, documentTitle]);

  const handleSend = async (questionText?: string) => {
    const textToSend = questionText || inputValue.trim();
    if (!textToSend || isThinking) return;

    const userMsg: ChatMessage = {
      id: `msg_u_${Date.now()}`,
      documentId,
      sender: 'user',
      content: textToSend,
      timestamp: new Date().toISOString(),
    };

    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    documentStore.saveChatMessage(userMsg);
    setInputValue('');
    setIsThinking(true);

    try {
      let answer = '';
      let citations: any[] = [];

      try {
        const apiRes = await fetch('/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            question: textToSend,
            documentTitle,
            documentText,
          }),
        });
        if (apiRes.ok) {
          const apiData = await apiRes.json();
          if (apiData.success && apiData.answer) {
            answer = apiData.answer;
            citations = apiData.citations || [];
          }
        }
      } catch (apiErr) {
        console.warn('API chat fetch failed, using direct client AI service', apiErr);
      }

      if (!answer) {
        const fallbackRes = await aiService.answerDocumentQuestion({
          question: textToSend,
          documentTitle,
          documentText,
        });
        answer = fallbackRes.answer;
        citations = fallbackRes.citations || [];
      }

      const assistantMsg: ChatMessage = {
        id: `msg_a_${Date.now()}`,
        documentId,
        sender: 'assistant',
        content: answer,
        citations,
        timestamp: new Date().toISOString(),
      };

      setMessages((prev) => [...prev, assistantMsg]);
      documentStore.saveChatMessage(assistantMsg);
      setIsThinking(false);
    } catch (err) {
      console.error('Error in chat assistant', err);
      setIsThinking(false);
    }
  };

  const quickPrompts = [
    'Explain this in simple Telugu.',
    'Describe the charts in detail.',
    'Summarize top 3 takeaways.',
    'What barriers were fixed?',
  ];

  return (
    <div className="rounded-3xl border-2 border-[var(--border-strong)] bg-white p-5 sm:p-6 shadow-[6px_6px_0_0_#192138] flex flex-col h-[580px]">
      <div className="flex items-center justify-between pb-3 border-b-2 border-[var(--border-strong)] mb-4">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-emerald-100 text-emerald-950 border border-emerald-300">
            <Bot className="h-4 w-4 text-[#059669]" />
          </div>
          <div>
            <h3 className="text-sm font-black text-[var(--text-primary)]">
              Ask INCLUSA
            </h3>
            <p className="text-[10px] text-[var(--text-muted)] font-medium">
              Context-grounded Q&A with citations
            </p>
          </div>
        </div>

        <span className="text-[10px] font-black px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-950 border border-amber-300">
          Document Aware
        </span>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto space-y-3.5 pr-2">
        {messages.map((msg) => {
          const isUser = msg.sender === 'user';
          return (
            <div
              key={msg.id}
              className={`flex gap-2.5 text-xs leading-relaxed ${
                isUser ? 'justify-end' : 'justify-start'
              }`}
            >
              {!isUser && (
                <div className="p-1.5 rounded-xl bg-emerald-100 text-emerald-950 shrink-0 h-7 w-7 flex items-center justify-center mt-1 border border-emerald-300">
                  <Bot className="h-3.5 w-3.5 text-[#059669]" />
                </div>
              )}

              <div
                className={`p-3.5 rounded-2xl max-w-[85%] ${
                  isUser
                    ? 'bg-amber-100 text-amber-950 font-bold rounded-tr-none border-2 border-[var(--border-strong)] shadow-[2px_2px_0_0_#192138]'
                    : 'bg-[var(--bg-primary)] text-[var(--text-primary)] border-2 border-[var(--border-strong)] rounded-tl-none font-medium'
                }`}
              >
                <div className="whitespace-pre-line">{msg.content}</div>

                {/* Citations */}
                {msg.citations && msg.citations.length > 0 && (
                  <div className="mt-2.5 pt-2 border-t border-[var(--border-color)] text-[10px] text-[var(--text-secondary)] space-y-1 font-normal">
                    <span className="font-black flex items-center gap-1 text-[#059669]">
                      <Quote className="h-3 w-3" /> Grounded References:
                    </span>
                    {msg.citations.map((c: any, ci: number) => (
                      <div key={ci} className="pl-2 border-l-2 border-[#059669]">
                        {c.section && <span className="font-bold text-[var(--text-primary)]">[{c.section}] </span>}
                        {c.pageNumber && <span>Page {c.pageNumber}: </span>}
                        <span>"{c.snippet}"</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {isUser && (
                <div className="p-1.5 rounded-xl bg-white text-[var(--text-primary)] shrink-0 h-7 w-7 flex items-center justify-center mt-1 border border-[var(--border-strong)]">
                  <User className="h-3.5 w-3.5" />
                </div>
              )}
            </div>
          );
        })}

        {isThinking && (
          <div className="flex gap-2 items-center text-xs text-[var(--text-muted)] p-2 font-bold">
            <Loader2 className="h-4 w-4 animate-spin text-[#059669]" />
            <span>INCLUSA Assistant is analyzing document context...</span>
          </div>
        )}
      </div>

      {/* Quick Prompt Chips */}
      <div className="my-2 pt-2.5 border-t border-[var(--border-subtle)]">
        <div className="flex gap-1.5 overflow-x-auto pb-1">
          {quickPrompts.map((qp, i) => (
            <button
              key={i}
              type="button"
              onClick={() => handleSend(qp)}
              disabled={isThinking}
              className="text-[10px] font-bold whitespace-nowrap px-2.5 py-1 rounded-xl bg-[var(--bg-primary)] hover:bg-amber-100 border border-[var(--border-strong)] text-[var(--text-primary)] transition-colors"
            >
              {qp}
            </button>
          ))}
        </div>
      </div>

      {/* Input Box */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSend();
        }}
        className="flex gap-2"
      >
        <input
          type="text"
          placeholder="Ask anything about this document..."
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          disabled={isThinking}
          className="flex-1 py-2.5 px-3.5 rounded-xl border-2 border-[var(--border-strong)] bg-[var(--bg-primary)] text-xs text-[var(--text-primary)] font-bold focus:border-[#059669]"
        />
        <button
          type="submit"
          disabled={!inputValue.trim() || isThinking}
          aria-label="Send message to INCLUSA Assistant"
          className="px-4 py-2.5 rounded-xl bg-[#059669] hover:bg-[#047857] text-white font-black text-xs border-2 border-[var(--border-strong)] shadow-[2px_2px_0_0_#192138] disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center transition-all"
        >
          <Send className="h-3.5 w-3.5" />
        </button>
      </form>
    </div>
  );
};
