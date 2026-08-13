import type { Usuario } from "../models/Usuario.js";
import { conexao } from "../config/database.js";
import type { ResultSetHeader } from "mysql2";

export class UsuarioRepository {
  async listar(): Promise<Usuario[]> {
    const [rows] = await conexao.query("SELECT * FROM usuarios ORDER BY nome");
    return rows as Usuario[];
  }

  async buscarPorId(id: string): Promise<Usuario | undefined> {
    const [rows] = await conexao.query("SELECT * FROM usuarios WHERE id = ?", [
      id,
    ]);
    return (rows as Usuario[])[0];
  }

  async buscarPorEmail(email: string): Promise<Usuario | undefined> {
    const [rows] = await conexao.query(
      "SELECT * FROM usuarios WHERE email = ?",
      [email],
    );
    const usuarios = rows as Usuario[];
    return usuarios[0];
  }

  async salvar(usuario: Usuario): Promise<void> {
    await conexao.query(
      "INSERT INTO usuarios (id, nome, email, senha) VALUES (?, ?, ?, ?)",
      [usuario.id, usuario.nome, usuario.email, usuario.senha],
    );
  }

  async remover(id: string): Promise<boolean> {
    const [resultado] = await conexao.query<ResultSetHeader>(
      "DELETE FROM usuarios WHERE id = ?",
      [id],
    );
    return resultado.affectedRows > 0;
  }
}
