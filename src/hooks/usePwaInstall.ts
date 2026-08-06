import { useCallback, useEffect, useState } from "react";
import { isIOS } from "../helpers/audio-file";

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{ outcome: "accepted" | "dismissed"; platform: string }>;
  prompt(): Promise<void>;
}

function estaEmModoApp(): boolean {
  if (typeof window === "undefined") return false;
  return (
    window.matchMedia("(display-mode: standalone)").matches ||
    window.matchMedia("(display-mode: fullscreen)").matches ||
    // iOS não implementa display-mode; usa esta flag proprietária.
    (window.navigator as unknown as { standalone?: boolean }).standalone === true
  );
}

/**
 * Instalação do site como app (PWA).
 *
 * No Chrome/Edge (Android e desktop) o navegador dispara `beforeinstallprompt`
 * e conseguimos abrir o diálogo nativo de instalação. No iOS não existe API:
 * o jeito é ensinar o caminho "Compartilhar > Adicionar à Tela de Início".
 */
export function usePwaInstall() {
  const [promptAdiado, setPromptAdiado] = useState<BeforeInstallPromptEvent | null>(null);
  const [modoApp, setModoApp] = useState<boolean>(estaEmModoApp);
  const dispositivoIOS = isIOS();

  useEffect(() => {
    const aoReceberPrompt = (evento: Event) => {
      evento.preventDefault();
      setPromptAdiado(evento as BeforeInstallPromptEvent);
    };
    const aoInstalar = () => {
      setPromptAdiado(null);
      setModoApp(true);
    };

    window.addEventListener("beforeinstallprompt", aoReceberPrompt);
    window.addEventListener("appinstalled", aoInstalar);

    const media = window.matchMedia("(display-mode: standalone)");
    const aoMudarModo = () => setModoApp(estaEmModoApp());
    media.addEventListener("change", aoMudarModo);

    return () => {
      window.removeEventListener("beforeinstallprompt", aoReceberPrompt);
      window.removeEventListener("appinstalled", aoInstalar);
      media.removeEventListener("change", aoMudarModo);
    };
  }, []);

  const instalar = useCallback(async (): Promise<
    "instalado" | "recusado" | "instrucoes-ios" | "indisponivel"
  > => {
    if (promptAdiado) {
      await promptAdiado.prompt();
      const { outcome } = await promptAdiado.userChoice;
      if (outcome === "accepted") {
        setPromptAdiado(null);
        return "instalado";
      }
      return "recusado";
    }
    if (dispositivoIOS) return "instrucoes-ios";
    return "indisponivel";
  }, [promptAdiado, dispositivoIOS]);

  return {
    /** Mostra o botão de instalar? */
    podeInstalar: !modoApp && (promptAdiado !== null || dispositivoIOS),
    /** O diálogo nativo está disponível agora? */
    temPromptNativo: promptAdiado !== null,
    /** O site já está aberto como app instalado. */
    modoApp,
    dispositivoIOS,
    instalar,
  };
}
