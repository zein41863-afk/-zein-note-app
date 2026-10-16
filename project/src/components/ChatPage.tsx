import { useState, useRef, useEffect } from 'react';
import { Bot, Send, Plus, ArrowRight, AlertCircle } from 'lucide-react';
import BrandLogo from '@/components/BrandLogo';

type Message = {
  id: string;
  role: 'student' | 'teacher';
  text: string;
};

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

const welcomeMessage: Message = {
  id: 'welcome',
  role: 'teacher',
  text: 'أهلاً يا بطل! 🤖 أنا المدرس الذكي من زين نوت. اسألني أي سؤال في رياضيات، علوم، عربي، دراسات، إنجليزي، أو فنون وأنا هساعدك!',
};

function TypingIndicator() {
  return (
    <div className="flex items-center gap-2 px-4 py-3">
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-zen-gold to-amber-600 text-white">
        <Bot className="h-5 w-5" />
      </div>
      <div className="flex items-center gap-1.5 rounded-2xl bg-gray-800 px-4 py-3">
        <span className="h-2.5 w-2.5 animate-bounce rounded-full bg-white/60 [animation-delay:-0.3s]" />
        <span className="h-2.5 w-2.5 animate-bounce rounded-full bg-white/60 [animation-delay:-0.15s]" />
        <span className="h-2.5 w-2.5 animate-bounce rounded-full bg-white/60" />
        <span className="mr-1 font-tajawal text-sm text-white/50">بيكتب...</span>
      </div>
    </div>
  );
}

type ChatPageProps = {
  onBack: () => void;
};

function ChatPage({ onBack }: ChatPageProps) {
  const [messages, setMessages] = useState<Message[]>([welcomeMessage]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [error, setError] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleSend = async () => {
    const trimmed = input.trim();
    if (!trimmed || isTyping) return;

    const studentMsg: Message = {
      id: `student-${Date.now()}`,
      role: 'student',
      text: trimmed,
    };

    setMessages((prev) => [...prev, studentMsg]);
    setInput('');
    setIsTyping(true);
    setError(false);

    try {
      const response = await fetch(`${SUPABASE_URL}/functions/v1/zein-ai`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
        },
        body: JSON.stringify({
          message: trimmed,
          grade: 'الأول الإعدادي',
        }),
      });

      if (!response.ok) {
        throw new Error(`Request failed (${response.status})`);
      }

      const data = await response.json();

      if (!data.success || !data.reply) {
        throw new Error('Invalid response');
      }

      const teacherMsg: Message = {
        id: `teacher-${Date.now()}`,
        role: 'teacher',
        text: data.reply,
      };

      setMessages((prev) => [...prev, teacherMsg]);
    } catch {
      setError(true);
    } finally {
      setIsTyping(false);
      inputRef.current?.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleNewChat = () => {
    setMessages([welcomeMessage]);
    setError(false);
    setInput('');
    inputRef.current?.focus();
  };

  return (
    <div className="flex h-screen flex-col bg-zen-bg">
      {/* Chat Header */}
      <div className="flex items-center justify-between border-b border-white/10 bg-zen-bg/80 px-4 py-3 backdrop-blur-lg sm:px-6">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="flex h-9 w-9 items-center justify-center rounded-lg text-white/70 transition-colors hover:bg-white/10 hover:text-white"
          >
            <ArrowRight className="h-5 w-5" />
          </button>
          <div className="flex items-center gap-2">
            <BrandLogo imageClassName="h-10 w-10 rounded-xl shadow-lg shadow-zen-gold/20" />
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-zen-gold to-amber-600 shadow-lg shadow-zen-gold/30">
              <Bot className="h-6 w-6 text-white" />
            </div>
            <div>
              <h2 className="font-cairo text-base font-bold text-white">المدرس الذكي</h2>
              <p className="font-tajawal text-xs text-zen-gold">متصل الآن</p>
            </div>
          </div>
        </div>

        <button
          onClick={handleNewChat}
          className="flex items-center gap-2 rounded-lg border border-zen-blue/30 bg-zen-blue/10 px-3 py-2 font-tajawal text-sm font-medium text-zen-blue transition-all duration-300 hover:bg-zen-blue hover:text-white sm:px-4"
        >
          <Plus className="h-4 w-4" />
          <span className="hidden sm:inline">محادثة جديدة</span>
        </button>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto px-4 py-6 sm:px-6">
        <div className="mx-auto max-w-3xl space-y-4">
          {messages.map((msg) => {
            const isStudent = msg.role === 'student';
            return (
              <div
                key={msg.id}
                className={`flex items-end gap-2 ${isStudent ? 'flex-row-reverse' : 'flex-row'}`}
              >
                {/* Avatar */}
                <div
                  className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-bold ${
                    isStudent
                      ? 'bg-zen-blue text-white'
                      : 'bg-gradient-to-br from-zen-gold to-amber-600 text-white'
                  }`}
                >
                  {isStudent ? 'أنا' : <Bot className="h-5 w-5" />}
                </div>

                {/* Bubble */}
                <div
                  className={`max-w-[75%] whitespace-pre-wrap rounded-2xl px-4 py-3 font-tajawal text-sm leading-relaxed sm:text-base ${
                    isStudent
                      ? 'rounded-tr-sm bg-zen-blue text-white'
                      : 'rounded-tl-sm bg-gray-800 text-white'
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            );
          })}

          {/* Typing indicator */}
          {isTyping && <TypingIndicator />}

          {/* Error message */}
          {error && (
            <div className="flex items-center gap-2 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3">
              <AlertCircle className="h-5 w-5 shrink-0 text-red-400" />
              <span className="font-tajawal text-sm text-red-300">
                المدرس مشغول، جرب تاني
              </span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input Area */}
      <div className="border-t border-white/10 bg-zen-bg/80 px-4 py-4 backdrop-blur-lg sm:px-6">
        <div className="mx-auto max-w-3xl">
          <div className="flex items-end gap-2 rounded-2xl border border-white/10 bg-white/5 p-2 transition-colors focus-within:border-zen-blue/50">
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="اكتب سؤالك هنا..."
              rows={1}
              className="max-h-32 flex-1 resize-none bg-transparent px-3 py-2 font-tajawal text-sm text-white placeholder-white/40 focus:outline-none sm:text-base"
              style={{ minHeight: '40px' }}
            />
            <button
              onClick={handleSend}
              disabled={!input.trim() || isTyping}
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-zen-blue text-white transition-all duration-300 hover:bg-blue-600 disabled:cursor-not-allowed disabled:opacity-30"
            >
              <Send className="h-5 w-5" />
            </button>
          </div>
          <p className="mt-2 text-center font-tajawal text-xs text-white/30">
            اضغط Enter للإرسال · Shift + Enter لسطر جديد
          </p>
        </div>
      </div>
    </div>
  );
}

export default ChatPage;
