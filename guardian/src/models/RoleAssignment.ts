import mongoose, { Document, Schema } from 'mongoose';
import { IFolder } from './Folder'; // Import IFolder for type referencing

export type RoleType = 'Owner' | 'Editor' | 'Viewer' | 'Contributor'; // Extend as needed

export interface IRoleAssignment extends Document {
  userId: string; // Clerk User ID
  role: RoleType;
  folderId: mongoose.Types.ObjectId | IFolder; // Target folder for the role
  // Potentially: organizationId
}

const RoleAssignmentSchema: Schema = new Schema({
  userId: { type: String, required: true }, // Clerk User ID
  role: { type: String, required: true, enum: ['Owner', 'Editor', 'Viewer', 'Contributor'] },
  folderId: { type: Schema.Types.ObjectId, ref: 'Folder', required: true },
}, { timestamps: true });

RoleAssignmentSchema.index({ userId: 1, folderId: 1, role: 1 }, { unique: true }); // Prevent duplicate role assignments for the same user, folder, and role.
// Consider if a user can have multiple roles on the same folder. If not, unique index should be on { userId: 1, folderId: 1 }

export default mongoose.models.RoleAssignment || mongoose.model<IRoleAssignment>('RoleAssignment', RoleAssignmentSchema);
