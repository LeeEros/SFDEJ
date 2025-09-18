import cors from "cors";
import express from "express";
import "express-async-errors";
import rateLimit from "express-rate-limit";

import { tratamentoErros } from "./middlewares/tratamento.erros";
import { createAdmin } from "./utils/create-admin";
import { routes } from "./utils/routes";

const app = express();

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 1000,
  standardHeaders: true,
  legacyHeaders: false,
  message:
    "Muitas requisições enviadas deste IP, por favor, tente novamente após 15 minutos.",
});

const corsOptions = {
  origin: "http://localhost:5173",
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  credentials: true,
  optionsSuccessStatus: 204,
};

app.use(cors(corsOptions));

app.options("*", cors(corsOptions));

app.use(limiter);

app.use(cors({ origin: "http://localhost:5173" }));
app.use(express.json());

createAdmin();

app.use(routes);

app.use(tratamentoErros);

export { app };
