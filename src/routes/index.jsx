import { Routes, Route } from "react-router-dom";

import NavBar from "../components/Navbar";
import AddAudio from "../pages/AddAudio";
import Login from "../pages/Login";
import Private from "./Private";
import AudiosNovoLayout from "../pages/Audios/novoLayout";
import NotFound from "../components/NotFound";

function RoutesApp() {
    return (
        <Routes>
            {/* <Route path="/" element={<NavBar tituloDaPagina="Áudios"><TableAudios /></NavBar>} /> */}
            <Route path="add-audio" element={<Private><NavBar tituloDaPagina="Adicionar Áudios"><AddAudio /></NavBar></Private>} />
            <Route path="login" element={<Login />}/>
            <Route path="/" element={<NavBar tituloDaPagina="Áudios"><AudiosNovoLayout /></NavBar>} />
            <Route path="*" element={<NotFound />} />
        </Routes>
    );
}

export default RoutesApp;