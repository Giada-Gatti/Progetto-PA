import { Request, Response, NextFunction } from 'express';

// classe personalizzata per gli errori dell'applicazione
export class AppError extends Error {
  statusCode: number;

  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    Error.captureStackTrace(this, this.constructor);
  }
}

// Middleware per la gestione centralizzata degli errori
export const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      status: 'error',
      message: err.message
    });
  }

  // Log dell'errore per debugging
  console.error('Error:', err);

  // In produzione, non inviare dettagli dell'errore al client
  if (process.env.NODE_ENV === 'production') {
    return res.status(500).json({
      status: 'error',
      message: 'Something went wrong'
    });
  }

  // In sviluppo, invia dettagli dell'errore
  return res.status(500).json({
    status: 'error',
    message: err.message,
    stack: err.stack
  });
};