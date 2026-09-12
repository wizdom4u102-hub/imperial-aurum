"use client";

interface CopyReferralButtonProps {
  referralLink: string;
}

export default function CopyReferralButton({
  referralLink,
}: CopyReferralButtonProps) {
  const handleCopy = async () => {
    if (!referralLink) {
      return;
    }

    try {
      await navigator.clipboard.writeText(referralLink);
    } catch (error) {
      console.error("Failed to copy referral link:", error);
    }
  };

  return (
    <button
      type="button"
      onClick={handleCopy}
      className="bg-yellow-500 hover:bg-yellow-400 text-black px-5 py-3 rounded-xl font-bold"
    >
      Copy Referral Link
    </button>
  );
}