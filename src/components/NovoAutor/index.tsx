import React, { useContext, useState } from "react";
import { Input, Modal } from "antd";
import { addDoc, collection } from "firebase/firestore";
import { toast } from "react-toastify";
import { db } from "../../infrastructure/services/firebaseConnection";
import { AutoresContext } from "../../infrastructure/context/autores";
import { IconPlus } from "../Icons";

interface NovoAutorProps {
  /** Chamado com o nome recém-criado, para já deixá-lo selecionado. */
  onAutorCriado?: (nome: string) => void;
  rotulo?: string;
}

const NovoAutor: React.FC<NovoAutorProps> = ({ onAutorCriado, rotulo = "Novo autor" }) => {
  const [aberto, setAberto] = useState(false);
  const [nome, setNome] = useState("");
  const [salvando, setSalvando] = useState(false);
  const { autores, loadAutores } = useContext(AutoresContext);

  const fechar = () => {
    setAberto(false);
    setNome("");
  };

  const salvar = async () => {
    const nomeLimpo = nome.trim();
    if (!nomeLimpo) {
      toast.error("Digite o nome do autor.");
      return;
    }
    if (autores.some((autor) => autor.toLowerCase() === nomeLimpo.toLowerCase())) {
      toast.warning("Esse autor já está cadastrado.");
      return;
    }

    setSalvando(true);
    try {
      await addDoc(collection(db, "autores"), { nome: nomeLimpo });
      await loadAutores();
      onAutorCriado?.(nomeLimpo);
      toast.success("Autor adicionado!");
      fechar();
    } catch (erro) {
      console.error("Erro ao adicionar autor: ", erro);
      toast.error("Erro ao adicionar o autor.");
    } finally {
      setSalvando(false);
    }
  };

  return (
    <>
      <button type="button" className="btn" onClick={() => setAberto(true)}>
        <IconPlus size={16} />
        {rotulo}
      </button>

      <Modal
        title="Adicionar autor"
        open={aberto}
        onOk={salvar}
        onCancel={fechar}
        okText="Adicionar"
        cancelText="Cancelar"
        confirmLoading={salvando}
        destroyOnClose
      >
        <div className="form-campo">
          <label className="form-campo__label" htmlFor="novo-autor">
            Nome do autor
          </label>
          <Input
            id="novo-autor"
            placeholder="Como ele é conhecido no grupo"
            value={nome}
            maxLength={40}
            onChange={(evento) => setNome(evento.target.value)}
            onPressEnter={salvar}
            autoFocus
          />
        </div>
      </Modal>
    </>
  );
};

export default NovoAutor;
