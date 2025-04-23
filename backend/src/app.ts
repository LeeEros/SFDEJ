import express from "express";
import "express-async-errors";

import { tratamentoErros } from "./middlewares/tratamento.erros";
import { routes } from "./utils";

const app = express();

app.use(express.json());

app.use(routes);

app.use(tratamentoErros);

export { app };
