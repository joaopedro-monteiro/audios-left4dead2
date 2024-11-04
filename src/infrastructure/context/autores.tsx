import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { createContext, useEffect, useState } from "react";
import { db } from "../services/firebaseConnection";

interface AutoresContextProps {
  children: React.ReactNode;
}

type AutoresContextType = {
  autores: string[];
  loadAutores: () => Promise<void>;
};

export const AutoresContext = createContext<AutoresContextType>(
  {} as AutoresContextType
);

export const AutoresProvider = ({ children }: AutoresContextProps) => {
  const [autores, setAutores] = useState<string[]>([]);

  async function loadAutores() {
    const q = query(collection(db, "autores"), orderBy("nome", "asc"));

    const querySnapshot = await getDocs(q);
    setAutores([]);

    let listaAutores: string[] = [];

    querySnapshot.forEach((doc) => {
      listaAutores.push(doc.data().nome);
    });

    setAutores((autores) => [...autores, ...listaAutores]);
    console.log("Autores carregados: ", autores);
  }

  return (
    <AutoresContext.Provider value={{ autores, loadAutores }}>
      {children}
    </AutoresContext.Provider>
  );
};
