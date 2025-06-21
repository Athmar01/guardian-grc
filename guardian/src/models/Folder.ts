import mongoose, { Document, Schema } from 'mongoose';

export interface IFolder extends Document {
  name: string;
  parent?: mongoose.Types.ObjectId | IFolder; // Self-referencing for hierarchy
  owner: string; // Clerk User ID
  ancestors?: (mongoose.Types.ObjectId | IFolder)[]; // For easier querying of hierarchy
  // Potentially: organizationId if multi-tenant
}

const FolderSchema: Schema = new Schema({
  name: { type: String, required: true, trim: true },
  parent: { type: Schema.Types.ObjectId, ref: 'Folder', default: null },
  owner: { type: String, required: true }, // Clerk User ID
  ancestors: [{ type: Schema.Types.ObjectId, ref: 'Folder' }],
}, { timestamps: true });

// Middleware to manage ancestors path for easier hierarchical queries
FolderSchema.pre('save', async function(this: IFolder, next) {
  if (this.isModified('parent')) {
    if (this.parent) {
      const parentFolder = await mongoose.model('Folder').findById(this.parent);
      if (parentFolder) {
        this.ancestors = [...(parentFolder.ancestors || []), parentFolder._id];
      } else {
        this.ancestors = []; // Parent not found, reset ancestors
      }
    } else {
      this.ancestors = []; // No parent, root folder
    }
  }
  next();
});

FolderSchema.index({ parent: 1, name: 1 }); // For efficient lookup within a folder

export default mongoose.models.Folder || mongoose.model<IFolder>('Folder', FolderSchema);
