import React from "react";
import { BrandMark, IconAlert } from "../Icons";
import "./tela-erro.css";

interface TelaErroProps {
  titulo: string;
  descricao: string;
  /** Pistas técnicas, mostradas em bloco monoespaçado. */
  detalhes?: string[];
  aoTentarNovamente?: () => void;
}

/**
 * Tela de última instância: qualquer falha que impeça o app de rodar precisa
 * virar uma mensagem legível, nunca um spinner girando para sempre.
 */
const TelaErro: React.FC<TelaErroProps> = ({
  titulo,
  descricao,
  detalhes,
  aoTentarNovamente,
}) => (
  <div className="tela-erro">
    <BrandMark size={56} />
    <IconAlert size={30} className="tela-erro__icone" />
    <h1>{titulo}</h1>
    <p className="tela-erro__texto">{descricao}</p>

    {detalhes && detalhes.length > 0 && (
      <ul className="tela-erro__detalhes">
        {detalhes.map((detalhe) => (
          <li key={detalhe}>{detalhe}</li>
        ))}
      </ul>
    )}

    <button
      type="button"
      className="btn btn--primary"
      onClick={aoTentarNovamente ?? (() => window.location.reload())}
    >
      Recarregar a página
    </button>
  </div>
);

export default TelaErro;
