import { createContext, useCallback, useMemo, useState } from "react";
import { signInWithEmailAndPassword, signOut } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { auth, db } from "../services/firebaseConnection";

const CHAVE_USUARIO = "@audiosL4D2:user";

interface AuthContextProps {
  children: React.ReactNode;
}

type DataUser = {
  uid: string;
  email: string | null;
  nome: string;
};

interface AuthContextType {
  signed: boolean;
  user: DataUser | null;
  signIn: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType>({} as AuthContextType);

function usuarioSalvo(): DataUser | null {
  try {
    const salvo = localStorage.getItem(CHAVE_USUARIO);
    return salvo ? (JSON.parse(salvo) as DataUser) : null;
  } catch {
    return null;
  }
}

export const AuthProvider = ({ children }: AuthContextProps) => {
  // Lido já na primeira renderização: assim uma rota privada não redireciona
  // por engano quando a página é recarregada com o usuário logado.
  const [user, setUser] = useState<DataUser | null>(usuarioSalvo);
  const navigate = useNavigate();

  const signIn = useCallback(
    async (email: string, password: string) => {
      try {
        const credencial = await signInWithEmailAndPassword(auth, email, password);
        const uid = credencial.user.uid;
        const documento = await getDoc(doc(db, "users", uid));

        const dados: DataUser = {
          uid,
          email: credencial.user.email,
          nome: documento.data()?.nome ?? "Admin",
        };

        setUser(dados);
        localStorage.setItem(CHAVE_USUARIO, JSON.stringify(dados));
        toast.success(`Bem-vindo, ${dados.nome}!`);
        navigate("/");
      } catch (erro) {
        console.error("Erro ao entrar:", erro);
        toast.error("E-mail ou senha inválidos.");
      }
    },
    [navigate]
  );

  const logout = useCallback(async () => {
    await signOut(auth);
    localStorage.removeItem(CHAVE_USUARIO);
    setUser(null);
    toast.success("Você saiu da conta.");
    navigate("/");
  }, [navigate]);

  const valor = useMemo<AuthContextType>(
    () => ({ signed: !!user, user, signIn, logout }),
    [user, signIn, logout]
  );

  return <AuthContext.Provider value={valor}>{children}</AuthContext.Provider>;
};
