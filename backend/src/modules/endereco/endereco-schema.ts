import { z } from "zod";

export const enderecoSchema = z.object({
  CEP: z.string().length(8),
  cidade: z.string().max(255),
  estado: z.string().max(255).toUpperCase(),
  endereco: z.string().max(255),
  numero: z.number().int(),
});
