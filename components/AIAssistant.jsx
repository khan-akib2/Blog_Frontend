'use client';
import { useState, useRef, useEffect } from 'react';
import {
  Sparkles, X, Image as ImageIcon, Video, PenSquare, Loader2,
  Download, Plus, RefreshCw, ChevronDown, ChevronUp, Wand2,
  Check, AlertCircle, Send, Trash2, HelpCircle, AlignLeft,
  FileText, Hash, MessageSquare,
} from 'lucide-react';
import toast from 'react-hot-toast';
import api from '@/services/api';

// ── Pollinations image URL ────────────────────────────────────────────────────
function buildImageUrl(prompt, seed) {
  return `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt.trim())}?width=1280&height=720&seed=${seed}&nologo=true&enhance=true`;
}

// ── Tab button ────────────────────────────────────────────────────────────────
function Tab({ active, onClick, icon: Icon, label }) {
  return (
    <button type="button" onClick={onClick}
      className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all"
      style={active
        ? { background: 'linear-gradient(135deg,rgba(37,99,235,0.2),rgba(124,58,237,0.2))', color: '#818cf8', border: '1px solid rgba(124,58,237,0.3)' }
        : { background: 'transparent', color: '#4a6080', border: '1px solid transparent' }
      }>
      <Icon className="w-3.5 h-3.5" /> {label}
    </button>
  );
}

