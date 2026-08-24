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
  { code: 'zh-CN', flag: '🇨🇳', name: '中文（简体）' },
  { code: 'zh-TW', flag: '🇹🇼', name: '中文（繁體）' },
  { code: 'ja', flag: '🇯🇵', name: '日本語' },
  { code: 'ko', flag: '🇰🇷', name: '한국어' },

  { code: 'af', flag: '🇿🇦', name: 'Afrikaans' },
  { code: 'sq', flag: '🇦🇱', name: 'Shqip' },
  { code: 'am', flag: '🇪🇹', name: 'አማርኛ' },
  { code: 'hy', flag: '🇦🇲', name: 'Հայերեն' },
  { code: 'az', flag: '🇦🇿', name: 'Azərbaycan' },
  { code: 'eu', flag: '🇪🇸', name: 'Euskara' },
  { code: 'be', flag: '🇧🇾', name: 'Беларуская' },
  { code: 'bn', flag: '🇧🇩', name: 'বাংলা' },
  { code: 'bs', flag: '🇧🇦', name: 'Bosanski' },
  { code: 'bg', flag: '🇧🇬', name: 'Български' },
  { code: 'ca', flag: '🇪🇸', name: 'Català' },
  { code: 'ceb', flag: '🇵🇭', name: 'Cebuano' },
  { code: 'ny', flag: '🇲🇼', name: 'Chichewa' },
  { code: 'co', flag: '🇫🇷', name: 'Corsu' },
  { code: 'hr', flag: '🇭🇷', name: 'Hrvatski' },
  { code: 'cs', flag: '🇨🇿', name: 'Čeština' },
  { code: 'da', flag: '🇩🇰', name: 'Dansk' },
  { code: 'eo', flag: '🌍', name: 'Esperanto' },
  { code: 'et', flag: '🇪🇪', name: 'Eesti' },
  { code: 'tl', flag: '🇵🇭', name: 'Filipino' },
  { code: 'fi', flag: '🇫🇮', name: 'Suomi' },
  { code: 'fy', flag: '🇳🇱', name: 'Frisian' },
  { code: 'gl', flag: '🇪🇸', name: 'Galego' },
  { code: 'ka', flag: '🇬🇪', name: 'ქართული' },
  { code: 'el', flag: '🇬🇷', name: 'Ελληνικά' },
  { code: 'gu', flag: '🇮🇳', name: 'ગુજરાતી' },
  { code: 'ht', flag: '🇭🇹', name: 'Kreyòl Ayisyen' },
  { code: 'ha', flag: '🇳🇬', name: 'Hausa' },
  { code: 'haw', flag: '🇺🇸', name: 'Hawaiian' },
  { code: 'he', flag: '🇮🇱', name: 'עברית' },
  { code: 'hmn', flag: '🌍', name: 'Hmong' },
  { code: 'hu', flag: '🇭🇺', name: 'Magyar' },
  { code: 'is', flag: '🇮🇸', name: 'Íslenska' },
  { code: 'ig', flag: '🇳🇬', name: 'Igbo' },
  { code: 'id', flag: '🇮🇩', name: 'Bahasa Indonesia' },
  { code: 'ga', flag: '🇮🇪', name: 'Gaeilge' },
  { code: 'jw', flag: '🇮🇩', name: 'Javanese' },
  { code: 'kn', flag: '🇮🇳', name: 'ಕನ್ನಡ' },
  { code: 'kk', flag: '🇰🇿', name: 'Қазақша' },
  { code: 'km', flag: '🇰🇭', name: 'ខ្មែរ' },
  { code: 'rw', flag: '🇷🇼', name: 'Kinyarwanda' },
  { code: 'ky', flag: '🇰🇬', name: 'Кыргызча' },
  { code: 'lo', flag: '🇱🇦', name: 'ລາວ' },
  { code: 'la', flag: '🇻🇦', name: 'Latin' },
  { code: 'lv', flag: '🇱🇻', name: 'Latviešu' },
  { code: 'lt', flag: '🇱🇹', name: 'Lietuvių' },
  { code: 'lb', flag: '🇱🇺', name: 'Lëtzebuergesch' },
  { code: 'mk', flag: '🇲🇰', name: 'Македонски' },
  { code: 'mg', flag: '🇲🇬', name: 'Malagasy' },
  { code: 'ms', flag: '🇲🇾', name: 'Bahasa Melayu' },
  { code: 'ml', flag: '🇮🇳', name: 'മലയാളം' },
  { code: 'mt', flag: '🇲🇹', name: 'Malti' },
  { code: 'mi', flag: '🇳🇿', name: 'Māori' },
  { code: 'mr', flag: '🇮🇳', name: 'मराठी' },
  { code: 'mn', flag: '🇲🇳', name: 'Монгол' },
  { code: 'my', flag: '🇲🇲', name: 'မြန်မာ' },
  { code: 'ne', flag: '🇳🇵', name: 'नेपाली' },
  { code: 'no', flag: '🇳🇴', name: 'Norsk' },
  { code: 'or', flag: '🇮🇳', name: 'ଓଡ଼ିଆ' },
  { code: 'ps', flag: '🇦🇫', name: 'پښتو' },
  { code: 'fa', flag: '🇮🇷', name: 'فارسی' },
  { code: 'pa', flag: '🇮🇳', name: 'ਪੰਜਾਬੀ' },
  { code: 'sm', flag: '🇼🇸', name: 'Samoan' },
  { code: 'gd', flag: '🏴', name: 'Scots Gaelic' },
  { code: 'sr', flag: '🇷🇸', name: 'Српски' },
  { code: 'st', flag: '🇱🇸', name: 'Sesotho' },
  { code: 'sn', flag: '🇿🇼', name: 'Shona' },
  { code: 'sd', flag: '🇵🇰', name: 'سنڌي' },
  { code: 'si', flag: '🇱🇰', name: 'සිංහල' },
  { code: 'sk', flag: '🇸🇰', name: 'Slovenčina' },
  { code: 'sl', flag: '🇸🇮', name: 'Slovenščina' },
  { code: 'so', flag: '🇸🇴', name: 'Soomaali' },
  { code: 'su', flag: '🇮🇩', name: 'Sundanese' },
  { code: 'sw', flag: '🇰🇪', name: 'Kiswahili' },
  { code: 'sv', flag: '🇸🇪', name: 'Svenska' },
  { code: 'tg', flag: '🇹🇯', name: 'Тоҷикӣ' },
  { code: 'ta', flag: '🇮🇳', name: 'தமிழ்' },
  { code: 'tt', flag: '🇷🇺', name: 'Татарча' },
  { code: 'te', flag: '🇮🇳', name: 'తెలుగు' },
  { code: 'th', flag: '🇹🇭', name: 'ไทย' },
  { code: 'tk', flag: '🇹🇲', name: 'Türkmençe' },
  { code: 'uk', flag: '🇺🇦', name: 'Українська' },
  { code: 'ur', flag: '🇵🇰', name: 'اردو' },
  { code: 'ug', flag: '🇨🇳', name: 'ئۇيغۇرچە' },
  { code: 'uz', flag: '🇺🇿', name: 'O‘zbekcha' },
  { code: 'vi', flag: '🇻🇳', name: 'Tiếng Việt' },
  { code: 'cy', flag: '🏴', name: 'Cymraeg' },
  { code: 'xh', flag: '🇿🇦', name: 'isiXhosa' },
  { code: 'yi', flag: '🌍', name: 'Yiddish' },
  { code: 'yo', flag: '🇳🇬', name: 'Yorùbá' },
  { code: 'zu', flag: '🇿🇦', name: 'isiZulu' },
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