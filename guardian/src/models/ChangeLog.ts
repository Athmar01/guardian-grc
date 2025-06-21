import mongoose, { Document, Schema } from 'mongoose';

export interface IChangeLog extends Document {
  changedBy: {
    userId: string;
    userEmail: string;
  };
  fieldName: string;
  oldValue: string;
  newValue: string;
  changeDate: Date;
}

export const ChangeLogSchema: Schema = new Schema({
  changedBy: {
    userId: { type: String, required: true },
    userEmail: { type: String, required: true },
  },
  fieldName: {
    type: String,
    required: true,
  },
  oldValue: {
    type: String,
  },
  newValue: {
    type: String,
  },
  changeDate: {
    type: Date,
    default: Date.now,
  },
}, { _id: false });
