declare namespace Express {
  interface Request {
    user?: {
      sub?: string | number;
      email?: string;
      role?: string;
      type?: string;
      [key: string]: unknown;
    };
  }
}
