import { Schema, model } from 'mongoose';
import { TenantDocument } from '../interfaces';

const tenantSchema = new Schema<TenantDocument>(
  {
    subdomain: { type: String, required: true, unique: true },
  },
  { timestamps: true }
);

export const Tenant = model<TenantDocument>('Tenant', tenantSchema);
