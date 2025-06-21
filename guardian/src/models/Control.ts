import mongoose, { Document, Schema, Types } from 'mongoose';
import { IFolder } from './Folder'; // Import IFolder for type referencing
import { ChangeLogSchema, IChangeLog } from './ChangeLog';

// Minimal interface for a populated folder reference
export interface IPopulatedFolderMin {
  _id: Types.ObjectId;
  name: string;
}

// New Base Interface
export interface IControlBase {
  controlId: string;
  name: string;
  description: string;
  family: string;
  sourceFramework: string;
  version: string;
  owner: {
    userId: string;
    userEmail: string;
  };
  status: 'Active' | 'Draft' | 'Retired';
  effectiveness: 'Effective' | 'Partially Effective' | 'Ineffective' | 'Not Assessed';
  changeHistory: IChangeLog[];
  // folder will be defined in extending interfaces
  createdAt?: Date; // from timestamps
  updatedAt?: Date; // from timestamps
  _id?: Types.ObjectId; // Mongoose _id
}

// IControl for Mongoose Document
export interface IControl extends IControlBase, Document {
  folder: Types.ObjectId; // In the document, folder is an ObjectId
  // Fields from IControlBase are inherited
}

const ControlSchema: Schema = new Schema({
  controlId: {
    type: String,
    required: [true, 'A unique Control ID is required.'],
    unique: true,
    trim: true,
  },
  name: {
    type: String,
    required: [true, 'Control name is required.'],
    trim: true,
  },
  description: {
    type: String,
    required: [true, 'Control description is required.'],
  },
  family: {
    type: String,
    required: [true, 'Control family or category is required.'],
  },
  sourceFramework: {
    type: String,
    required: true,
  },
  version: {
    type: String,
    default: '1.0',
  },
  owner: {
    userId: { type: String, required: true },
    userEmail: { type: String, required: true },
  },
  status: {
    type: String,
    enum: ['Active', 'Draft', 'Retired'],
    default: 'Draft',
  },
  effectiveness: {
    type: String,
    enum: ['Effective', 'Partially Effective', 'Ineffective', 'Not Assessed'],
    default: 'Not Assessed',
  },
  changeHistory: [ChangeLogSchema],
  folder: { type: Schema.Types.ObjectId, ref: 'Folder', required: true },
}, {
  timestamps: true, // Adds createdAt and updatedAt timestamps
});

// IControlPopulatedFolder for lean queries with populated folder
export interface IControlPopulatedFolder extends IControlBase {
  folder: IPopulatedFolderMin; // Populated folder
  _id: Types.ObjectId; // Ensure _id is present and correctly typed for lean objects
}

export default mongoose.models.Control || mongoose.model<IControl>('Control', ControlSchema);
