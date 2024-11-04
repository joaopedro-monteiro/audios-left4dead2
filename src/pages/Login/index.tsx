import { Button, Checkbox, Flex, Form, Input } from "antd";
import "./login.css";
import { LockOutlined, UserOutlined } from "@ant-design/icons";
import { useContext, useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../infrastructure/services/firebaseConnection";
import { toast } from "react-toastify";
import { AuthContext } from "../../infrastructure/context/auth";
import { sign } from "crypto";

export default function Login() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");

  const { signIn } = useContext(AuthContext);

  const onFinish = async () => {
    if(email === "" || senha === "") {
      toast.error("Preencha todos os campos");
      return;
    }
    await signIn(email, senha);
    // await signInWithEmailAndPassword(auth, email, senha)
    //   .then(() => {
    //     toast.success("Login efetuado com sucesso");
    //   })
    //   .catch((error) => {
    //     console.log(error);
    //     toast.error("Email ou senha inválidos");
    //   });
  };

  return (
    <div className="container-background">
      <div className="container-login">
        <img
          className="logo"
          src="https://firebasestorage.googleapis.com/v0/b/audios-left4dead.appspot.com/o/images%2Fleft%204%20dead%202%20icon.png?alt=media&token=e30a4615-ed47-404f-830d-d0eb1fcb62ca"
          alt="Ícone do Left 4 Dead 2"
        ></img>
        <Form
          name="login"
          initialValues={{ remember: true }}
          style={{ maxWidth: 360 }}
          onFinish={onFinish}
        >
          <Form.Item
            name="email"
            rules={[{ required: true, message: "Por favor, digite o e-mail" }]}
          >
            <Input
              prefix={<UserOutlined />}
              type="email"
              placeholder="E-mail"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
              }}
            />
          </Form.Item>
          <Form.Item
            name="password"
            rules={[{ required: true, message: "Por favor, digite a senha" }]}
          >
            <Input
              prefix={<LockOutlined />}
              type="password"
              placeholder="Senha"
              value={senha}
              onChange={(e) => {
                setSenha(e.target.value);
              }}
            />
          </Form.Item>
          <Form.Item>
            <Flex justify="space-between" align="center">
              <Form.Item name="remember" valuePropName="checked" noStyle>
                <Checkbox>Lembrar</Checkbox>
              </Form.Item>
            </Flex>
          </Form.Item>

          <Form.Item>
            <Button block type="primary" htmlType="submit">
              Entrar
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
}
