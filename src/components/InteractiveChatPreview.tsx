import { motion } from 'framer-motion';
import { Bot, Send, User, MessageCircle, Clock, Sparkles } from 'lucide-react';

export default function InteractiveChatPreview() {
  return (
    <div className="relative w-full max-w-[480px] mx-auto mt-12 md:mt-0 perspective-1000">
      {/* Floating Badge 1 (Left) */}
      <motion.div 
        initial={{ opacity: 0, x: -30, y: 20 }}
        animate={{ opacity: 1, x: -60, y: 40 }}
        transition={{ duration: 1, delay: 0.5, type: 'spring' }}
        className="absolute top-1/3 left-0 z-20 bg-white text-neutral-900 rounded-xl p-3 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.2)] border border-neutral-100 hidden sm:block"
      >
        <p className="text-[10px] font-bold tracking-widest text-neutral-400 mb-1 uppercase">Deflection</p>
        <p className="text-2xl font-light tracking-tight">71.4%</p>
      </motion.div>

      {/* Floating Badge 2 (Right) */}
      <motion.div 
        initial={{ opacity: 0, x: 30, y: -20 }}
        animate={{ opacity: 1, x: 40, y: -10 }}
        transition={{ duration: 1, delay: 0.7, type: 'spring' }}
        className="absolute bottom-1/4 right-0 z-20 bg-white text-neutral-900 rounded-xl p-3 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.2)] border border-neutral-100 hidden sm:block"
      >
        <p className="text-[10px] font-bold tracking-widest text-neutral-400 mb-1 uppercase">Queue Now</p>
        <p className="text-2xl font-light tracking-tight">0 <span className="text-sm font-normal text-neutral-500">waiting</span></p>
      </motion.div>

      {/* Main Chat Interface */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, rotateY: 5, rotateX: 5 }}
        animate={{ opacity: 1, scale: 1, rotateY: -2, rotateX: 2 }}
        transition={{ duration: 1, type: 'spring' }}
        className="relative bg-white rounded-2xl shadow-2xl overflow-hidden border border-neutral-200 z-10"
        style={{ transformStyle: 'preserve-3d' }}
      >
        {/* Subtle grid background inside chat box */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.03)_1px,transparent_1px)] bg-[size:20px_20px] pointer-events-none" />

        {/* Chat Header */}
        <div className="relative flex items-center justify-between p-4 border-b border-neutral-100 bg-white/80 backdrop-blur-md">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-neutral-900 flex items-center justify-center text-white">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-medium text-neutral-900">dedbot - Fieldnotes</h3>
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                <span className="text-[10px] tracking-widest text-neutral-500 uppercase font-medium">Online</span>
              </div>
            </div>
          </div>
          <div className="flex gap-1">
            <div className="w-1 h-1 rounded-full bg-neutral-300"></div>
            <div className="w-1 h-1 rounded-full bg-neutral-300"></div>
            <div className="w-1 h-1 rounded-full bg-neutral-300"></div>
          </div>
        </div>

        {/* Chat Body */}
        <div className="relative p-5 space-y-4 h-[320px] overflow-hidden flex flex-col justify-end bg-transparent">
          {/* Messages */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 1 }}
            className="flex justify-end"
          >
            <div className="bg-neutral-900 text-white text-xs px-4 py-2.5 rounded-2xl rounded-tr-sm max-w-[85%]">
              where's my order #4821?
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 1.5 }}
            className="flex justify-start"
          >
            <div className="bg-neutral-100 border border-neutral-200 text-neutral-800 text-xs px-4 py-2.5 rounded-2xl rounded-tl-sm max-w-[85%]">
              It left the Rotterdam hub at 07:42 and lands Thursday 8:00. Want me to resend the tracking link?
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 2.2 }}
            className="flex justify-end"
          >
            <div className="bg-neutral-900 text-white text-xs px-4 py-2.5 rounded-2xl rounded-tr-sm max-w-[85%]">
              yes please
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 3 }}
            className="flex justify-start"
          >
            <div className="bg-neutral-100 border border-neutral-200 text-neutral-800 text-xs px-4 py-2.5 rounded-2xl rounded-tl-sm max-w-[85%] leading-relaxed">
              Sent to aisha@fieldnotes.io. Anything else I can take off your plate?
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 4 }}
            className="flex justify-end"
          >
            <div className="bg-neutral-900 text-white text-xs px-4 py-2.5 rounded-2xl rounded-tr-sm max-w-[85%] inline-flex items-center gap-1">
              that<span className="inline-block w-[1px] h-3 bg-white/70 animate-pulse"></span>
            </div>
          </motion.div>
        </div>

        {/* Chat Input */}
        <div className="relative p-3 border-t border-neutral-100 bg-white">
          <div className="flex items-center gap-2 px-4 py-2 bg-neutral-50 rounded-full border border-neutral-200">
            <input 
              type="text" 
              placeholder="Type a message..." 
              className="flex-1 bg-transparent text-xs text-neutral-800 placeholder-neutral-400 focus:outline-none"
              disabled
            />
            <button className="w-6 h-6 rounded-full bg-neutral-900 text-white flex items-center justify-center">
              <Send className="w-3 h-3" />
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
