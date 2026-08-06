import { createContext, useCallback, useContext, useMemo, useState } from "react";

type PlayerContextType = {
  /** Id do áudio que está tocando agora (ou null). */
  faixaAtual: string | null;
  iniciarReproducao: (id: string) => void;
  pararReproducao: (id: string) => void;
};

export const PlayerContext = createContext<PlayerContextType>({
  faixaAtual: null,
  iniciarReproducao: () => undefined,
  pararReproducao: () => undefined,
});

/**
 * Garante que apenas um áudio toque por vez: cada player avisa quando começa e
 * os outros se pausam sozinhos ao ver que a faixa atual mudou.
 */
export const PlayerProvider = ({ children }: { children: React.ReactNode }) => {
  const [faixaAtual, setFaixaAtual] = useState<string | null>(null);

  const iniciarReproducao = useCallback((id: string) => setFaixaAtual(id), []);
  const pararReproducao = useCallback(
    (id: string) => setFaixaAtual((atual) => (atual === id ? null : atual)),
    []
  );

  const valor = useMemo(
    () => ({ faixaAtual, iniciarReproducao, pararReproducao }),
    [faixaAtual, iniciarReproducao, pararReproducao]
  );

  return <PlayerContext.Provider value={valor}>{children}</PlayerContext.Provider>;
};

export const usePlayer = (): PlayerContextType => useContext(PlayerContext);
