'use client'

import { useEffect, useState } from 'react'

export default function CookieBanner() {
  const [show, setShow] = useState(false)

  useEffect(() => {
    const accepted = localStorage.getItem('cookie-consent')

    if (!accepted) {
      setShow(true)
    }
  }, [])

  function acceptCookies() {
    localStorage.setItem('cookie-consent', 'accepted')
    setShow(false)
  }

  if (!show) return null

  return (
    <div
      className="
        fixed
        bottom-4
        left-1/2
        -translate-x-1/2
        z-[99999]
        max-w-xl
        rounded-2xl
        bg-zinc-900
        border
        border-yellow-500
        p-5
        shadow-2xl
      "
    >
      <p className="text-sm text-white leading-6">
        🍪 We use cookies and similar technologies to improve your
        experience, analyze website traffic, and provide customer support.
        By continuing to use Imperial Aurum, you agree to our use of
        cookies.
      </p>

      <button
        onClick={acceptCookies}
        className="
          mt-4
          w-full
          rounded-lg
          bg-yellow-500
          py-2
          font-semibold
          text-black
          hover:bg-yellow-400
        "
      >
        Accept Cookies
      </button>
    </div>
  )
}