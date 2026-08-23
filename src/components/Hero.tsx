import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowDown, Sparkles, Volume2, VolumeX, Play, Pause, MessageCircle } from 'lucide-react';
import SafeImage from './SafeImage';
import InteractiveChatPreview from './InteractiveChatPreview';

export default function Hero({ settings }: { settings: Record<string, string> }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [videoError, setVideoError] = useState(false);

  const videoUrl = settings?.hero_video_url || 'https://assets.mixkit.co/videos/preview/mixkit-abstract-technology-grid-loop-41559-large.mp4';
  const hasImage = !!settings?.hero_image_url;

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
        setIsPlaying(false);
      } else {
        videoRef.current.play().then(() => setIsPlaying(true)).catch(() => {});
      }
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.play().catch(() => {
        if (videoRef.current) {
          videoRef.current.muted = true;
          videoRef.current.play().catch(() => {});
        }
      });
    }
  }, [videoUrl]);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Functional Background Video */}
      {!videoError ? (
        <div className="absolute inset-0 z-0">
          <video
            ref={videoRef}
            src={videoUrl}
            autoPlay
            loop
            muted={isMuted}
            playsInline
            onError={() => setVideoError(true)}
            className="w-full h-full object-cover opacity-50 transition-opacity duration-1000"
          />
          {/* Gradients and Dark Overlay for Premium Look & High Contrast */}
          <div className="absolute inset-0 bg-neutral-950/70 backdrop-blur-[1px]" />
          <div className="absolute inset-0 bg-gradient-to-b from-neutral-950/80 via-transparent to-neutral-950" />
        </div>
      ) : hasImage ? (
        <div className="absolute inset-0 z-0">
          <SafeImage
            src={settings.hero_image_url}
            alt="Hero background"
            className="w-full h-full object-cover opacity-40"
          />
          <div className="absolute inset-0 bg-neutral-950/70" />
        </div>
      ) : (
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(255,255,255,0.04),transparent_50%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_70%,rgba(255,255,255,0.02),transparent_40%)]" />
        </div>
      )}

      {/* Hero Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-12 items-center min-h-[80vh] pt-20">
        <div className="text-left">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 bg-white/5 backdrop-blur-md text-xs tracking-widest text-neutral-300 mb-8"
          >
            <Sparkles className="w-3 h-3 text-white" />
            <span className="bg-white text-neutral-900 px-2 py-0.5 rounded-full text-[10px] font-bold mr-1">NEW</span>
            {settings?.hero_tagline || 'AI chatbot guardrails shipped this week'}
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="text-5xl md:text-6xl lg:text-7xl font-medium text-white leading-[1.1] tracking-tight mb-6"
          >
            Support tickets, <br/>
            before your team <br/>
            even sees them <br/>
            <span className="font-light">68% already</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-lg text-neutral-400 max-w-md mb-10 font-light leading-relaxed"
          >
            {settings?.hero_subtitle || 'dedbot is an AI chatbot trained on your docs, tickets and site. It answers in 42 languages, cites its sources, escalates the genuinely hard stuff to a human — and never takes a sick day.'}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-start gap-4"
          >
            <Link
              to="/contact"
              className="px-8 py-4 bg-white text-neutral-950 rounded-full text-sm font-medium tracking-wide hover:bg-neutral-200 transition-colors shadow-lg shadow-white/5 flex items-center gap-2"
            >
              Start free — 14 days <span className="text-lg leading-none">→</span>
            </Link>
            <a
              href="#services"
              className="px-8 py-4 rounded-full border border-white/20 bg-white/5 backdrop-blur-md text-sm text-white hover:bg-white/10 transition-colors flex items-center gap-2"
            >
              <MessageCircle className="w-4 h-4" />
              Talk to the bot
            </a>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="mt-8 flex items-center gap-6 text-[10px] tracking-[0.2em] text-neutral-500 font-medium uppercase"
          >
            <span>SOC 2 Type II</span>
            <span className="w-1 h-1 rounded-full bg-neutral-600"></span>
            <span>GDPR</span>
            <span className="w-1 h-1 rounded-full bg-neutral-600"></span>
            <span>No card required</span>
          </motion.div>
        </div>

        {/* Right side: Interactive element */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="w-full flex justify-center lg:justify-end"
        >
          <InteractiveChatPreview />
        </motion.div>
      </div>

      {/* Video Controls */}
      {!videoError && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="absolute bottom-8 right-8 z-20 flex items-center gap-2 bg-neutral-900/80 backdrop-blur-md border border-white/10 rounded-full p-1.5 px-3"
        >
          <button
            onClick={togglePlay}
            aria-label={isPlaying ? 'Pause background video' : 'Play background video'}
            className="p-1.5 text-neutral-400 hover:text-white transition-colors rounded-full"
            title={isPlaying ? 'Pause Video' : 'Play Video'}
          >
            {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          </button>
          <div className="w-[1px] h-4 bg-white/10" />
          <button
            onClick={toggleMute}
            aria-label={isMuted ? 'Unmute background video' : 'Mute background video'}
            className="p-1.5 text-neutral-400 hover:text-white transition-colors rounded-full"
            title={isMuted ? 'Unmute Audio' : 'Mute Audio'}
          >
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>
        </motion.div>
      )}

      {/* Scroll Down Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 1 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10"
      >
        <a href="#services" className="text-neutral-400 hover:text-white transition-colors">
          <ArrowDown className="w-5 h-5 animate-bounce" />
        </a>
      </motion.div>
    </section>
  );
}

