import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import en from './asset/language/en/en.json'
import fr from './asset/language/fr/fr.json'
import zh_tw from './asset/language/zh-tw/zh-tw.json'
// import Backend from "i18next-http-backend";
// import LanguageDetector from 'i18next-browser-languagedetector';

const resources = {
    en: {
      translation: en,
    },
    fr: {
      translation: fr,
    },
    zh_tw: {
      translation: zh_tw,
    },
};

i18n
//    .use(Backend) 
//    .use(LanguageDetector)
   .use(initReactI18next)  
   .init({
      resources,
      fallbackLng: "en", // When system didn't find the correspondant word, it will use the default language (en).
      lng: "en", // Default Language
      interpolation: {
         escapeValue: false, // Protect xss attack
      },
   });
   
export default i18n;