import { v4 as uuidv4 } from "uuid";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import type { Usuario } from "../models/Usuario.js";
import { UsuarioRepository } from "../repository/UsuarioRepository.js";

const JWT_SECRET = "sua_chave_secreta_super_segura_aqui";

export class UsuarioService {
  private repository = new UsuarioRepository();

  private obterIniciais(nome: string): string {
    const partes = nome.trim().split(" ");
    if (partes.length >= 2) {
      return (partes[0][0] + partes[partes.length - 1][0]).toUpperCase();
    }
    return partes[0].substring(0, 2).toUpperCase();
  }

  async cadastrar(dados: any): Promise<Usuario> {
    const { nome, email, senha } = dados;

    if (!nome || nome.trim().length < 3)
      throw new Error("O nome deve possuir pelo menos 3 caracteres.");
    if (!email || !email.includes("@")) throw new Error("E-mail inválido.");
    if (!senha || senha.length < 6)
      throw new Error("A senha deve possuir pelo menos 6 caracteres.");

    const usuarioExistente = await this.repository.buscarPorEmail(email);
    if (usuarioExistente) throw new Error("Este e-mail já está cadastrado.");

    const senhaCriptografada = await bcrypt.hash(senha, 10);

    const novoUsuario: Usuario = {
      id: uuidv4(),
      nome,
      email,
      senha: senhaCriptografada,
    };

    await this.repository.salvar(novoUsuario);

    const { senha: _, ...usuarioSemSenha } = novoUsuario;
    return usuarioSemSenha as Usuario;
  }

  async login(dados: any): Promise<{ token: string; usuario: any }> {
    const { email, senha } = dados;

    if (!email || !senha) {
      throw new Error("E-mail e senha são obrigatórios.");
    }

    const usuario = await this.repository.buscarPorEmail(email);
    if (!usuario || !usuario.senha) {
      throw new Error("E-mail ou senha inválidos.");
    }

    const senhaValida = await bcrypt.compare(senha, usuario.senha);
    if (!senhaValida) {
      throw new Error("E-mail ou senha inválidos.");
    }

    const iniciais = this.obterIniciais(usuario.nome);

    const token = jwt.sign(
      { id: usuario.id, nome: usuario.nome, iniciais },
      JWT_SECRET,
      { expiresIn: "1d" }, 
    );

    return {
      token,
      usuario: {
        id: usuario.id,
        nome: usuario.nome,
        email: usuario.email,
        iniciais,
      },
    };
  }
}
