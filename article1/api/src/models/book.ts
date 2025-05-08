import { Schema, model } from 'mongoose';
import { BookDocument } from '../interfaces';

export const bookSchema = new Schema<BookDocument>(
  {
    name: { type: String, required: true },
  },
  { timestamps: true }
);

export const Book = model<BookDocument>('Book', bookSchema);