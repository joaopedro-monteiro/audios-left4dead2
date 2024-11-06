import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import { useContext, useEffect, useRef, useState } from "react";
import { db } from "../../infrastructure/services/firebaseConnection";
import { Card, Col, Input, Row, Spin, Tooltip } from "antd";
import EditarAudio from "../../components/EditarAudio";
import ExcluirAudio from "../../components/ExcluirAudio";
import { AuthContext } from "../../infrastructure/context/auth";
import { SearchOutlined } from "@ant-design/icons";

const style: React.CSSProperties = {
  padding: "8px 0",
};

export default function AudiosNovoLayout(): JSX.Element {
  interface Audio {
    id: string;
    descricao: string;
    autor: string;
    url: string;
    duracao: string;
  }

  const [audios, setAudios] = useState<Audio[]>([]);
  const { signed } = useContext(AuthContext);
  const [searchedText, setSearchedText] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(true);
  
  const audioRefs = useRef<HTMLAudioElement[]>([]);

  useEffect(() => {
    const q = query(collection(db, "audios"), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const dadosAtualizados = snapshot.docs.map((doc) => ({
        id: doc.id,
        descricao: doc.data().descricao,
        autor: doc.data().autor,
        url: doc.data().url,
        duracao: doc.data().duracao,
      }));
      setAudios(dadosAtualizados);
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const filteredAudios = audios.filter(
    (audio) =>
      audio.descricao.toLowerCase().includes(searchedText.toLowerCase()) ||
      audio.autor.toLowerCase().includes(searchedText.toLowerCase())
  );

  const handlePlay = (currentAudio: HTMLAudioElement) => {
    audioRefs.current.forEach((audio) => {
      if (audio !== currentAudio) {
        audio.pause();
      }
    });
  };

  return (
    <>
      {isLoading ? (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100vh",
          }}
        >
          <Spin size="large" tip="Carregando dados..." />
        </div>
      ) : (
        <div>
          <Input
            placeholder="Pesquisar áudios/autores"
            onChange={(e) => setSearchedText(e.target.value)}
            style={{ marginBottom: 16 }}
            prefix={<SearchOutlined />}
          />
          <Row
            gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}
            justify="start"
            align="middle"
          >
            {filteredAudios.map((audio, index) => (
              <Col
                key={audio.id}
                xs={{ flex: "100%" }}
                sm={{ flex: "50%" }}
                md={{ flex: "40%" }}
                lg={{ flex: "30%" }}
                xl={{ flex: "20%" }}
              >
                <div style={style}>
                  <Card
                    style={{
                      border: "1px solid #333638",
                      boxShadow: "0 0 5px #2d9ae2",
                    }}
                    title={
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <Tooltip title={audio.descricao}>
                          {audio.descricao.length > 34
                            ? audio.descricao.substring(0, 34) + "..."
                            : audio.descricao}
                        </Tooltip>
                      </div>
                    }
                    bordered={true}
                    actions={[
                      signed && (
                        <EditarAudio
                          id={audio.id}
                          atorAtual={audio.autor}
                          descricaoAtual={audio.descricao}
                        />
                      ),
                      signed && <ExcluirAudio id={audio.id} />,
                    ]}
                  >
                    <h3>Autor: {audio.autor}</h3>
                    <audio
                      controls
                      style={{ width: "250px" }}
                      ref={(el) => {
                        if (el && !audioRefs.current.includes(el)) {
                          audioRefs.current[index] = el;
                        }
                      }}
                      onPlay={(e) => handlePlay(e.currentTarget)}
                    >
                      <source src={audio.url} type="audio/mpeg" />
                      Your browser does not support the audio element.
                    </audio>
                    <p>Duração: {audio.duracao}</p>
                  </Card>
                </div>
              </Col>
            ))}
          </Row>
        </div>
      )}
    </>
  );
}