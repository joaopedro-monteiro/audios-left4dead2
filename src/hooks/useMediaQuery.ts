import { useEffect, useState } from "react";

/**
 * Acompanha uma media query em tempo real (inclusive quando o usuário gira o
 * celular ou redimensiona a janela).
 */
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState<boolean>(
    () => typeof window !== "undefined" && window.matchMedia(query).matches
  );

  useEffect(() => {
    const mediaQuery = window.matchMedia(query);
    const onChange = (event: MediaQueryListEvent) => setMatches(event.matches);

    setMatches(mediaQuery.matches);
    mediaQuery.addEventListener("change", onChange);
    return () => mediaQuery.removeEventListener("change", onChange);
  }, [query]);

  return matches;
}

export const useIsMobile = (): boolean => useMediaQuery("(max-width: 767px)");
