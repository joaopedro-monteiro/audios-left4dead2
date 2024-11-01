import React, { useState } from "react";
import { Button, Form, Input, Modal } from "antd";
import { PlusCircleOutlined } from "@ant-design/icons";
import { addDoc, collection } from "firebase/firestore";
import { db } from "../../infrastructure/services/firebaseConnection";
import { toast } from "react-toastify";

const NovoAutor: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [autor, setAutor] = useState<string>("");

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = async () => {
    if (!autor) {
      toast.error("Por favor, preencha o nome do autor.");
      return;
    }

    try {
      await addDoc(collection(db, "autores"), {
        nome: autor,
      });
      toast.success("Autor adicionado com sucesso");
      setAutor("");
      setIsModalOpen(false);
    } catch (error) {
      console.error("Error adding document: ", error);
      toast.error("Erro ao adicionar autor");
    }
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    setAutor("");
  };

  return (
    <>
      <Button type="dashed" onClick={showModal}>
        Adicionar novo autor <PlusCircleOutlined />
      </Button>
      <Modal
        title="Adicionar autor"
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
          <Form.Item label="Nome">
            <Input
              placeholder="Nome do autor"
              value={autor}
              onChange={(e) => {
                console.log("Input Value: ", e.target.value); // Debugging
                setAutor(e.target.value);
              }}
            />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default NovoAutor;
