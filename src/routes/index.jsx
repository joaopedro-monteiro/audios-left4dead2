import { Routes, Route } from "react-router-dom";

import NavBar from "../components/Navbar";
import AddAudio from "../pages/AddAudio";
import TableAudios from "../pages/Audios";

function RoutesApp() {
    return (
        <Routes>
            <Route path="/" element={<NavBar tituloDaPagina="Áudios"><TableAudios /></NavBar>} />
            <Route path="add-audio" element={<NavBar tituloDaPagina="Adicionar Áudios"><AddAudio /></NavBar>} />
        </Routes>
    );
}

export default RoutesApp;