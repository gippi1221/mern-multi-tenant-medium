import { NextFunction, Request, Response } from 'express';
import { MongoService } from '../services';

export const createBook = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { tenantId } = req;
    if (!tenantId) {
      throw new Error('Tenant ID is missing');
    }
    
    const db = MongoService.getTenantConnection(tenantId);
    const Book = db.model('Book');

    const { name } = req.body;
    if (!name) {
      throw new Error('Book name is required');
    }

    const book = await Book.create({ name });

    res.status(201).json(book);
  } catch (error) {
    next(error);
  }
}
export const getBooks = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { tenantId } = req;
    if (!tenantId) {
      throw new Error('Tenant ID is missing');
    }

    const db = MongoService.getTenantConnection(tenantId);
    const Book = db.model('Book');

    const books = await Book.find();
    res.status(200).json(books);
  } catch (error) {
    next(error);
  }
}