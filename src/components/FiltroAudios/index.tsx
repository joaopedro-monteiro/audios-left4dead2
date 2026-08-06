import React from "react";
import { Select } from "antd";
import { IconClose, IconHeart, IconSearch } from "../Icons";
import "./filtros.css";

export type Ordenacao = "recentes" | "antigos" | "az" | "za" | "curtos" | "longos" | "autor";

export const OPCOES_ORDENACAO: { value: Ordenacao; label: string }[] = [
  { value: "recentes", label: "Mais recentes" },
  { value: "antigos", label: "Mais antigos" },
  { value: "az", label: "Descrição (A-Z)" },
  { value: "za", label: "Descrição (Z-A)" },
  { value: "curtos", label: "Mais curtos" },
  { value: "longos", label: "Mais longos" },
  { value: "autor", label: "Autor (A-Z)" },
];

interface FiltroAudiosProps {
  busca: string;
  onBuscaChange: (valor: string) => void;
  autores: { nome: string; total: number }[];
  autoresSelecionados: string[];
  onAutoresChange: (autores: string[]) => void;
  ordenacao: Ordenacao;
  onOrdenacaoChange: (ordenacao: Ordenacao) => void;
  somenteFavoritos: boolean;
  onSomenteFavoritosChange: (valor: boolean) => void;
  totalFavoritos: number;
  totalResultados: number;
  totalGeral: number;
  onLimpar: () => void;
}

const FiltroAudios: React.FC<FiltroAudiosProps> = ({
  busca,
  onBuscaChange,
  autores,
  autoresSelecionados,
  onAutoresChange,
  ordenacao,
  onOrdenacaoChange,
  somenteFavoritos,
  onSomenteFavoritosChange,
  totalFavoritos,
  totalResultados,
  totalGeral,
  onLimpar,
}) => {
  const temFiltro =
    busca.trim() !== "" || autoresSelecionados.length > 0 || somenteFavoritos;

  return (
    <div className="filtros-barra">
      <div className="container filtros">
      <div className="filtros__linha">
        <div className="campo-busca">
          <IconSearch size={18} className="campo-busca__icone" />
          <input
            type="search"
            className="campo-busca__input"
            placeholder="Buscar por descrição ou autor..."
            value={busca}
            onChange={(evento) => onBuscaChange(evento.target.value)}
            aria-label="Buscar áudios"
            enterKeyHint="search"
          />
          {busca && (
            <button
              type="button"
              className="campo-busca__limpar"
              onClick={() => onBuscaChange("")}
              aria-label="Limpar busca"
            >
              <IconClose size={15} />
            </button>
          )}
        </div>

        <div className="filtros__controles">
          <Select<string[]>
            className="filtros__select filtros__select--autores"
            mode="multiple"
            allowClear
            maxTagCount="responsive"
            value={autoresSelecionados}
            onChange={onAutoresChange}
            placeholder="Todos os autores"
            optionFilterProp="label"
            aria-label="Filtrar por autor"
            options={autores.map(({ nome, total }) => ({
              value: nome,
              label: nome,
              title: `${nome} (${total})`,
            }))}
            optionRender={(opcao) => (
              <div className="filtros__opcao">
                <span>{opcao.data.label as string}</span>
                <span className="filtros__opcao-total">
                  {autores.find((autor) => autor.nome === opcao.data.value)?.total ?? 0}
                </span>
              </div>
            )}
          />

          <Select<Ordenacao>
            className="filtros__select filtros__select--ordenacao"
            value={ordenacao}
            onChange={onOrdenacaoChange}
            options={OPCOES_ORDENACAO}
            aria-label="Ordenar áudios"
          />

          <button
            type="button"
            className={`chip filtros__favoritos${somenteFavoritos ? " chip--active" : ""}`}
            onClick={() => onSomenteFavoritosChange(!somenteFavoritos)}
            aria-pressed={somenteFavoritos}
            title="Mostrar apenas favoritos"
          >
            <IconHeart size={15} filled={somenteFavoritos} />
            <span className="filtros__favoritos-texto">Favoritos</span>
            {totalFavoritos > 0 && <span className="filtros__contador">{totalFavoritos}</span>}
          </button>
        </div>
      </div>

      <div className="filtros__resumo">
        <span>
          <strong>{totalResultados}</strong>
          {totalResultados === totalGeral
            ? ` áudio${totalGeral === 1 ? "" : "s"}`
            : ` de ${totalGeral} áudios`}
        </span>
        {temFiltro && (
          <button type="button" className="filtros__limpar" onClick={onLimpar}>
            Limpar filtros
          </button>
        )}
        </div>
      </div>
    </div>
  );
};

export default FiltroAudios;
