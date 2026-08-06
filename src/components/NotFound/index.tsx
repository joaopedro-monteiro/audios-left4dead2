import { Link } from "react-router-dom";
import { BrandMark } from "../Icons";
import "./not-found.css";

export default function NotFound(): JSX.Element {
  return (
    <div className="nao-encontrado">
      <BrandMark size={72} />
      <p className="nao-encontrado__codigo">404</p>
      <h1>Essa página virou pasto de Tank</h1>
      <p className="nao-encontrado__texto">
        O endereço que você tentou abrir não existe (ou foi levado pelo Smoker).
      </p>
      <Link to="/" className="btn btn--primary">
        Voltar para os áudios
      </Link>
    </div>
  );
}
