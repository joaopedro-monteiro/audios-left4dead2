import React from "react";
import { Breadcrumb, Layout, Menu, theme } from "antd";
import { SoundOutlined, PlusCircleOutlined } from "@ant-design/icons";
import type { MenuProps } from "antd";
import { useNavigate } from "react-router-dom";

const { Header, Content, Footer } = Layout;

type MenuItem = Required<MenuProps>["items"][number];

function getItem(
  label: React.ReactNode,
  key: React.Key,
  icon?: React.ReactNode,
  children?: MenuItem[],
  route: string = label as string
): MenuItem {
  return {
    key,
    icon,
    children,
    label,
  } as MenuItem;
}

const items: MenuItem[] = [
  getItem("Áudios", "1", <SoundOutlined />),
  getItem("Adicionar Áudio", "2", <PlusCircleOutlined />),
];

interface NavBarProps {
  children: React.ReactNode;
  tituloDaPagina: string;
}

const Navbar: React.FC<NavBarProps> = ({ children, tituloDaPagina }) => {
  const navigate = useNavigate();

  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const handleMenuClick: MenuProps["onClick"] = (e) => {
    switch (e.key) {
      case "1":
        navigate("/");
        break;
      case "2":
        navigate("/add-audio");
        break;
    }
  };

  return (
    <Layout style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <Header style={{ display: "flex", alignItems: "center" }}>
        <div className="demo-logo" />
        <Menu
          theme="dark"
          mode="horizontal"
          defaultSelectedKeys={["2"]}
          items={items}
          style={{ flex: 1, minWidth: 0 }}
          onClick={handleMenuClick}
        />
      </Header>
      <Content style={{ padding: "0 10px", flex: 1 }}>
        <Breadcrumb
          style={{ margin: "16px 0" }}
          items={[{ title: "Home" }, { title: tituloDaPagina }]}
        />
        <div
          style={{
            background: colorBgContainer,
            minHeight: 280,
            padding: 24,
            borderRadius: borderRadiusLG,
          }}
        >
          {children}
        </div>
      </Content>
      <Footer style={{ textAlign: "center", backgroundColor: "black", color: "white" }}>
        Áudios Left 4 Dead 2 ©{new Date().getFullYear()} Created by <a href="https://steamcommunity.com/id/fearw33/" target="_blank" rel="noreferrer">Fear</a>
      </Footer>
    </Layout>
  );
};

export default Navbar;
