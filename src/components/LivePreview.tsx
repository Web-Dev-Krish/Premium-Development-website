import { useState } from 'react';
import { ExternalLink, Lock, Globe, RefreshCw } from 'lucide-react';

interface LivePreviewProps {
  url?: string;
  title: string;
  className?: string;
  aspectRatio?: string;
}

export default function LivePreview({ url, title, className = '', aspectRatio = 'aspect-[16/10]' }: LivePreviewProps) {
  const [iframeKey, setIframeKey] = useState(0);
  const [hasError, setHasError] = useState(false);

  const getDomain = (link?: string) => {
    if (!link) return 'devsiy.com';
    try {
      const parsed = new URL(link.startsWith('http://') || link.startsWith('https://') ? link : `https://${link}`);
      return parsed.hostname;
    } catch {
      return link;
    }
  };

  const domain = getDomain(url);
  const validUrl = url ? (url.startsWith('http://') || url.startsWith('https://') ? url : `https://${url}`) : '';

  return (
    <div className={`group relative rounded-xl border border-white/10 bg-neutral-900/80 overflow-hidden shadow-xl ${className}`}>
      {/* Top Browser Bar */}
      <div className="flex items-center justify-between px-3 py-2 bg-neutral-900 border-b border-white/10 text-xs text-neutral-400 select-none z-10 relative">
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-red-500/80 inline-block" />
          <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80 inline-block" />
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80 inline-block" />
        </div>
        <div className="flex items-center gap-1.5 px-3 py-0.5 bg-neutral-950/90 border border-white/5 rounded-md text-[11px] text-neutral-300 max-w-[65%] truncate">
          <Lock className="w-2.5 h-2.5 text-emerald-400 flex-shrink-0" />
          <span className="truncate">{domain}</span>
        </div>
        <div className="flex items-center gap-2">
          {validUrl && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setIframeKey((k) => k + 1);
                setHasError(false);
              }}
              className="p-1 text-neutral-500 hover:text-white transition-colors"
              title="Reload preview"
            >
              <RefreshCw className="w-3 h-3" />
            </button>
          )}
        </div>
      </div>

      {/* Preview Container */}
      <div className={`relative w-full ${aspectRatio} bg-neutral-950 overflow-hidden`}>
        {validUrl && !hasError ? (
          <div className="w-[200%] h-[200%] origin-top-left scale-50 pointer-events-none">
            <iframe
              key={iframeKey}
              src={validUrl}
              title={title}
              className="w-full h-full border-0 bg-white"
              loading="lazy"
              onError={() => setHasError(true)}
              sandbox="allow-scripts allow-same-origin allow-popups"
            />
          </div>
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center bg-gradient-to-br from-neutral-900 via-neutral-950 to-neutral-900">
            <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-3 text-neutral-400">
              <Globe className="w-6 h-6" />
            </div>
            <p className="text-white font-medium text-sm mb-1">{title}</p>
            <p className="text-neutral-500 text-xs">{domain}</p>
          </div>
        )}

        {/* Hover overlay with button */}
        {validUrl && (
          <div className="absolute inset-0 bg-neutral-950/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3 backdrop-blur-[2px] z-20">
            <a
              href={validUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white text-neutral-950 text-xs font-medium tracking-wide shadow-lg hover:bg-neutral-200 transition-all transform hover:scale-105"
            >
              Visit Live Site <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
