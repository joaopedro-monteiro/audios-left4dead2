/** Um áudio como ele é exibido na listagem. */
export interface Audio {
  id: string;
  descricao: string;
  autor: string;
  url: string;
  duracao: string;
  /** Data de envio; documentos antigos podem não ter. */
  createdAt: Date | null;
}
