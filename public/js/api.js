function obterIdUsuarioLogado() {
  const usuarioRaw = localStorage.getItem("@NextEpisode:usuario");

  if (!usuarioRaw) {
    window.location.href = "/login.html";
    throw new Error("Usuário não autenticado.");
  }

  return JSON.parse(usuarioRaw).id;
}

export async function buscarEstatisticas() {
  const idUsuario = obterIdUsuarioLogado();

  const resposta = await fetch(`/api/usuarios/${idUsuario}/estatisticas`);

  if (resposta.status === 401) {
    localStorage.removeItem("@NextEpisode:token");
    localStorage.removeItem("@NextEpisode:usuario");
    window.location.href = "/login.html";
    return;
  }

  if (!resposta.ok) {
    const erro = await resposta.json().catch(() => ({}));
    throw new Error(erro.erro || "Erro ao carregar estatísticas.");
  }

  return await resposta.json();
}

export async function buscarSeries() {
  const idUsuario = obterIdUsuarioLogado();

  const resposta = await fetch(`/api/series?usuario_id=${idUsuario}`);

  if (resposta.status === 401) {
    localStorage.removeItem("@NextEpisode:token");
    localStorage.removeItem("@NextEpisode:usuario");
    window.location.href = "/login.html";
    return;
  }

  if (!resposta.ok) {
    const erro = await resposta.json().catch(() => ({}));
    throw new Error(erro.erro || "Erro ao carregar séries.");
  }

  return await resposta.json();
}

export async function adicionarSerie(dados) {
  const idUsuario = obterIdUsuarioLogado();

  const dadosComUsuario = {
    ...dados,
    usuario_id: idUsuario,
  };

  const resposta = await fetch("/api/series", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(dadosComUsuario),
  });

  if (resposta.status === 401) {
    localStorage.removeItem("@NextEpisode:token");
    localStorage.removeItem("@NextEpisode:usuario");
    window.location.href = "/login.html";
    return;
  }

  if (!resposta.ok) {
    const erro = await resposta.json().catch(() => ({}));
    throw new Error(erro.erro || "Erro ao adicionar série.");
  }

  return await resposta.json();
}

export async function assistirEpisodio(id) {
  const resposta = await fetch(`/api/series/${id}/assistir`, {
    method: "PUT",
  });

  if (resposta.status === 401) {
    localStorage.removeItem("@NextEpisode:token");
    localStorage.removeItem("@NextEpisode:usuario");
    window.location.href = "/login.html";
    return;
  }

  if (!resposta.ok) {
    const erro = await resposta.json().catch(() => ({}));
    throw new Error(erro.erro || "Erro ao atualizar episódio.");
  }

  return await resposta.json();
}

export async function diminuirEpisodio(id) {
  const resposta = await fetch(`/api/series/${id}/diminuir`, {
    method: "PUT",
  });

  if (resposta.status === 401) {
    localStorage.removeItem("@NextEpisode:token");
    localStorage.removeItem("@NextEpisode:usuario");
    window.location.href = "/login.html";
    return;
  }

  if (!resposta.ok) {
    const erro = await resposta.json().catch(() => ({}));
    throw new Error(erro.erro || "Erro ao diminuir episódio.");
  }

  return await resposta.json();
}

export async function deletarSerie(id) {
  const resposta = await fetch(`/api/series/${id}`, {
    method: "DELETE",
  });

  if (resposta.status === 401) {
    localStorage.removeItem("@NextEpisode:token");
    localStorage.removeItem("@NextEpisode:usuario");
    window.location.href = "/login.html";
    return;
  }

  if (!resposta.ok) {
    const erro = await resposta.json().catch(() => ({}));
    throw new Error(erro.erro || "Erro ao deletar série.");
  }

  return await resposta.json();
}