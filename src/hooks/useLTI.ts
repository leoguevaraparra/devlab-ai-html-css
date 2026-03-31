/// <reference types="vite/client" />
import { useState, useEffect } from 'react';
import { LtiUser, LtiContext } from '../types';

/** URL base del backend LTI. */
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

/** Forma esperada de la respuesta del endpoint /api/me. */
interface MeApiResponse {
  success: boolean;
  user: LtiUser;
  context: LtiContext;
  error?: string;
}

/**
 * Hook que gestiona el ciclo de vida completo de la sesión LTI 1.3.
 *
 * ## Flujo:
 * 1. Al montar, busca el token `ltik` en la URL (inyectado por el backend
 *    tras el handshake OIDC con Moodle) o en `sessionStorage` (recargas).
 * 2. Si hay un token nuevo en la URL, lo persiste en `sessionStorage`
 *    y limpia la URL para evitar exposición y bugs de navegación.
 * 3. Valida el token contra `/api/me` para obtener el contexto del estudiante.
 * 4. En modo standalone (sin `ltik`), finaliza sin error — la app opera normal.
 */
export function useLTI() {
  const [ltiUser, setLtiUser] = useState<LtiUser | null>(null);
  const [ltiContext, setLtiContext] = useState<LtiContext | null>(null);
  const [isValidating, setIsValidating] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // 1. Buscar el token en URL o en sessionStorage
    const urlParams = new URLSearchParams(window.location.search);
    const ltikFromUrl = urlParams.get('ltik');
    const ltik = ltikFromUrl || sessionStorage.getItem('ltik');

    if (ltikFromUrl) {
      // Persistir el token para sobrevivir recargas dentro del iframe de Moodle
      sessionStorage.setItem('ltik', ltikFromUrl);
      // Limpiar la URL de forma silenciosa (sin recargar la página)
      window.history.replaceState({}, document.title, window.location.pathname);
    }

    if (!ltik) {
      // Modo standalone — sin contexto LTI, la app funciona normalmente
      setIsValidating(false);
      return;
    }

    // 2. Validar el token y obtener el perfil del estudiante
    const validateToken = async () => {
      try {
        const response = await fetch(`${API_URL}/api/me`, {
          headers: { Authorization: `Bearer ${ltik}` },
        });

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: Token LTIK inválido o expirado.`);
        }

        const data: MeApiResponse = await response.json();

        if (data.success) {
          setLtiUser(data.user);
          setLtiContext(data.context);
        } else {
          throw new Error(data.error || 'Error desconocido al validar el token LTI.');
        }
      } catch (err: unknown) {
        const message =
          err instanceof Error ? err.message : 'Error de conexión con el servidor LTI.';
        setError(message);
        console.error('[LTI] Error de validación:', message);
      } finally {
        setIsValidating(false);
      }
    };

    validateToken();
  }, []);

  return {
    ltiUser,
    ltiContext,
    isValidating,
    error,
    /** `true` si el estudiante está autenticado vía Moodle LTI. */
    hasLti: !!ltiUser,
  };
}
