import { Modal, Tooltip } from "antd";
import { useState } from "react";
import { deleteDoc, doc } from "firebase/firestore";
import { toast } from "react-toastify";
import { db } from "../../infrastructure/services/firebaseConnection";
import { IconTrash } from "../Icons";

interface ExcluirAudioProps {
  id: string;
  descricao?: string;
}

const ExcluirAudio: React.FC<ExcluirAudioProps> = ({ id, descricao }) => {
  const [aberto, setAberto] = useState(false);
  const [excluindo, setExcluindo] = useState(false);

  const excluir = async () => {
    setExcluindo(true);
    try {
      await deleteDoc(doc(db, "audios", id));
      toast.success("Áudio apagado com sucesso!");
      setAberto(false);
    } catch (erro) {
      console.error("Erro ao apagar áudio: ", erro);
      toast.error("Erro ao apagar o áudio.");
    } finally {
      setExcluindo(false);
    }
  };

  return (
    <>
      <Tooltip title="Apagar">
        <button
          type="button"
          className="btn btn--ghost btn--icon btn--sm btn--perigo"
          onClick={() => setAberto(true)}
          aria-label="Apagar áudio"
        >
          <IconTrash size={17} />
        </button>
      </Tooltip>

      <Modal
        title="Apagar áudio"
        open={aberto}
        onOk={excluir}
        onCancel={() => setAberto(false)}
        okText="Apagar"
        cancelText="Cancelar"
        okButtonProps={{ danger: true }}
        confirmLoading={excluindo}
      >
        <p style={{ margin: 0, color: "var(--text-dim)" }}>
          Tem certeza que deseja apagar
          {descricao ? (
            <>
              {" "}
              <strong style={{ color: "var(--text)" }}>“{descricao}”</strong>?
            </>
          ) : (
            " esse áudio?"
          )}
          <br />
          Essa ação não pode ser desfeita.
        </p>
      </Modal>
    </>
  );
};

export default ExcluirAudio;
