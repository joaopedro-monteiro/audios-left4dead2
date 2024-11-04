import { signInWithEmailAndPassword, signOut } from "firebase/auth";
import { createContext, useEffect, useState } from "react";
import { auth, db } from "../services/firebaseConnection";
import { doc, getDoc } from "firebase/firestore";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";


interface AuthContextProps {
    children: React.ReactNode;
}

interface AuthContextType {
    signed: boolean;
    user: any;
    signIn: (email: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
}

type DataUser = {
    uid: string;
    email: string | null;
    nome: string;
}
export const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const AuthProvider = ({children}: AuthContextProps) => {
    const [user, setUser] = useState<any>({});
    const [signed, setSigned] = useState<boolean>(false);

    const navigate = useNavigate();

    useEffect(() => {
        async function loadUser() {
            const userStorage = localStorage.getItem("@audiosL4D2:user");
            if(userStorage) {
                setUser(JSON.parse(userStorage));
                console.log("User: ", user);
                console.log("UserStorage: ", userStorage);
                console.log("Signed?", signed)
            }            
        }
        loadUser();
    }, []);

    async function signIn(email: string, password: string) {
        await signInWithEmailAndPassword(auth, email, password)
        .then(async(value) => {
            let uid = value.user.uid;
            const docRef = doc(db, "users", uid);
            const docSnap = await getDoc(docRef);          

            let data: DataUser = {
                uid: uid,
                email: value.user.email,
                nome: docSnap.data()?.nome,
            }

            setUser(data);
            storageUser(data);
            // setSigned(true);
            toast.success("Login efetuado com sucesso");
            navigate("/");
        })
        .catch((error) => {
            console.log(error);
            toast.error("Email ou senha inválidos");
        });
    }

    function storageUser(data: DataUser) {
        localStorage.setItem("@audiosL4D2:user", JSON.stringify(data));
      }

      async function logout(){
        await signOut(auth);
        localStorage.removeItem("@audiosL4D2:user");
        setUser(null);        
        setSigned(false);
        toast.success("Logout efetuado com sucesso");
      }

    return (
        <AuthContext.Provider value={{
            signed: !!user,
            user,
            signIn,
            logout
        }}>
            {children}
        </AuthContext.Provider>
    );
}