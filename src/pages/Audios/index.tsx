import { useContext, useEffect, useRef, useState } from "react";
import { Card, Input, Space, Table } from "antd";
import type { TableColumnsType, TableProps } from "antd";
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import { SearchOutlined } from "@ant-design/icons";
import { db } from "../../infrastructure/services/firebaseConnection";
import { ColumnFilterItem } from "antd/es/table/interface";
import { AuthContext } from "../../infrastructure/context/auth";
import EditarAudio from "../../components/EditarAudio";
import ExcluirAudio from "../../components/ExcluirAudio";

export default function TableAudios(): JSX.Element {
  const [audios, setAudios] = useState<Audio[]>([]);
  const [autores, setAutores] = useState<ColumnFilterItem[]>([]);
  const [searchedText, setSearchedText] = useState<string>("");

  const [isMobile, setIsMobile] = useState<boolean>(window.innerWidth < 768);

  const { signed } = useContext(AuthContext);

  interface Audio {
    id: string;
    descricao: string;
    autor: string;
    url: string;
    duracao: string;
  }

  const columns: TableColumnsType<Audio> = [
    {
      title: "Descrição",
      dataIndex: "descricao",
      width: "50%",
      filteredValue: [searchedText],
      onFilter: (value, record) => {
        return record.descricao.includes(value as string) ?? false;
      },
      // responsive: ["lg"],
    },
    {
      title: "Autor",
      dataIndex: "autor",
      filters: autores,
      filterMode: "tree",
      filterSearch: true,
      onFilter: (value, record) => record.autor.startsWith(value as string),
      width: "10%",
      // responsive: ["lg"],
    },
    {
      title: "Áudio",
      dataIndex: "url",
      width: "8%",
      render: (url: string) => (
        <audio controls>
          <source src={url} type="audio/mpeg" />
          Your browser does not support the audio element.
        </audio>
      ),
      // responsive: ["lg"],
    },
    {
      title: "Duração",
      dataIndex: "duracao",
      width: "5%",
      // responsive: ["lg"],
    },
  ];

  if (signed) {
    columns.push({
      title: "Ações",
      width: "2%",
      render: (_, record) => (
        <Space size="middle">
          <EditarAudio
            id={record.id}
            descricaoAtual={record.descricao}
            atorAtual={record.autor}
          />
          <ExcluirAudio id={record.id} />
        </Space>
      ),
    });
  }

  const onChange: TableProps<Audio>["onChange"] = (
    pagination,
    filters,
    sorter,
    extra
  ) => {
    console.log("params", pagination, filters, sorter, extra);
  };

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
    });
    // const querySnapshot = await getDocs(q);
    // setAudios([]);

    // await updateState(querySnapshot);

    // console.log("Audios carregados: ", audios);

    console.log("audios carregados: ", audios);
    return () => unsubscribe();
    // loadAudios();
  }, []);

  // async function updateState(querySnapshot: any) {
  //   const isCollectionEmpty = querySnapshot.size === 0;

  //   if (isCollectionEmpty) {
  //     alert("No documents in collection");
  //     return;
  //   }
  //   let lista: Audio[] = [];

  //   querySnapshot.forEach((doc: any) => {
  //     lista.push({
  //       id: doc.id,
  //       descricao: doc.data().descricao,
  //       autor: doc.data().autor,
  //       url: doc.data().url,
  //       duracao: doc.data().duracao,
  //     });
  //   });
  //   setAudios((audios) => [...audios, ...lista]);

  //   const uniqueAuthors = Array.from(
  //     new Set(lista.map((audio) => audio.autor))
  //   ).map((autor) => ({
  //     text: autor,
  //     value: autor,
  //   }));
  //   setAutores(uniqueAuthors);
  // }

  return (
    <>
      {isMobile ? (
        <Space direction="vertical" size={16}>
          {audios.map((audio) => (
            <Card
              title={
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  {audio.descricao}
                </div>
              }
              style={{ width: 350 }}
              key={audio.id}
            >
              <h3>Autor: {audio.autor}</h3>
              <audio controls style={{ width: "300px" }}>
                <source src={audio.url} type="audio/mpeg" />
                Your browser does not support the audio element.
              </audio>
              <p>Duração: {audio.duracao}</p>
              {signed && (
                <p> Ações: 
                  <EditarAudio
                    id={audio.id}
                    descricaoAtual={audio.descricao}
                    atorAtual={audio.autor}
                  />
                  <ExcluirAudio id={audio.id} />
                </p>
              )}
            </Card>
          ))}
        </Space>
      ) : (
        <div>
          <Input.Search
            placeholder="Pesquisar"
            onSearch={(value) => {
              setSearchedText(value);
            }}
            prefix={<SearchOutlined />}
            style={{ marginBottom: 16 }}
          />
          <Table<Audio>
            columns={columns}
            dataSource={audios.map((audio) => ({ ...audio, key: audio.id }))}
            onChange={onChange}
          />
        </div>
      )}
    </>
  );
}
