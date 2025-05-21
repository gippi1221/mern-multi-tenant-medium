import { Document, Types } from "mongoose";

export interface IBook {
  name: string;
}

export interface BookDocument extends IBook, Document {
  _id: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}