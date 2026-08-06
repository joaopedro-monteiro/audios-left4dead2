import React from "react";
import ReactDOM from "react-dom/client";
import { toast } from "react-toastify";
// Os tokens globais entram antes dos estilos de componente, que podem sobrescrevê-los.
import "./styles/global.css";
import App from "./App";
import { applyUpdate, registerServiceWorker } from "./pwa/serviceWorkerRegistration";

const root = ReactDOM.createRoot(document.getElementById("root") as HTMLElement);
root.render(
  <React.StrictMode>
    <App />
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
