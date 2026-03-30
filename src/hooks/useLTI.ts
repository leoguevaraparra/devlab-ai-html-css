/// <reference types="vite/client" />
import { useState, useEffect } from 'react';

// The URL of our backend where LTI operates.
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

export function useLTI() {
  const [ltiContext, setLtiContext] = useState<any>(null);
  const [ltiUser, setLtiUser] = useState<any>(null);
  const [isValidating, setIsValidating] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // 1. Check URL parameters for ltik
    const urlParams = new URLSearchParams(window.location.search);
    const ltikFromUrl = urlParams.get('ltik');
    let ltik = ltikFromUrl || sessionStorage.getItem('ltik');

    if (ltikFromUrl) {
      // Guardar en sessionStorage para aguantar recargas (iframes refrescan mucho)
      sessionStorage.setItem('ltik', ltikFromUrl);
      
      // Limpiar URL para no dejar el token visualmente expuesto ni causar bugs al navegar
      window.history.replaceState({}, document.title, window.location.pathname);
    }

    if (!ltik) {
      setIsValidating(false);
      return; // No hay conexión LTI
    }

    // 2. Validate token and get user context from backend
    const validateToken = async () => {
      try {
        const response = await fetch(`${API_URL}/api/me`, {
          headers: {
            'Authorization': `Bearer ${ltik}`
          }
        });

        if (!response.ok) {
          throw new Error('Token LTIK inválido o expirado.');
        }

        const data = await response.json();
        if (data.success) {
          setLtiUser(data.user);
          setLtiContext(data.context);
        } else {
          throw new Error(data.error || 'Error al validar.');
        }
      } catch (err: any) {
        setError(err.message);
        console.error('LTI Validation error:', err);
      } finally {
        setIsValidating(false);
      }
    };

    validateToken();

  }, []);

  return { ltiContext, ltiUser, isValidating, error, hasLti: !!ltiUser };
}
