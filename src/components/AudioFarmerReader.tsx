import React, { useState, useEffect, useRef } from 'react';
import { Volume2, Play, Pause, RotateCcw } from 'lucide-react';

interface AudioFarmerReaderProps {
  englishText: string;
  kannadaText?: string;
  hindiText?: string;
  primaryDiagnosis: string;
}

export const AudioFarmerReader: React.FC<AudioFarmerReaderProps> = ({
  englishText,
  kannadaText,
  hindiText,
  primaryDiagnosis,
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [lang, setLang] = useState<'en' | 'kn' | 'hi'>('en');
  const [rate, setRate] = useState<number>(0.9);
  const [voiceMessage, setVoiceMessage] = useState('');
  const [loadingVoice, setLoadingVoice] = useState(false);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const audioUrlRef = useRef<string | null>(null);

  const defaultKnText = `ಎಚ್ಚರಿಕೆ: ನಿಮ್ಮ ಟೊಮೇಟೊ ಬೆಳೆಯಲ್ಲಿ ಎಲೆ ಕೊರೆಯುವ ಕೀಟದ ಲಕ್ಷಣಗಳು ಕಂಡುಬಂದಿವೆ. ${primaryDiagnosis}. ಕೂಡಲೇ ಹಳದಿ ಅಂಟು ಬಲೆಗಳು ಮತ್ತು ಕ್ಯೂ-ಲ್ಯೂರ್ ಫೆರೋಮೋನ್ ಬಲೆಗಳನ್ನು ಅಳವಡಿಸಿ. ತುರ್ತು ರಾಸಾಯನಿಕ ಸಿಂಪಡಣೆ ಬೇಡ, ನೈಸರ್ಗಿಕ ಜೈವಿಕ ನಿಯಂತ್ರಣ ಬಳಸಿ.`;
  const defaultHiText = `सावधान: आपके टमाटर के पौधे में पत्ती सुरंग कीट (लीफ-माइनर) का लक्षण पाया गया है। ${primaryDiagnosis}। कृपया तुरंत पीले चिपचिपे कार्ड और फेरोमोन ट्रैप लगाएं। अत्यधिक रासायनिक कीटनाशक के प्रयोग से बचें।`;

  const currentSpeechText =
    lang === 'kn' ? (kannadaText || defaultKnText) : lang === 'hi' ? (hindiText || defaultHiText) : englishText;

  const handleStop = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
    if (audioUrlRef.current) {
      URL.revokeObjectURL(audioUrlRef.current);
      audioUrlRef.current = null;
    }
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setIsPlaying(false);
    setLoadingVoice(false);
  };

  const handleTogglePlay = async () => {
    if (isPlaying) {
      handleStop();
      return;
    }

    setVoiceMessage('');
    if ('speechSynthesis' in window) window.speechSynthesis.cancel();

    // 1. Kannada Speech (Server backend route)
    if (lang === 'kn') {
      setLoadingVoice(true);
      try {
        const response = await fetch('/api/plant-audio', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ text: currentSpeechText }),
        });

        if (!response.ok) {
          throw new Error('Kannada audio server error. Please try again.');
        }

        const data = await response.json();
        if (!data.audio) throw new Error('No audio returned.');

        const binaryString = window.atob(data.audio);
        const len = binaryString.length;
        const bytes = new Uint8Array(len);
        for (let i = 0; i < len; i++) {
          bytes[i] = binaryString.charCodeAt(i);
        }

        const blob = new Blob([bytes], { type: data.mimeType || 'audio/mpeg' });
        const url = URL.createObjectURL(blob);
        audioUrlRef.current = url;

        const audio = new Audio(url);
        audioRef.current = audio;
        audio.playbackRate = rate;

        audio.onended = () => {
          setIsPlaying(false);
          handleStop();
        };

        audio.onerror = () => {
          setIsPlaying(false);
          setLoadingVoice(false);
          setVoiceMessage('Kannada audio playback issue. Please retry.');
        };

        await audio.play();
        setIsPlaying(true);
        setLoadingVoice(false);
      } catch (err: any) {
        setIsPlaying(false);
        setLoadingVoice(false);
        setVoiceMessage(err.message || 'Could not play Kannada voice.');
      }
      return;
    }

    // 2. English & Hindi Speech
    const utterance = new SpeechSynthesisUtterance(currentSpeechText);
    utterance.rate = rate;
    utterance.pitch = 1.0;

    const voices = window.speechSynthesis.getVoices();
    if (lang === 'hi') {
      const hiVoice = voices.find((v) => v.lang.startsWith('hi') || v.name.includes('Hindi'));
      if (hiVoice) utterance.voice = hiVoice;
      utterance.lang = 'hi-IN';
    } else {
      const enVoice = voices.find((v) => v.lang.startsWith('en-IN') || v.lang.startsWith('en'));
      if (enVoice) utterance.voice = enVoice;
      utterance.lang = 'en-US';
    }

    utterance.onend = () => setIsPlaying(false);
    utterance.onerror = () => {
      setIsPlaying(false);
      setVoiceMessage('Unable to play audio.');
    };

    utteranceRef.current = utterance;
    window.speechSynthesis.speak(utterance);
    setIsPlaying(true);
  };

  useEffect(() => {
    return () => {
      handleStop();
    };
  }, []);

  useEffect(() => {
    if (isPlaying) {
      handleStop();
    }
  }, [lang]);

  return (
    <div className="neuro-card rounded-2xl p-4 text-slate-200">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
            <Volume2 className="w-4 h-4 animate-pulse" />
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 block font-mono">
              FARMER VOICE GUIDE
            </span>
            <h4 className="text-xs sm:text-sm font-bold text-white">
              Hear simple advice about this leaf
            </h4>
          </div>
        </div>

        {/* Language selector buttons */}
        <div
          className="flex items-center gap-1.5 p-1 neuro-inset rounded-xl text-xs notranslate"
          translate="no"
        >
          <button
            onClick={() => setLang('en')}
            className={`px-2.5 py-1 rounded-lg font-semibold transition-all ${
              lang === 'en'
                ? 'neuro-btn-emerald text-slate-950 font-bold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            English
          </button>
          <button
            onClick={() => setLang('kn')}
            className={`px-2.5 py-1 rounded-lg font-semibold transition-all ${
              lang === 'kn'
                ? 'neuro-btn-emerald text-slate-950 font-bold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            ಕನ್ನಡ (Kannada)
          </button>
          <button
            onClick={() => setLang('hi')}
            className={`px-2.5 py-1 rounded-lg font-semibold transition-all ${
              lang === 'hi'
                ? 'neuro-btn-emerald text-slate-950 font-bold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            हिंदी (Hindi)
          </button>
        </div>
      </div>

      {/* Spoken Prose preview */}
      <div
        className="neuro-inset rounded-xl p-3 text-xs text-slate-300 leading-relaxed mb-3 italic notranslate"
        translate="no"
      >
        "{currentSpeechText}"
      </div>

      {voiceMessage && (
        <p role="status" className="mb-3 rounded-lg border border-amber-300 bg-amber-50 px-3 py-2 text-xs font-medium text-amber-900">
          {voiceMessage}
        </p>
      )}

      {/* Playback Controls Strip */}
      <div className="flex items-center justify-between gap-3 pt-1">
        <div className="flex items-center gap-2">
          <button
            onClick={handleTogglePlay}
            disabled={loadingVoice}
            className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 shadow-md transition-all ${
              isPlaying
                ? 'neuro-btn-amber text-slate-950'
                : 'neuro-btn-emerald text-slate-950'
            }`}
          >
            {isPlaying ? (
              <>
                <Pause className="w-3.5 h-3.5 fill-current" />
                <span>Pause Audio</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>{loadingVoice ? 'Loading Kannada…' : 'Listen'}</span>
              </>
            )}
          </button>

          {isPlaying && (
            <button
              onClick={handleStop}
              className="neuro-btn px-3 py-2 rounded-xl text-xs text-slate-300 hover:text-white flex items-center gap-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
          )}
        </div>

        {/* Speed toggle */}
        <div className="flex items-center gap-1.5 text-[11px] text-slate-400 font-mono notranslate" translate="no">
          <span>Speed:</span>
          <button
            onClick={() => setRate(0.8)}
            className={`px-2 py-0.5 rounded ${rate === 0.8 ? 'bg-emerald-500 text-slate-950 font-bold' : 'hover:text-white'}`}
          >
            0.8x
          </button>
          <button
            onClick={() => setRate(1.0)}
            className={`px-2 py-0.5 rounded ${rate === 1.0 ? 'bg-emerald-500 text-slate-950 font-bold' : 'hover:text-white'}`}
          >
            1.0x
          </button>
        </div>
      </div>
    </div>
  );
};