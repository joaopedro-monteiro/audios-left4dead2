import React, { useCallback, useState } from "react";
import { toast } from "react-toastify";
import AudioPlayer from "../AudioPlayer";
import EditarAudio from "../EditarAudio";
import ExcluirAudio from "../ExcluirAudio";
import { IconDownload, IconHeart, IconShare } from "../Icons";
import { baixarAudio, compartilharAudio } from "../../helpers/audio-file";
import type { Audio } from "../../infrastructure/models/audio";
import "./audio-card.css";

interface AudioCardProps {
  audio: Audio;
  podeEditar: boolean;
  favorito: boolean;
  onAlternarFavorito: (id: string) => void;
  onSelecionarAutor: (autor: string) => void;
}

const AudioCard: React.FC<AudioCardProps> = ({
  audio,
  podeEditar,
  favorito,
  onAlternarFavorito,
  onSelecionarAutor,
}) => {
  const [baixando, setBaixando] = useState(false);
  const [compartilhando, setCompartilhando] = useState(false);
  const [tocando, setTocando] = useState(false);

  const aoBaixar = useCallback(async () => {
    setBaixando(true);
    try {
      const resultado = await baixarAudio(audio.url, audio.descricao);
      if (resultado === "baixado") toast.success("Download iniciado!");
      if (resultado === "compartilhado") toast.success("Áudio pronto para salvar/compartilhar!");
      if (resultado === "nova-aba") toast.info("Abrimos o áudio em outra aba para você salvar.");
    } finally {
      setBaixando(false);
    }
  }, [audio.url, audio.descricao]);

  const aoCompartilhar = useCallback(async () => {
    setCompartilhando(true);
    try {
      const resultado = await compartilharAudio(audio.url, audio.descricao);
      if (resultado === "link-copiado") toast.success("Link do áudio copiado!");
      if (resultado === "indisponivel")
        toast.error("Seu navegador não permite compartilhar por aqui.");
    } finally {
      setCompartilhando(false);
    }
  }, [audio.url, audio.descricao]);

  return (
    <article className={`audio-card${tocando ? " audio-card--tocando" : ""}`}>
      <div className="audio-card__topo">
        <h3 className="audio-card__titulo" title={audio.descricao}>
          {audio.descricao}
        </h3>
        <button
          type="button"
          className={`audio-card__favorito${favorito ? " audio-card__favorito--ativo" : ""}`}
          onClick={() => onAlternarFavorito(audio.id)}
          aria-pressed={favorito}
          aria-label={favorito ? "Remover dos favoritos" : "Salvar nos favoritos"}
          title={favorito ? "Remover dos favoritos" : "Salvar nos favoritos"}
        >
          <IconHeart size={18} filled={favorito} />
        </button>
      </div>

      <div className="audio-card__meta">
        <button
          type="button"
          className="audio-card__autor"
          onClick={() => onSelecionarAutor(audio.autor)}
          title={`Filtrar áudios de ${audio.autor}`}
        >
          {audio.autor}
        </button>
        <span className="audio-card__duracao">
          {tocando && (
            <span className="equalizador" aria-hidden="true">
              <i />
              <i />
              <i />
            </span>
          )}
          {audio.duracao}
        </span>
      </div>

      <AudioPlayer
        id={audio.id}
        url={audio.url}
        titulo={audio.descricao}
        autor={audio.autor}
        duracaoTexto={audio.duracao}
        onTocandoChange={setTocando}
      />

      <div className="audio-card__acoes">
        <button
          type="button"
          className="btn btn--sm btn--primary audio-card__baixar"
          onClick={aoBaixar}
          disabled={baixando}
        >
          {baixando ? <span className="btn-spinner" /> : <IconDownload size={16} />}
          {baixando ? "Baixando..." : "Baixar"}
        </button>
        <button
          type="button"
          className="btn btn--sm"
          onClick={aoCompartilhar}
          disabled={compartilhando}
          title="Compartilhar áudio"
        >
          {compartilhando ? <span className="btn-spinner" /> : <IconShare size={16} />}
          <span className="audio-card__acao-texto">Compartilhar</span>
        </button>

        {podeEditar && (
          <div className="audio-card__admin">
            <EditarAudio
              id={audio.id}
              descricaoAtual={audio.descricao}
              atorAtual={audio.autor}
            />
            <ExcluirAudio id={audio.id} descricao={audio.descricao} />
          </div>
        )}
      </div>
    </article>
  );
};

export default AudioCard;
