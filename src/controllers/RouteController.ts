import type { Request, Response } from "express";
import { SerieService } from "../services/SerieService.js";
import { UsuarioService } from "../services/UsuarioService.js";

export class ControladorProgresso {
  private service = new SerieService();
  private usuarioService = new UsuarioService();

  async obterMinhaLista(req: Request, res: Response): Promise<Response> {
    try {

      const { usuario_id } = req.query;

      if (!usuario_id) {
        return res
          .status(400)
          .json({ erro: "Usuário não identificado para listar as séries." });
      }

      const lista = await this.service.listarPorUsuario(String(usuario_id));
      return res.status(200).json(lista);
    } catch (erro) {
      return res.status(500).json({
        erro:
          erro instanceof Error
            ? erro.message
            : "Erro ao carregar lista de séries.",
      });
    }
  }

  async adicionarSerie(req: Request, res: Response): Promise<Response> {
    try {
      const { usuario_id } = req.body;

      if (!usuario_id) {
        return res
          .status(400)
          .json({ erro: "A série precisa estar vinculada a um usuário." });
      }

      const serie = await this.service.adicionar(req.body);
      return res.status(201).json(serie);
    } catch (erro) {
      return res.status(400).json({
        erro: erro instanceof Error ? erro.message : "Erro interno.",
      });
    }
  }

  async assistirEpisodio(
    req: Request<{ id: string }>,
    res: Response,
  ): Promise<Response> {
    try {
      const serie = await this.service.assistir(req.params.id);
      return res.status(200).json(serie);
    } catch (erro) {
      return res.status(400).json({
        erro: erro instanceof Error ? erro.message : "Erro interno.",
      });
    }
  }

  async diminuirEpisodio(
    req: Request<{ id: string }>,
    res: Response,
  ): Promise<Response> {
    try {
      const serie = await this.service.diminuir(req.params.id);
      return res.status(200).json(serie);
    } catch (erro) {
      return res.status(400).json({
        erro: erro instanceof Error ? erro.message : "Erro interno.",
      });
    }
  }

  async removerSerie(
    req: Request<{ id: string }>,
    res: Response,
  ): Promise<Response> {
    try {
      await this.service.remover(req.params.id);
      return res.status(200).json({
        mensagem: "Série removida com sucesso!",
      });
    } catch (erro) {
      return res.status(404).json({
        erro: erro instanceof Error ? erro.message : "Erro interno.",
      });
    }
  }

  async obterEstatisticasUsuario(
    req: Request<{ idUsuario: string }>,
    res: Response,
  ): Promise<Response> {
    try {
      const { idUsuario } = req.params;

      if (!idUsuario) {
        return res.status(400).json({ erro: "ID do usuário não fornecido." });
      }

      const estatisticas = await this.service.estatisticasPorUsuario(idUsuario);
      return res.status(200).json(estatisticas);
    } catch (erro) {
      return res.status(500).json({
        erro:
          erro instanceof Error
            ? erro.message
            : "Erro ao calcular estatísticas.",
      });
    }
  }

  async cadastrarUsuario(req: Request, res: Response): Promise<Response> {
    try {
      const usuario = await this.usuarioService.cadastrar(req.body);
      return res.status(201).json(usuario);
    } catch (erro) {
      return res.status(400).json({
        erro:
          erro instanceof Error
            ? erro.message
            : "Erro interno ao cadastrar usuário.",
      });
    }
  }

  async logarUsuario(req: Request, res: Response): Promise<Response> {
    try {
      const resultado = await this.usuarioService.login(req.body);
      // Retorna o token e os dados do usuário com sucesso
      return res.status(200).json(resultado);
    } catch (erro) {
      return res.status(401).json({
        erro:
          erro instanceof Error
            ? erro.message
            : "Erro interno ao realizar login.",
      });
    }
  }
}
