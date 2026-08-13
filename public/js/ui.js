import {
  buscarEstatisticas,
  buscarSeries,
  assistirEpisodio as apiAssistirEpisodio,
  diminuirEpisodio as apiDiminuirEpisodio,
  deletarSerie as apiDeletarSerie,
} from "./api.js";

let filtroAtual = "all";

function escaparHtml(texto) {
  if (!texto) return "";

  return String(texto)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function criarModalSinopse() {
  if (document.getElementById("modal-sinopse")) {
    return;
  }

  const modal = document.createElement("div");

  modal.id = "modal-sinopse";
  modal.className = "modal-sinopse";

  modal.innerHTML = `
    <div class="modal-sinopse-conteudo">

      <button
        class="modal-sinopse-fechar"
        id="fechar-modal-sinopse"
        title="Fechar"
      >
        ×
      </button>

      <h2 id="modal-sinopse-titulo"></h2>

      <div
        id="modal-sinopse-ano"
        class="modal-sinopse-ano"
      ></div>

      <div
        id="modal-sinopse-texto"
        class="modal-sinopse-texto"
      ></div>

      <button
        id="modal-sinopse-btn-fechar"
        class="modal-sinopse-btn-fechar"
      >
        Fechar
      </button>

    </div>
  `;

  document.body.appendChild(modal);

  const botaoFechar = document.getElementById(
    "fechar-modal-sinopse",
  );

  const botaoFecharInferior = document.getElementById(
    "modal-sinopse-btn-fechar",
  );

  botaoFechar.addEventListener("click", fecharModalSinopse);

  botaoFecharInferior.addEventListener(
    "click",
    fecharModalSinopse,
  );

  modal.addEventListener("click", (evento) => {
    if (evento.target === modal) {
      fecharModalSinopse();
    }
  });
}

function abrirModalSinopse(titulo, ano, sinopse) {
  criarModalSinopse();

  const modal = document.getElementById("modal-sinopse");

  const tituloModal = document.getElementById(
    "modal-sinopse-titulo",
  );

  const anoModal = document.getElementById(
    "modal-sinopse-ano",
  );

  const textoModal = document.getElementById(
    "modal-sinopse-texto",
  );

  tituloModal.textContent = titulo || "Série";

  anoModal.textContent = ano || "";

  textoModal.textContent =
    sinopse || "Nenhuma sinopse foi cadastrada.";

  modal.classList.add("ativo");

  document.body.classList.add("modal-aberto");
}

function fecharModalSinopse() {
  const modal = document.getElementById("modal-sinopse");

  if (!modal) {
    return;
  }

  modal.classList.remove("ativo");

  document.body.classList.remove("modal-aberto");
}

document.addEventListener("keydown", (evento) => {
  if (evento.key === "Escape") {
    fecharModalSinopse();
  }
});

export function filtrarStatus(status) {
  filtroAtual = status;

  document
    .querySelectorAll(".nav-btn")
    .forEach((btn) => btn.classList.remove("active"));

  document
    .getElementById(`aba-${status}`)
    .classList.add("active");

  const titulos = {
    all: "Todos os Seus Títulos",
    assistindo: "🍿 Assistindo Agora",
    planejado: "⏳ Planejado para Ver",
    concluido: "🏆 Maratonas Concluídas",
  };

  document.getElementById("titulo-secao").innerText =
    titulos[status] || "Séries";

  carregarDadosAplicativo();
}

export async function assistirEpisodio(id) {
  try {
    await apiAssistirEpisodio(id);
    carregarDadosAplicativo();
  } catch (erro) {
    alert(erro.message);
  }
}

export async function diminuirEpisodio(id) {
  try {
    await apiDiminuirEpisodio(id);
    carregarDadosAplicativo();
  } catch (erro) {
    alert(erro.message);
  }
}

export async function deletarSerie(id) {
  if (
    !confirm(
      "Tem certeza que deseja remover esta série da sua lista?",
    )
  ) {
    return;
  }

  try {
    await apiDeletarSerie(id);
    carregarDadosAplicativo();
  } catch (erro) {
    alert(erro.message);
  }
}

export async function carregarDadosAplicativo() {
  try {
    await carregarEstatisticas();

    let listaSeries = await buscarSeries();

    if (filtroAtual !== "all") {
      listaSeries = listaSeries.filter(
        (serie) => serie.status === filtroAtual,
      );
    }

    renderizarSeries(listaSeries);
  } catch (erro) {
    console.error("Erro:", erro);
  }
}

async function carregarEstatisticas() {
  const estatisticas = await buscarEstatisticas();

  const totalMinutosReal = Math.round(
    estatisticas.totalHoras * 60,
  );

  const horas = Math.floor(totalMinutosReal / 60);
  const minutos = totalMinutosReal % 60;

  document.getElementById(
    "total-horas",
  ).innerText = `${horas}h ${minutos}m`;

  document.getElementById(
    "total-episodios",
  ).innerText =
    estatisticas.totalEpisodiosAssistidos;

  document.getElementById(
    "total-series",
  ).innerText = estatisticas.totalSeries;

  document.getElementById(
    "series-concluidas",
  ).innerText =
    estatisticas.seriesConcluidas;

  document.getElementById(
    "series-assistindo",
  ).innerText =
    estatisticas.seriesAssistindo;
}

function renderizarSeries(listaSeries) {
  const grid = document.getElementById("grid-series");

  grid.innerHTML = "";

  if (listaSeries.length === 0) {
    grid.innerHTML = `
      <p class="empty-msg">
        Sua estante está vazia.
        Adicione títulos na barra lateral!
      </p>
    `;
    return;
  }

  listaSeries.forEach((serie) => {
    const porcentagem = Math.round(
      (serie.episodiosAssistidos /
        serie.totalEpisodios) *
        100,
    );

    const tituloSeguro = escaparHtml(serie.titulo);

    const anoSeguro = escaparHtml(
      serie.ano || "",
    );

    const sinopse = serie.sinopse || "";

    const sinopseSeguro = escaparHtml(sinopse);

    grid.innerHTML += `
      <div class="movie-card status-${serie.status}">

        <div class="img-container">

          <button
            onclick="event.stopPropagation(); deletarSerie('${serie.id}')"
            class="btn-delete"
            title="Remover da lista"
          >
            ❌
          </button>

          <img
            src="${serie.imagem}"
            alt="${tituloSeguro}"
            onerror="this.src='https://images.unsplash.com/photo-1485846234645-a62644f84728?w=500'"
          >

          ${
            serie.episodiosAssistidos <
            serie.totalEpisodios
              ? `
                <div class="acoes-serie">

                  <button
                    onclick="event.stopPropagation(); diminuirEpisodio('${serie.id}')"
                    class="btn-remover-ep"
                    title="Remover episódio"
                  >
                    −
                  </button>

                  <button
                    onclick="event.stopPropagation(); assistirEpisodio('${serie.id}')"
                    class="btn-ver-ep"
                    title="Marcar episódio assistido"
                  >
                    + Ver Ep
                  </button>

                </div>
              `
              : `
                <span class="badge-done">
                  ✔ Concluída
                </span>
              `
          }

        </div>

        <div class="card-overlay">

          <h3>${tituloSeguro}</h3>

          ${
            serie.ano
              ? `
                <div class="serie-ano">
                  ${anoSeguro}
                </div>
              `
              : ""
          }

          ${
            sinopse
              ? `
                <p class="serie-sinopse">
                  ${sinopseSeguro}
                </p>

                <button
                  type="button"
                  class="btn-ler-mais"
                  data-titulo="${tituloSeguro}"
                  data-ano="${anoSeguro}"
                  data-sinopse="${sinopseSeguro}"
                >
                  Ler mais...
                </button>
              `
              : ""
          }

          <div class="progress-container">

            <div
              class="progress-bar"
              style="width:${porcentagem}%"
            ></div>

          </div>

          <div class="card-footer">

            <span class="progress-text">
              ${serie.episodiosAssistidos} /
              ${serie.totalEpisodios} Eps
            </span>

            <span class="percent-text">
              ${porcentagem}%
            </span>

          </div>

        </div>

      </div>
    `;
  });

  grid
    .querySelectorAll(".btn-ler-mais")
    .forEach((botao) => {
      botao.addEventListener("click", (evento) => {
        evento.stopPropagation();

        abrirModalSinopse(
          botao.dataset.titulo,
          botao.dataset.ano,
          botao.dataset.sinopse,
        );
      });
    });
}