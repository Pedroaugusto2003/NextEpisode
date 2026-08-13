import { adicionarSerie } from "./api.js";
import {
  carregarDadosAplicativo,
  filtrarStatus,
  assistirEpisodio,
  diminuirEpisodio,
  deletarSerie,
} from "./ui.js";

const formulario = document.getElementById("formulario-adicionar-serie");

if (formulario) {
  formulario.addEventListener("submit", async (e) => {
    e.preventDefault();

    const dados = {
      titulo: document.getElementById("campo-titulo").value,
      ano: document.getElementById("campo-ano").value,
      sinopse: document.getElementById("campo-sinopse").value,
      totalEpisodios: document.getElementById("campo-episodios").value,
      duracaoEpisodio: document.getElementById("campo-duracao").value,
      status: document.getElementById("campo-status").value,
      urlImagem: document.getElementById("campo-imagem").value,
    };

    try {
      await adicionarSerie(dados);

      formulario.reset();

      carregarDadosAplicativo();
    } catch (erro) {
      alert(erro.message);
    }
  });
}

window.filtrarStatus = filtrarStatus;
window.assistirEpisodio = assistirEpisodio;
window.deletarSerie = deletarSerie;
window.diminuirEpisodio = diminuirEpisodio;
