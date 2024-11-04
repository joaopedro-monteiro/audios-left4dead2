import { Button, Form, Input, Modal, Select, Tooltip } from "antd";
import { useContext, useState } from "react";
import { EditTwoTone } from "@ant-design/icons";
import { AutoresContext } from "../../infrastructure/context/autores";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../../infrastructure/services/firebaseConnection";
import { toast } from "react-toastify";

interface EditarAudioProps {
  id: string;
  descricaoAtual: string;
  atorAtual: string;
}

const EditarAudio: React.FC<EditarAudioProps> = ({id, descricaoAtual, atorAtual}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const[descricao, setDescricao] = useState<string>(descricaoAtual);
  const[autorSelected, setAutorSelected] = useState<string>(atorAtual);

  const { autores, loadAutores } = useContext(AutoresContext);

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = async () => {
    const docRef = doc(db, "audios", id);
    await updateDoc(docRef, {
      descricao: descricao,
      autor: autorSelected,
    })
    .then(() => {
      toast.success("Áudio editado com sucesso!");
    })
    .catch((error) => {
      console.error("Erro ao edtir áudio: ", error);
      toast.error("Erro ao editar áudio");
    });

    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  return (
    <>
    <Tooltip title="Editar"><EditTwoTone onClick={showModal}/></Tooltip>      
      <Modal
        title="Editar Áudio"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <Form
          labelCol={{ span: 6 }}
          wrapperCol={{ span: 14 }}
          layout="horizontal"
          style={{ maxWidth: 600 }}
        >
          <Form.Item label="Descrição">
            <Input
              placeholder="Descrição do áudio"
              value={descricao}
              onChange={(e) => {
                console.log("Input Value: ", e.target.value); // Debugging
                setDescricao(e.target.value);
              }}
            />
          </Form.Item>
          <Form.Item label="Autor">
          <Select
              value={autorSelected}
              onChange={(value) => setAutorSelected(value)} 
              onDropdownVisibleChange={loadAutores}             
            >
              {autores.map((autor) => (
                <Select.Option key={autor} value={autor}>
                  {autor}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default EditarAudio;