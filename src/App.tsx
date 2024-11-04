import React from "react";
import { BrowserRouter } from "react-router-dom";
import RoutesApp from "./routes";
import "./App.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AuthProvider } from "./infrastructure/context/auth";
import { AutoresProvider } from "./infrastructure/context/autores";

function App() {
  return (
    <BrowserRouter>
      <ToastContainer autoClose={3000} />
      <AuthProvider>
        <AutoresProvider>
          <RoutesApp />
        </AutoresProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
