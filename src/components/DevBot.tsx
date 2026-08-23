import { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

type Message = {
  id: string;
  type: 'bot' | 'user';
  text: string;
  options?: { label: string; action: string }[];
};

export default function DevBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      type: 'bot',
      text: 'Hello! Namaste! 🙏 I am DevBot. How can I guide you with the onboarding process today? (Main aapki onboarding mein kaise madad kar sakta hoon?)',
      options: [
        { label: 'Start Onboarding (Shuru karein)', action: 'start' },
        { label: 'What is the process? (Process kya hai?)', action: 'process' },
        { label: 'Contact Support (Support se baat karein)', action: 'contact' },
      ]
    }
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen]);

  const handleOptionClick = (action: string, label: string) => {
    const userMsg: Message = {
      id: Date.now().toString(),
      type: 'user',
      text: label,
    };
    
    setMessages(prev => [...prev, userMsg]);

    setTimeout(() => {
      let botResponse: Message;

      switch (action) {
        case 'start':
          botResponse = {
            id: Date.now().toString() + '_bot',
            type: 'bot',
            text: 'Great! Let\'s start. First, you need to select a service from our Portfolio or Services page. Then, click on "Get Started" to fill out your project details. (Bahut badhiya! Sabse pehle, aapko ek service select karni hogi, fir "Get Started" par click karke details bharni hogi.)',
            options: [
              { label: 'What happens next? (Aage kya hoga?)', action: 'next_steps' },
              { label: 'Go back (Wapas jayein)', action: 'home' }
            ]
          };
          break;
        case 'process':
          botResponse = {
            id: Date.now().toString() + '_bot',
            type: 'bot',
            text: 'The process is simple (Process bahut aasan hai): \n1. Select a Service \n2. Submit Requirements \n3. We contact you with a proposal \n4. Project kicks off!',
            options: [
              { label: 'Ready to start (Main tayyar hoon)', action: 'start' },
              { label: 'Go back (Wapas jayein)', action: 'home' }
            ]
          };
          break;
        case 'next_steps':
          botResponse = {
            id: Date.now().toString() + '_bot',
            type: 'bot',
            text: 'Once you submit your details, our team will review them and reach out to you within 24 hours to discuss the timeline and pricing. (Details submit karne ke baad, humari team 24 ghante mein aapse contact karegi.)',
            options: [
              { label: 'Go back (Wapas jayein)', action: 'home' }
            ]
          };
          break;
        case 'contact':
          botResponse = {
            id: Date.now().toString() + '_bot',
            type: 'bot',
            text: 'You can reach out to us directly through the Contact page, or call our support number listed there. (Aap hume Contact page ke through message kar sakte hain ya call kar sakte hain.)',
            options: [
              { label: 'Go back (Wapas jayein)', action: 'home' }
            ]
          };
          break;
        case 'home':
        default:
          botResponse = {
            id: Date.now().toString() + '_bot',
            type: 'bot',
            text: 'Is there anything else I can help you with? (Kya main aapki koi aur madad kar sakta hoon?)',
            options: [
              { label: 'Start Onboarding (Shuru karein)', action: 'start' },
              { label: 'What is the process? (Process kya hai?)', action: 'process' },
              { label: 'Contact Support (Support se baat karein)', action: 'contact' },
            ]
          };
          break;
      }
      
      setMessages(prev => [...prev, botResponse]);
    }, 500);
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-6 right-6 p-4 bg-white text-black rounded-full shadow-lg hover:bg-neutral-200 transition-all z-50 flex items-center justify-center ${isOpen ? 'scale-0' : 'scale-100'}`}
      >
        <MessageCircle className="w-6 h-6" />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="fixed bottom-6 right-6 w-80 sm:w-96 h-[500px] bg-neutral-900 border border-white/10 rounded-2xl shadow-2xl flex flex-col z-50 overflow-hidden"
          >
            <div className="flex items-center justify-between p-4 border-b border-white/10 bg-black/50">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-white text-black flex items-center justify-center">
                  <MessageCircle className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-white font-medium">DevBot</h3>
                  <p className="text-xs text-neutral-400">Onboarding Guide</p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-neutral-400 hover:text-white transition-colors p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex flex-col ${msg.type === 'user' ? 'items-end' : 'items-start'}`}
                >
                  <div
                    className={`max-w-[85%] p-3 rounded-2xl ${
                      msg.type === 'user'
                        ? 'bg-white text-black rounded-tr-sm'
                        : 'bg-neutral-800 text-white rounded-tl-sm border border-white/5'
                    }`}
                  >
                    <p className="text-sm whitespace-pre-wrap">{msg.text}</p>
                  </div>
                  
                  {msg.options && (
                    <div className="flex flex-col gap-2 mt-3 w-[85%]">
                      {msg.options.map((opt, i) => (
                        <button
                          key={i}
                          onClick={() => handleOptionClick(opt.action, opt.label)}
                          className="text-left text-xs p-2.5 rounded-lg border border-white/10 text-neutral-300 hover:bg-white/10 hover:text-white transition-all flex items-center justify-between group"
                        >
                          {opt.label}
                          <ChevronRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
            
            <div className="p-3 border-t border-white/10 bg-black/50 text-center">
              <p className="text-[10px] text-neutral-500">DevBot operates in English, Hindi & Hinglish</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
