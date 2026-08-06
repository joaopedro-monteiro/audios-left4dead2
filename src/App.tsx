import { BrowserRouter } from "react-router-dom";
import { ConfigProvider } from "antd";
import ptBR from "antd/locale/pt_BR";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import RoutesApp from "./routes";
import { AuthProvider } from "./infrastructure/context/auth";
import { AutoresProvider } from "./infrastructure/context/autores";
import { PlayerProvider } from "./infrastructure/context/player";
import { antdTheme } from "./theme/antdTheme";

function App() {
  return (
    <ConfigProvider theme={antdTheme} locale={ptBR}>
      <BrowserRouter>
        <ToastContainer
          position="top-right"
          autoClose={2500}
          theme="dark"
          limit={3}
          newestOnTop
          pauseOnFocusLoss={false}
        />
        <AuthProvider>
          <AutoresProvider>
            <PlayerProvider>
              <RoutesApp />
            </PlayerProvider>
          </AutoresProvider>
        </AuthProvider>
      </BrowserRouter>
    </ConfigProvider>
  );
}

export default App;
