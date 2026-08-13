import { Router } from "express";
import { ControladorProgresso } from "../controllers/RouteController.js";

const router = Router();
const controlador = new ControladorProgresso();

router.get("/usuarios/:idUsuario/estatisticas", (req, res) =>
  controlador.obterEstatisticasUsuario(req, res),
);

router.get("/series", (req, res) => controlador.obterMinhaLista(req, res));

router.post("/series", (req, res) => controlador.adicionarSerie(req, res));

router.put("/series/:id/assistir", (req, res) =>
  controlador.assistirEpisodio(req, res),
);

router.put("/series/:id/diminuir", (req, res) =>
  controlador.diminuirEpisodio(req, res),
);

router.delete("/series/:id", (req, res) =>
  controlador.removerSerie(req, res),
);

router.post("/usuarios", (req, res) => controlador.cadastrarUsuario(req, res));

router.post("/login", (req, res) => controlador.logarUsuario(req, res));

export default router;
