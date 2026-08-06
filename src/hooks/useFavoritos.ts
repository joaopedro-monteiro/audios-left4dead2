import { useCallback, useEffect, useState } from "react";

const CHAVE = "@audiosL4D2:favoritos";

function carregar(): string[] {
  try {
    const salvos = localStorage.getItem(CHAVE);
    const lista = salvos ? JSON.parse(salvos) : [];
    return Array.isArray(lista) ? lista.filter((id) => typeof id === "string") : [];
  } catch {
    return [];
  }
}

/** Favoritos ficam só no dispositivo (localStorage), sem precisar de login. */
export function useFavoritos() {
  const [favoritos, setFavoritos] = useState<string[]>(carregar);

  useEffect(() => {
    try {
      localStorage.setItem(CHAVE, JSON.stringify(favoritos));
    } catch {
      /* modo privado / storage cheio: favoritos apenas nesta sessão */
    }
  }, [favoritos]);

  const alternarFavorito = useCallback((id: string) => {
    setFavoritos((atuais) =>
      atuais.includes(id) ? atuais.filter((item) => item !== id) : [...atuais, id]
    );
  }, []);

  const ehFavorito = useCallback((id: string) => favoritos.includes(id), [favoritos]);

  return { favoritos, alternarFavorito, ehFavorito, totalFavoritos: favoritos.length };
}
