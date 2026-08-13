import express from "express";
import serieRoutes from "./routes/SerieRoutes.js";
import { conexao } from "./config/database.js";

const app = express();
const porta = 3000;

app.use(express.json());
app.use(express.static("public"));

app.use("/api", serieRoutes);

async function testarBanco() {
  while (true) {
    try {
      const connection = await conexao.getConnection();

      console.log("✅ MySQL conectado!");

      connection.release();
      break;
    } catch (erro) {
      console.log("⏳ Aguardando o MySQL iniciar...");
      console.error(erro);
      await new Promise((resolve) => setTimeout(resolve, 3000));
    }
  }
}

(async () => {
  await testarBanco();

  app.listen(porta, () => {
    console.log(`🚀 NextEpisode rodando em: http://localhost:${porta}`);
  });
})();
