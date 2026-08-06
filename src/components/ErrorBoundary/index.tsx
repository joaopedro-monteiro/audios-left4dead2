import React from "react";
import TelaErro from "../TelaErro";

interface Props {
  children: React.ReactNode;
}

interface State {
  erro: Error | null;
}

/**
 * Impede que um erro de renderização deixe a tela em branco (ou presa no
 * splash de carregamento do index.html).
 */
class ErrorBoundary extends React.Component<Props, State> {
  state: State = { erro: null };

  static getDerivedStateFromError(erro: Error): State {
    return { erro };
  }

  componentDidCatch(erro: Error, info: React.ErrorInfo) {
    console.error("Erro não tratado na interface:", erro, info.componentStack);
  }

  render() {
    if (this.state.erro) {
      return (
        <TelaErro
          titulo="Alguma coisa quebrou por aqui"
          descricao="Tivemos um problema para montar a página. Recarregar costuma resolver."
          detalhes={[this.state.erro.message]}
        />
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
