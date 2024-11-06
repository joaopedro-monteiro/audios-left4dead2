import { useNavigate } from "react-router-dom";
import "./notFround.css";

export default function NotFound(): JSX.Element {
  const navigate = useNavigate();
  function voltarParaHome() {
    navigate("/");
  }

  return (
    <div>
      <h1>404 Error Page</h1>
      <p className="zoom-area"></p>
      <section className="error-container">
        <span className="four">
          <span className="screen-reader-text">4</span>
        </span>
        <span className="zero">
          <span className="screen-reader-text">0</span>
        </span>
        <span className="four">
          <span className="screen-reader-text">4</span>
        </span>
      </section>
      <div className="link-container">
        <button className="button-back" onClick={voltarParaHome}>
          Voltar para a página principal
        </button>
      </div>
    </div>
  );
}
