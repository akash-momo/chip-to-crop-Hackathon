import React, { createContext, useContext, useState, useEffect } from 'react';

export type Language = 'en' | 'hi' | 'kn';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

// Translations dictionary for English, Hindi, and Kannada
export const translations: Record<Language, Record<string, string>> = {
  en: {
    selectLanguage: "Language",
    dashboard: "Dashboard",
    cropHealth: "Crop Health & Diagnostics",
    scanLeaf: "Scan Leaf / Upload Photo",
    evidenceMap: "Evidence Map",
    calculator: "Treatment Calculator",
    audioReader: "Farmer Audio Assistant",
    plantHelp: "Ask Plant Doctor",
    diseaseDetection: "Early Disease Detection",
    soilHealth: "Soil & Weather",
    recommendation: "Recommended Action",
    urgent: "Immediate Action Required",
    healthy: "Healthy Crop",
    downloadReport: "Download Farmer Report",
  },
  hi: {
    selectLanguage: "भाषा",
    dashboard: "डैशबोर्ड",
    cropHealth: "फसल स्वास्थ्य और निदान",
    scanLeaf: "पत्ते की फोटो लें / अपलोड करें",
    evidenceMap: "प्रमाण मानचित्र",
    calculator: "उपचार कैलकुलेटर",
    audioReader: "किसान ऑडियो सहायक",
    plantHelp: "कृषि विशेषज्ञ से पूछें",
    diseaseDetection: "रोग की पहचान",
    soilHealth: "मिट्टी और मौसम",
    recommendation: "सलाह",
    urgent: "तत्काल उपाय आवश्यक",
    healthy: "स्वस्थ फसल",
    downloadReport: "किसान रिपोर्ट डाउनलोड करें",
  },
  kn: {
    selectLanguage: "ಭಾಷೆ",
    dashboard: "ಡ್ಯಾಶ್‌ಬೋರ್ಡ್",
    cropHealth: "ಬೆಳೆ ಆರೋಗ್ಯ ಮತ್ತು ರೋಗನಿರ್ಣಯ",
    scanLeaf: "ಎಲೆಯ ಫೋಟೋ ತೆಗೆಯಿರಿ / ಅಪ್‌ಲೋಡ್ ಮಾಡಿ",
    evidenceMap: "ಸಾಕ್ಷ್ಯ ನಕ್ಷೆ",
    calculator: "ಚಿಕಿತ್ಸಾ ಕ್ಯಾಲ್ಕುಲೇಟರ್",
    audioReader: "ರೈತ ಆಡಿಯೋ ಸಹಾಯಕ",
    plantHelp: "ಕೃಷಿ ವೈದ್ಯರನ್ನು ಕೇಳಿ",
    diseaseDetection: "ರೋಗ ಪತ್ತೆ",
    soilHealth: "ಮಣ್ಣು ಮತ್ತು ಹವಾಮಾನ",
    recommendation: "ಶಿಫಾರಸು ಮಾಡಿದ ಕ್ರಮ",
    urgent: "ತಕ್ಷಣದ ಕ್ರಮ ಅಗತ್ಯ",
    healthy: "ಆರೋಗ್ಯಕರ ಬೆಳೆ",
    downloadReport: "ರೈತರ ವರದಿ ಡೌನ್‌ಲೋಡ್ ಮಾಡಿ",
  }
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Save farmer's preference in browser local storage
  const [language, setLanguageState] = useState<Language>(() => {
    return (localStorage.getItem('farmer_lang') as Language) || 'en';
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('farmer_lang', lang);
  };

  const t = (key: string): string => {
    return translations[language]?.[key] || translations['en']?.[key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};