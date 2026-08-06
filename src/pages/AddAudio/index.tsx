import React, { useCallback, useContext, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Input, Select } from "antd";
import { addDoc, collection } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { toast } from "react-toastify";
import { db, storage } from "../../infrastructure/services/firebaseConnection";
import { AutoresContext } from "../../infrastructure/context/autores";
import { formatDuration } from "../../helpers/audio-duration-formatter";
import { slugify } from "../../helpers/audio-file";
import AudioPlayer from "../../components/AudioPlayer";
import NovoAutor from "../../components/NovoAutor";
import {
  IconAlert,
  IconCheck,
  IconClose,
  IconMusic,
  IconUpload,
} from "../../components/Icons";
import "./add-audio.css";

const TAMANHO_MAXIMO_MB = 20;
const EXTENSOES_ACEITAS = ["mp3", "ogg", "wav", "m4a", "aac", "opus", "webm"];
const DESCRICAO_MAXIMA = 140;

type Erros = { arquivo?: string; descricao?: string; autor?: string };

function formatarTamanho(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function nomeSemExtensao(nome: string): string {
  return nome.replace(/\.[^.]+$/, "").replace(/[_-]+/g, " ").trim();
}

const AddAudioPage: React.FC = () => {
  const navigate = useNavigate();
  const { autores, loadAutores } = useContext(AutoresContext);

  const [arquivo, setArquivo] = useState<File | null>(null);
  const [urlPreview, setUrlPreview] = useState<string>("");
  const [duracao, setDuracao] = useState<string>("");
  const [descricao, setDescricao] = useState<string>("");
  const [autor, setAutor] = useState<string>("");

  const [arrastando, setArrastando] = useState(false);
  const [enviando, setEnviando] = useState(false);
  const [progresso, setProgresso] = useState(0);
  const [concluido, setConcluido] = useState(false);
  const [erros, setErros] = useState<Erros>({});

  const inputArquivoRef = useRef<HTMLInputElement>(null);
  const urlPreviewRef = useRef<string>("");

  useEffect(() => {
    loadAutores();
  }, [loadAutores]);

  useEffect(() => {
    urlPreviewRef.current = urlPreview;
  }, [urlPreview]);

  useEffect(
    () => () => {
      if (urlPreviewRef.current) URL.revokeObjectURL(urlPreviewRef.current);
    },
    []
  );

  const limparArquivo = useCallback(() => {
    setArquivo(null);
    setDuracao("");
    setUrlPreview((atual) => {
      if (atual) URL.revokeObjectURL(atual);
      return "";
    });
    if (inputArquivoRef.current) inputArquivoRef.current.value = "";
  }, []);

  const selecionarArquivo = useCallback(
    (novoArquivo: File | undefined | null) => {
      if (!novoArquivo) return;

      const extensao = novoArquivo.name.split(".").pop()?.toLowerCase() ?? "";
      const tipoValido =
        novoArquivo.type.startsWith("audio/") || EXTENSOES_ACEITAS.includes(extensao);

      if (!tipoValido) {
        setErros((atuais) => ({ ...atuais, arquivo: "Esse arquivo não é um áudio." }));
        return;
      }
      if (novoArquivo.size > TAMANHO_MAXIMO_MB * 1024 * 1024) {
        setErros((atuais) => ({
          ...atuais,
          arquivo: `O arquivo passa de ${TAMANHO_MAXIMO_MB} MB.`,
        }));
        return;
      }

      setErros((atuais) => ({ ...atuais, arquivo: undefined }));
      setConcluido(false);

      const novaUrl = URL.createObjectURL(novoArquivo);
      setUrlPreview((anterior) => {
        if (anterior) URL.revokeObjectURL(anterior);
        return novaUrl;
      });
      setArquivo(novoArquivo);
      setDuracao("");

      // lê a duração real do arquivo escolhido
      const elemento = document.createElement("audio");
      elemento.preload = "metadata";
      elemento.src = novaUrl;
      elemento.addEventListener("loadedmetadata", () => {
        if (Number.isFinite(elemento.duration)) setDuracao(formatDuration(elemento.duration));
      });

      setDescricao((atual) => atual || nomeSemExtensao(novoArquivo.name).slice(0, DESCRICAO_MAXIMA));
    },
    []
  );

  const aoSoltar = (evento: React.DragEvent<HTMLDivElement>) => {
    evento.preventDefault();
    setArrastando(false);
    if (enviando) return;
    selecionarArquivo(evento.dataTransfer.files?.[0]);
  };

  const validar = (): boolean => {
    const novosErros: Erros = {};
    if (!arquivo) novosErros.arquivo = "Escolha o arquivo de áudio.";
    if (!descricao.trim()) novosErros.descricao = "Escreva uma descrição.";
    if (!autor) novosErros.autor = "Selecione o autor.";
    setErros(novosErros);
    return Object.keys(novosErros).length === 0;
  };

  const enviarArquivo = (arquivoSelecionado: File): Promise<string> => {
    const extensao = arquivoSelecionado.name.split(".").pop()?.toLowerCase() ?? "mp3";
    const nomeBase = slugify(nomeSemExtensao(arquivoSelecionado.name)) || "audio";
    // O nome recebe um carimbo de tempo para nunca sobrescrever um áudio já enviado.
    const caminho = `audios/${Date.now()}-${nomeBase}.${extensao}`;
    const referencia = ref(storage, caminho);
    const tarefa = uploadBytesResumable(referencia, arquivoSelecionado, {
      contentType: arquivoSelecionado.type || "audio/mpeg",
    });

    return new Promise((resolver, rejeitar) => {
      tarefa.on(
        "state_changed",
        (snapshot) => {
          setProgresso(Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100));
        },
        rejeitar,
        async () => {
          try {
            resolver(await getDownloadURL(tarefa.snapshot.ref));
          } catch (falha) {
            rejeitar(falha);
          }
        }
      );
    });
  };

  const aoEnviar = async (evento: React.FormEvent) => {
    evento.preventDefault();
    if (enviando || !validar() || !arquivo) return;

    setEnviando(true);
    setProgresso(0);
    try {
      const url = await enviarArquivo(arquivo);
      await addDoc(collection(db, "audios"), {
        descricao: descricao.trim(),
        autor,
        duracao,
        url,
        createdAt: new Date(),
      });

      toast.success("Áudio adicionado com sucesso!");
      setConcluido(true);
      setDescricao("");
      setAutor("");
      limparArquivo();
    } catch (falha) {
      console.error("Erro ao enviar o áudio:", falha);
      toast.error("Não foi possível enviar o áudio. Tente novamente.");
    } finally {
      setEnviando(false);
      setProgresso(0);
    }
  };

  return (
    <div className="container upload">
      <header className="upload__topo">
        <h1 className="upload__titulo">Adicionar áudio</h1>
        <p className="upload__subtitulo">
          Envie um áudio novo para a coleção. Formatos aceitos: {EXTENSOES_ACEITAS.join(", ")} —
          até {TAMANHO_MAXIMO_MB} MB.
        </p>
      </header>

      {concluido && (
        <div className="upload__sucesso" role="status">
          <IconCheck size={18} />
          <span>Áudio publicado! Ele já aparece na listagem.</span>
          <button type="button" className="btn btn--sm" onClick={() => navigate("/")}>
            Ver na lista
          </button>
        </div>
      )}

      <form className="upload__grid" onSubmit={aoEnviar} noValidate>
        <div className="upload__coluna surface">
          {/* ---------- arquivo ---------- */}
          <div className="form-campo">
            <span className="form-campo__label">Arquivo de áudio</span>

            {!arquivo ? (
              <div
                className={`dropzone${arrastando ? " dropzone--ativo" : ""}${
                  erros.arquivo ? " dropzone--erro" : ""
                }`}
                onDragOver={(evento) => {
                  evento.preventDefault();
                  setArrastando(true);
                }}
                onDragLeave={() => setArrastando(false)}
                onDrop={aoSoltar}
                onClick={() => inputArquivoRef.current?.click()}
                onKeyDown={(evento) => {
                  if (evento.key === "Enter" || evento.key === " ") {
                    evento.preventDefault();
                    inputArquivoRef.current?.click();
                  }
                }}
                role="button"
                tabIndex={0}
              >
                <IconUpload size={30} className="dropzone__icone" />
                <strong>Toque para escolher um áudio</strong>
                <span>ou arraste o arquivo aqui</span>
              </div>
            ) : (
              <div className="arquivo-escolhido">
                <div className="arquivo-escolhido__icone">
                  <IconMusic size={20} />
                </div>
                <div className="arquivo-escolhido__info">
                  <strong title={arquivo.name}>{arquivo.name}</strong>
                  <span>
                    {formatarTamanho(arquivo.size)}
                    {duracao && ` · ${duracao}`}
                  </span>
                </div>
                <button
                  type="button"
                  className="btn btn--ghost btn--icon btn--sm"
                  onClick={limparArquivo}
                  disabled={enviando}
                  aria-label="Remover arquivo"
                >
                  <IconClose size={16} />
                </button>
              </div>
            )}

            <input
              ref={inputArquivoRef}
              type="file"
              className="sr-only"
              accept="audio/*,.mp3,.ogg,.wav,.m4a,.aac,.opus"
              onChange={(evento) => selecionarArquivo(evento.target.files?.[0])}
            />

            {erros.arquivo && (
              <p className="form-campo__erro">
                <IconAlert size={14} /> {erros.arquivo}
              </p>
            )}
          </div>

          {/* ---------- prévia ---------- */}
          {arquivo && urlPreview && (
            <div className="upload__previa">
              <span className="upload__previa-rotulo">Prévia</span>
              <AudioPlayer
                id="previa-upload"
                url={urlPreview}
                titulo={descricao || arquivo.name}
                autor={autor || "Prévia"}
                duracaoTexto={duracao}
              />
            </div>
          )}

          {/* ---------- descrição ---------- */}
          <div className="form-campo">
            <label className="form-campo__label" htmlFor="descricao">
              Descrição
            </label>
            <Input.TextArea
              id="descricao"
              value={descricao}
              onChange={(evento) => setDescricao(evento.target.value)}
              placeholder="Ex.: Toma essa bicho, tá querendo brincar comigo?"
              autoSize={{ minRows: 3, maxRows: 6 }}
              maxLength={DESCRICAO_MAXIMA}
              showCount
              status={erros.descricao ? "error" : undefined}
              disabled={enviando}
            />
            {erros.descricao && (
              <p className="form-campo__erro">
                <IconAlert size={14} /> {erros.descricao}
              </p>
            )}
          </div>

          {/* ---------- autor ---------- */}
          <div className="form-campo">
            <label className="form-campo__label" htmlFor="autor">
              Autor
            </label>
            <div className="upload__autor">
              <Select
                id="autor"
                className="upload__autor-select"
                value={autor || undefined}
                onChange={(valor) => {
                  setAutor(valor);
                  setErros((atuais) => ({ ...atuais, autor: undefined }));
                }}
                showSearch
                optionFilterProp="label"
                placeholder="Quem mandou esse áudio?"
                status={erros.autor ? "error" : undefined}
                disabled={enviando}
                notFoundContent="Nenhum autor cadastrado"
                options={autores.map((nome) => ({ value: nome, label: nome }))}
              />
              <NovoAutor onAutorCriado={setAutor} />
            </div>
            {erros.autor && (
              <p className="form-campo__erro">
                <IconAlert size={14} /> {erros.autor}
              </p>
            )}
          </div>

          {/* ---------- envio ---------- */}
          {enviando && (
            <div className="upload__progresso" role="progressbar" aria-valuenow={progresso}>
              <div className="upload__progresso-barra" style={{ width: `${progresso}%` }} />
              <span className="upload__progresso-texto">Enviando... {progresso}%</span>
            </div>
          )}

          <div className="upload__acoes">
            <button type="submit" className="btn btn--primary" disabled={enviando}>
              {enviando ? <span className="btn-spinner" /> : <IconUpload size={17} />}
              {enviando ? "Enviando..." : "Publicar áudio"}
            </button>
            <button
              type="button"
              className="btn btn--ghost"
              onClick={() => navigate("/")}
              disabled={enviando}
            >
              Cancelar
            </button>
          </div>
        </div>

        {/* ---------- dicas ---------- */}
        <aside className="upload__dicas surface">
          <h2>Dicas rápidas</h2>
          <ul>
            <li>
              Descrição curta e reconhecível — é por ela que a galera vai buscar o áudio depois.
            </li>
            <li>Prefira MP3: é o formato que toca em qualquer celular.</li>
            <li>A duração é calculada sozinha assim que você escolhe o arquivo.</li>
            <li>Autor novo? Cadastre no botão ao lado do campo, sem sair da página.</li>
          </ul>
        </aside>
      </form>
    </div>
  );
};

export default AddAudioPage;
