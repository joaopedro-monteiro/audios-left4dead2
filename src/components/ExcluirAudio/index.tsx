import { Button, Modal, Tooltip } from "antd";
import { useState } from "react";
import { DeleteTwoTone } from "@ant-design/icons";
import { deleteDoc, doc } from "firebase/firestore";
import { db } from "../../infrastructure/services/firebaseConnection";
import { toast } from "react-toastify";

interface ExcluirAudioProps {
  id: string;
}

const ExcluirAudio: React.FC<ExcluirAudioProps> = ({ id }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = async () => {
    const docRef = doc(db, "audios", id);
    await deleteDoc(docRef).then(() => {
      toast.success("Áudio apagado com sucesso!");
      console.log("Document successfully deleted!");
    })
    .catch((error) => {
        console.error("Error removing document: ", error);
        toast.error("Erro ao apagar áudio");
    });

    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      <Tooltip title="Apagar">
        <DeleteTwoTone onClick={showModal} />
      </Tooltip>
      <Modal
        title="Apagar áudio"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <p>Tem certeza que deseja apagar esse áudio?</p>
      </Modal>
    </>
  );
};

export default ExcluirAudio;
