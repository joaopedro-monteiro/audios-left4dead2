/**
 * Utilitários de download/compartilhamento dos áudios.
 *
 * O `<audio controls>` nativo tem um menu de download que simplesmente não
 * existe no iOS e é escondido em vários navegadores. Aqui o arquivo é baixado
 * via fetch + Blob, o que funciona em todo lugar, com o share sheet do iOS como
 * caminho principal no iPhone (é por lá que dá para salvar em Arquivos ou
 * mandar direto no WhatsApp).
 */

export type ResultadoDownload = "baixado" | "compartilhado" | "cancelado" | "nova-aba";
export type ResultadoCompartilhar =
  | "compartilhado"
  | "cancelado"
  | "link-copiado"
  | "indisponivel";

export const isIOS = (): boolean => {
  if (typeof navigator === "undefined") return false;
  const ua = navigator.userAgent;
  const iOSClassico = /iPad|iPhone|iPod/.test(ua);
  // iPad com iPadOS 13+ se identifica como Mac; o toque denuncia.
  const iPadModerno = /Macintosh/.test(ua) && navigator.maxTouchPoints > 1;
  return iOSClassico || iPadModerno;
};

export function slugify(texto: string): string {
  return texto
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);
}

/** Remove acentos e caixa para busca/ordenação "à prova de digitação". */
export function normalizar(texto: string): string {
  return texto
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
}

const EXTENSOES_POR_MIME: Record<string, string> = {
  "audio/mpeg": "mp3",
  "audio/mp3": "mp3",
  "audio/ogg": "ogg",
  "audio/wav": "wav",
  "audio/x-wav": "wav",
  "audio/webm": "webm",
  "audio/mp4": "m4a",
  "audio/aac": "aac",
};

function extensaoDoArquivo(url: string, mime?: string): string {
  const caminho = decodeURIComponent(url.split("?")[0]);
  const match = caminho.match(/\.(mp3|ogg|wav|m4a|aac|opus|webm|flac)$/i);
  if (match) return match[1].toLowerCase();
  if (mime && EXTENSOES_POR_MIME[mime]) return EXTENSOES_POR_MIME[mime];
  return "mp3";
}

export function nomeDoArquivo(descricao: string, url: string, mime?: string): string {
  const base = slugify(descricao) || "audio-l4d2";
  return `${base}.${extensaoDoArquivo(url, mime)}`;
}

function foiCancelado(erro: unknown): boolean {
  return erro instanceof DOMException && erro.name === "AbortError";
}

function podeCompartilharArquivo(file: File): boolean {
  return (
    typeof navigator !== "undefined" &&
    typeof navigator.share === "function" &&
    typeof navigator.canShare === "function" &&
    navigator.canShare({ files: [file] })
  );
}

async function carregarArquivo(url: string, descricao: string): Promise<File> {
  const resposta = await fetch(url, { mode: "cors", credentials: "omit" });
  if (!resposta.ok) throw new Error(`HTTP ${resposta.status}`);
  const blob = await resposta.blob();
  const tipo = blob.type || "audio/mpeg";
  return new File([blob], nomeDoArquivo(descricao, url, tipo), { type: tipo });
}

function salvarBlob(file: File): void {
  const objectUrl = URL.createObjectURL(file);
  const link = document.createElement("a");
  link.href = objectUrl;
  link.download = file.name;
  link.rel = "noopener";
  document.body.appendChild(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(objectUrl), 60_000);
}

export async function baixarAudio(url: string, descricao: string): Promise<ResultadoDownload> {
  let file: File;
  try {
    file = await carregarArquivo(url, descricao);
  } catch (erro) {
    // Sem conseguir o blob (rede/CORS), abrir a URL direta ainda permite salvar.
    console.error("Falha ao baixar o áudio, abrindo em nova aba:", erro);
    window.open(url, "_blank", "noopener,noreferrer");
    return "nova-aba";
  }

  if (isIOS() && podeCompartilharArquivo(file)) {
    try {
      await navigator.share({ files: [file], title: descricao });
      return "compartilhado";
    } catch (erro) {
      if (foiCancelado(erro)) return "cancelado";
      // Se o share sheet falhar, ainda tentamos o download tradicional.
    }
  }

  salvarBlob(file);
  return "baixado";
}

export async function compartilharAudio(
  url: string,
  descricao: string
): Promise<ResultadoCompartilhar> {
  if (typeof navigator !== "undefined" && typeof navigator.share === "function") {
    try {
      const file = await carregarArquivo(url, descricao).catch(() => null);
      if (file && podeCompartilharArquivo(file)) {
        await navigator.share({ files: [file], title: descricao });
        return "compartilhado";
      }
      await navigator.share({
        title: "L4D2 Áudios",
        text: descricao,
        url: window.location.origin,
      });
      return "compartilhado";
    } catch (erro) {
      if (foiCancelado(erro)) return "cancelado";
      console.error("Falha ao compartilhar:", erro);
    }
  }

  try {
    await navigator.clipboard.writeText(url);
    return "link-copiado";
  } catch {
    return "indisponivel";
  }
}
