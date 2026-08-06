import React, { useCallback, useEffect, useState } from "react";
import { Modal } from "antd";
import { usePwaInstall } from "../../hooks/usePwaInstall";
import { BrandMark, IconClose, IconInstall, IconShare } from "../Icons";
import "./instalar.css";

const CHAVE_BANNER = "@audiosL4D2:bannerInstalarFechado";

/** Diálogo com o passo a passo do iPhone (o iOS não tem API de instalação). */
const InstrucoesIOS: React.FC<{ aberto: boolean; onFechar: () => void }> = ({
  aberto,
  onFechar,
}) => (
  <Modal
    title="Instalar no iPhone/iPad"
    open={aberto}
    onCancel={onFechar}
    onOk={onFechar}
    okText="Entendi"
    cancelButtonProps={{ style: { display: "none" } }}
  >
    <ol className="instalar-passos">
      <li>
        Toque em <IconShare size={16} className="instalar-passos__icone" />{" "}
        <strong>Compartilhar</strong>, na barra do Safari.
      </li>
      <li>
        Role a lista e escolha <strong>Adicionar à Tela de Início</strong>.
      </li>
      <li>
        Confirme em <strong>Adicionar</strong>. O app aparece junto dos outros, em tela cheia.
      </li>
    </ol>
  </Modal>
);

export const BotaoInstalar: React.FC<{ compacto?: boolean }> = ({ compacto }) => {
  const { podeInstalar, instalar } = usePwaInstall();
  const [instrucoes, setInstrucoes] = useState(false);

  const aoClicar = useCallback(async () => {
    const resultado = await instalar();
    if (resultado === "instrucoes-ios") setInstrucoes(true);
  }, [instalar]);

  if (!podeInstalar) return null;

  return (
    <>
      <button
        type="button"
        className={`btn btn--sm instalar-btn${compacto ? " btn--icon" : ""}`}
        onClick={aoClicar}
        title="Instalar como aplicativo"
        aria-label="Instalar como aplicativo"
      >
        <IconInstall size={17} />
        {!compacto && <span>Instalar app</span>}
      </button>
      <InstrucoesIOS aberto={instrucoes} onFechar={() => setInstrucoes(false)} />
    </>
  );
};

/** Faixa discreta no rodapé da tela, só no celular e só uma vez. */
export const BannerInstalar: React.FC = () => {
  const { podeInstalar, instalar } = usePwaInstall();
  const [fechado, setFechado] = useState(true);
  const [instrucoes, setInstrucoes] = useState(false);

  useEffect(() => {
    // pequena espera para não competir com o carregamento inicial
    const timer = setTimeout(() => {
      setFechado(localStorage.getItem(CHAVE_BANNER) === "1");
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  const visivel = podeInstalar && !fechado;

  // reserva espaço no fim da página para o banner flutuante não tapar conteúdo
  useEffect(() => {
    document.body.classList.toggle("com-banner-instalar", visivel);
    return () => document.body.classList.remove("com-banner-instalar");
  }, [visivel]);

  const fechar = () => {
    setFechado(true);
    try {
      localStorage.setItem(CHAVE_BANNER, "1");
    } catch {
      /* ignora storage indisponível */
    }
  };

  const aoInstalar = async () => {
    const resultado = await instalar();
    if (resultado === "instrucoes-ios") setInstrucoes(true);
    if (resultado === "instalado") fechar();
  };

  if (!visivel) {
    return <InstrucoesIOS aberto={instrucoes} onFechar={() => setInstrucoes(false)} />;
  }

  return (
    <>
      <div className="instalar-banner" role="region" aria-label="Instalar aplicativo">
        <BrandMark size={34} />
        <div className="instalar-banner__texto">
          <strong>Instale o L4D2 Áudios</strong>
          <span>Abre em tela cheia e funciona offline.</span>
        </div>
        <button type="button" className="btn btn--sm btn--primary" onClick={aoInstalar}>
          Instalar
        </button>
        <button
          type="button"
          className="instalar-banner__fechar"
          onClick={fechar}
          aria-label="Dispensar"
        >
          <IconClose size={16} />
        </button>
      </div>
      <InstrucoesIOS aberto={instrucoes} onFechar={() => setInstrucoes(false)} />
    </>
  );
};
