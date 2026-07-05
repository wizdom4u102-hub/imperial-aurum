'use client'

const languages = [
  { code: 'en', flag: '🇺🇸', name: 'English' },
  { code: 'fr', flag: '🇫🇷', name: 'Français' },
  { code: 'de', flag: '🇩🇪', name: 'Deutsch' },
  { code: 'es', flag: '🇪🇸', name: 'Español' },
  { code: 'it', flag: '🇮🇹', name: 'Italiano' },
  { code: 'pt', flag: '🇵🇹', name: 'Português' },
  { code: 'nl', flag: '🇳🇱', name: 'Nederlands' },
  { code: 'pl', flag: '🇵🇱', name: 'Polski' },
  { code: 'ro', flag: '🇷🇴', name: 'Română' },
  { code: 'ru', flag: '🇷🇺', name: 'Русский' },
  { code: 'tr', flag: '🇹🇷', name: 'Türkçe' },
  { code: 'ar', flag: '🇸🇦', name: 'العربية' },
  { code: 'hi', flag: '🇮🇳', name: 'हिन्दी' },
  { code: 'zh-CN', flag: '🇨🇳', name: '中文' },
  { code: 'ja', flag: '🇯🇵', name: '日本語' },
  { code: 'ko', flag: '🇰🇷', name: '한국어' },
]

export default function LanguageSelector() {
  function changeLanguage(code: string) {
    if (code === 'en') {
      window.location.href = '/'
      return
    }

    const currentUrl = window.location.href

    window.location.href =
      `https://translate.google.com/translate?sl=en&tl=${code}&u=` +
      encodeURIComponent(currentUrl)
  }

  return (
    <div
      className="
      fixed
      bottom-6
      left-6
      z-[99999]
    "
    >
      <select
        defaultValue="en"
        onChange={(e) => changeLanguage(e.target.value)}
        className="
          bg-[#111]
          text-white
          border
          border-yellow-500
          rounded-xl
          px-4
          py-3
          shadow-2xl
          text-sm
          cursor-pointer
          min-w-[220px]
        "
      >
        {languages.map((lang) => (
          <option
            key={lang.code}
            value={lang.code}
          >
            {lang.flag} {lang.name}
          </option>
        ))}
      </select>
    </div>
  )
}