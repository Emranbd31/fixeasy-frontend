'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const languages = [
    { code: 'en', name: 'English (Ireland)', flag: '🇮🇪' },
    { code: 'ga', name: 'Gaeilge', flag: '🇮🇪' },
    { code: 'en-GB', name: 'English (UK)', flag: '🇬🇧' },
    { code: 'pl', name: 'Polski', flag: '🇵🇱' },
    { code: 'ro', name: 'Română', flag: '🇷🇴' },
    { code: 'es', name: 'Español', flag: '🇪🇸' },
    { code: 'pt', name: 'Português', flag: '🇵🇹' },
    { code: 'fr', name: 'Français', flag: '🇫🇷' },
    { code: 'de', name: 'Deutsch', flag: '🇩🇪' }
]

export default function LanguageSwitcher() {
    const [currentLang, setCurrentLang] = useState('en')
    const [isOpen, setIsOpen] = useState(false)

    const handleLanguageChange = (langCode: string) => {
        setCurrentLang(langCode)
        setIsOpen(false)

        // Use Google Translate for automatic translation
        const googleTranslateElement = document.querySelector('.goog-te-combo') as HTMLSelectElement
        if (googleTranslateElement) {
            googleTranslateElement.value = langCode
            googleTranslateElement.dispatchEvent(new Event('change'))
        } else {
            // Initialize Google Translate if not already loaded
            initGoogleTranslate(langCode)
        }
    }

    const initGoogleTranslate = (targetLang: string) => {
        // Add Google Translate script if not present
        if (!document.getElementById('google-translate-script')) {
            const script = document.createElement('script')
            script.id = 'google-translate-script'
            script.src = '//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit'
            document.body.appendChild(script)

            // @ts-ignore - Google Translate global
            window.googleTranslateElementInit = function () {
                // @ts-ignore - Google Translate API
                new window.google.translate.TranslateElement(
                    {
                        pageLanguage: 'en',
                        includedLanguages: 'en,ga,pl,ro,es,pt,fr,de',
                        autoDisplay: false
                    },
                    'google_translate_element'
                )

                // Auto-select the target language after initialization
                setTimeout(() => {
                    const selectElement = document.querySelector('.goog-te-combo') as HTMLSelectElement
                    if (selectElement && targetLang !== 'en') {
                        selectElement.value = targetLang
                        selectElement.dispatchEvent(new Event('change'))
                    }
                }, 1000)
            }
        }
    }

    const currentLanguage = languages.find(lang => lang.code === currentLang) || languages[0]

    return (
        <div className="relative">
            {/* Hidden Google Translate Element */}
            <div id="google_translate_element" className="hidden"></div>

            {/* Custom Language Selector */}
            <div className="relative">
                <motion.button
                    onClick={() => setIsOpen(!isOpen)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white border-2 border-gray-200 hover:border-blue-500 transition-all shadow-sm"
                >
                    <span className="text-2xl">{currentLanguage.flag}</span>
                    <span className="hidden md:inline text-sm font-medium text-gray-700">
                        {currentLanguage.name}
                    </span>
                    <svg
                        className={`w-4 h-4 text-gray-600 transition-transform ${isOpen ? 'rotate-180' : ''}`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                </motion.button>

                {/* Dropdown Menu */}
                <AnimatePresence>
                    {isOpen && (
                        <motion.div
                            initial={{ opacity: 0, y: -10, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: -10, scale: 0.95 }}
                            transition={{ duration: 0.2 }}
                            className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-2xl border-2 border-gray-100 overflow-hidden z-50"
                        >
                            <div className="py-2">
                                {languages.map((lang) => (
                                    <button
                                        key={lang.code}
                                        onClick={() => handleLanguageChange(lang.code)}
                                        className={`w-full flex items-center gap-3 px-4 py-3 hover:bg-blue-50 transition-colors ${currentLang === lang.code ? 'bg-blue-50 border-l-4 border-blue-600' : ''
                                            }`}
                                    >
                                        <span className="text-2xl">{lang.flag}</span>
                                        <span className="text-sm font-medium text-gray-700">{lang.name}</span>
                                        {currentLang === lang.code && (
                                            <span className="ml-auto text-blue-600">✓</span>
                                        )}
                                    </button>
                                ))}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Hide Google Translate Bar */}
            <style jsx global>{`
        .goog-te-banner-frame,
        .goog-te-balloon-frame,
        .goog-logo-link,
        .goog-te-gadget {
          display: none !important;
        }
        body {
          top: 0 !important;
        }
        .skiptranslate {
          display: none !important;
        }
        #google_translate_element {
          display: none;
        }
      `}</style>
        </div>
    )
}
