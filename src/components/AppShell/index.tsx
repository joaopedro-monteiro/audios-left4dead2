import React, { useContext } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Tooltip } from "antd";
import { AuthContext } from "../../infrastructure/context/auth";
import { BotaoInstalar, BannerInstalar } from "../InstalarApp";
import { BrandMark, IconLogout, IconPlus, IconWave } from "../Icons";
import "./app-shell.css";

interface AppShellProps {
  children: React.ReactNode;
  /** Usado no título da aba e como fallback de acessibilidade. */
  tituloDaPagina: string;
}

const AppShell: React.FC<AppShellProps> = ({ children, tituloDaPagina }) => {
  const { user, signed, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const { pathname } = useLocation();

  React.useEffect(() => {
    document.title = `${tituloDaPagina} · L4D2 Áudios`;
  }, [tituloDaPagina]);

  return (
    <div className="app-shell">
      <a className="pular-link" href="#conteudo">
        Pular para o conteúdo
      </a>

      <header className="app-header">
        <div className="container app-header__inner">
          <Link to="/" className="marca" aria-label="L4D2 Áudios — início">
            <BrandMark size={30} className="marca__simbolo" />
            <span className="marca__texto">
              L4D2 <span>ÁUDIOS</span>
            </span>
          </Link>

          <nav className="app-header__acoes" aria-label="Ações">
            <BotaoInstalar />

            {signed && (
              <>
                <button
                  type="button"
                  className={`btn btn--sm app-header__nav${
                    pathname === "/add-audio" ? " app-header__nav--ativo" : ""
                  }`}
                  onClick={() => navigate("/add-audio")}
                >
                  <IconPlus size={17} />
                  <span className="app-header__nav-texto">Adicionar</span>
                </button>

                <div className="app-header__usuario" title={user?.email ?? undefined}>
                  <IconWave size={16} />
                  <span>{user?.nome ?? "Admin"}</span>
                </div>

                <Tooltip title="Sair">
                  <button
                    type="button"
                    className="btn btn--ghost btn--icon btn--sm"
                    onClick={logout}
                    aria-label="Sair da conta"
                  >
                    <IconLogout size={18} />
                  </button>
                </Tooltip>
              </>
            )}
          </nav>
        </div>
      </header>

      <main className="app-main" id="conteudo">
        {children}
      </main>

      <footer className="app-footer">
        <div className="container app-footer__inner">
          <span>
            Áudios Left 4 Dead 2 © {new Date().getFullYear()} — feito pela comunidade
          </span>
          <span className="app-footer__creditos">
            criado por{" "}
            <a
              href="https://steamcommunity.com/id/fearw33/"
              target="_blank"
              rel="noreferrer"
            >
              Fear
            </a>
          </span>
        </div>
      </footer>

      <BannerInstalar />
    </div>
  );
};

export default AppShell;
