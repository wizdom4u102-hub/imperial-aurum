"use client";

import { useEffect, useState } from "react";

const messages = [
  "🇨🇦 John from Canada activated a Premium Plan.",
  "🇬🇧 Sarah from London earned today's mining reward.",
  "🇩🇪 Michael from Germany upgraded to Gold Plan.",
  "🇳🇬 David from Nigeria withdrew mining profits.",
  "🇦🇺 Emma from Australia joined Imperial Aurum.",
  "🇺🇸 Robert from USA referred 5 new members.",
  "🇮🇳 Rahul from India activated Shared Plan.",
  "🇫🇷 Lucas from France completed today's mining.",
  
  // New additions
  "RU Dima from Russia converted gold to cash.",
  "🇯🇵 Akira from Tokyo just hit a big mining streak.",
  "🇰🇪 Aisha from Kenya activated her first Gold Plan.",
  "🇲🇽 Diego from Mexico withdrew $1,240 in profits.",
  "🇮🇹 Sophia from Italy referred 3 new members today.",
  "🇵🇭 Maria from Philippines completed daily mining.",
  "🇪🇸 Carlos from Spain upgraded to Premium Plan.",
  "🇹🇷 Ahmet from Turkey joined the Imperial Aurum community.",
  "🇨🇳 Li Wei from China earned a massive reward boost.",
  "🇿🇦 Thabo from South Africa converted gold to cash.",
  "🇰🇷 Ji-hoon from Seoul activated Shared Mining Plan.",
  "🇦🇷 Valentina from Argentina withdrew mining profits.",
  "🇳🇱 Lars from Netherlands referred 7 new users.",
  "🇸🇦 Fatima from Saudi Arabia completed today's mining session.",
  "🇷🇺 Ivan from Russia upgraded to Gold Plan.",
  "🇲🇾 Wei from Malaysia just joined Imperial Aurum.",
  "🇵🇰 Hassan from Pakistan converted gold to cash.",
  "🇨🇱 Isabella from Chile earned today's top reward.",
  "🇧🇷 Dima from Brazil converted gold to cash.",
];

export default function LiveTicker() {

  const [index, setIndex] = useState(0);

  useEffect(() => {

    const timer = setInterval(() => {

      setIndex((prev) => (prev + 1) % messages.length);

    }, 3500);

    return () => clearInterval(timer);

  }, []);

  return (

    <div className="bg-yellow-500 text-black py-3 overflow-hidden">

      <div className="max-w-7xl mx-auto px-6">

        <p className="font-semibold animate-pulse">

          🔴 Live Activity

          <span className="ml-4">

            {messages[index]}

          </span>

        </p>

      </div>

    </div>

  );

}