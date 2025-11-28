"use client";

import { useEffect, useCallback } from 'react';
import { GoogleOAuthProvider, useGoogleOneTapLogin } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode';
import { toast } from 'sonner';

interface GoogleUser {
  email: string;
  name: string;
  picture: string;
  sub: string;
}

function OneTapLogin() {
  const handleSuccess = useCallback(async (credentialResponse: any) => {
    try {
      const decoded = jwtDecode<GoogleUser>(credentialResponse.credential);
      
      // Send to backend for authentication
      const res = await fetch('/api/auth/google', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          token: credentialResponse.credential,
          user: {
            email: decoded.email,
            name: decoded.name,
            avatar: decoded.picture,
            google_id: decoded.sub,
          }
        }),
      });

      const data = await res.json();

      if (res.ok) {
        // Store user session
        localStorage.setItem('user', JSON.stringify(data.user));
        
        // Trigger custom event for other components to react
        window.dispatchEvent(new CustomEvent('user-signed-in', { detail: data.user }));
        
        // Silent success - no toast notification for auto sign-in
        console.log('User signed in:', data.user.name);
      } else {
        console.error('Sign-in failed:', data.error);
      }
    } catch (error) {
      console.error('One Tap error:', error);
    }
  }, []);

  useGoogleOneTapLogin({
    onSuccess: handleSuccess,
    onError: () => {
      console.log('One Tap Login Failed');
    },
    auto_select: true, // Auto-select user without clicking
    cancel_on_tap_outside: false,
    use_fedcm_for_prompt: true, // Use modern FedCM API
  });

  return null; // No UI component
}

export default function GoogleOneTap() {
  const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;

  // Don't render if no client ID configured
  if (!clientId) {
    console.warn('Google Client ID not configured. Add NEXT_PUBLIC_GOOGLE_CLIENT_ID to .env.local');
    return null;
  }

  return (
    <GoogleOAuthProvider clientId={clientId}>
      <OneTapLogin />
    </GoogleOAuthProvider>
  );
}
