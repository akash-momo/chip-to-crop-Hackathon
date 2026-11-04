import React, { useEffect, useState } from 'react';
import { Globe } from 'lucide-react';

declare global {
  interface Window {
    google: any;
    googleTranslateElementInit: () => void;
  }
}

export const LanguageSelector: React.FC = () => {
  const [currentLang, setCurrentLang] = useState<string>('en');

  useEffect(() => {
    const match = document.cookie.match(/googtrans=\/en\/([a-z]{2})/);
    if (match && match[1]) {
      setCurrentLang(match[1]);
    }

    if (!document.getElementById('google_translate_element')) {
      const div = document.createElement('div');
      div.id = 'google_translate_element';
      div.style.display = 'none';
      document.body.appendChild(div);
    }

    window.googleTranslateElementInit = () => {
      if (window.google && window.google.translate) {
        new window.google.translate.TranslateElement(
          {
            pageLanguage: 'en',
            includedLanguages: 'en,hi,kn',
            autoDisplay: false,
          },
          'google_translate_element'
        );
      }
    };

    if (!document.getElementById('google-translate-script')) {
      const script = document.createElement('script');
      script.id = 'google-translate-script';
      script.src = '//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
      script.async = true;
      document.body.appendChild(script);
    }

    const styleId = 'google-translate-clean-styles';
    if (!document.getElementById(styleId)) {
      const style = document.createElement('style');
      style.id = styleId;
      style.innerHTML = `
        .goog-te-banner-frame.skiptranslate, .goog-te-banner-frame { display: none !important; }
        body { top: 0px !important; position: static !important; }
        #goog-gt-tt, .goog-te-balloon-frame { display: none !important; }
        .goog-text-highlight { background: transparent !important; box-shadow: none !important; }
        .skiptranslate iframe { display: none !important; }
      `;
      document.head.appendChild(style);
    }
  }, []);

  const handleLanguageChange = (langCode: string) => {
    setCurrentLang(langCode);

    document.cookie = `googtrans=/en/${langCode}; path=/;`;
    document.cookie = `googtrans=/en/${langCode}; domain=${window.location.hostname}; path=/;`;

    const selectElem = document.querySelector('.goog-te-combo') as HTMLSelectElement | null;
    if (selectElem) {
      selectElem.value = langCode;
      selectElem.dispatchEvent(new Event('change'));
    } else {
      window.location.reload();
    }
  };

  return (
    <div className="flex items-center gap-1.5 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border border-emerald-500/40 hover:border-emerald-500 shadow-sm px-2.5 py-1 rounded-full transition-all">
      <Globe className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
      <select
        value={currentLang}
        onChange={(e) => handleLanguageChange(e.target.value)}
        className="bg-transparent text-slate-800 dark:text-slate-100 font-semibold text-xs outline-none cursor-pointer pr-0.5"
      >
        <option value="en" className="bg-white text-slate-900">EN</option>
        <option value="hi" className="bg-white text-slate-900">हिंदी (HI)</option>
        <option value="kn" className="bg-white text-slate-900">ಕನ್ನಡ (KN)</option>
      </select>
    </div>
  );
};