// ── Write panel with chat history ─────────────────────────────────────────────
function WritePanel({ title, content, onInsertContent, onInsertFaqs, onInsertConclusion }) {
  const [input, setInput] = useState('');
  const [history, setHistory] = useState([]); // [{role:'user'|'ai', content, type, faqs}]
  const [loading, setLoading] = useState(false);
  const [activeType, setActiveType] = useState('intro');
  const bottomRef = useRef(null);

  const typeOptions = [
    { value: 'intro',      label: 'Introduction', icon: FileText    },
    { value: 'section',    label: 'Section',       icon: PenSquare   },
    { value: 'outline',    label: 'Outline',       icon: AlignLeft   },
    { value: 'paragraph',  label: 'Paragraph',     icon: AlignLeft   },
    { value: 'conclusion', label: 'Conclusion',    icon: AlignLeft   },
    { value: 'faqs',       label: 'FAQs',          icon: HelpCircle  },
    { value: 'tags',       label: 'Tags',          icon: Hash        },
    { value: 'chat',       label: 'Ask AI',        icon: MessageSquare },
  ];

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history, loading]);

  const generate = async (customInput) => {
    const topic = (customInput || input).trim() || title?.trim();
    if (!topic) return toast.error('Enter a topic or fill in the blog title first');

    const userMsg = customInput || input;
    setHistory(prev => [...prev, { role: 'user', content: userMsg || `Generate ${activeType}`, type: activeType }]);
    setInput('');
    setLoading(true);

    try {
      const { data } = await api.post('/ai/generate', {
        type: activeType,
        topic,
        message: userMsg,
        context: content ? content.replace(/<[^>]*>/g, '').substring(0, 300) : '',
        history: history.slice(-6).map(h => ({ role: h.role === 'user' ? 'user' : 'assistant', content: h.content })),
      });

      if (!data.success) throw new Error(data.message);

      if (data.faqs) {
        setHistory(prev => [...prev, { role: 'ai', content: `Generated ${data.faqs.length} FAQs`, type: 'faqs', faqs: data.faqs }]);
      } else {
        setHistory(prev => [...prev, { role: 'ai', content: data.text, type: data.type }]);
      }
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'AI failed';
      setHistory(prev => [...prev, { role: 'ai', content: msg, type: 'error' }]);
      toast.error(msg, { duration: 4000 });
    } finally {
      setLoading(false);
    }
  };

  const handleInsert = (msg) => {
    if (msg.type === 'faqs' && msg.faqs) {
      onInsertFaqs(msg.faqs);
      toast.success(`${msg.faqs.length} FAQs inserted!`);
    } else if (msg.type === 'conclusion') {
      onInsertConclusion(msg.content);
      toast.success('Conclusion inserted!');
    } else if (msg.type === 'tags') {
      onInsertContent(msg.content, 'tags');
      toast.success('Tags added!');
    } else {
      onInsertContent(msg.content, msg.type);
      toast.success('Content inserted into editor!');
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Type selector */}
      <div className="flex flex-wrap gap-1 mb-3">
        {typeOptions.map((opt) => {
          const Icon = opt.icon;
          return (
            <button key={opt.value} type="button" onClick={() => setActiveType(opt.value)}
              className="flex items-center gap-1 px-2 py-1 rounded-lg text-[11px] font-semibold transition-all"
              style={activeType === opt.value
                ? { background: 'rgba(37,99,235,0.2)', color: '#60a5fa', border: '1px solid rgba(37,99,235,0.3)' }
                : { background: 'transparent', color: '#4a6080', border: '1px solid #1a2744' }
              }>
              <Icon className="w-3 h-3" /> {opt.label}
            </button>
          );
        })}
      </div>

      {/* Chat history */}
      <div className="flex-1 overflow-y-auto space-y-3 mb-3 max-h-72 pr-1">
        {history.length === 0 && (
          <div className="text-center py-8">
            <Sparkles className="w-8 h-8 text-purple-400/40 mx-auto mb-2" />
            <p className="text-xs text-gray-600">Select a type above and describe what you need.</p>
            <p className="text-[10px] text-gray-700 mt-1">AI will generate formatted HTML content ready to insert.</p>
          </div>
        )}

        {history.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            {msg.role === 'user' ? (
              <div className="max-w-[80%] px-3 py-2 rounded-2xl rounded-tr-sm text-xs text-white"
                style={{ background: 'linear-gradient(135deg,#2563eb,#7c3aed)' }}>
                <span className="text-[10px] text-blue-200 block mb-0.5 font-semibold uppercase tracking-wide">{msg.type}</span>
                {msg.content}
              </div>
            ) : msg.type === 'error' ? (
              <div className="max-w-[90%] px-3 py-2 rounded-2xl rounded-tl-sm text-xs"
                style={{ background: 'rgba(248,113,113,0.1)', border: '1px solid rgba(248,113,113,0.2)', color: '#f87171' }}>
                <AlertCircle className="w-3 h-3 inline mr-1" />{msg.content}
              </div>
            ) : (
              <div className="max-w-[95%] rounded-2xl rounded-tl-sm overflow-hidden"
                style={{ background: '#060b18', border: '1px solid #1a2744' }}>
                {/* Preview */}
                <div className="px-3 py-2.5 text-xs text-gray-300 max-h-40 overflow-y-auto">
                  {msg.type === 'faqs' && msg.faqs ? (
                    <div className="space-y-1.5">
                      {msg.faqs.map((faq, fi) => (
                        <div key={fi}>
                          <p className="font-semibold text-white text-[11px]">Q{fi+1}. {faq.question}</p>
                          <p className="text-gray-400 text-[10px] mt-0.5">{faq.answer}</p>
                        </div>
                      ))}
                    </div>
                  ) : msg.type === 'tags' ? (
                    <div className="flex flex-wrap gap-1">
                      {msg.content.split(',').map(t => t.trim()).filter(Boolean).map((tag, ti) => (
                        <span key={ti} className="px-2 py-0.5 rounded-full text-[10px] font-bold"
                          style={{ background: 'rgba(37,99,235,0.15)', color: '#60a5fa' }}>
                          #{tag}
                        </span>
                      ))}
                    </div>
                  ) : (
                    // Render HTML preview
                    <div className="prose-sm prose-invert ai-preview"
                      dangerouslySetInnerHTML={{ __html: msg.content }} />
                  )}
                </div>
                {/* Actions */}
                <div className="flex items-center gap-2 px-3 py-2 border-t" style={{ borderColor: '#1a2744' }}>
                  <button type="button" onClick={() => handleInsert(msg)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-bold text-white flex-1 justify-center"
                    style={{ background: 'linear-gradient(135deg,#10b981,#059669)' }}>
                    <Plus className="w-3 h-3" />
                    {msg.type === 'faqs' ? 'Insert FAQs' : msg.type === 'conclusion' ? 'Insert Conclusion' : msg.type === 'tags' ? 'Add Tags' : 'Insert into Editor'}
                  </button>
                  <button type="button" onClick={() => generate(msg.role === 'user' ? msg.content : undefined)}
                    className="p-1.5 rounded-lg transition-colors"
                    style={{ color: '#4a6080', border: '1px solid #1a2744' }}
                    title="Regenerate">
                    <RefreshCw className="w-3 h-3" />
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}

        {loading && (
          <div className="flex justify-start">
            <div className="px-4 py-3 rounded-2xl rounded-tl-sm flex items-center gap-2"
              style={{ background: '#060b18', border: '1px solid #1a2744' }}>
              <div className="flex gap-1">
                {[0,1,2].map(i => (
                  <div key={i} className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-bounce"
                    style={{ animationDelay: `${i * 0.15}s` }} />
                ))}
              </div>
              <span className="text-xs text-gray-500">Gemini is writing…</span>
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="flex gap-2">
        <input type="text" value={input} onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && !loading && generate()}
          placeholder={
            activeType === 'chat' ? 'Ask anything about your blog…' :
            title ? `Topic: "${title.substring(0, 25)}…" or type custom` :
            'Enter topic or keyword…'
          }
          className="flex-1 px-3 py-2.5 rounded-xl text-sm focus:outline-none"
          style={{ background: '#060b18', border: '1px solid #1a2744', color: '#e8f0fe' }} />
        <button type="button" onClick={() => generate()} disabled={loading}
          className="flex items-center gap-1.5 px-3 py-2.5 rounded-xl text-sm font-bold text-white disabled:opacity-40 transition-all hover:-translate-y-0.5"
          style={{ background: 'linear-gradient(135deg,#2563eb,#7c3aed)' }}>
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
        </button>
        {history.length > 0 && (
          <button type="button" onClick={() => setHistory([])}
            className="p-2.5 rounded-xl transition-colors"
            style={{ color: '#4a6080', border: '1px solid #1a2744' }}
            title="Clear chat">
            <Trash2 className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
}

// ── Image panel ───────────────────────────────────────────────────────────────
function ImagePanel({ onInsert }) {
  const [prompt, setPrompt] = useState('');
  const [images, setImages] = useState([]);
  const [generating, setGenerating] = useState(false);

  const generate = () => {
    if (!prompt.trim()) return toast.error('Describe the image you want');
    setGenerating(true);
    const seeds = Array.from({ length: 4 }, () => Math.random() * 99999 | 0);
    setImages(seeds.map(seed => ({ url: buildImageUrl(prompt, seed), seed, loaded: false, error: false })));
    setGenerating(false);
  };

  const regenerate = (idx) => {
    const seed = Math.random() * 99999 | 0;
    setImages(prev => prev.map((img, i) =>
      i === idx ? { ...img, url: buildImageUrl(prompt, seed), seed, loaded: false, error: false } : img
    ));
  };

  const download = async (url, idx) => {
    try {
      const blob = await fetch(url).then(r => r.blob());
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = `ai-image-${idx + 1}.jpg`;
      a.click();
    } catch { toast.error('Download failed'); }
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <input type="text" value={prompt} onChange={e => setPrompt(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && generate()}
          placeholder="Describe the image… e.g. 'futuristic city at night, neon lights'"
          className="flex-1 px-3 py-2.5 rounded-xl text-sm focus:outline-none"
          style={{ background: '#060b18', border: '1px solid #1a2744', color: '#e8f0fe' }} />
        <button type="button" onClick={generate} disabled={generating || !prompt.trim()}
          className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-bold text-white disabled:opacity-40 transition-all hover:-translate-y-0.5"
          style={{ background: 'linear-gradient(135deg,#2563eb,#7c3aed)' }}>
          {generating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Wand2 className="w-4 h-4" />}
          Generate
        </button>
      </div>
      {images.length > 0 && (
        <>
          <div className="grid grid-cols-2 gap-3">
            {images.map((img, i) => (
              <div key={img.seed} className="group relative rounded-xl overflow-hidden bg-[#060b18]" style={{ aspectRatio: '16/9' }}>
                {!img.loaded && !img.error && <div className="absolute inset-0 flex items-center justify-center"><Loader2 className="w-5 h-5 animate-spin text-blue-400" /></div>}
                {img.error && <div className="absolute inset-0 flex items-center justify-center"><AlertCircle className="w-5 h-5 text-red-400" /></div>}
                <img src={img.url} alt={`AI ${i+1}`}
                  className={`w-full h-full object-cover transition-opacity duration-300 ${img.loaded ? 'opacity-100' : 'opacity-0'}`}
                  onLoad={() => setImages(p => p.map((x, xi) => xi === i ? { ...x, loaded: true } : x))}
                  onError={() => setImages(p => p.map((x, xi) => xi === i ? { ...x, error: true, loaded: true } : x))} />
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  <button type="button" onClick={() => onInsert(img.url)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-white"
                    style={{ background: 'linear-gradient(135deg,#10b981,#059669)' }}>
                    <Check className="w-3.5 h-3.5" /> Use
                  </button>
                  <button type="button" onClick={() => download(img.url, i)}
                    className="p-1.5 rounded-lg text-white hover:bg-white/20 transition-colors">
                    <Download className="w-3.5 h-3.5" />
                  </button>
                  <button type="button" onClick={() => regenerate(i)}
                    className="p-1.5 rounded-lg text-white hover:bg-white/20 transition-colors">
                    <RefreshCw className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
          <p className="text-[10px] text-gray-600 text-center">Hover → Use as cover · Download · Regenerate</p>
        </>
      )}
    </div>
  );
}

// ── Video panel ───────────────────────────────────────────────────────────────
function VideoPanel({ onInsert }) {
  const [prompt, setPrompt] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [loaded, setLoaded] = useState(false);

  const generate = () => {
    if (!prompt.trim()) return toast.error('Describe the video you want');
    setLoaded(false);
    const encoded = encodeURIComponent(prompt.trim());
    const seed = Math.random() * 99999 | 0;
    setVideoUrl(`https://video.pollinations.ai/prompt/${encoded}?seed=${seed}&nologo=true`);
  };

  const download = async () => {
    try {
      const blob = await fetch(videoUrl).then(r => r.blob());
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = 'ai-video.mp4';
      a.click();
      toast.success('Downloaded!');
    } catch { toast.error('Download failed — right-click the video to save'); }
  };

  return (
    <div className="space-y-4">
      <div className="rounded-xl p-3 text-xs text-amber-400 flex items-start gap-2"
        style={{ background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.2)' }}>
        <AlertCircle className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" />
        <span>Video generation may take 30–60 seconds to load after clicking Generate.</span>
      </div>
      <textarea value={prompt} onChange={e => setPrompt(e.target.value)}
        placeholder="Describe your video… e.g. 'a drone flying over mountains at sunset, cinematic'"
        rows={3} className="w-full px-3 py-2.5 rounded-xl text-sm focus:outline-none resize-none"
        style={{ background: '#060b18', border: '1px solid #1a2744', color: '#e8f0fe' }} />
      <button type="button" onClick={generate} disabled={!prompt.trim()}
        className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-bold text-white disabled:opacity-40 transition-all hover:-translate-y-0.5"
        style={{ background: 'linear-gradient(135deg,#7c3aed,#2563eb)' }}>
        <Video className="w-4 h-4" /> Generate Video
      </button>
      {videoUrl && (
        <div className="space-y-3">
          <div className="rounded-xl overflow-hidden bg-black" style={{ aspectRatio: '16/9' }}>
            {!loaded && <div className="flex items-center justify-center h-full min-h-[160px]"><Loader2 className="w-6 h-6 animate-spin text-purple-400" /></div>}
            <video src={videoUrl} controls playsInline
              className={`w-full h-full ${loaded ? 'block' : 'hidden'}`}
              onLoadedData={() => setLoaded(true)}
              onError={() => { setLoaded(true); toast.error('Video failed — try regenerating'); }} />
          </div>
          {loaded && (
            <div className="flex gap-2">
              <button type="button" onClick={() => onInsert(videoUrl)}
                className="flex-1 flex items-center justify-center gap-2 py-2 rounded-xl text-sm font-bold text-white"
                style={{ background: 'linear-gradient(135deg,#10b981,#059669)' }}>
                <Plus className="w-4 h-4" /> Add to Blog
              </button>
              <button type="button" onClick={download}
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold"
                style={{ background: 'rgba(26,39,68,0.8)', border: '1px solid #1a2744', color: '#7a90b8' }}>
                <Download className="w-4 h-4" /> Download
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ── Main AI Assistant ─────────────────────────────────────────────────────────
export default function AIAssistant({ title, content, onInsertImage, onInsertVideo, onInsertContent, onInsertFaqs, onInsertConclusion }) {
  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState('write');

  return (
    <>
      <style>{`
        .ai-preview h1,.ai-preview h2,.ai-preview h3 { color:#e8f0fe; font-weight:700; margin:6px 0 3px; }
        .ai-preview h2 { font-size:13px; }
        .ai-preview h3 { font-size:12px; }
        .ai-preview p  { margin:3px 0; line-height:1.5; }
        .ai-preview ul,.ai-preview ol { padding-left:16px; margin:3px 0; }
        .ai-preview li { margin:2px 0; }
        .ai-preview strong { color:#93c5fd; }
      `}</style>

      {/* Floating trigger */}
      <button type="button" onClick={() => setOpen(o => !o)}
        className="fixed bottom-6 right-6 z-40 flex items-center gap-2 px-4 py-3 rounded-2xl text-sm font-bold text-white shadow-2xl transition-all hover:-translate-y-1"
        style={{ background: 'linear-gradient(135deg,#7c3aed,#2563eb)', boxShadow: '0 8px 32px rgba(124,58,237,0.4)' }}>
        <Sparkles className="w-4 h-4" />
        AI Assistant
        {open ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronUp className="w-3.5 h-3.5" />}
      </button>

      {/* Panel */}
      {open && (
        <div className="fixed bottom-20 right-6 z-40 w-[460px] max-w-[calc(100vw-24px)] rounded-2xl overflow-hidden shadow-2xl flex flex-col"
          style={{ background: '#0d1526', border: '1px solid #1a2744', boxShadow: '0 32px 80px rgba(0,0,0,0.7),0 0 0 1px rgba(124,58,237,0.15)', maxHeight: '80vh' }}>

          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b flex-shrink-0" style={{ borderColor: '#1a2744' }}>
            <div className="flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg"
                style={{ background: 'linear-gradient(135deg,rgba(124,58,237,0.3),rgba(37,99,235,0.3))' }}>
                <Sparkles className="w-3.5 h-3.5 text-purple-400" />
              </div>
              <span className="text-sm font-bold text-white">AI Assistant</span>
              <span className="text-[10px] px-1.5 py-0.5 rounded-full font-bold"
                style={{ background: 'rgba(37,99,235,0.2)', color: '#60a5fa', border: '1px solid rgba(37,99,235,0.3)' }}>
                Gemini
              </span>
            </div>
            <button type="button" onClick={() => setOpen(false)}
              className="p-1.5 rounded-lg text-gray-500 hover:text-white hover:bg-[#1a2744] transition-colors">
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Tabs */}
          <div className="flex items-center gap-1 px-3 pt-3 flex-shrink-0">
            <Tab active={tab === 'write'} onClick={() => setTab('write')} icon={PenSquare} label="Write" />
            <Tab active={tab === 'image'} onClick={() => setTab('image')} icon={ImageIcon} label="Images" />
            <Tab active={tab === 'video'} onClick={() => setTab('video')} icon={Video}     label="Video"  />
          </div>

          {/* Content */}
          <div className="p-4 flex-1 overflow-hidden flex flex-col min-h-0">
            {tab === 'write' && (
              <WritePanel
                title={title}
                content={content}
                onInsertContent={onInsertContent}
                onInsertFaqs={onInsertFaqs}
                onInsertConclusion={onInsertConclusion}
              />
            )}
            {tab === 'image' && <ImagePanel onInsert={onInsertImage} />}
            {tab === 'video' && <VideoPanel onInsert={onInsertVideo} />}
          </div>

          {/* Footer */}
          <div className="px-4 py-2 border-t flex-shrink-0" style={{ borderColor: '#1a2744' }}>
            <p className="text-[10px] text-gray-600 text-center">
              Text: <span className="text-blue-500">Gemini</span> · Images/Video: <span className="text-purple-500">Pollinations.ai</span>
            </p>
          </div>
        </div>
      )}
    </>
  );
}
