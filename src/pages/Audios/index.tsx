import { useContext, useEffect, useMemo, useState } from "react";
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import { db } from "../../infrastructure/services/firebaseConnection";
import { AuthContext } from "../../infrastructure/context/auth";
import { useFavoritos } from "../../hooks/useFavoritos";
import { normalizar } from "../../helpers/audio-file";
import { parseDuration } from "../../helpers/audio-duration-formatter";
import type { Audio } from "../../infrastructure/models/audio";
import AudioCard from "../../components/AudioCard";
import FiltroAudios, { Ordenacao } from "../../components/FiltroAudios";
import { IconAlert, IconHeart, IconMusic, IconSearch } from "../../components/Icons";
import "./audios.css";

export default function AudiosPage(): JSX.Element {
  const { signed } = useContext(AuthContext);
  const { alternarFavorito, ehFavorito, totalFavoritos } = useFavoritos();

  const [audios, setAudios] = useState<Audio[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState(false);

  const [busca, setBusca] = useState("");
  const [autoresSelecionados, setAutoresSelecionados] = useState<string[]>([]);
  const [ordenacao, setOrdenacao] = useState<Ordenacao>("recentes");
  const [somenteFavoritos, setSomenteFavoritos] = useState(false);

  useEffect(() => {
    const consulta = query(collection(db, "audios"), orderBy("createdAt", "desc"));

    const cancelarInscricao = onSnapshot(
      consulta,
      (snapshot) => {
        const lista = snapshot.docs
          .map((documento) => {
            const dados = documento.data();
            return {
              id: documento.id,
              descricao: dados.descricao ?? "Sem descrição",
              autor: dados.autor ?? "Desconhecido",
              url: dados.url ?? "",
              duracao: dados.duracao ?? "",
              createdAt: dados.createdAt?.toDate?.() ?? null,
            } as Audio;
          })
          .filter((audio) => audio.url);

        setAudios(lista);
        setErro(false);
        setCarregando(false);
      },
      (falha) => {
        console.error("Erro ao carregar os áudios:", falha);
        setErro(true);
        setCarregando(false);
      }
    );

    return () => cancelarInscricao();
  }, []);

  const autoresDisponiveis = useMemo(() => {
    const contagem = new Map<string, number>();
    audios.forEach((audio) => {
      contagem.set(audio.autor, (contagem.get(audio.autor) ?? 0) + 1);
    });
    return Array.from(contagem, ([nome, total]) => ({ nome, total })).sort((a, b) =>
      a.nome.localeCompare(b.nome, "pt-BR", { sensitivity: "base" })
    );
  }, [audios]);

  const listaVisivel = useMemo(() => {
    const termos = normalizar(busca).split(/\s+/).filter(Boolean);

    const filtrados = audios.filter((audio) => {
      if (somenteFavoritos && !ehFavorito(audio.id)) return false;
      if (autoresSelecionados.length > 0 && !autoresSelecionados.includes(audio.autor)) {
        return false;
      }
      if (termos.length === 0) return true;
      const texto = normalizar(`${audio.descricao} ${audio.autor}`);
      return termos.every((termo) => texto.includes(termo));
    });

    const porTexto = (a: string, b: string) =>
      a.localeCompare(b, "pt-BR", { sensitivity: "base" });
    const emSegundos = (audio: Audio) => parseDuration(audio.duracao);
    const emData = (audio: Audio) => audio.createdAt?.getTime() ?? 0;

    const ordenadores: Record<Ordenacao, (a: Audio, b: Audio) => number> = {
      recentes: (a, b) => emData(b) - emData(a),
      antigos: (a, b) => emData(a) - emData(b),
      az: (a, b) => porTexto(a.descricao, b.descricao),
      za: (a, b) => porTexto(b.descricao, a.descricao),
      curtos: (a, b) => emSegundos(a) - emSegundos(b),
      longos: (a, b) => emSegundos(b) - emSegundos(a),
      autor: (a, b) => porTexto(a.autor, b.autor) || porTexto(a.descricao, b.descricao),
    };

    return [...filtrados].sort(ordenadores[ordenacao]);
  }, [audios, busca, autoresSelecionados, ordenacao, somenteFavoritos, ehFavorito]);

  const limparFiltros = () => {
    setBusca("");
    setAutoresSelecionados([]);
    setSomenteFavoritos(false);
  };

  const filtrarPorAutor = (autor: string) => {
    setAutoresSelecionados([autor]);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <>
      <section className="container hero">
        <h1 className="hero__titulo">
          Áudios lendários do <span>Left 4 Dead 2</span>
        </h1>
        <p className="hero__texto">
          A coleção que a comunidade brasileira juntou ao longo dos anos. Ouça, baixe e manda
          no grupo.
        </p>
        {!carregando && !erro && audios.length > 0 && (
          <div className="hero__stats">
            <span>
              <strong>{audios.length}</strong> áudios
            </span>
            <span aria-hidden="true">·</span>
            <span>
              <strong>{autoresDisponiveis.length}</strong> autores
            </span>
            {totalFavoritos > 0 && (
              <>
                <span aria-hidden="true">·</span>
                <span>
                  <strong>{totalFavoritos}</strong> favoritos
                </span>
              </>
            )}
          </div>
        )}
      </section>

      {!erro && (
        <FiltroAudios
          busca={busca}
          onBuscaChange={setBusca}
          autores={autoresDisponiveis}
          autoresSelecionados={autoresSelecionados}
          onAutoresChange={setAutoresSelecionados}
          ordenacao={ordenacao}
          onOrdenacaoChange={setOrdenacao}
          somenteFavoritos={somenteFavoritos}
          onSomenteFavoritosChange={setSomenteFavoritos}
          totalFavoritos={totalFavoritos}
          totalResultados={listaVisivel.length}
          totalGeral={audios.length}
          onLimpar={limparFiltros}
        />
      )}

      <div className="container">
        {erro ? (
          <div className="empty-state">
            <IconAlert size={40} className="empty-state__icon" />
            <h3>Não conseguimos carregar os áudios</h3>
            <p>Confira sua conexão e tente de novo.</p>
            <button
              type="button"
              className="btn btn--primary"
              onClick={() => window.location.reload()}
            >
              Tentar novamente
            </button>
          </div>
        ) : carregando ? (
          <div className="audio-grid" aria-busy="true" aria-label="Carregando áudios">
            {Array.from({ length: 8 }).map((_, indice) => (
              <div className="audio-card audio-card--esqueleto" key={indice}>
                <div className="skeleton" style={{ height: 16, width: "85%" }} />
                <div className="skeleton" style={{ height: 16, width: "55%" }} />
                <div className="skeleton" style={{ height: 24, width: "40%" }} />
                <div className="skeleton" style={{ height: 46, width: "100%" }} />
                <div className="skeleton" style={{ height: 34, width: "100%" }} />
              </div>
            ))}
          </div>
        ) : listaVisivel.length === 0 ? (
          <div className="empty-state">
            {audios.length === 0 ? (
              <>
                <IconMusic size={40} className="empty-state__icon" />
                <h3>Nenhum áudio por aqui ainda</h3>
                <p>Assim que os primeiros áudios forem enviados eles aparecem nesta página.</p>
              </>
            ) : somenteFavoritos && totalFavoritos === 0 ? (
              <>
                <IconHeart size={40} className="empty-state__icon" />
                <h3>Você ainda não favoritou nada</h3>
                <p>Toque no coração de um áudio para guardá-lo aqui neste dispositivo.</p>
                <button
                  type="button"
                  className="btn"
                  onClick={() => setSomenteFavoritos(false)}
                >
                  Ver todos os áudios
                </button>
              </>
            ) : (
              <>
                <IconSearch size={40} className="empty-state__icon" />
                <h3>Nenhum áudio encontrado</h3>
                <p>Tente outras palavras ou remova os filtros.</p>
                <button type="button" className="btn" onClick={limparFiltros}>
                  Limpar filtros
                </button>
              </>
            )}
          </div>
        ) : (
          <div className="audio-grid">
            {listaVisivel.map((audio) => (
              <AudioCard
                key={audio.id}
                audio={audio}
                podeEditar={signed}
                favorito={ehFavorito(audio.id)}
                onAlternarFavorito={alternarFavorito}
                onSelecionarAutor={filtrarPorAutor}
              />
            ))}
          </div>
        )}
      </div>
    </>
  );
}
