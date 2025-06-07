// ===================================================================
// HOOKS UTILITÁRIOS - PERFORMANCE E USABILIDADE
// ===================================================================

import { useState, useEffect, useRef, useCallback } from 'react';
import { UI_CONFIG } from '../constants';

/**
 * Hook para debounce de valores
 */
export function useDebounce<T>(value: T, delay: number = UI_CONFIG.DEBOUNCE_DELAY): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = window.setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

/**
 * Hook para debounce de funções
 */
export function useDebouncedCallback<T extends (...args: any[]) => any>(
  callback: T,
  delay: number = UI_CONFIG.DEBOUNCE_DELAY
): T {
  const callbackRef = useRef<T>(callback);
  const timeoutRef = useRef<number | undefined>(undefined);

  // Atualizar callback ref quando callback mudar
  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  const debouncedCallback = useCallback(
    (...args: Parameters<T>) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      timeoutRef.current = window.setTimeout(() => {
        callbackRef.current(...args);
      }, delay);
    },
    [delay]
  );

  return debouncedCallback as T;
}

/**
 * Hook para auto-hide de notificações
 */
export function useAutoHide(
  isVisible: boolean,
  duration: number = UI_CONFIG.AUTO_HIDE_DELAY
): {
  shouldShow: boolean;
  hide: () => void;
} {
  const [shouldShow, setShouldShow] = useState(isVisible);
  const timeoutRef = useRef<number | undefined>(undefined);

  const hide = useCallback(() => {
    setShouldShow(false);
  }, []);

  useEffect(() => {
    if (isVisible) {
      setShouldShow(true);
      
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      
      timeoutRef.current = window.setTimeout(() => {
        setShouldShow(false);
      }, duration);
    } else {
      setShouldShow(false);
    }

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [isVisible, duration]);

  return { shouldShow, hide };
}

/**
 * Hook para detectar clique fora do elemento
 */
export function useClickOutside<T extends HTMLElement>(
  callback: () => void
): React.RefObject<T | null> {
  const ref = useRef<T | null>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        callback();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [callback]);

  return ref;
}

/**
 * Hook para detectar se é mobile
 */
export function useIsMobile(): boolean {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth <= UI_CONFIG.MAX_MOBILE_WIDTH);
    };

    checkIsMobile();
    window.addEventListener('resize', checkIsMobile);

    return () => {
      window.removeEventListener('resize', checkIsMobile);
    };
  }, []);

  return isMobile;
}

/**
 * Hook para persistir estado no localStorage
 */
export function useLocalStorage<T>(
  key: string,
  initialValue: T
): [T, (value: T | ((val: T) => T)) => void] {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.warn(`Erro ao ler localStorage para chave "${key}":`, error);
      return initialValue;
    }
  });

  const setValue = useCallback(
    (value: T | ((val: T) => T)) => {
      try {
        const valueToStore = value instanceof Function ? value(storedValue) : value;
        setStoredValue(valueToStore);
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
      } catch (error) {
        console.error(`Erro ao salvar no localStorage para chave "${key}":`, error);
      }
    },
    [key, storedValue]
  );

  return [storedValue, setValue];
}

/**
 * Hook para throttle de funções
 */
export function useThrottle<T extends (...args: any[]) => any>(
  callback: T,
  delay: number
): T {
  const lastCallRef = useRef<number>(0);
  const callbackRef = useRef<T>(callback);

  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  const throttledCallback = useCallback(
    (...args: Parameters<T>) => {
      const now = Date.now();
      if (now - lastCallRef.current >= delay) {
        lastCallRef.current = now;
        return callbackRef.current(...args);
      }
    },
    [delay]
  );

  return throttledCallback as T;
}

/**
 * Hook para scroll para elemento
 */
export function useScrollToElement(): (
  elementId: string,
  behavior?: ScrollBehavior,
  block?: ScrollLogicalPosition
) => void {
  return useCallback((elementId: string, behavior = 'smooth', block = 'start') => {
    const element = document.getElementById(elementId);
    if (element) {
      element.scrollIntoView({ behavior, block });
    }
  }, []);
}

/**
 * Hook para copy to clipboard
 */
export function useCopyToClipboard(): {
  copyToClipboard: (text: string) => Promise<boolean>;
  isCopied: boolean;
} {
  const [isCopied, setIsCopied] = useState(false);

  const copyToClipboard = useCallback(async (text: string): Promise<boolean> => {
    try {
      await navigator.clipboard.writeText(text);
      setIsCopied(true);
      window.setTimeout(() => setIsCopied(false), 2000);
      return true;
    } catch (error) {
      console.error('Erro ao copiar para clipboard:', error);
      setIsCopied(false);
      return false;
    }
  }, []);

  return { copyToClipboard, isCopied };
}

/**
 * Hook para controle de loading states
 */
export function useAsyncOperation(): {
  isLoading: boolean;
  error: string | null;
  execute: <T>(operation: () => Promise<T>) => Promise<T | null>;
  reset: () => void;
} {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const execute = useCallback(async <T>(operation: () => Promise<T>): Promise<T | null> => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await operation();
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro desconhecido';
      setError(errorMessage);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const reset = useCallback(() => {
    setIsLoading(false);
    setError(null);
  }, []);

  return { isLoading, error, execute, reset };
} 