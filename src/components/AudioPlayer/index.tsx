import React, { useCallback, useEffect, useRef, useState } from "react";
import { usePlayer } from "../../infrastructure/context/player";
import { formatDuration, parseDuration } from "../../helpers/audio-duration-formatter";
import { IconAlert, IconPause, IconPlay, IconRepeat } from "../Icons";
import "./player.css";

interface AudioPlayerProps {
  id: string;
  url: string;
  titulo: string;
  autor: string;
  /** Duração salva no banco, usada antes do arquivo ser carregado. */
  duracaoTexto?: string;
  onTocandoChange?: (tocando: boolean) => void;
}

const AudioPlayer: React.FC<AudioPlayerProps> = ({
  id,
  url,
  titulo,
  autor,
  duracaoTexto,
  onTocandoChange,
}) => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const rafRef = useRef<number>();
  const { faixaAtual, iniciarReproducao, pararReproducao } = usePlayer();

  const [tocando, setTocando] = useState(false);
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState(false);
  const [repetir, setRepetir] = useState(false);
  const [tempoAtual, setTempoAtual] = useState(0);
  const [duracao, setDuracao] = useState<number>(() => parseDuration(duracaoTexto));

  const duracaoValida = duracao > 0 && Number.isFinite(duracao);

  /* Acompanha o tempo com requestAnimationFrame: o evento timeupdate do
     navegador dispara ~4x por segundo e deixa a barra travada. */
  useEffect(() => {
    if (!tocando) return;
    const atualizar = () => {
      const audio = audioRef.current;
      if (audio) setTempoAtual(audio.currentTime);
      rafRef.current = requestAnimationFrame(atualizar);
    };
    rafRef.current = requestAnimationFrame(atualizar);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [tocando]);

  /* Outro áudio começou a tocar: este se pausa. */
  useEffect(() => {
    if (faixaAtual !== id && tocando) {
      audioRef.current?.pause();
    }
  }, [faixaAtual, id, tocando]);

  useEffect(() => {
    onTocandoChange?.(tocando);
  }, [tocando, onTocandoChange]);

  useEffect(() => {
    const audio = audioRef.current;
    return () => {
      audio?.pause();
    };
  }, []);

  const registrarMediaSession = useCallback(() => {
    if (!("mediaSession" in navigator)) return;
    navigator.mediaSession.metadata = new MediaMetadata({
      title: titulo,
      artist: autor,
      album: "L4D2 Áudios",
      artwork: [
        { src: `${process.env.PUBLIC_URL}/icons/icon-192.png`, sizes: "192x192", type: "image/png" },
        { src: `${process.env.PUBLIC_URL}/icons/icon-512.png`, sizes: "512x512", type: "image/png" },
      ],
    });
    navigator.mediaSession.setActionHandler("play", () => audioRef.current?.play());
    navigator.mediaSession.setActionHandler("pause", () => audioRef.current?.pause());
  }, [titulo, autor]);

  const alternarPlay = useCallback(async () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (!audio.paused) {
      audio.pause();
      return;
    }

    setErro(false);
    setCarregando(true);
    iniciarReproducao(id);
    try {
      await audio.play();
      registrarMediaSession();
    } catch (falha) {
      if ((falha as DOMException)?.name !== "AbortError") {
        console.error("Não foi possível reproduzir o áudio:", falha);
        setErro(true);
      }
    } finally {
      setCarregando(false);
    }
  }, [id, iniciarReproducao, registrarMediaSession]);

  const aoBuscar = (evento: React.ChangeEvent<HTMLInputElement>) => {
    const audio = audioRef.current;
    const valor = Number(evento.target.value);
    setTempoAtual(valor);
    if (audio && Number.isFinite(audio.duration)) audio.currentTime = valor;
  };

  const progresso = duracaoValida ? Math.min(100, (tempoAtual / duracao) * 100) : 0;

  return (
    <div className={`player${tocando ? " player--tocando" : ""}`}>
      <audio
        ref={audioRef}
        src={url}
        preload="none"
        loop={repetir}
        onLoadedMetadata={(e) => {
          const valor = e.currentTarget.duration;
          if (Number.isFinite(valor) && valor > 0) setDuracao(valor);
        }}
        onPlay={() => {
          setTocando(true);
          iniciarReproducao(id);
        }}
        onPause={() => {
          setTocando(false);
          pararReproducao(id);
        }}
        onEnded={() => {
          setTocando(false);
          setTempoAtual(0);
          pararReproducao(id);
        }}
        onWaiting={() => setCarregando(true)}
        onPlaying={() => setCarregando(false)}
        onError={() => {
          setErro(true);
          setCarregando(false);
          setTocando(false);
        }}
      />

      <button
        type="button"
        className="player__play"
        onClick={alternarPlay}
        aria-label={tocando ? `Pausar ${titulo}` : `Reproduzir ${titulo}`}
      >
        {carregando && !tocando ? (
          <span className="player__spinner" />
        ) : erro ? (
          <IconAlert size={20} />
        ) : tocando ? (
          <IconPause size={18} />
        ) : (
          <IconPlay size={18} />
        )}
      </button>

      <div className="player__body">
        <input
          type="range"
          className="player__seek"
          min={0}
          max={duracaoValida ? duracao : 1}
          step={0.01}
          value={tempoAtual}
          onChange={aoBuscar}
          disabled={!duracaoValida || erro}
          style={{ ["--progresso" as string]: progresso }}
          aria-label={`Posição do áudio ${titulo}`}
          aria-valuetext={`${formatDuration(tempoAtual)} de ${formatDuration(duracao)}`}
        />
        <div className="player__tempo">
          <span>{erro ? "Erro ao carregar" : formatDuration(tempoAtual)}</span>
          <span>{duracaoValida ? formatDuration(duracao) : duracaoTexto ?? "--:--"}</span>
        </div>
      </div>

      <button
        type="button"
        className={`player__acao${repetir ? " player__acao--ativa" : ""}`}
        onClick={() => setRepetir((atual) => !atual)}
        aria-pressed={repetir}
        title={repetir ? "Repetição ligada" : "Repetir áudio"}
        aria-label={repetir ? "Desligar repetição" : "Repetir áudio"}
      >
        <IconRepeat size={16} />
      </button>
    </div>
  );
};

export default AudioPlayer;
