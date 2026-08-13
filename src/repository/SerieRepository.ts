import { conexao } from "../config/database.js";

export class SerieRepository {

  async listarPorUsuario(usuarioId: string): Promise<any[]> {
    const [rows] = await conexao.query(
      "SELECT * FROM series WHERE usuario_id = ?",
      [usuarioId],
    );
    return rows as any[];
  }

  async salvar(serie: any): Promise<void> {
    await conexao.query(
      `INSERT INTO series
  (id, titulo, ano, sinopse, status, episodiosAssistidos, totalEpisodios, duracaoEpisodio, imagem, usuario_id)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        serie.id,
        serie.titulo,
        serie.ano,
        serie.sinopse,
        serie.status,
        serie.episodiosAssistidos || 0,
        serie.totalEpisodios,
        serie.duracaoEpisodio,
        serie.urlImagem || serie.imagem,
        serie.usuario_id,
      ],
    );
  }

  async buscarPorId(id: string): Promise<any> {
    const [linhas]: any = await conexao.query(
      "SELECT * FROM series WHERE id = ?",
      [id],
    );
    return linhas.length > 0 ? linhas[0] : null;
  }

  async atualizar(serie: any): Promise<void> {
    await conexao.query(
      "UPDATE series SET episodiosAssistidos = ?, status = ? WHERE id = ?",
      [serie.episodiosAssistidos, serie.status, serie.id],
    );
  }

  async remover(id: string): Promise<boolean> {
    const [resultado]: any = await conexao.query(
      "DELETE FROM series WHERE id = ?",
      [id],
    );
    return resultado.affectedRows > 0;
  }
}
