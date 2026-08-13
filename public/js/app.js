import "./eventos.js";
import { carregarDadosAplicativo } from "./ui.js";

function verificarAutenticacao() {
  const token = localStorage.getItem("@NextEpisode:token");
  const usuarioRaw = localStorage.getItem("@NextEpisode:usuario");

  if (!token || !usuarioRaw) {
    window.location.href = "/login.html";
    return false;
  }

  const usuario = JSON.parse(usuarioRaw);

  const avatarElemento = document.getElementById("userAvatar");

  if (avatarElemento) {
    avatarElemento.innerText = usuario.iniciais; 
  }

  return true;
}

if (verificarAutenticacao()) {
  carregarDadosAplicativo();
}

const btnLogout = document.getElementById("btnLogout");

if (btnLogout) {
  btnLogout.addEventListener("click", () => {
    
    localStorage.removeItem("@NextEpisode:token");
    localStorage.removeItem("@NextEpisode:usuario");

    window.location.href = "/login.html";
  });
}
