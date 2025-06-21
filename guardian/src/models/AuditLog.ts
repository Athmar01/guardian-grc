import mongoose, { Document, Schema } from 'mongoose';

export interface IAuditLog extends Document {
  userId: string;
  userEmail: string;
  action: string;
  details?: string;
  timestamp: Date;
}

const AuditLogSchema: Schema<IAuditLog> = new mongoose.Schema({
  userId: { type: String, required: true },
  userEmail: { type: String, required: true },
  action: { type: String, required: true },
  details: { type: String }, // Optional based on interface
  timestamp: { type: Date, default: Date.now },
});

export default mongoose.models.AuditLog || mongoose.model<IAuditLog>('AuditLog', AuditLogSchema); 