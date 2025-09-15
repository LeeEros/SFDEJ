import express from "express";
import "express-async-errors";
import cors from "cors";
import rateLimit from "express-rate-limit";
import helmet from "helmet";

import { tratamentoErros } from "./middlewares/tratamento.erros";
import { routes } from "./utils/routes";
import { createAdmin } from "./utils/create-admin";

const app = express();

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message:
    "Muitas requisições enviadas deste IP, por favor, tente novamente após 15 minutos.",
});

app.use(limiter);

app.use(cors({ origin: "http://localhost:5173" }));
app.use(express.json());

createAdmin();

app.use(routes);

app.use(tratamentoErros);

export { app };
