import { Document, Types } from "mongoose";

export interface ITenant {
  subdomain: string;
}

export interface TenantDocument extends ITenant, Document {
  _id: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}