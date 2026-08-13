import { v4 as uuidv4 } from "uuid";
import { SerieRepository } from "../repository/SerieRepository.js";

export class SerieService {
  private repository: any = new SerieRepository();

  async listarPorUsuario(usuarioId: string): Promise<any[]> {
    return await this.repository.listarPorUsuario(usuarioId);
  }

  async adicionar(dados: any): Promise<any> {
    const {
      titulo,
      ano,
      sinopse,
      totalEpisodios,
      duracaoEpisodio,
      status,
      urlImagem,
      usuario_id,
    } = dados;

    if (!titulo || titulo.trim().length < 2) {
      throw new Error("Título deve possuir pelo menos 2 caracteres.");
    }

    if (ano && ano.trim().length > 20) {
      throw new Error("Ano inválido.");
    }

    if (sinopse && sinopse.trim().length > 2000) {
      throw new Error("A sinopse deve possuir no máximo 2000 caracteres.");
    }

    if (Number(totalEpisodios) <= 0) {
      throw new Error("Quantidade de episódios inválida.");
    }

    if (
      duracaoEpisodio !== undefined &&
      Number(duracaoEpisodio) <= 0
    ) {
      throw new Error("Duração inválida.");
    }

    const novaSerie: any = {
      id: uuidv4(),

      titulo,

      ano: ano || "",
      sinopse: sinopse || "",

      status: status || "planejado",

      episodiosAssistidos:
        status === "concluido"
          ? Number(totalEpisodios)
          : 0,

      totalEpisodios: Number(totalEpisodios),

      duracaoEpisodio:
        Number(duracaoEpisodio) || 45,

      imagem:
        urlImagem ||
        "https://images.unsplash.com/photo-1485846234645-a62644f84728?w=500",

      usuario_id,
    };

    await this.repository.salvar(novaSerie);

    return novaSerie;
  }

  async assistir(id: string): Promise<any> {
    const serie = await this.repository.buscarPorId(id);

    if (!serie) {
      throw new Error("Série não encontrada.");
    }

    if (serie.episodiosAssistidos >= serie.totalEpisodios) {
      throw new Error("Todos os episódios já foram assistidos.");
    }

    serie.episodiosAssistidos++;

    if (serie.episodiosAssistidos === serie.totalEpisodios) {
      serie.status = "concluido";
    } else if (serie.status === "planejado") {
      serie.status = "assistindo";
    }

    await this.repository.atualizar(serie);

    return serie;
  }

  async diminuir(id: string): Promise<any> {
    const serie = await this.repository.buscarPorId(id);

    if (!serie) {
      throw new Error("Série não encontrada.");
    }

    if (serie.episodiosAssistidos <= 0) {
      throw new Error("Nenhum episódio assistido para remover.");
    }

    serie.episodiosAssistidos--;

    if (serie.episodiosAssistidos === 0) {
      serie.status = "planejado";
    } else if (
      serie.episodiosAssistidos < serie.totalEpisodios
    ) {
      serie.status = "assistindo";
    }

    await this.repository.atualizar(serie);

    return serie;
  }

  async remover(id: string): Promise<void> {
    const removido = await this.repository.remover(id);

    if (!removido) {
      throw new Error("Série não encontrada.");
    }
  }

  async estatisticasPorUsuario(usuarioId: string) {
    const lista =
      await this.repository.listarPorUsuario(usuarioId);

    let totalMinutos = 0;
    let totalEpisodiosAssistidos = 0;

    for (const serie of lista) {
      totalMinutos +=
        (serie.episodiosAssistidos || 0) *
        (serie.duracaoEpisodio || 45);

      totalEpisodiosAssistidos +=
        serie.episodiosAssistidos || 0;
    }

    return {
      totalHoras: Number(
        (totalMinutos / 60).toFixed(1)
      ),

      totalEpisodiosAssistidos,

      totalSeries: lista.length,

      seriesConcluidas: lista.filter(
        (s: any) => s.status === "concluido"
      ).length,

      seriesAssistindo: lista.filter(
        (s: any) => s.status === "assistindo"
      ).length,
    };
  }
}