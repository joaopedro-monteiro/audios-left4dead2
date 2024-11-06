import React, { useEffect, useState } from "react";
import { UploadOutlined } from "@ant-design/icons";
import { Button, Form, Input, Upload, Select, Row, Col, Flex } from "antd";
import { AudioCommand } from "../../infrastructure/commands/audio-command";
import { PlusCircleOutlined } from "@ant-design/icons";
import { db, storage } from "../../infrastructure/services/firebaseConnection";
import {
  collection,
  addDoc,
  query,
  orderBy,
  getDocs,
} from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { formatDuration } from "../../helpers/audio-duration-formatter";
import { toast } from "react-toastify";
import NovoAutor from "../../components/NovoAutor";

const { TextArea } = Input;

const AddAudioPage: React.FC = () => {
  const [audio, setAudio] = useState<AudioCommand>({});
  const [descricao, setDescricao] = useState<string>("");
  const [autor, setAutor] = useState<string>("");
  const [duracao, setDuracao] = useState<string>("");
  const [url, setUrl] = useState<string>(""); // Para a URL de visualização temporária
  const [audioFile, setAudioFile] = useState<File>();

  const [uploadKey, setUploadKey] = useState<number>(Date.now());

  const [durationAndAudioVisible, setDurationAndAudioVisible] =
    useState<boolean>(true);

  const [autoresLoad, setAutoresLoad] = useState<string[]>([]);

  const [novaOpcao, setNovaOpcao] = useState({ value: "", label: "" });
  const [isMobile, setIsMobile] = useState<boolean>(window.innerWidth < 768);

  async function handleLoadAutores() {
    const q = query(collection(db, "autores"), orderBy("nome", "asc"));

    const querySnapshot = await getDocs(q);
    setAutoresLoad([]);

    let listaAutores: string[] = [];

    querySnapshot.forEach((doc) => {
      listaAutores.push(doc.data().nome);
    });

    setAutoresLoad((autores) => [...autores, ...listaAutores]);

    console.log("Autores carregados: ", autoresLoad);
  }

  async function handleSubmit() {

    if (!descricao || !autor || !audioFile) {
      toast.error("Por favor, preencha todos os campos!");
      return;
    }

    audio.descricao = descricao;
    audio.autor = autor;
    audio.duracao = duracao;
    audio.createdAt = new Date();

    const audioUrl = await handleUpload();
    if (audioUrl) {
      audio.url = audioUrl;
      await addDoc(collection(db, "audios"), audio)
        .then(() => {
          setDescricao("");
          setAutor("");
          setDuracao("");
          setUrl("");
          setAudioFile(undefined);
          setUploadKey(Date.now());
          setDurationAndAudioVisible(true);
          toast.success("Áudio adicionado com sucesso!");
        })
        .catch((error) => {
          toast.error("Erro ao adicionar o áudio");
          console.error("Erro ao adicionar o documento: ", error);
        });
    }
  }

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) {
      setAudioFile(file);

      const tempUrl = URL.createObjectURL(file);
      setUrl(tempUrl);

      const audioElement = new Audio(tempUrl);
      audioElement.addEventListener("loadedmetadata", () => {
        const durationFormatted = formatDuration(audioElement.duration);
        setDuracao(durationFormatted);

        setDurationAndAudioVisible(false);
      });
    } else {
      alert("Selecione um arquivo de áudio válido");
      setAudioFile(undefined);
    }
  }

  async function handleUpload() {
    if (!audioFile) return;
    const uploadRef = ref(storage, `audios/${audioFile.name}`);

    try {
      const snapshot = await uploadBytes(uploadRef, audioFile);
      const downloadUrl = await getDownloadURL(snapshot.ref);
      return downloadUrl;
    } catch (error) {
      console.error("Erro ao fazer upload do arquivo: ", error);
      return null;
    }
  }

  return (
    <>
      <Form
        labelCol={{ span: 6 }}
        wrapperCol={{ span: 14 }}
        layout="horizontal"
        style={{ maxWidth: 600 }}
        onFinish={handleSubmit}
      >
        <Form.Item
          label="Descrição do áudio"
          rules={[
            {
              required: true,
              message: "Por favor, insira a descrição do áudio!",
            },
          ]}
        >
          <TextArea
            rows={4}
            value={descricao}
            onChange={(e) => setDescricao(e.target.value)}
          />
        </Form.Item>
        {isMobile ? (
          <Form.Item
            label="Autor do áudio"
            rules={[
              {
                required: true,
                message: "Por favor, insira o nome do autor!",
              },
            ]}
          >
            <Select
              value={autor}
              onChange={(value) => setAutor(value)}
              onDropdownVisibleChange={handleLoadAutores}
            >
              {autoresLoad.map((autor) => (
                <Select.Option key={autor} value={autor}>
                  {autor}
                </Select.Option>
              ))}
            </Select>
            <br />
            <NovoAutor />
          </Form.Item>
        ) : (
          <Form.Item
            label="Autor do áudio"
            rules={[
              {
                required: true,
                message: "Por favor, insira o nome do autor!",
              },
            ]}
          >
            <Row gutter={8}>
              <Col span={18}>
                <Select
                  value={autor}
                  onChange={(value) => setAutor(value)}
                  onDropdownVisibleChange={handleLoadAutores}
                >
                  {autoresLoad.map((autor) => (
                    <Select.Option key={autor} value={autor}>
                      {autor}
                    </Select.Option>
                  ))}
                </Select>
              </Col>
              <Col span={6}>
                <NovoAutor />
              </Col>
            </Row>
          </Form.Item>
        )}

        <Form.Item
          label="Upload"
          valuePropName="fileList"
          rules={[
            {
              required: true,
              message: "Por favor, insira um áudio!",
            },
          ]}
        >
          <input
            type="file"
            key={uploadKey}
            accept=".ogg, .mp3, .wav, audio/ogg, audio/mpeg, audio/*"
            onChange={handleFile}
          />
        </Form.Item>
        <Form.Item hidden={durationAndAudioVisible} label="Áudio">
          <audio controls src={url} />
        </Form.Item>
        <Form.Item label="Duração" hidden={durationAndAudioVisible}>
          {duracao}
        </Form.Item>
        <Form.Item
          wrapperCol={{
            xs: { span: 24, offset: 0 },
            sm: { span: 16, offset: 8 },
          }}
        >
          <Button type="primary" htmlType="submit">
            Adicionar áudio
          </Button>
        </Form.Item>
      </Form>
    </>
  );
};

export default AddAudioPage;
