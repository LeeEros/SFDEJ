import { app } from "@/app";

const PORT = 3333;

app.listen(PORT, () =>
  console.log(`Server online em: http://localhost:${PORT}`)
);
