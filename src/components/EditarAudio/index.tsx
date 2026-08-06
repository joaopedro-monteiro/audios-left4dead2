import { Modal, Input, Select, Tooltip } from "antd";
import { useContext, useState } from "react";
import { doc, updateDoc } from "firebase/firestore";
import { toast } from "react-toastify";
import { AutoresContext } from "../../infrastructure/context/autores";
import { db } from "../../infrastructure/services/firebaseConnection";
import { IconEdit } from "../Icons";

interface EditarAudioProps {
  id: string;
  descricaoAtual: string;
  atorAtual: string;
}

const EditarAudio: React.FC<EditarAudioProps> = ({ id, descricaoAtual, atorAtual }) => {
  const [aberto, setAberto] = useState(false);
  const [salvando, setSalvando] = useState(false);
  const [descricao, setDescricao] = useState<string>(descricaoAtual);
  const [autor, setAutor] = useState<string>(atorAtual);

  const { autores, loadAutores } = useContext(AutoresContext);

  const abrir = () => {
    setDescricao(descricaoAtual);
    setAutor(atorAtual);
    setAberto(true);
    loadAutores();
  };

  const semAlteracao = descricao.trim() === descricaoAtual && autor === atorAtual;

  const salvar = async () => {
    if (!descricao.trim()) {
      toast.error("A descrição não pode ficar vazia.");
      return;
    }

    setSalvando(true);
    try {
      await updateDoc(doc(db, "audios", id), {
        descricao: descricao.trim(),
        autor,
      });
      toast.success("Áudio editado com sucesso!");
      setAberto(false);
    } catch (erro) {
      console.error("Erro ao editar áudio: ", erro);
      toast.error("Erro ao editar o áudio.");
    } finally {
      setSalvando(false);
    }
  };

  return (
    <>
      <Tooltip title="Editar">
        <button type="button" className="btn btn--ghost btn--icon btn--sm" onClick={abrir} aria-label="Editar áudio">
          <IconEdit size={17} />
        </button>
      </Tooltip>

      <Modal
        title="Editar áudio"
        open={aberto}
        onOk={salvar}
        onCancel={() => setAberto(false)}
        okText="Salvar"
        cancelText="Cancelar"
        confirmLoading={salvando}
        okButtonProps={{ disabled: semAlteracao || !descricao.trim() }}
        destroyOnClose
      >
        <div className="form-campo">
          <label className="form-campo__label" htmlFor={`descricao-${id}`}>
            Descrição
          </label>
          <Input.TextArea
            id={`descricao-${id}`}
            autoSize={{ minRows: 2, maxRows: 4 }}
            maxLength={140}
            showCount
            value={descricao}
            onChange={(e) => setDescricao(e.target.value)}
            placeholder="Do que se trata esse áudio?"
          />
        </div>

        <div className="form-campo">
          <label className="form-campo__label" htmlFor={`autor-${id}`}>
            Autor
          </label>
          <Select
            id={`autor-${id}`}
            style={{ width: "100%" }}
            value={autor || undefined}
            onChange={setAutor}
            showSearch
            placeholder="Selecione o autor"
            optionFilterProp="label"
            options={autores.map((nome) => ({ value: nome, label: nome }))}
          />
        </div>
      </Modal>
    </>
  );
};

export default EditarAudio;
