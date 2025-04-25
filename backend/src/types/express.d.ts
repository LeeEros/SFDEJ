declare namespace Express {
  export interface Request {
    usuario?: {
      id: string;
      permissao: string;
    };
  }
}
