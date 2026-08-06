import { Routes, Route } from "react-router-dom";

import AppShell from "../components/AppShell";
import AddAudio from "../pages/AddAudio";
import AudiosPage from "../pages/Audios";
import Login from "../pages/Login";
import NotFound from "../components/NotFound";
import Private from "./Private";

function RoutesApp() {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <AppShell tituloDaPagina="Áudios">
            <AudiosPage />
          </AppShell>
        }
      />
      <Route
        path="add-audio"
        element={
          <Private>
            <AppShell tituloDaPagina="Adicionar áudio">
              <AddAudio />
            </AppShell>
          </Private>
        }
      />
      <Route path="login" element={<Login />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default RoutesApp;
