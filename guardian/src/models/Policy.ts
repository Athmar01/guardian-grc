import mongoose, { Document, Schema, Types, Model } from 'mongoose'; // Standard import for types
// We don't strictly need IFolder here if we define a minimal populated interface
// import { IFolder } from './Folder';

export interface IComment extends Document {
  text: string;
  date?: Date;
  userId?: string;
  userEmail?: string;
}

const CommentSchema = new Schema<IComment>({
  text: { type: String, required: true },
  date: { type: Date, default: Date.now },
  userId: { type: String },
  userEmail: { type: String },
});

export interface IPolicy extends Document {
  name: string;
  description?: string;
  owner?: { userId?: string; userEmail?: string };
  effectiveDate?: Date;
  reviewDate?: Date;
  version?: string;
  category?: string;
  attachments?: Array<{ url: string; name: string }>;
  state?: 'Draft' | 'Review' | 'Approved' | 'Rejected';
  comments?: Types.DocumentArray<IComment>;
  changeHistory?: Array<{
    userId?: string;
    userEmail?: string;
    action?: string;
    date?: Date;
    details?: string;
  }>;
  folder: Types.ObjectId | IPopulatedFolderMin; // Link to the folder, can be ObjectId or populated
  createdAt?: Date;
  updatedAt?: Date;
}

// Interface for a minimally populated folder (e.g., when using .populate('folder', '_id name'))
export interface IPopulatedFolderMin {
  _id: Types.ObjectId;
  name: string;
}

// Interface for IPolicy when its 'folder' field is populated
export interface IPolicyPopulatedFolder extends Omit<IPolicy, 'folder'> {
  folder: IPopulatedFolderMin;
}

const PolicySchema = new Schema<IPolicy>({
  name: { type: String, required: true },
  description: { type: String },
  owner: {
    userId: { type: String },
    userEmail: { type: String },
  },
  effectiveDate: { type: Date },
  reviewDate: { type: Date },
  version: { type: String, default: '1.0' },
  category: { type: String },
  attachments: [{ url: String, name: String }], // Array of { url, name }
  state: { type: String, enum: ['Draft', 'Review', 'Approved', 'Rejected'], default: 'Draft' },
  comments: [CommentSchema],
  changeHistory: [{
    userId: { type: String },
    userEmail: { type: String },
    action: { type: String },
    date: { type: Date, default: Date.now },
    details: { type: String },
  }],
  folder: { type: Schema.Types.ObjectId, ref: 'Folder', required: true },
}, { timestamps: true });

const Policy: Model<IPolicy> = mongoose.models.Policy || mongoose.model<IPolicy>('Policy', PolicySchema);
export default Policy; 