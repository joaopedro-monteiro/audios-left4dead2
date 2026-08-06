import React from "react";
import ReactDOM from "react-dom/client";
import { toast } from "react-toastify";
// Os tokens globais entram antes dos estilos de componente, que podem sobrescrevê-los.
import "./styles/global.css";
import App from "./App";
import ErrorBoundary from "./components/ErrorBoundary";
import TelaErro from "./components/TelaErro";
import { applyUpdate, registerServiceWorker } from "./pwa/serviceWorkerRegistration";
import {
  configuracaoValida,
  variaveisFaltando,
} from "./infrastructure/services/firebaseConnection";

const root = ReactDOM.createRoot(document.getElementById("root") as HTMLElement);

if (!configuracaoValida) {
  // Sem as variáveis do Firebase o site não tem como funcionar; melhor dizer
  // isso na tela do que deixar o carregamento girando para sempre.
  root.render(
    <TelaErro
      titulo="Site fora do ar por configuração"
      descricao="As variáveis do Firebase não foram definidas no build. Se você administra o site, cadastre-as nas variáveis de ambiente e rode um novo deploy."
      detalhes={variaveisFaltando}
    />
  );
} else {
  root.render(
    <React.StrictMode>
      <ErrorBoundary>
        <App />
      </ErrorBoundary>
    </React.StrictMode>
  );

  registerServiceWorker({
    onUpdateAvailable: (registration) => {
      toast.info(
        <span>
          Tem uma versão nova do site.{" "}
          <button
            type="button"
            className="btn btn--sm btn--primary"
            style={{ marginTop: 8 }}
            onClick={() => applyUpdate(registration)}
          >
            Atualizar
          </button>
        </span>,
        { autoClose: false, closeOnClick: false }
      );
    },
  });
}
