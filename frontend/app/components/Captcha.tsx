"use client";

import { useRef } from "react";
import ReCAPTCHA from "react-google-recaptcha";

interface CaptchaProps {
  onChange: (token: string | null) => void;
  onExpired?: () => void;
  onError?: () => void;
}

export default function Captcha({ onChange, onExpired, onError }: CaptchaProps) {
  const recaptchaRef = useRef<ReCAPTCHA>(null);
  const siteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || "";

  // If no site key is provided, return null (CAPTCHA won't render)
  if (!siteKey) {
    console.warn("reCAPTCHA site key not found. Please set NEXT_PUBLIC_RECAPTCHA_SITE_KEY in your environment variables.");
    return null;
  }

  const handleExpired = () => {
    if (onExpired) {
      onExpired();
    }
    // Reset CAPTCHA
    if (recaptchaRef.current) {
      recaptchaRef.current.reset();
    }
  };

  const handleError = () => {
    if (onError) {
      onError();
    }
  };

  return (
    <div className="flex justify-center my-4">
      <ReCAPTCHA
        ref={recaptchaRef}
        sitekey={siteKey}
        onChange={onChange}
        onExpired={handleExpired}
        onError={handleError}
        theme="light"
      />
    </div>
  );
}

