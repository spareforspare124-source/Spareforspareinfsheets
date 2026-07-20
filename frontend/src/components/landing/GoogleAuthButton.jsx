import React, { useEffect, useRef } from 'react';

/*
 * "Continue with Google" using Google Identity Services.
 *
 * To turn it on, create a Google OAuth client ID in the Google Cloud
 * Console and set REACT_APP_GOOGLE_CLIENT_ID (frontend) + GOOGLE_CLIENT_ID
 * (backend). While unset, a styled button still renders and calls
 * onUnavailable() so the layout is ready and nothing looks broken.
 */
const CLIENT_ID = (process.env.REACT_APP_GOOGLE_CLIENT_ID || '').trim();
const GIS_SRC = 'https://accounts.google.com/gsi/client';

function loadGis() {
  return new Promise((resolve, reject) => {
    if (window.google?.accounts?.id) { resolve(); return; }
    let s = document.querySelector(`script[src="${GIS_SRC}"]`);
    if (s) { s.addEventListener('load', resolve); s.addEventListener('error', reject); return; }
    s = document.createElement('script');
    s.src = GIS_SRC; s.async = true; s.defer = true;
    s.onload = resolve; s.onerror = reject;
    document.head.appendChild(s);
  });
}

function GoogleG() {
  return (
    <svg className="w-5 h-5" viewBox="0 0 48 48" aria-hidden="true">
      <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
      <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
      <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
      <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
    </svg>
  );
}

export default function GoogleAuthButton({ onCredential, onError, onUnavailable, label = 'Continue with Google' }) {
  const holderRef = useRef(null);
  const cbRef = useRef(onCredential);
  cbRef.current = onCredential;

  useEffect(() => {
    if (!CLIENT_ID) return;
    let cancelled = false;
    loadGis().then(() => {
      if (cancelled || !window.google?.accounts?.id || !holderRef.current) return;
      window.google.accounts.id.initialize({
        client_id: CLIENT_ID,
        callback: (resp) => { if (resp?.credential) cbRef.current?.(resp.credential); },
      });
      holderRef.current.innerHTML = '';
      window.google.accounts.id.renderButton(holderRef.current, {
        theme: 'outline', size: 'large', text: 'continue_with', shape: 'pill',
        logo_alignment: 'left', width: 320,
      });
    }).catch(() => onError?.('Could not load Google sign-in.'));
    return () => { cancelled = true; };
  }, [onError]);

  // Configured: Google renders its official (trusted) button into this slot.
  if (CLIENT_ID) {
    return <div ref={holderRef} className="flex justify-center min-h-[44px]" data-testid="google-auth" />;
  }

  // Dormant: styled button so the layout is complete before a client ID exists.
  return (
    <button
      type="button"
      onClick={() => onUnavailable?.()}
      data-testid="google-auth"
      className="w-full inline-flex items-center justify-center gap-3 py-3 rounded-lg bg-white text-slate-700 text-[14px] font-medium border border-slate-200 hover:bg-slate-50 transition-colors"
    >
      <GoogleG /> {label}
    </button>
  );
}
