/**
 * Registro do service worker (`public/sw.js`).
 *
 * Só roda em produção: em desenvolvimento o service worker atrapalha o
 * hot reload do CRA.
 */
type Callbacks = {
  onUpdateAvailable?: (registration: ServiceWorkerRegistration) => void;
};

export function registerServiceWorker(callbacks: Callbacks = {}): void {
  if (process.env.NODE_ENV !== "production") return;
  if (!("serviceWorker" in navigator)) return;

  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register(`${process.env.PUBLIC_URL}/sw.js`)
      .then((registration) => {
        registration.addEventListener("updatefound", () => {
          const installing = registration.installing;
          if (!installing) return;

          installing.addEventListener("statechange", () => {
            if (installing.state === "installed" && navigator.serviceWorker.controller) {
              callbacks.onUpdateAvailable?.(registration);
            }
          });
        });
      })
      .catch((error) => {
        console.error("Erro ao registrar o service worker:", error);
      });
  });
}

export function applyUpdate(registration: ServiceWorkerRegistration): void {
  registration.waiting?.postMessage("SKIP_WAITING");
  window.location.reload();
}
