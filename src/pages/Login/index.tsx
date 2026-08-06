import { useContext, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { AuthContext } from "../../infrastructure/context/auth";
import { BrandMark, IconLock, IconMail } from "../../components/Icons";
import "./login.css";

export default function Login(): JSX.Element {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [entrando, setEntrando] = useState(false);

  const { signIn } = useContext(AuthContext);

  const aoEnviar = async (evento: React.FormEvent) => {
    evento.preventDefault();
    if (!email.trim() || !senha) {
      toast.error("Preencha e-mail e senha.");
      return;
    }

    setEntrando(true);
    try {
      await signIn(email.trim(), senha);
    } finally {
      setEntrando(false);
    }
  };

  return (
    <div className="login">
      <form className="login__cartao" onSubmit={aoEnviar}>
        <BrandMark size={56} />
        <div className="login__cabecalho">
          <h1>Área da administração</h1>
          <p>Entre para adicionar, editar e remover áudios.</p>
        </div>

        <label className="login__campo">
          <span className="sr-only">E-mail</span>
          <IconMail size={18} />
          <input
            type="email"
            inputMode="email"
            autoComplete="email"
            placeholder="E-mail"
            value={email}
            onChange={(evento) => setEmail(evento.target.value)}
            disabled={entrando}
          />
        </label>

        <label className="login__campo">
          <span className="sr-only">Senha</span>
          <IconLock size={18} />
          <input
            type="password"
            autoComplete="current-password"
            placeholder="Senha"
            value={senha}
            onChange={(evento) => setSenha(evento.target.value)}
            disabled={entrando}
          />
        </label>

        <button type="submit" className="btn btn--primary btn--block" disabled={entrando}>
          {entrando ? <span className="btn-spinner" /> : null}
          {entrando ? "Entrando..." : "Entrar"}
        </button>

        <Link to="/" className="login__voltar">
          Voltar para os áudios
        </Link>
      </form>
    </div>
  );
}
