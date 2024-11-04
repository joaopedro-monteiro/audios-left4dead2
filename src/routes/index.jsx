import { Routes, Route } from "react-router-dom";

import NavBar from "../components/Navbar";
import AddAudio from "../pages/AddAudio";
import TableAudios from "../pages/Audios";
import Login from "../pages/Login";
import Private from "./Private";

function RoutesApp() {
    return (
        <Routes>
            <Route path="/" element={<NavBar tituloDaPagina="Áudios"><TableAudios /></NavBar>} />
            <Route path="add-audio" element={<Private><NavBar tituloDaPagina="Adicionar Áudios"><AddAudio /></NavBar></Private>} />
            <Route path="login" element={<Login />}/>
        </Routes>
    );
}

export default RoutesApp;