import  { AuthenticatedUser } from './models/User';
 
declare global {
  namespace Express {
    interface Request {
      user?: AuthenticatedUser; // Definisci la proprietà user nella Request
    }
  }
}
 