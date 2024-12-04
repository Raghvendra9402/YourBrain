import "express";

declare global {
  namespace Express {
    interface Request {
      id?: string; // Add your custom properties here
    }
  }
}