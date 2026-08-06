import { createContext, useCallback, useMemo, useState } from "react";
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { db } from "../services/firebaseConnection";

interface AutoresContextProps {
  children: React.ReactNode;
}

type AutoresContextType = {
  autores: string[];
  loadAutores: () => Promise<void>;
};

export const AutoresContext = createContext<AutoresContextType>({} as AutoresContextType);

export const AutoresProvider = ({ children }: AutoresContextProps) => {
  const [autores, setAutores] = useState<string[]>([]);

  const loadAutores = useCallback(async () => {
    try {
      const consulta = query(collection(db, "autores"), orderBy("nome", "asc"));
      const resultado = await getDocs(consulta);
      setAutores(resultado.docs.map((documento) => documento.data().nome as string));
    } catch (erro) {
      console.error("Erro ao carregar os autores:", erro);
    }
  }, []);

  const valor = useMemo(() => ({ autores, loadAutores }), [autores, loadAutores]);

  return <AutoresContext.Provider value={valor}>{children}</AutoresContext.Provider>;
};
