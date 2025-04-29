import express from "express";
import "express-async-errors";
import cors from "cors";

import { tratamentoErros } from "./middlewares/tratamento.erros";
import { routes } from "./utils/routes";

const app = express();

app.use(cors());
app.use(express.json());

app.use(routes);

app.use(tratamentoErros);

export { app };
